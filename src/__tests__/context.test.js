import { describe, expect, it } from '@jest/globals'
import { render } from '@testing-library/svelte'
import { getContext } from 'svelte'
import Fragment from 'svelte-fragment-component'

import h from '../h'

describe('context API', () => {
  it('propagates context', () => {
    let a

    render(
      h(
        Fragment,
        { context: { a: 1 } },
        h(Fragment, {
          onCreate: () => {
            a = getContext('a')
          },
        }),
      ),
    )

    expect(a).toBe(1)
  })
})
