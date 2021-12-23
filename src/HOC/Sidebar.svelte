<script lang="ts">
  import { fs, dialog } from "@tauri-apps/api";
  import { DialogFilter } from "@tauri-apps/api/dialog";
  import FileItem from "../components/FileItem.svelte";
  import { appStore } from "../store/app";
  import { editorStore } from "../store/editor";
  import { projectsStore } from "../store/projects";

  const openFile = async (file: { name: string; path: string }) => {
    const content = await fs.readTextFile(file.path);

    editorStore.setFile(file.name, content);
    $appStore.editorInstance.focus();
  };
</script>

<div class="wrapper">
  <ul>
    {#each $projectsStore.files as file}
      <li>
        <FileItem
          active={file.name === $editorStore.fileName}
          name={file.name}
          on:select={() => openFile(file)}
        />
      </li>
    {/each}
  </ul>
</div>

<style>
  .wrapper {
    height: 100%;
    border-right: 1px solid var(--border-color);
  }
  ul {
    margin: 0;
    padding: 0;
    & li {
      margin: 0;
      padding: 0;
      & + li {
        border-top: 1px solid var(--border-color);
      }
    }
  }
</style>
