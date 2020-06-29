import type { SvelteComponent } from 'svelte'

declare function h(
  type: string | SvelteComponent,
  props?: Record<string, unknown> | null,
  ...children: unknown[]
): typeof SvelteComponent

export default h
