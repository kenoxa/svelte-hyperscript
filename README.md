# svelte-hyperscript

> use [hyperscript](https://github.com/hyperhype/hyperscript) to create [svelte](https://svelte.dev/) components

[![License](https://badgen.net/npm/license/svelte-hyperscript)](https://github.com/kenoxa/svelte-hyperscript/blob/main/LICENSE)
[![Latest Release](https://badgen.net/npm/v/svelte-hyperscript)](https://www.npmjs.com/package/svelte-hyperscript)
[![View changelog](https://badgen.net/badge/%E2%80%8B/Explore%20Changelog/green?icon=awesome)](https://changelogs.xyz/svelte-hyperscript)

[![CI](https://github.com/kenoxa/svelte-hyperscript/workflows/CI/badge.svg)](https://github.comkenoxan/svelte-hyperscript/actions?query=branch%3Amain+workflow%3ACI)
[![Coverage Status](https://badgen.net/coveralls/c/github/kenoxa/svelte-hyperscript/main)](https://coveralls.io/github/kenoxa/svelte-hyperscript?branch=main)
[![PRs Welcome](https://badgen.net/badge/PRs/welcome/purple)](http://makeapullrequest.com)
[![Conventional Commits](https://badgen.net/badge/Conventional%20Commits/1.0.0/cyan)](https://conventionalcommits.org)

## What?

This package exposes an [hyperscript](https://github.com/hyperhype/hyperscript) compatible function: `h(tag, properties, ...children)` which returns a svelte component.

## Why?

This is the core for [svelte-jsx] and [svelte-htm]. These packages allow to simplify svelte testing code especially slot handling.

## Installation

```sh
npm install svelte-hyperscript
```

And then import it:

```js
// using es modules
import h from 'svelte-hyperscript'

// common.js
const h = require('svelte-hyperscript')
```

Alternatively use [UNPKG](https://unpkg.com/svelte-htm/) or [jsDelivr](https://cdn.jsdelivr.net/npm/svelte-htm/) packages:

With script tags and globals:

```html
<!-- UNPKG -->
<script src="https://unpkg.com/svelte-hyperscript"></script>

<!-- jsDelivr -->
<script src="https://cdn.jsdelivr.net/npm/svelte-hyperscript"></script>

<script>
  <!-- And then grab it off the global like so: -->
  const h = svelteHyperscript
</script>
```

Hotlinking from unpkg: _(no build tool needed!)_

```js
import h from 'https://unpkg.com/svelte-hyperscript?module'
```

## Usage

```js
import h from 'svelte-hyperscript'

import Button from '../src/Button.svelte'

let clicked = 0
const LabeledButton = h(Button, { 'on:click': () => (clicked += 1) }, h('span', null, 'Click Me!'))

const button = new LabeledButton({
  target: document.body,
})
```

The above example written in [jsx] using [svelte-jsx]:

```jsx
import Button from '../src/Button.svelte'

let clicked = 0
const LabeledButton = (
  <Button onClick={() => (clicked += 1)}>
    <span>Click Me!</span>
  </Button>
)

const button = new LabeledButton({
  target: document.body,
})
```

or using [svelte-htm]:

```js
import html from 'svelte-htm'
import Button from '../src/Button.svelte'

let clicked = 0
const LabeledButton = html`<${Button} on:click=${() => (clicked += 1)}><span>Click Me!</span><//>`

const button = new LabeledButton({
  target: document.body,
})
```

## API

We [aim to support](#feature-set) all svelte features. In some cases this is not possible due to the static nature of hyperscript. For those cases we provided feasible workarounds:

### Using stores to allow reactivity

To allow reactivity the following properties accept a [writable store](https://svelte.dev/docs#svelte_store):

- [bind:property](https://svelte.dev/docs#bind_element_property)
- [bind:group](https://svelte.dev/docs#bind_group)
- [bind:this](https://svelte.dev/docs#bind_this)
- [\<slot let:name={value}>](https://svelte.dev/docs#slot_let)

[\<slot let:name={value}>](https://svelte.dev/docs#slot_let) additionally accepts a function which is called with the current value.

This allows to for example to access the value if an input:

```js
import { test } from '@jest/globals'
import { render } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'

import { writable, get } from 'svelte/store'

import h from 'svelte-hyperscript'

test('write into an input', () => {
  const text = writable()
  const { getByRole } = render(h('input', { 'bind:value': text }))

  const input = getByRole('textbox')

  await userEvent.type(input, 'some text')

  expect(get(text)).toBe('some text')
})
```

The [tests](https://github.com/kenoxa/svelte-hyperscript/tree/main/src/__tests__) are a good source of how to use this feature.

### Action factories

The [action feature](https://svelte.dev/docs#use_action) of svelte is supported but lacks the possibility to pass parameters to the action. This can still be achieved using a factory function as action:

```js
import h from 'svelte-hyperscript'

import action from 'some-action-module'

h('div', { 'use:action': (node) => action(node, parameters) })
```

## Related Projects

- [svelte-jsx] - write svelte components using [jsx]
- [svelte-htm] - [**H**yperscript **T**agged **M**arkup](https://www.npmjs.com/package/htm) for svelte
- [svelte-fragment-component] - a utility component

## Feature Set

- [x] plain html children
- [x] readable store children
- [x] on:eventname
- [x] on:eventname modifiers
- [x] bind:property **but** using writable store
  - [x] bind:property on components
  - [x] bind:property on html elements
  - [x] bind:group
  - [x] bind:this
- [x] use:action
- [x] class:name
- [ ] transition:fn
- [ ] in:fn/out:fn
- [x] `<slot>`
  - [x] `<slot name="name">`
  - [x] `<slot let:name={setter}>` **but** using setter or writable store
  - [x] `<slot let:name={property}>{property}</slot>` when using a writable store
- [x] context propagation
- [ ] svelte:self
- [ ] svelte:component
- [ ] svelte:window
- [ ] svelte:body
- [ ] svelte:head

## Support

This project is free and open-source, so if you think this project can help you or anyone else, you may [star it on GitHub](https://github.com/kenoxa/svelte-hyperscript). Feel free to [open an issue](https://github.comkenoxan/svelte-hyperscript/issues) if you have any idea, question, or you've found a bug.

## Contribute

Thanks for being willing to contribute!

**Working on your first Pull Request?** You can learn how from this _free_ series [How to Contribute to an Open Source Project on GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github)

We are following the [Conventional Commits](https://www.conventionalcommits.org) convention.

### Develop

- `npm test`: Run test suite
- `npm run build`: Generate bundles
- `npm run lint`: Lints code

## NPM Statistics

[![NPM](https://nodei.co/npm/svelte-hyperscript.png)](https://nodei.co/npm/svelte-hyperscript/)

## License

`svelte-hyperscript` is open source software [licensed as MIT](https://github.com/kenoxa/svelte-hyperscript/blob/main/LICENSE).

[jsx]: https://reactjs.org/docs/introducing-jsx.html
[svelte-jsx]: https://www.npmjs.com/package/svelte-jsx
[svelte-hyperscript]: https://www.npmjs.com/package/svelte-hyperscript
[svelte-fragment-component]: https://www.npmjs.com/package/svelte-fragment-component
