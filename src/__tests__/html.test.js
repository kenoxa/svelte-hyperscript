import { describe, expect, it, jest } from '@jest/globals'
import { render, fireEvent, act } from '@testing-library/svelte'
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

  it('supports click listener', async () => {
    const handleClick = jest.fn()

    const { getByRole } = render(h('button', { 'on:click': handleClick }, 'Click Me!'))
    const button = getByRole('button')

    // Using await when firing events is unique to the svelte testing library because
    // we have to wait for the next `tick` so that Svelte flushes all pending state changes.
    await fireEvent.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('allows to use a store as child', async () => {
    const count = writable(0)

    const { container } = render(h('span', null, 'count: ', count))

    expect(container).toContainHTML('<span>count: 0</span>')

    await act(() => count.set(1))
    expect(container).toContainHTML('<span>count: 1</span>')

    await act(() => count.set(-1))
    expect(container).toContainHTML('<span>count: -1</span>')
  })
})
