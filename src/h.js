import {
  add_resize_listener, // eslint-disable-line camelcase
  append,
  attr,
  bind,
  binding_callbacks, // eslint-disable-line camelcase
  create_component, // eslint-disable-line camelcase
  destroy_component, // eslint-disable-line camelcase
  detach,
  element,
  empty,
  identity,
  init,
  insert,
  listen,
  mount_component, // eslint-disable-line camelcase
  noop,
  prevent_default, // eslint-disable-line camelcase
  run_all, // eslint-disable-line camelcase
  safe_not_equal, // eslint-disable-line camelcase
  select_option, // eslint-disable-line camelcase
  select_options, // eslint-disable-line camelcase
  select_value, // eslint-disable-line camelcase
  select_multiple_value, // eslint-disable-line camelcase
  self,
  set_input_value, // eslint-disable-line camelcase
  stop_propagation, // eslint-disable-line camelcase
  SvelteComponent,
  text,
  to_number, // eslint-disable-line camelcase
  toggle_class, // eslint-disable-line camelcase
  // Intro/Outro: transition_in, // eslint-disable-line camelcase
  // Intro/Outro: transition_out, // eslint-disable-line camelcase
} from 'svelte/internal'
import { get } from 'svelte/store'

import StoreValue from './store-value'

const COMPONENT_SLOTS = new WeakMap()

export default function h(type, props, ...children) {
  const $$props = {}
  let slot = null
  const $$letSetters = {}
  forEach(props, (key, value) => {
    if (key === 'slot') {
      slot = value
    } else if (key.startsWith('let:')) {
      if (!slot) slot = 'default'
      $$letSetters[key.slice(4)] = value
    } else {
      $$props[key] = value
    }
  })

  const isComponent = typeof type !== 'string'

  const instance = (/* self, props, invalidate */) => {
    // For bind:value
    // if (isComponent) {
    //   self.$set = (newProps) => {
    //     // $$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    //     console.log({ newProps })
    //   }

    //   // $$props = exclude_internal_props($$props);
    // }

    return [type, $$props, children, $$letSetters]
  }

  const createFragment = isComponent ? createComponentFragment : createElementFragment

  class Component extends SvelteComponent {
    constructor(options) {
      super()
      init(
        this,
        options,
        instance,
        createFragment,
        safe_not_equal,
        Object.keys($$props).reduce((memo, key, index) => {
          memo[key] = index
          return memo
        }, {}),
      )
    }
  }

  if (slot) COMPONENT_SLOTS.set(Component, { name: slot, setters: $$letSetters })

  return Component
}

function createComponentFragment([Component, props, children, componentSlotSetters]) {
  // Intro/Outro: let current

  const $$props = {}
  const $$listeners = {}
  const $$bindings = {}
  forEach(props, (key, value) => {
    if (isListener(key)) {
      const event = key.slice(3)
      $$listeners[event] = value
    } else if (isBinding(key)) {
      const binding = key.slice(5)
      $$bindings[binding] = value
      $$props[binding] = get(value)
    } else {
      $$props[key] = value
    }
  })

  const $$slots = {}

  const defaultSlotChildren = children.filter((child) => !COMPONENT_SLOTS.has(child))
  if (defaultSlotChildren.length > 0) {
    $$slots.default = createSlotDefinition(defaultSlotChildren, componentSlotSetters)
  }

  children.forEach((child) => {
    const slot = COMPONENT_SLOTS.get(child)

    if (slot) {
      $$slots[slot.name] = createSlotDefinition([child], slot.setters)
    }
  })

  const component = new Component({
    props: {
      ...$$props,
      $$slots,
      $$scope: { ctx: [] },
    },
    $$inline: true,
  })

  forEach($$listeners, (event, handler) => {
    component.$on(event, handler)
  })

  forEach($$bindings, (binding, store) => {
    // eslint-disable-next-line camelcase
    binding_callbacks.push(() => bind(component, binding, (value) => store.set(value)))
  })

  let dispose

  return {
    /* Create */ c() {
      create_component(component.$$.fragment)
    },
    /* Mount */ m(target, anchor, remount) {
      mount_component(component, target, anchor)
      // Intro/Outro: current = true

      if (remount) run_all(dispose)

      dispose = []
      forEach($$bindings, (binding, store) => {
        dispose.push(store.subscribe((value) => component.$set({ [binding]: value })))
      })
    },
    /* Update */ p: noop,
    /* Intro i(local) {
      if (current) return
      transitionNodeIn(component, local)
      current = true
    }, */
    /* Outro o(local) {
      transitionNodeOut(component, local)
      current = false
    }, */
    /* Destroy */ d(detaching) {
      destroy_component(component, detaching)
      run_all(dispose)
    },
  }
}

