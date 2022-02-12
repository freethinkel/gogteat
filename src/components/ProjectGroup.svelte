<script lang="ts">
  import { onMount } from "svelte";
  import { SET_RENAME_PROJECT_ACTION } from "../constants";

  import type { Project, ProjectDoc } from "../models/project";
  import { appStore } from "../store/app";
  import { editorStore } from "../store/editor";
  import { projectsStore } from "../store/projects";
  import { useContextMenu } from "./ContextMenu";
  import DocumentItem from "./DocumentItem.svelte";
  import Icon from "./Icon.svelte";

  export let project: Project;
  export let isDraft = false;
  export let isOpen = false;

  let renameMode = false;
  let inputEl: HTMLInputElement | undefined;

  $: documents = project.documents.filter((doc) => !doc.isRemoved);

  $: projectContextMenuActions = [
    {
      text: "Создать новый файл",
      type: "create_new_document",
    },
    {
      text: "Переименовать",
      type: "rename_project",
    },
    {
      text: "Удалить",
      type: "remove_project",
    },
  ].filter((action) =>
    project.isDraft
      ? !["remove_project", "rename_project"].includes(action.type)
      : true
  );

  const toggleOpen = () => {
    isOpen = !isOpen;
  };

  const selectDocument = async (doc: ProjectDoc) => {
    editorStore.setDocument(doc);
  };

  const onRename = (event: Event) => {
    renameMode = false;
    const newName = (event.target as HTMLInputElement).value;
    projectsStore.renameProject(project, newName);
  };

  const setRename = () => {
    renameMode = true;
    setTimeout(() => {
      inputEl?.focus();
    });
  };

  $: onContextMenuAction = (type: string) => {
    const handler = {
      create_new_document: () => projectsStore.createDocument(project),
      rename_project: setRename,
      remove_project: () => projectsStore.removeProject(project),
    }[type];

    handler && handler();
  };

  onMount(() => {
    appStore.channel.on(SET_RENAME_PROJECT_ACTION, (_project: Project) => {
      if (_project.id === project.id) {
        setRename();
      }
    });
  });
</script>

<div class="wrapper" class:state_open={isOpen}>
  <div
    class="project__btn"
    on:click={toggleOpen}
    on:contextmenu|preventDefault|stopPropagation={useContextMenu(
      projectContextMenuActions
    )(onContextMenuAction)}
  >
    <div class="project__name">
      {#if renameMode}
        <input
          on:blur={onRename}
          on:keydown={(e) => e.key === "Enter" && onRename(e)}
          on:click|stopPropagation
          bind:this={inputEl}
          value={project.name}
        />
      {:else}
        <div class="project__name__text">
          {project.name}
        </div>
      {/if}
    </div>
    <div class="arrow-icon">
      <Icon name="chevron-down" />
    </div>
  </div>
  <div class="file-list">
    {#if !documents?.length}
      <div class="file-list__empty">Пустой проект</div>
    {/if}
    {#each documents as document}
      <DocumentItem
        {document}
        active={$editorStore.document?.id === document.id}
        on:select={() => selectDocument(document)}
      />
    {/each}
  </div>
</div>

<style lang="postcss">
  .wrapper {
    user-select: none;
    & .project__btn .arrow-icon {
      transform: rotate(-90deg);
      transition: 0.1s;
    }
    &.state_open {
      & .file-list {
        height: auto;
      }
      & .project__btn .arrow-icon {
        transform: rotate(0deg);
      }
    }
  }
  .file-list {
    height: 0;
    overflow: hidden;
    padding: 0 12px;
    &__empty {
      font-size: 0.8rem;
      padding: 12px 0;
      color: var(--base-text-color80);
      letter-spacing: 0.03rem;
    }
  }
  .project {
    &__actions {
      display: flex;
      gap: 2px;
    }
    &__name {
      flex-grow: 1;
      width: 0;
      &__text {
        padding: 0 6px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: left;
      }
      & input {
        appearance: none;
        border: none;
        background: none;
        padding: 0 6px;
        margin: 0;
        height: 23px;
        width: 100%;
        outline: none;
        font-size: inherit;
        font-weight: inherit;
        color: inherit;
        background: var(--base-box-color06);
        border-radius: 4px;
      }
    }
    &__btn {
      border: none;
      background: none;
      color: var(--base-text-color80);
      font-size: 0.85rem;
      font-weight: bold;
      /* background-color: var(--base-text-color12); */
      width: 100%;
      margin: 0;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 4px;
      gap: 6px;
      cursor: pointer;
      min-height: 32px;
      & :global(.icon) {
        font-size: 1.2rem;
      }
    }
  }
</style>
