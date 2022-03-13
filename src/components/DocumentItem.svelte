<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { SET_RENAME_DOCUMENT_ACTION } from "../constants";
  import type { ProjectDoc } from "../models/project";
  import { appStore } from "../store/app";
  import Dragabble from "./Draggable.svelte";
  import { projectsStore } from "../store/projects";
  import { useContextMenu } from "./ContextMenu";
  import type { ContextMenuItem } from "./ContextMenu/types";
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
  let renameMode = false;

  let inputEl: HTMLInputElement | undefined;

  const dispatch = createEventDispatcher();

  const onRename = (e: Event) => {
    const newName = (e.target as HTMLInputElement).value;
    if (newName !== document.name) {
      projectsStore.renameDocument(document, newName);
    }
  };

  const setRename = () => {
    renameMode = true;
    setTimeout(() => {
      const name = inputEl.value.split(".").slice(0, -1).join(".");
      const pos = name.length === 0 ? inputEl.value.length : name.length;
      inputEl.focus();
      inputEl.setSelectionRange(0, pos);
    });
  };

  const onSelectContextAction = (type: string) => {
    const handler = {
      rename_document: setRename,
      remove_document: () => {
        projectsStore.removeDocument(document);
      },
    }[type];
    handler && handler();
  };

  onMount(() => {
    appStore.channel.on(SET_RENAME_DOCUMENT_ACTION, (doc: ProjectDoc) => {
      if (doc.id === document.id) {
        setRename();
      }
    });
  });
</script>

<Dragabble type="document" payload={document.id}>
  <button
    class:active
    class="wrapper"
    on:click={() => dispatch("select")}
    on:contextmenu|preventDefault|stopPropagation={useContextMenu(fileActions)(
      onSelectContextAction
    )}
  >
    <div class="icon">
      <Icon name="markdown" />
    </div>
    <div class="content">
      <div class="name">
        {#if renameMode}
          <input
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
    </div>
  </button>
</Dragabble>

<style lang="postcss">
  .wrapper {
    --active-item-color: var(--base-box-color12);
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
    font-size: 1rem;
    color: var(--base-text-color);
    transition: var(--transition);
    border-radius: 4px;
    &.active {
      background-color: var(--active-item-color);
    }
    & .icon {
      color: var(--accent-color);
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
    font-weight: 400;
    color: var(--base-text-color);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
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
