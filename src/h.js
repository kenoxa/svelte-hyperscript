import {
  SvelteComponent,
  append,
  attr,
  create_component, // eslint-disable-line camelcase
  destroy_component, // eslint-disable-line camelcase
  detach,
  element,
  empty,
  init,
  insert,
  listen,
  mount_component, // eslint-disable-line camelcase
  noop,
  run_all, // eslint-disable-line camelcase
  safe_not_equal, // eslint-disable-line camelcase
  text,
  transition_in, // eslint-disable-line camelcase
  transition_out, // eslint-disable-line camelcase
} from 'svelte/internal'

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
      init(this, options, instance, createFragment, safe_not_equal, { ...$$props })
    }
  }

  if (slot) COMPONENT_SLOTS.set(Component, { name: slot, setters: $$letSetters })

  return Component
}

function createComponentFragment([Component, props, children, componentSlotSetters]) {
  let current

  const $$props = {}
  const $$listeners = {}
  forEach(props, (key, value) => {
    if (isListener(key)) {
      $$listeners[key] = value
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

  forEach($$listeners, (key, value) => {
    // Insert on:click|preventDefault => prevent_default(click_handler)
    component.$on(key.slice(3), value)
  })

  return {
    /* Create */ c() {
      create_component(component.$$.fragment)
    },
    /* Mount */ m(target, anchor) {
      mount_component(component, target, anchor)
      current = true
    },
    /* Update */ p: noop,
    /* Intro */ i(local) {
      if (current) return
      transitionNodeIn(component, local)
      current = true
    },
    /* Outro */ o(local) {
      transitionNodeOut(component, local)
      current = false
    },
    /* Destroy */ d(detaching) {
      destroy_component(component, detaching)
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
  let current

  return {
    /* Create */ c() {
      nodes = factories.map((create) => create())
    },
    /* Mount */ m(target, anchor) {
      nodes.forEach((node) => mountNode(node, target, anchor))
      current = true
    },
    /* Update */ p: noop,
    /* Intro */ i(local) {
      if (current) return
      nodes.forEach((node) => transitionNodeIn(node, local))
      current = true
    },
    /* Outro */ o(local) {
      nodes.forEach((node) => transitionNodeOut(node, local))
      current = false
    },
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
  let current
  let dispose

  return {
    /* Create */ c() {
      node = element(type)
      forEach(props, (key, value) => {
        if (isAttribute(key)) {
          attr(node, key, value)
        }
      })

      childNodes = factories.map((create) => create())
    },
    /* Mount */ m(target, anchor, remount) {
      insert(target, node, anchor)
      childNodes.forEach((childNode) => mountNode(childNode, node, null))
      current = true

      // Listener handling
      if (remount) run_all(dispose)

      dispose = []
      forEach(props, (key, value) => {
        if (isListener(key)) {
          // Insert on:click|preventDefault => prevent_default(click_handler)
          dispose.push(listen(node, key.slice(3), value))
        }
      })
    },
    /* Update */ p: noop,
    /* Intro */ i(local) {
      if (current) return
      childNodes.forEach((childNode) => transitionNodeIn(childNode, local))
      current = true
    },
    /* Outro */ o(local) {
      childNodes.forEach((childNode) => transitionNodeOut(childNode, local))
      current = false
    },
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

function createNodeFactory(Child) {
  if (Child === undefined || Child === null || Child === false) {
    return () => empty()
  }

  if (typeof Child === 'function' || isStore(Child)) {
    const component = isStore(Child)
      ? new StoreValue({
          props: {
            store: Child,
            $$scope: { ctx: [] },
          },
          $$inline: true,
        })
      : new Child({
          props: {
            $$scope: { ctx: [] },
          },
          $$inline: true,
        })

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

function transitionNodeIn(child, local) {
  if (child.$$) {
    transition_in(child.$$.fragment, local)
  }
}

function transitionNodeOut(child, local) {
  if (child.$$) {
    transition_out(child.$$.fragment, local)
  }
}

function forEach(object, iteratee) {
  if (object) {
    Object.entries(object).forEach(([key, value]) => iteratee(key, value, object))
  }
}

function isAttribute(key) {
  return !isListener(key)
}

function isListener(key) {
  return key.startsWith('on:')
}

function isStore(object) {
  return object && typeof object.subscribe === 'function'
}
