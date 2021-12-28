<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { ProjectDoc } from "../models/project";
  import { appStore, ContextMenuItem } from "../store/app";
  import { editorStore } from "../store/editor";
  import { projectsStore } from "../store/projects";
  import Icon from "./Icon.svelte";

  const fileActions: ContextMenuItem[] = [
    {
      text: "Переименовать",
      type: "rename_document",
    },
    {
      text: "Удалить",
      type: "remove_document",
    },
  ];

  export let document: ProjectDoc;
  export let active = false;
  export let renameMode = false;

  let inputEl: HTMLInputElement | undefined;

  $: {
    if (renameMode) {
      setTimeout(() => {
        const name = inputEl.value.split(".").slice(0, -1).join(".");
        const pos = name.length === 0 ? inputEl.value.length : name.length;
        inputEl.setSelectionRange(pos, pos);
      });
    }
  }

  const dispatch = createEventDispatcher();

  const onRename = (e: Event) => {
    const newName = (e.target as HTMLInputElement).value;
    if (newName !== document.name) {
      projectsStore.renameDocument(document, newName);
    }
    appStore.closeContextMenu(null);
  };
</script>

<button
  class:active
  class="wrapper"
  on:click={() => dispatch("select")}
  on:contextmenu|preventDefault={appStore.openContextMenu(
    fileActions.map((item) => ({ ...item, payload: document }))
  )}
>
  <div class="icon">
    <Icon name="markdown" />
  </div>
  <div class="content">
    <div class="name">
      {#if renameMode}
        <input
          autofocus
          type="text"
          value={document.name}
          bind:this={inputEl}
          on:blur={onRename}
          on:keydown={(e) => e.key === "Enter" && onRename(e)}
        />
      {:else}
        {document.name}
      {/if}
    </div>
    {#if active}
      <div class="path">
        {$editorStore.document?.content?.split("\n")?.[0]}
      </div>
    {/if}
  </div>
</button>

<style lang="postcss">
  .wrapper {
    --active-item-color: rgba(0, 0, 0, 0.06);
    @media (prefers-color-scheme: dark) {
      --active-item-color: rgba(255, 255, 255, 0.06);
    }
    user-select: none;
    border: none;
    background: none;
    width: 100%;
    margin: 0;
    padding: 0;
    display: flex;
    padding: 4px 6px;
    cursor: pointer;
    text-align: left;
    gap: 4px;
    align-items: center;
    height: 42px;
    font-size: 1rem;
    color: var(--base-text-color);
    border-bottom: 1px solid var(--border-color);
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
    color: var(--base-text-color);
    & input {
      width: 100%;
      background: none;
      appearance: none;
      color: inherit;
      font-size: inherit;
      border: none;
      padding: 0;
      outline: none;
      margin: 0;
      font-weight: inherit;
    }
  }
  .path {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    color: var(--base-text-color60);
    font-size: 0.8rem;
  }
</style>
