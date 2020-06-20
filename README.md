# svelte-hyperscript

> use [hyperscript](https://github.com/hyperhype/hyperscript) to create svelte components

[![GitHub license](https://img.shields.io/github/license/sastan/svelte-hyperscript)](https://github.com/sastan/svelte-hyperscript/blob/main/LICENSE) [![NPM version](https://img.shields.io/npm/v/svelte-hyperscript.svg?style=flat)](https://www.npmjs.com/package/svelte-hyperscript) [![NPM downloads](https://img.shields.io/npm/dm/svelte-hyperscript.svg?style=flat)](https://www.npmjs.com/package/svelte-hyperscript)

## Installation

```sh
npm install svelte-hyperscript
```

CDN: [UNPKG](https://unpkg.com/svelte-hyperscript/) | [jsDelivr](https://cdn.jsdelivr.net/npm/svelte-hyperscript/) (available as `window.svelteHyperscript`)

## Usage

This package exposes an hyperscript compatible function: `h(tag, properties, ...children)` which return a svelte component.

```js
import h from 'svelte-hyperscript'

import Button from '../src/Button.svelte'

let clicked = 0
const LabeledButton = h(Button, { 'on:click': () => (clicked += 1) }, h('span', null, 'Click Me!'))

const button = new LabeledButton({
  target: document.body,
})
```

This project is the core for [svelte-jsx](https://www.npmjs.com/package/svelte-jsx)
and [svelte-htm](https://www.npmjs.com/package/svelte-htm). Their aim is to simplify svelte component testing.

## Feature Set

- [x] on:eventname
- [ ] on:eventname modifiers
- [ ] bind:property **but** using setter/getter
- [ ] use:action
- [ ] transition:fn
- [ ] in:fn/out:fn
- [x] `<slot>`
- [x] `<slot name="name">`
- [x] `<slot let:name={setter}>`
- [ ] `<slot let:name={property}>{property}</slot>`
- [ ] Client-side component API
  - [ ] component.\$set(props)
  - [ ] component.\$on(event, callback)
  - [ ] component.\$destroy()
- [x] context propagation
- [ ] Lifecycle component: `<Component init={() => setContext()}>...<//>`

## NPM Statistics

[![NPM](https://nodei.co/npm/svelte-hyperscript.png)](https://nodei.co/npm/svelte-hyperscript/)

## License

`svelte-hyperscript` is open source software [licensed as MIT](https://github.com/sastan/svelte-hyperscript/blob/main/LICENSE).
