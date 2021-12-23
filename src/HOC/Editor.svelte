<script lang="ts">
  import "codemirror/lib/codemirror.css";
  import "codemirror/mode/gfm/gfm";
  import "../styles/theme/light.postcss";
  import CodeMirror from "codemirror";
  import { editorStore } from "../store/editor";
  import { onMount } from "svelte";
  import { appStore } from "../store/app";

  let editorEl;
  let editorInstance;

  $: {
    if (editorInstance) {
      if ($editorStore.content !== editorInstance.getValue()) {
        editorInstance.setValue($editorStore.content);
      }
    }
  }

  onMount(() => {
    editorInstance = CodeMirror(editorEl, {
      value: $editorStore.content,
      theme: "default gogteat",
      tabSize: 2,
      indentWithTabs: true,
      lineWrapping: true,
      autocorrect: true,
      addModeClass: true,
      // cursorBlinkRate: 0,
      mode: "gfm",
    });

    appStore.setEditorInstance(editorInstance);

    editorInstance.on("change", (data) => {
      editorStore.updateContent(data.getValue());
    });
  });
</script>

<div class="gogteat__editor" bind:this={editorEl} />