function createSlotDefinition(children, setters) {
  return [
    () => createSlot(children),
    // Notify each listener on each change
    (changes) => {
      forEach(changes, (key, value) => {
        const setter = setters[key]
        if (typeof setter === 'function') {
          setter(value, key)
        } else if (setter && typeof setter.set === 'function') {
          setter.set(value)
        }
      })
    },
    // Mark all as changed
    (changes) => Object.keys(changes).length,
  ]
}

function createSlot(children) {
  const factories = children.map((child) => createNodeFactory(child))
  let nodes
  // Intro/Outro: let current

  return {
    /* Create */ c() {
      nodes = factories.map((create) => create())
    },
    /* Mount */ m(target, anchor) {
      nodes.forEach((node) => mountNode(node, target, anchor))
      // Intro/Outro: current = true
    },
    /* Update */ p: noop,
    /* Intro i(local) {
      if (current) return
      nodes.forEach((node) => transitionNodeIn(node, local))
      current = true
    }, */
    /* Outro o(local) {
      nodes.forEach((node) => transitionNodeOut(node, local))
      current = false
    }, */
    /* Destroy */ d(detaching) {
      nodes.forEach((node) => {
        if (node.$$) {
          destroy_component(node, detaching)
        } else {
          detach(node)
        }
      })
    },
  }
}

function createElementFragment([type, props, children]) {
  const factories = children.map((child) => createNodeFactory(child))
  let node
  let childNodes
  // Intro/Outro: let current
  let dispose

  const $$props = {}
  const $$listeners = {}
  const $$bindings = {}
  const $$classes = {}
  forEach(props, (key, value) => {
    if (isListener(key)) {
      const event = key.slice(3)
      $$listeners[event] = value
    } else if (isClass(key)) {
      const name = key.slice(6)
      $$classes[name] = value
    } else if (isBinding(key)) {
      const binding = key.slice(5)
      $$bindings[binding] = {
        store: value,
        handler: createElementBinding(type, binding, value, props),
      }
    } else {
      $$props[key] = value
    }
  })

  return {
    /* Create */ c() {
      node = element(type)

      if (type === 'option' || isCheckableInput(type, $$props)) {
        node.__value = $$props.value
      }

      forEach($$props, (key, value) => {
        attr(node, key, value)
      })

      childNodes = factories.map((create) => create())
    },
    /* Mount */ m(target, anchor, remount) {
      insert(target, node, anchor)
      childNodes.forEach((childNode) => mountNode(childNode, node, null))

      // Intro/Outro: current = true

      // Listener handling
      if (remount) run_all(dispose)

      dispose = []
      forEach($$listeners, (event, handler) => {
        dispose.push(listenTo(node, event, handler))
      })

      forEach($$classes, (name, store) => {
        dispose.push(toggleClass(node, name, store))
      })

      forEach($$bindings, (binding, { store, handler }) => {
        // Initial store update
        if (isReadonlyBinding(binding) || get(store) === undefined) {
          handler.call(node)
        }

        if (!isReadonlyBinding(binding)) {
          subscribeWithBinding(type, binding, node, store, props)
        }

        listenWithBinding(dispose, type, binding, node, store, handler, props)
      })
    },
    /* Update */ p: noop,
    /* Intro i(local) {
      if (current) return
      childNodes.forEach((childNode) => transitionNodeIn(childNode, local))
      current = true
    }, */
    /* Outro o(local) {
      childNodes.forEach((childNode) => transitionNodeOut(childNode, local))
      current = false
    }, */
    /* Destroy */ d(detaching) {
      if (detaching) detach(node)

      childNodes.forEach((childNode) => {
        if (childNode.$$) {
          destroy_component(childNode)
        }
      })

      run_all(dispose)
    },
  }
}

function toggleClass(node, name, store) {
  return store.subscribe((active) => {
    toggle_class(node, name, active)
  })
}

function createElementBinding(type, binding, store, props) {
  let toValue = (self) => self[binding]

  if (binding === 'group' && isCheckableInput(type, props)) {
    if (props.type === 'radio') {
      // This is the only early return --- I don't like it either...
      return function () {
        if (this.checked) {
          store.set(this.__value)
        }
      }
    }

    toValue = (self) => {
      const values = new Set(get(store) || [])

      if (self.checked) {
        values.add(self.__value)
      } else {
        values.delete(self.__value)
      }

      return [...values]
    }
  } else if (binding === 'this') {
    toValue = identity
  } else if (binding === 'value') {
    if (type === 'select') {
      if (props.multiple) {
        toValue = (self) => select_multiple_value(self)
      } else {
        toValue = (self) => select_value(self)
      }
    } else if (isCheckableInput(type, props)) {
      toValue = (self) => self.checked
    } else if (isNumberInput(type, props)) {
      toValue = (self) => to_number(self.value)
    }
  }

  return function () {
    store.set(toValue(this))
  }
}

