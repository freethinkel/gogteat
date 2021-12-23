<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { editorStore } from "../store/editor";
  import Icon from "./Icon.svelte";

  export let name = "";
  export let active = false;

  const dispatch = createEventDispatcher();
</script>

<button class:active class="wrapper" on:click={() => dispatch("select")}>
  <div class="icon">
    <Icon name="markdown" />
  </div>
  <div class="content">
    <div class="name">
      {name}
    </div>
    {#if active}
      <div class="path">
        {$editorStore.content.split("\n")[0]}
      </div>
    {/if}
  </div>
</button>

<style lang="postcss">
  .wrapper {
    border: none;
    background: none;
    width: 100%;
    margin: 0;
    padding: 0;
    display: flex;
    padding: 4px 6px;
    cursor: pointer;
    --active-item-color: rgba(0, 0, 0, 0.06);
    text-align: left;
    gap: 4px;
    align-items: center;
    height: 42px;
    font-size: 1rem;
    &.active {
      background-color: var(--active-item-color);
    }
  }
  .content {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    width: 0;
  }
  .name {
    font-size: 0.9rem;
    font-weight: bold;
  }
  .path {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    color: rgba(0, 0, 0, 0.6);
    font-size: 0.8rem;
  }
</style>
