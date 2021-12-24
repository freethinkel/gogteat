<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let active: boolean = false;

  const dispatch = createEventDispatcher();
</script>

<button class:active class="btn" on:click={() => dispatch("click")}>
  <slot />
</button>

<style lang="postcss">
  .btn {
    border: none;
    cursor: pointer;
    background: none;
    margin: 0;
    font-size: 1rem;
    padding: 3px;
    border-radius: 6px;
    display: flex;
    color: var(--base-text-color60);
    &:hover,
    &.active {
      background-color: var(--accent-color12);
      color: var(--accent-color);
    }
    &:disabled {
      opacity: 0.6;
      cursor: pointer;
    }
  }
</style>
