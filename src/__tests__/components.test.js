import { describe, expect, it, jest } from '@jest/globals'
import { render, fireEvent } from '@testing-library/svelte'
import { writable, get } from 'svelte/store'

import Counter from '../__fixtures__/Counter'
import List from '../__fixtures__/List'

import h from '../h'

describe('html', () => {
  it('increments count when button is clicked', async () => {
    const { getByText } = render(h(Counter))
    const button = getByText('Count is 0')

    await fireEvent.click(button)
    expect(button).toHaveTextContent('Count is 1')

    await fireEvent.click(button)
    expect(button).toHaveTextContent('Count is 2')
  })

  it('increments count when button is clicked (initialized)', async () => {
    const { getByText } = render(h(Counter, { initialCount: 5 }))
    const button = getByText('Count is 5')

    await fireEvent.click(button)
    expect(button).toHaveTextContent('Count is 6')
  })

  it('forwards click event', async () => {
    const handleClick = jest.fn()

    const { getByRole } = render(h(Counter, { 'on:click': handleClick }))

    const button = getByRole('button')

    await fireEvent.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
    expect(button).toHaveTextContent('Count is 1')
  })

  it('allows to provide default slot content', () => {
    const { getByRole } = render(h(Counter, null, 'New default slot content'))

    const button = getByRole('button')

    expect(button).toHaveTextContent('New default slot content')
  })

  it('allows to access default slot values using setter', async () => {
    const countSetter = jest.fn()
    const { getByRole } = render(h(Counter, { 'let:count': countSetter }, 'slot content'))
    const button = getByRole('button')

    expect(countSetter).toHaveBeenCalledWith(0, 'count')

    await fireEvent.click(button)
    expect(countSetter).toHaveBeenCalledWith(1, 'count')

    await fireEvent.click(button)

    expect(countSetter).toHaveBeenCalledWith(2, 'count')
  })

  it('allows to access default slot values using writeable store', async () => {
    const count = writable(-1) // Should be set to 0 before slot rendering

    // <Counter let:count>current count: {$count}</Counter>
    const { getByRole } = render(h(Counter, { 'let:count': count }, 'current count: ', count))
    const button = getByRole('button')

    expect(button).toHaveTextContent('current count: 0')

    await fireEvent.click(button)
    expect(get(count)).toBe(1)
    expect(button).toHaveTextContent('current count: 1')

    await fireEvent.click(button)
    expect(get(count)).toBe(2)
    expect(button).toHaveTextContent('current count: 2')
  })

  it('allows to provide named slot content', () => {
    const itemSetter = jest.fn()
    const itemsSetter = jest.fn()
    const items = ['a', 'b', 'c']

    const { container } = render(
      h(
        List,
        { items, 'let:item': itemSetter },
        'each item',
        h('p', { slot: 'footer', 'let:items': itemsSetter }, 'The end'),
      ),
    )

    expect(container).toContainHTML(
      `<ul><li>each item </li><li>each item </li><li>each item </li></ul> <p>The end</p>`,
    )

    expect(itemSetter.mock.calls).toMatchObject([
      ['a', 'item'],
      ['b', 'item'],
      ['c', 'item'],
    ])

    expect(itemsSetter).toHaveBeenCalledTimes(1)
    expect(itemsSetter).toHaveBeenCalledWith(items, 'items')
  })
})
