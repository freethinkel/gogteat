<script lang="ts">
  import Editor from "./HOC/Editor.svelte";
  import Sidebar from "./HOC/Sidebar.svelte";
  import Statusbar from "./HOC/Statusbar.svelte";
  import Toolbar from "./HOC/Toolbar.svelte";
</script>

<div class="app">
  <Toolbar />
  <main>
    <div class="sidebar">
      <Sidebar />
    </div>
    <div class="content">
      <Editor />
    </div>
  </main>
  <Statusbar />
</div>

<style lang="postcss">
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
