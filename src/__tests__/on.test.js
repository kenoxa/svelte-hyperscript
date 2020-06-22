import { describe, expect, it } from '@jest/globals'
import { render, fireEvent } from '@testing-library/svelte'

import h from '../h'

describe('on:eventname', () => {
  it('supports click listener', async () => {
    const handleClick = jest.fn()

    const { getByRole } = render(h('button', { 'on:click': handleClick }, 'Click Me!'))
    const button = getByRole('button')

    await fireEvent.click(button)
    expect(handleClick).toHaveBeenCalledTimes(1)

    await fireEvent.click(button)
    expect(handleClick).toHaveBeenCalledTimes(2)
  })

  it('supports once modifier', async () => {
    const handleClick = jest.fn()

    const { getByRole } = render(h('button', { 'on:click|once': handleClick }, 'Click Me!'))
    const button = getByRole('button')

    await fireEvent.click(button)
    expect(handleClick).toHaveBeenCalledTimes(1)

    await fireEvent.click(button)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('supports self modifier', async () => {
    const buttonClick = jest.fn()
    const articleClick = jest.fn()

    const { getByRole } = render(
      h(
        'article',
        { 'on:click|self': articleClick },
        h('button', { 'on:click|self': buttonClick }, 'Click Me!'),
      ),
    )
    const article = getByRole('article')
    const button = getByRole('button')

    await fireEvent.click(button)
    expect(buttonClick).toHaveBeenCalledTimes(1)
    expect(articleClick).toHaveBeenCalledTimes(0)

    await fireEvent.click(article)
    expect(buttonClick).toHaveBeenCalledTimes(1)
    expect(articleClick).toHaveBeenCalledTimes(1)
  })

  it('supports propagated events', async () => {
    const buttonClick = jest.fn()
    const articleClick = jest.fn()

    const { getByRole } = render(
      h(
        'article',
        { 'on:click': articleClick },
        h('button', { 'on:click': buttonClick }, 'Click Me!'),
      ),
    )
    const button = getByRole('button')

    await fireEvent.click(button)
    expect(buttonClick).toHaveBeenCalledTimes(1)
    expect(articleClick).toHaveBeenCalledTimes(1)
  })

  it('supports stopPropagation modifier', async () => {
    const buttonClick = jest.fn()
    const articleClick = jest.fn()

    const { getByRole } = render(
      h(
        'article',
        { 'on:click': articleClick },
        h('button', { 'on:click|stopPropagation': buttonClick }, 'Click Me!'),
      ),
    )
    const button = getByRole('button')

    await fireEvent.click(button)
    expect(buttonClick).toHaveBeenCalledTimes(1)
    expect(articleClick).toHaveBeenCalledTimes(0)
  })

  it('supports preventDefault modifier', async () => {
    const labelClick = jest.fn()
    const checkboxClick = jest.fn()

    const { getByRole } = render(
      h(
        'label',
        { 'on:click': labelClick },
        h('input', { type: 'checkbox', 'on:click|preventDefault': checkboxClick }),
      ),
    )

    const checkbox = getByRole('checkbox')

    await fireEvent.click(checkbox)
    expect(checkbox).not.toBeChecked()

    expect(checkboxClick).toHaveBeenCalledTimes(1)
    expect(labelClick).toHaveBeenCalledWith(expect.objectContaining({ defaultPrevented: true }))
  })
})
