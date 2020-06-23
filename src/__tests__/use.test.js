import { describe, expect, it, jest } from '@jest/globals'
import { render } from '@testing-library/svelte'

import h from '../h'

describe('use:action', () => {
  it('it call action factory', async () => {
    const firstActionDestroy = jest.fn()
    const firstAction = jest.fn(() => {
      return {
        destroy: firstActionDestroy,
      }
    })

    const secondAction = jest.fn()

    const { getByRole, unmount } = render(
      h('h1', { 'use:first': firstAction, 'use:second': secondAction }),
    )

    const h1 = getByRole('heading')

    expect(firstAction).toHaveBeenCalledWith(h1)
    expect(secondAction).toHaveBeenCalledWith(h1)

    await unmount()

    expect(firstActionDestroy).toHaveBeenCalled()
  })
})
