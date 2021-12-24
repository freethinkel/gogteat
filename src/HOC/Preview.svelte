<script lang="ts">
  const marked = require("marked");
  import { editorStore } from "../store/editor";

  $: html = marked.parse($editorStore.content);
</script>

<div class="wrapper">
  {@html html}
</div>

<style>
  .wrapper {
    overflow: auto;
    height: 100%;
  }
</style>
