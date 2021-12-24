<script lang="ts">
  import { fs } from "@tauri-apps/api";

  import type { FileItem, Project } from "../models/project";
  import { editorStore } from "../store/editor";
  import FileListItem from "./FileListItem.svelte";
  import Icon from "./Icon.svelte";

  export let project: Project;

  let isOpen = false;

  const toggleOpen = () => {
    isOpen = !isOpen;
  };

  const selectFile = async (file: FileItem) => {
    const content = await fs.readTextFile(file.path);
    editorStore.setFile(file, content);
  };
</script>

<div class="wrapper" class:state_open={isOpen}>
  <button class="project__btn" on:click={toggleOpen}>
    <div class="arrow-icon">
      <Icon name="chevron-down" />
    </div>
    <div class="project__name">
      {project.name}
    </div>
    <div class="project__actions">
      <Icon name="pencil" />
      <Icon name="trash" />
    </div>
  </button>
  <div class="file-list">
    {#each project.files as file}
      <FileListItem
        name={file.name}
        active={$editorStore.filePath === file.path}
        on:select={() => selectFile(file)}
      />
    {/each}
  </div>
</div>

<style lang="postcss">
  .wrapper {
    &.state_open {
      & .file-list {
        height: auto;
      }
      & .project-btn .arrow-icon {
        transform: rotate(180deg);
      }
    }
  }
  .file-list {
    height: 0;
    overflow: hidden;
    padding-left: 12px;
  }
  .project {
    &__actions {
      display: flex;
      gap: 2px;
    }
    &__name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: left;
      flex-grow: 1;
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
