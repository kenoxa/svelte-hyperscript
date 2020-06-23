import { describe, expect, it } from '@jest/globals'
import { render, fireEvent, act } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import { writable, get } from 'svelte/store'
import Fragment from 'svelte-fragment-component'

import Counter from '../__fixtures__/Counter'
import h from '../h'

describe('bind:property', () => {
  describe('on component', () => {
    it('passes property along', async () => {
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

  describe('on input', () => {
    it('binds value', async () => {
      const text = writable('a')
      const { getByRole } = render(h('input', { 'bind:value': text }))

      const input = getByRole('textbox')

      expect(input).toHaveValue('a')

      await userEvent.type(input, 'b')

      expect(input).toHaveValue('ab')
      expect(get(text)).toBe('ab')

      await act(() => text.set('c'))
      expect(input).toHaveValue('c')
    })

    it('initially undefined', async () => {
      const text = writable()
      const { getByRole } = render(h('input', { 'bind:value': text, value: 'x' }))

      const input = getByRole('textbox')

      expect(input).toHaveValue('x')
      expect(get(text)).toBe('x')
    })

    it('with value (store has precedence)', async () => {
      const text = writable('a')
      const { getByRole } = render(h('input', { 'bind:value': text, value: 'x' }))

      const input = getByRole('textbox')

      expect(input).toHaveValue('a')
      expect(get(text)).toBe('a')
    })
  })

  describe('on textarea', () => {
    it('binds value', async () => {
      const text = writable('a')
      const { getByRole } = render(h('textarea', { 'bind:value': text }))

      const textarea = getByRole('textbox')

      expect(textarea).toHaveValue('a')

      await userEvent.type(textarea, 'b')

      expect(textarea).toHaveValue('ab')
      expect(get(text)).toBe('ab')

      await act(() => text.set('c'))
      expect(textarea).toHaveValue('c')
    })

    it('initially undefined', async () => {
      const text = writable()
      const { getByRole } = render(h('textarea', { 'bind:value': text }, 'x'))

      const textarea = getByRole('textbox')

      expect(textarea).toHaveValue('x')
      expect(get(text)).toBe('x')
    })

    it('with content (store has precedence)', async () => {
      const text = writable('a')
      const { getByRole } = render(h('textarea', { 'bind:value': text }, 'x'))

      const textarea = getByRole('textbox')

      expect(textarea).toHaveValue('a')
      expect(get(text)).toBe('a')
    })
  })

  describe('on input[checkbox]', () => {
    it('binds checked state', async () => {
      const checked = writable(true)
      const { getByRole } = render(h('input', { type: 'checkbox', 'bind:value': checked }))

      const input = getByRole('checkbox')

      expect(input).toBeChecked()

      await userEvent.click(input)

      expect(input).not.toBeChecked()
      expect(get(checked)).toBe(false)

      await act(() => checked.set(true))
      expect(input).toBeChecked()
    })

    it('initially undefined', async () => {
      const checked = writable()
      const { getByRole } = render(h('input', { type: 'checkbox', 'bind:value': checked }))

      const input = getByRole('checkbox')

      expect(input).not.toBeChecked()
      expect(get(checked)).toBe(false)
    })

    it('with checked and initially undefined', async () => {
      const checked = writable()
      const { getByRole } = render(
        h('input', { type: 'checkbox', 'bind:value': checked, checked: true }),
      )

      const input = getByRole('checkbox')

      expect(input).toBeChecked()
      expect(get(checked)).toBe(true)
    })

    it('store has precedence', async () => {
      const checked = writable(true)
      const { getByRole } = render(
        h('input', { type: 'checkbox', 'bind:value': checked, checked: false }),
      )

      const input = getByRole('checkbox')

      expect(input).toBeChecked()
      expect(get(checked)).toBe(true)
    })

    it('with checked and store has precedence', async () => {
      const checked = writable(false)
      const { getByRole } = render(
        h('input', { type: 'checkbox', 'bind:value': checked, checked: true }),
      )

      const input = getByRole('checkbox')

      expect(input).not.toBeChecked()
      expect(get(checked)).toBe(false)
    })
  })

  describe('on input[number]', () => {
    it('binds value', async () => {
      const number = writable(1)
      const { getByTestId } = render(
        h('input', { type: 'number', 'bind:value': number, 'data-testid': 'input' }),
      )

      const input = getByTestId('input')

      expect(input).toHaveValue(1)

      await userEvent.clear(input)
      await userEvent.type(input, '2')

      expect(input).toHaveValue(2)
      expect(get(number)).toBe(2)

      await act(() => number.set(3))
      expect(input).toHaveValue(3)
    })

    it('initially undefined', async () => {
      const number = writable()
      const { getByTestId } = render(
        h('input', { type: 'number', 'bind:value': number, value: '5', 'data-testid': 'input' }),
      )

      const input = getByTestId('input')

      expect(input).toHaveValue(5)
      expect(get(number)).toBe(5)
    })

    it('with value (store has precedence)', async () => {
      const number = writable(3)
      const { getByTestId } = render(
        h('input', { type: 'number', 'bind:value': number, value: 5, 'data-testid': 'input' }),
      )

      const input = getByTestId('input')

      expect(input).toHaveValue(3)
      expect(get(number)).toBe(3)
    })
  })

  describe('on input[range]', () => {
    it('binds value', async () => {
      const range = writable(1)
      const { getByTestId } = render(
        h('input', { type: 'range', 'bind:value': range, 'data-testid': 'input' }),
      )

      const input = getByTestId('input')

      expect(input).toHaveValue('1')

      await userEvent.clear(input)
      await userEvent.type(input, '100')

      expect(input).toHaveValue('100')
      expect(get(range)).toBe(100)

      await act(() => range.set(3))
      expect(input).toHaveValue('3')
    })

    it('initially undefined', async () => {
      const range = writable()
      const { getByTestId } = render(
        h('input', { type: 'range', 'bind:value': range, value: '5', 'data-testid': 'input' }),
      )

      const input = getByTestId('input')

      expect(input).toHaveValue('5')
      expect(get(range)).toBe(5)
    })

    it('with value (store has precedence)', async () => {
      const range = writable(3)
      const { getByTestId } = render(
        h('input', { type: 'range', 'bind:value': range, value: 5, 'data-testid': 'input' }),
      )

      const input = getByTestId('input')

      expect(input).toHaveValue('3')
      expect(get(range)).toBe(3)
    })
  })

  describe('on select', () => {
    it('binds value', async () => {
      const value = writable('a')
      const { getByRole } = render(
        h(
          'select',
          { 'bind:value': value },
          h('option', { value: 'a' }),
          h('option', { value: 'b' }),
          h('option', { value: 'c' }),
        ),
      )

      const select = getByRole('combobox')

      expect(select).toHaveValue('a')

      await userEvent.selectOptions(select, 'b')

      expect(select).toHaveValue('b')
      expect(get(value)).toBe('b')

      await act(() => value.set('c'))
      expect(select).toHaveValue('c')
    })

    it('initially undefined with selected option', async () => {
      const value = writable()
      const { getByRole } = render(
        h(
          'select',
          { 'bind:value': value },
          h('option', { value: 'a' }),
          h('option', { value: 'b', selected: true }),
          h('option', { value: 'c' }),
        ),
      )

      const select = getByRole('combobox')

      expect(select).toHaveValue('b')
      expect(get(value)).toBe('b')
    })

    it('initially undefined without selected option', async () => {
      const value = writable()
      const { getByRole } = render(
        h(
          'select',
          { 'bind:value': value },
          h('option', { value: 'a' }),
          h('option', { value: 'b' }),
          h('option', { value: 'c' }),
        ),
      )

      const select = getByRole('combobox')

      expect(select).toHaveValue('a')
      expect(get(value)).toBe('a')
    })

    it('with value (store has precedence)', async () => {
      const value = writable('b')
      const { getByRole } = render(
        h(
          'select',
          { 'bind:value': value },
          h('option', { value: 'a' }),
          h('option', { value: 'b' }),
          h('option', { value: 'c', selected: true }),
        ),
      )

      const select = getByRole('combobox')

      expect(select).toHaveValue('b')
      expect(get(value)).toBe('b')
    })
  })

  describe('on select[multiple]', () => {
    it('binds value', async () => {
      const value = writable(['a', 'c'])
      const { getByRole } = render(
        h(
          'select',
          { 'bind:value': value, multiple: true },
          h('option', { value: 'a' }),
          h('option', { value: 'b' }),
          h('option', { value: 'c' }),
          h('option', { value: 'd' }),
          h('option', { value: 'e' }),
        ),
      )

      const select = getByRole('listbox')

      expect(select).toHaveValue(['a', 'c'])

      await userEvent.selectOptions(select, ['d', 'e'])

      expect(select).toHaveValue(['a', 'c', 'd', 'e'])
      expect(get(value)).toEqual(['a', 'c', 'd', 'e'])

      await userEvent.deselectOptions(select, ['c', 'e'])

      expect(select).toHaveValue(['a', 'd'])
      expect(get(value)).toEqual(['a', 'd'])

      await act(() => value.set(['b', 'd']))
      expect(select).toHaveValue(['b', 'd'])
    })

    it('initially undefined with selected options', async () => {
      const value = writable()
      const { getByRole } = render(
        h(
          'select',
          { 'bind:value': value, multiple: true },
          h('option', { value: 'a' }),
          h('option', { value: 'b' }),
          h('option', { value: 'c', selected: true }),
          h('option', { value: 'd', selected: true }),
          h('option', { value: 'e' }),
        ),
      )

      const select = getByRole('listbox')

      expect(select).toHaveValue(['c', 'd'])
      expect(get(value)).toEqual(['c', 'd'])
    })

    it('initially undefined without selected option', async () => {
      const value = writable()
      const { getByRole } = render(
        h(
          'select',
          { 'bind:value': value, multiple: true },
          h('option', { value: 'a' }),
          h('option', { value: 'b' }),
          h('option', { value: 'c' }),
          h('option', { value: 'd' }),
          h('option', { value: 'e' }),
        ),
      )

      const select = getByRole('listbox')

      expect(select).toHaveValue([])
      expect(get(value)).toEqual([])
    })

    it('with value (store has precedence)', async () => {
      const value = writable(['b', 'd'])
      const { getByRole } = render(
        h(
          'select',
          { 'bind:value': value, multiple: true },
          h('option', { value: 'a', selected: true }),
          h('option', { value: 'b', selected: true }),
          h('option', { value: 'c', selected: true }),
          h('option', { value: 'd' }),
          h('option', { value: 'e' }),
        ),
      )

      const select = getByRole('listbox')

      expect(select).toHaveValue(['b', 'd'])
      expect(get(value)).toEqual(['b', 'd'])
    })
  })

  describe('contenteditable="true"', () => {
    it('binds value', async () => {
      const text = writable('a')
      const { getByTestId } = render(
        h('label', { 'bind:textContent': text, contenteditable: true, 'data-testid': 'label' }),
      )

      const label = getByTestId('label')

      expect(label).toHaveTextContent('a')

      await fireEvent.input(label, { target: { textContent: 'b' } })

      expect(label).toHaveTextContent('b')
      expect(get(text)).toBe('b')

      await act(() => text.set('c'))
      expect(label).toHaveTextContent('c')
    })

    it('initially undefined', async () => {
      const text = writable()
      const { getByTestId } = render(
        h(
          'label',
          {
            'bind:textContent': text,
            contenteditable: true,
            'data-testid': 'label',
          },
          'x',
        ),
      )

      const label = getByTestId('label')

      expect(label).toHaveTextContent('x')
      expect(get(text)).toBe('x')
    })

    it('with content (store has precedence)', async () => {
      const text = writable('a')
      const { getByTestId } = render(
        h(
          'label',
          {
            'bind:textContent': text,
            contenteditable: true,
            'data-testid': 'label',
          },
          'x',
        ),
      )

      const label = getByTestId('label')

      expect(label).toHaveTextContent('a')
      expect(get(text)).toBe('a')
    })
  })

  describe('block-level element measured readonly properties', () => {
    it('binds value', async () => {
      const clientWidth = writable()
      const clientHeight = writable()
      const offsetWidth = writable()
      const offsetHeight = writable()

      render(
        h(
          'div',
          {
            'bind:clientWidth': clientWidth,
            'bind:clientHeight': clientHeight,
            'bind:offsetWidth': offsetWidth,
            'bind:offsetHeight': offsetHeight,
            style: 'margin: 30px; width: 100px;',
          },
          h('article', { style: 'height: 50px' }, 'abc'),
        ),
      )

      // That's it for now:
      // - https://github.com/jsdom/jsdom/issues/135
      // - https://github.com/jsdom/jsdom/blob/master/Changelog.md#9110
      // - https://github.com/jsdom/jsdom/blob/master/Changelog.md#9100
      expect(get(clientWidth)).toBe(0)
      expect(get(clientHeight)).toBe(0)
      expect(get(offsetWidth)).toBe(0)
      expect(get(offsetHeight)).toBe(0)
    })
  })

  describe('bind:group', () => {
    it('binds on checkbox', async () => {
      const selected = writable()

      const { getAllByRole } = render(
        h(
          Fragment,
          null,
          h('input', { type: 'checkbox', 'bind:group': selected, value: 'a' }),
          h('input', { type: 'checkbox', 'bind:group': selected, value: 'b' }),
          h('input', { type: 'checkbox', 'bind:group': selected, value: 'c' }),
          h('input', { type: 'checkbox', 'bind:group': selected, value: 'd' }),
        ),
      )

      const [a, b, c, d] = getAllByRole('checkbox')

      expect(a).not.toBeChecked()
      expect(b).not.toBeChecked()
      expect(c).not.toBeChecked()
      expect(d).not.toBeChecked()
      expect(get(selected)).toEqual([])

      await userEvent.click(b)
      expect(a).not.toBeChecked()
      expect(b).toBeChecked()
      expect(c).not.toBeChecked()
      expect(d).not.toBeChecked()
      expect(get(selected)).toEqual(['b'])

      await userEvent.click(d)
      expect(a).not.toBeChecked()
      expect(b).toBeChecked()
      expect(c).not.toBeChecked()
      expect(d).toBeChecked()
      expect(get(selected)).toEqual(['b', 'd'])

      await act(() => selected.set(['a', 'c', 'd']))
      expect(a).toBeChecked()
      expect(b).not.toBeChecked()
      expect(c).toBeChecked()
      expect(d).toBeChecked()
      expect(get(selected)).toEqual(['a', 'c', 'd'])
    })

    it('binds on checkbox with initial selected', async () => {
      const selected = writable(['a', 'd'])

      const { getAllByRole } = render(
        h(
          Fragment,
          null,
          h('input', { type: 'checkbox', 'bind:group': selected, value: 'a' }),
          h('input', { type: 'checkbox', 'bind:group': selected, value: 'b' }),
          h('input', { type: 'checkbox', 'bind:group': selected, value: 'c' }),
          h('input', { type: 'checkbox', 'bind:group': selected, value: 'd' }),
        ),
      )

      const [a, b, c, d] = getAllByRole('checkbox')

      expect(a).toBeChecked()
      expect(b).not.toBeChecked()
      expect(c).not.toBeChecked()
      expect(d).toBeChecked()
      expect(get(selected)).toEqual(['a', 'd'])
    })

    it('binds on radio', async () => {
      const selected = writable()

      const { getAllByRole } = render(
        h(
          Fragment,
          null,
          h('input', { type: 'radio', 'bind:group': selected, value: 'a' }),
          h('input', { type: 'radio', 'bind:group': selected, value: 'b' }),
          h('input', { type: 'radio', 'bind:group': selected, value: 'c' }),
          h('input', { type: 'radio', 'bind:group': selected, value: 'd' }),
        ),
      )

      const [a, b, c, d] = getAllByRole('radio')

      expect(a).not.toBeChecked()
      expect(b).not.toBeChecked()
      expect(c).not.toBeChecked()
      expect(d).not.toBeChecked()
      expect(get(selected)).toBeUndefined()

      await userEvent.click(b)
      expect(a).not.toBeChecked()
      expect(b).toBeChecked()
      expect(c).not.toBeChecked()
      expect(d).not.toBeChecked()
      expect(get(selected)).toBe('b')

      await userEvent.click(d)
      expect(a).not.toBeChecked()
      expect(b).not.toBeChecked()
      expect(c).not.toBeChecked()
      expect(d).toBeChecked()
      expect(get(selected)).toBe('d')

      await act(() => selected.set('c'))
      expect(a).not.toBeChecked()
      expect(b).not.toBeChecked()
      expect(c).toBeChecked()
      expect(d).not.toBeChecked()
      expect(get(selected)).toBe('c')
    })

    it('binds on radio with initial selected', async () => {
      const selected = writable('b')

      const { getAllByRole } = render(
        h(
          Fragment,
          null,
          h('input', { type: 'radio', 'bind:group': selected, value: 'a' }),
          h('input', { type: 'radio', 'bind:group': selected, value: 'b' }),
          h('input', { type: 'radio', 'bind:group': selected, value: 'c' }),
          h('input', { type: 'radio', 'bind:group': selected, value: 'd' }),
        ),
      )

      const [a, b, c, d] = getAllByRole('radio')

      expect(a).not.toBeChecked()
      expect(b).toBeChecked()
      expect(c).not.toBeChecked()
      expect(d).not.toBeChecked()
      expect(get(selected)).toBe('b')
    })

    it('binds on radio with initial checked', async () => {
      const selected = writable()

      const { getAllByRole } = render(
        h(
          Fragment,
          null,
          h('input', { type: 'radio', 'bind:group': selected, value: 'a' }),
          h('input', { type: 'radio', 'bind:group': selected, value: 'b' }),
          h('input', { type: 'radio', 'bind:group': selected, value: 'c', checked: true }),
          h('input', { type: 'radio', 'bind:group': selected, value: 'd' }),
        ),
      )

      const [a, b, c, d] = getAllByRole('radio')

      expect(a).not.toBeChecked()
      expect(b).not.toBeChecked()
      expect(c).toBeChecked()
      expect(d).not.toBeChecked()
      expect(get(selected)).toBe('c')
    })

    it('binds on radio with initial selected (prefered) and checked', async () => {
      const selected = writable('b')

      const { getAllByRole } = render(
        h(
          Fragment,
          null,
          h('input', { type: 'radio', 'bind:group': selected, value: 'a' }),
          h('input', { type: 'radio', 'bind:group': selected, value: 'b' }),
          h('input', { type: 'radio', 'bind:group': selected, value: 'c', checked: true }),
          h('input', { type: 'radio', 'bind:group': selected, value: 'd' }),
        ),
      )

      const [a, b, c, d] = getAllByRole('radio')

      expect(a).not.toBeChecked()
      expect(b).toBeChecked()
      expect(c).not.toBeChecked()
      expect(d).not.toBeChecked()
      expect(get(selected)).toBe('b')
    })
  })

  describe('bind:this', () => {
    it('sets the dom node reference', async () => {
      const element = writable()
      const { unmount } = render(h('canvas', { 'bind:this': element }))

      expect(get(element)).toBeInTheDocument()

      await unmount()

      expect(get(element)).toBeNull()
    })
  })
})
