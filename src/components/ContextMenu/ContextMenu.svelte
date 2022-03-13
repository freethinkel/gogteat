<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { ContextMenuItem } from "./types";

  export let items: ContextMenuItem[] = [];

  export let x = 0;
  export let y = 0;

  const dispatch = createEventDispatcher();
</script>

<div
  class="wrapper"
  style={`left: ${x}px; top: ${y}px;`}
  class:hidden={!items.length}
>
  <ul>
    {#each items as item}
      <li>
        <button on:click={() => dispatch("select", item)}>
          {item.text}
        </button>
      </li>
    {/each}
  </ul>
</div>

<style>
  .wrapper {
    user-select: none;
    position: fixed;
    background: var(--base-box-color12);
    backdrop-filter: blur(9px);
    border-radius: 8px;
    min-width: 100px;
    border: 1px solid var(--base-box-color12);
    transition: var(--transition);

    &.hidden {
      opacity: 0;
      visibility: hidden;
    }
  }
  ul {
    margin: 0;
    padding: 6px 4px;
    display: flex;
    flex-direction: column;
  }
  li + li {
    &::before {
      display: flex;
      flex-direction: column;
      content: "";
      width: 100%;
      border-top: 1px solid var(--base-box-color06);
      margin: 2px 0;
    }
  }
  li {
    padding: 0;
    margin: 0;
    list-style: none;
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--base-text-color);
    margin: 0;
    outline: none;
    border-radius: 6px;
    display: flex;
    width: 100%;
    height: 24px;
    font-size: 0.9rem;
    align-items: center;
    &:hover {
      background-color: var(--accent-color);
    }
  }
</style>
