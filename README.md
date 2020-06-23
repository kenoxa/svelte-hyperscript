# svelte-hyperscript

> use [hyperscript](https://github.com/hyperhype/hyperscript) to create svelte components

[![License](https://badgen.net/npm/license/svelte-hyperscript)](https://github.com/sastan/svelte-hyperscript/blob/main/LICENSE)
[![Latest Release](https://badgen.net/npm/v/svelte-hyperscript)](https://www.npmjs.com/package/svelte-hyperscript)
[![View changelog](https://badgen.net/badge/%E2%80%8B/Explore%20Changelog/green?icon=awesome)](https://changelogs.xyz/svelte-hyperscript)

[![CI](https://github.com/sastan/svelte-hyperscript/workflows/CI/badge.svg)](https://github.com/sastan/svelte-hyperscript/actions?query=branch%3Amain+workflow%3ACI)
[![Coverage Status](https://badgen.net/coveralls/c/github/sastan/svelte-hyperscript/main)](https://coveralls.io/github/sastan/svelte-hyperscript?branch=main)
[![PRs Welcome](https://badgen.net/badge/PRs/welcome/purple)](http://makeapullrequest.com)
[![Conventional Commits](https://badgen.net/badge/Conventional%20Commits/1.0.0/cyan)](https://conventionalcommits.org)

## What?

This package exposes an [hyperscript](https://github.com/hyperhype/hyperscript) compatible function: `h(tag, properties, ...children)` which returns a svelte component.

## Why?

This is the core for [svelte-jsx](https://www.npmjs.com/package/svelte-jsx) and [svelte-htm](https://www.npmjs.com/package/svelte-htm). These packages allow to simplify svelte testing code especially slot handling.

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

Or use script tags and globals ([UNPKG](https://unpkg.com/svelte-hyperscript/) | [jsDelivr](https://cdn.jsdelivr.net/npm/svelte-hyperscript/)).

```html
<!-- UNPKG -->
<script src="https://unpkg.com/svelte-hyperscript"></script>

<!-- jsDelivr -->
<script src="https://cdn.jsdelivr.net/npm/svelte-hyperscript"></script>
```

And then grab it off the global like so:

```js
const h = svelteHyperscript
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
- [x] on:eventname modifiers
- [x] bind:property **but** using writable store
  - [x] bind:property on components
  - [x] bind:property on html elements
  - [x] bind:group
  - [x] bind:this
- [ ] use:action
- [x] class:name
- [ ] transition:fn
- [ ] in:fn/out:fn
- [x] `<slot>`
- [x] `<slot name="name">`
- [x] `<slot let:name={setter}>` **but** using setter or writable store
- [x] `<slot let:name={property}>{property}</slot>` when using a writable store
- [ ] Client-side component API
  - [ ] component.\$set(props)
  - [ ] component.\$on(event, callback)
  - [ ] component.\$destroy()
- [x] context propagation

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
