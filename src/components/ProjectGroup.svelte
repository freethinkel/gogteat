<script lang="ts">
  import type { Project, ProjectDoc } from "../models/project";
  import { appStore, ContextMenuItem } from "../store/app";
  import { editorStore } from "../store/editor";
  import { projectsStore } from "../store/projects";
  import Button from "./Button.svelte";
  import DocumentItem from "./DocumentItem.svelte";
  import Icon from "./Icon.svelte";

  export let project: Project;
  export let isDraft = false;
  export let isOpen = false;

  $: renameMode =
    $appStore.contextMenu.payload?.type === "rename_project" &&
    $appStore.contextMenu.payload?.payload?.id === project?.id &&
    !$appStore.contextMenu.payload?.payload?.isDraft;

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
    const newName = (event.target as HTMLInputElement).value;
    projectsStore.renameProject(project, newName);
    $appStore.contextMenu.payload = null;
  };
</script>

<div class="wrapper" class:state_open={isOpen}>
  <div
    class="project__btn"
    on:click={toggleOpen}
    on:contextmenu|preventDefault={appStore.openContextMenu(
      projectContextMenuActions.map((item) => ({ ...item, payload: project }))
    )}
  >
    <div class="arrow-icon">
      <Icon name="chevron-down" />
    </div>
    <div class="project__name">
      {#if renameMode}
        <input
          autofocus
          on:blur={onRename}
          on:keydown={(e) => e.key === "Enter" && onRename(e)}
          on:click|stopPropagation
          value={project.name}
        />
      {:else}
        <div class="project__name__text">
          {project.name}
        </div>
      {/if}
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
        renameMode={$appStore.contextMenu.payload?.type === "rename_document" &&
          $appStore.contextMenu.payload?.payload?.id === document.id}
        on:select={() => selectDocument(document)}
      />
    {/each}
  </div>
</div>

<style lang="postcss">
  .wrapper {
    user-select: none;
    &.state_open {
      & .file-list {
        height: auto;
      }
      & .project__btn .arrow-icon {
        transform: rotate(180deg);
      }
    }
  }
  .file-list {
    height: 0;
    overflow: hidden;
    padding-left: 12px;
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
        color: inherit;
        background: var(--base-box-color06);
        border-radius: 4px;
      }
    }
    &__btn {
      border: none;
      background: none;
      color: var(----base-text-color);
      font-size: 1rem;
      background-color: var(--base-text-color12);
      width: 100%;
      margin: 0;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 4px;
      gap: 6px;
      cursor: pointer;
      & :global(.icon) {
        font-size: 1.2rem;
      }
    }
  }
</style>