// eslint-disable-next-line max-params
function subscribeWithBinding(type, binding, node, store, props) {
  if (binding !== 'group' && isCheckableInput(type, props)) {
    binding = 'checked'
  }

  store.subscribe((value) => {
    if (binding === 'group' && isCheckableInput(type, props)) {
      if (props.type === 'radio') {
        node.checked = value === node.__value
      } else {
        node.checked = Boolean(value) && value.includes(node.__value)
      }
    } else if (type === 'select') {
      if (props.multiple) {
        select_options(node, value)
      } else {
        select_option(node, value)
      }
    } else {
      switch (binding) {
        case 'value':
          set_input_value(node, value)
          break
        default:
          node[binding] = value
      }
    }
  })
}

// eslint-disable-next-line max-params
function listenWithBinding(dispose, type, binding, node, store, handler, props) {
  let listener

  if (isMeasuredBinding(binding)) {
    listener = add_resize_listener(node, handler.bind(node))
  } else if (binding === 'this') {
    listener = () => store.set(null)
  } else if (isCheckableInput(type, props) || type === 'select') {
    listener = listen(node, 'change', handler)
  } else {
    if (type === 'input' && props.type === 'range') {
      dispose.push(listen(node, 'change', handler))
    }

    listener = listen(node, 'input', handler)
  }

  dispose.push(listener)
}

function createNodeFactory(Child) {
  if (Child === undefined || Child === null || Child === false) {
    return () => empty()
  }

  if (typeof Child === 'function' || isStore(Child)) {
    const options = {
      props: {
        $$scope: { ctx: [] },
      },
      $$inline: true,
    }

    const component = isStore(Child)
      ? new StoreValue((options.props.store = Child) && options)
      : new Child(options)

    return () => {
      create_component(component.$$.fragment)
      return component
    }
  }

  return () => text(Child)
}

function mountNode(child, target, anchor) {
  if (child.$$) {
    mount_component(child, target, anchor)
  } else {
    append(target, child)
  }
}

function listenTo(node, property, handler) {
  const [event, ...modifiers] = property.split(/\|/g)

  let options
  modifiers.forEach((modifier) => {
    switch (modifier) {
      case 'preventDefault':
        handler = prevent_default(handler)
        break
      case 'stopPropagation':
        handler = stop_propagation(handler)
        break
      case 'self':
        handler = self(handler)
        break
      default:
        // Add to options: passive, capture, once
        ;(options || (options = {}))[modifier] = true
    }
  })

  return listen(node, event, handler, options)
}

/* Intro/Outro:
function transitionNodeIn(child, local) {
  if (child.$$) {
    transition_in(child.$$.fragment, local)
  }
}

function transitionNodeOut(child, local) {
  if (child.$$) {
    transition_out(child.$$.fragment, local)
  }
} */

function forEach(object, iteratee) {
  if (object) {
    Object.entries(object).forEach(([key, value]) => iteratee(key, value, object))
  }
}

function isListener(key) {
  return key.startsWith('on:')
}

function isClass(key) {
  return key.startsWith('class:')
}

function isBinding(key) {
  return key.startsWith('bind:')
}

const READONLY_BINDINGS = new Set([
  'duration',
  'buffered',
  'played',
  'seekable',
  'seeking',
  'ended',
  'videoWidth',
  'videoHeight',
  'clientWidth',
  'clientHeight',
  'offsetWidth',
  'offsetHeight',
  'this',
])
function isReadonlyBinding(binding) {
  return READONLY_BINDINGS.has(binding)
}

const MEASURED_BINDINGS = new Set(['clientWidth', 'clientHeight', 'offsetWidth', 'offsetHeight'])
function isMeasuredBinding(binding) {
  return MEASURED_BINDINGS.has(binding)
}

function isStore(object) {
  return object && typeof object.subscribe === 'function'
}

function isCheckableInput(type, props) {
  return type === 'input' && (props.type === 'checkbox' || props.type === 'radio')
}

function isNumberInput(type, props) {
  return type === 'input' && (props.type === 'number' || props.type === 'range')
}
