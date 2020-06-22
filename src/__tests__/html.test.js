import { describe, expect, it } from '@jest/globals'
import { render, act } from '@testing-library/svelte'
import { writable } from 'svelte/store'
import Fragment from 'svelte-fragment-component'

import h from '../h'

describe('html', () => {
  it('supports nested html', () => {
    const { getByRole } = render(
      h('h1', { class: 'large' }, 'Hello ', h('strong', null, 'World'), '!'),
    )
    const heading = getByRole('heading')

    expect(heading.outerHTML).toMatch('<h1 class="large">Hello <strong>World</strong>!</h1>')
  })

  it('supports multiple root elements (fragments)', () => {
    const { container } = render(h(Fragment, null, h('span', null, 'a'), h('span', null, 'b')))

    expect(container.innerHTML).toMatch('<div><span>a</span><span>b</span></div>')
  })

  it('allows to use a store as child', async () => {
    const count = writable(0)

    // <span>count: {$count}</span>
    const { container } = render(h('span', null, 'count: ', count))

    expect(container).toContainHTML('<span>count: 0</span>')

    await act(() => count.set(1))
    expect(container).toContainHTML('<span>count: 1</span>')

    await act(() => count.set(-1))
    expect(container).toContainHTML('<span>count: -1</span>')
  })

  it('ignores undefined, null & false children', () => {
    const { container } = render(h('p', null, 'There', null, ' are ', '', 5, undefined, ' icons'))

    expect(container).toContainHTML('<p>There are 5 icons</p>')
  })
})
