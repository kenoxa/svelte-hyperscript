import { describe, expect, it } from '@jest/globals'
import { render, fireEvent, act } from '@testing-library/svelte'
import { writable, get } from 'svelte/store'

import Counter from '../__fixtures__/Counter'
import h from '../h'

describe('bind:property', () => {
  it('on component', async () => {
    const count = writable(1)
    const { getByRole } = render(h(Counter, { 'bind:count': count }))

    const button = getByRole('button')

    expect(button).toHaveTextContent('Count is 1')

    await fireEvent.click(button)

    expect(button).toHaveTextContent('Count is 2')
    expect(get(count)).toBe(2)

    await act(() => count.set(-1))
    expect(button).toHaveTextContent('Count is -1')
  })
})
