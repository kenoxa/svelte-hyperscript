# svelte-hyperscript

> use [hyperscript](https://github.com/hyperhype/hyperscript) to create svelte components

[![GitHub license](https://img.shields.io/github/license/sastan/svelte-hyperscript)](https://github.com/sastan/svelte-hyperscript/blob/main/LICENSE)
[![NPM version](https://img.shields.io/npm/v/svelte-hyperscript.svg?style=flat)](https://www.npmjs.com/package/svelte-hyperscript)
[![CI](https://github.com/sastan/svelte-hyperscript/workflows/Node.js%20NPM/badge.svg)](https://github.com/sastan/svelte-hyperscript/actions?query=workflow%3A%22Node.js+NPM%22)
[![Coverage Status](https://coveralls.io/repos/github/sastan/svelte-hyperscript/badge.png?branch=main)](https://coveralls.io/github/sastan/svelte-hyperscript?branch=main)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

## Installation

```sh
npm install svelte-hyperscript
```

CDN: [UNPKG](https://unpkg.com/svelte-hyperscript/) | [jsDelivr](https://cdn.jsdelivr.net/npm/svelte-hyperscript/) (available as `window.svelteHyperscript`)

## Usage

This package exposes an [hyperscript](https://github.com/hyperhype/hyperscript) compatible function: `h(tag, properties, ...children)` which returns a svelte component.

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
and [svelte-htm](https://www.npmjs.com/package/svelte-htm).

The above example written in jsx using [svelte-jsx](https://www.npmjs.com/package/svelte-jsx):

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

or using [svelte-htm](https://www.npmjs.com/package/svelte-htm):

```js
import html from 'svelte-htm'
import Button from '../src/Button.svelte'

let clicked = 0
const LabeledButton = html`<${Button} on:click=${() => (clicked += 1)}><span>Click Me!</span><//>`

const button = new LabeledButton({
  target: document.body,
})
```

## Feature Set

- [x] plain html children
- [x] readable store children
- [x] on:eventname
- [ ] on:eventname modifiers
- [ ] bind:property **but** using setter/getter or writable store
- [ ] use:action
- [ ] transition:fn
- [ ] in:fn/out:fn
- [x] `<slot>`
- [x] `<slot name="name">`
- [ ] `<slot let:name={setter}>` **but** using setter or readable store
- [ ] `<slot let:name={property}>{property}</slot>`
- [ ] Client-side component API
  - [ ] component.\$set(props)
  - [ ] component.\$on(event, callback)
  - [ ] component.\$destroy()
- [x] context propagation
- [ ] Lifecycle component: `<Component init={() => setContext()}>...<//>`

## Support

This project is free and open-source, so if you think this project can help you or anyone else, you may [star it on GitHub](https://github.com/sastan/svelte-hyperscript). Feel free to [open an issue](https://github.com/sastan/svelte-hyperscript/issues) if you have any idea, question, or you've found a bug.

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

`svelte-hyperscript` is open source software [licensed as MIT](https://github.com/sastan/svelte-hyperscript/blob/main/LICENSE).
