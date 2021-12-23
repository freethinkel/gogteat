<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
</script>

<button class="btn" on:click={() => dispatch("click")}>
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
    &:hover {
      background-color: rgba(0, 0, 0, 0.08);
    }
    &:disabled {
      opacity: 0.6;
      cursor: pointer;
    }
  }
</style>
