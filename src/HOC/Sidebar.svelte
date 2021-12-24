<script lang="ts">
  import { fs, dialog } from "@tauri-apps/api";
  import { DialogFilter } from "@tauri-apps/api/dialog";
  import FileListItem from "../components/FileListItem.svelte";
  import ProjectGroup from "../components/ProjectGroup.svelte";
  import type { FileItem } from "../models/project";
  import { appStore } from "../store/app";
  import { editorStore } from "../store/editor";
  import { projectsStore } from "../store/projects";
</script>

<div class="wrapper">
  <ul>
    {#each $projectsStore.projects as project}
      <li>
        <ProjectGroup {project} />
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
      list-style: none;
      & + li {
        border-top: 1px solid var(--border-color);
      }
    }
  }
</style>
