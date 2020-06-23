<script>
  export let initialCount = 0
  export let count = initialCount

  function handleClick() {
    count += 1
  }
</script>

<button on:click="{handleClick}" on:click>
  <slot {count}>Count is {count}</slot>
</button>
