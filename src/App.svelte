<script lang="ts">
  import { onMount } from "svelte";
  import { identity } from "svelte/internal";
  import AppContextMenu from "./HOC/AppContextMenu.svelte";

  import Editor from "./HOC/Editor.svelte";
  import Preview from "./HOC/Preview/Preview.svelte";
  import Sidebar from "./HOC/Sidebar.svelte";
  import Statusbar from "./HOC/Statusbar.svelte";
  import Toolbar from "./HOC/Toolbar.svelte";
  import { ProjectService } from "./services/projects.services";
  import { appStore } from "./store/app";
  import { editorStore } from "./store/editor";
  import { projectsStore } from "./store/projects";

  onMount(() => {
    setTimeout(() => {
      projectsStore.readFiles();
    }, 100);
  });

  const changeCurrentDoc = (state) => {
    if ($editorStore.document) {
      $editorStore.document.content = state.doc.toString();
    }
  };
</script>

<div class="app">
  <Toolbar />
  <main>
    <div class="sidebar">
      <Sidebar />
    </div>
    <div class="content">
      {#if $appStore.previewMode}
        <Preview />
      {/if}
      <div
        class="editor__wrapper"
        hidden={$appStore.previewMode || !$editorStore.document}
      >
        <Editor
          doc={$editorStore.document?.content}
          on:change={(e) => changeCurrentDoc(e.detail)}
        />
      </div>
    </div>
  </main>
  {#if $editorStore.document}
    <Statusbar />
  {/if}
</div>

<AppContextMenu />

<style lang="postcss">
  .editor__wrapper {
    height: 100%;
  }
  .app {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .sidebar {
    max-width: 180px;
    min-width: 180px;
    height: 100%;
    width: 100%;
  }
  main {
    display: flex;
    flex-grow: 1;
    height: 0;
  }
  .content {
    width: 0;
    flex-grow: 1;
  }
</style>
