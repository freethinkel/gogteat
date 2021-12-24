<script lang="ts">
  import { dialog, fs } from "@tauri-apps/api";
  import { platform } from "@tauri-apps/api/os";

  import { appWindow } from "@tauri-apps/api/window";
  import { onMount } from "svelte";

  import Button from "../components/Button.svelte";
  import Icon from "../components/Icon.svelte";
  import { appStore } from "../store/app";
  import { editorStore } from "../store/editor";
  import { projectsStore } from "../store/projects";

  let isMacos = false;

  onMount(async () => {
    isMacos = (await platform()) === "darwin";
  });

  const togglePreview = () => {
    $appStore.previewMode = !$appStore.previewMode;
  };

  const openFilePicker = () => {};
</script>

<div class="wrapper" data-tauri-drag-region={isMacos} class:macos={isMacos}>
  <div class="left_side">
    <Button on:click={openFilePicker}>
      <Icon name="file" />
    </Button>
  </div>
  <div class="right_side">
    <Button active={$appStore.previewMode} on:click={togglePreview}>
      <Icon name="presentation" />
    </Button>
    <Button>
      <Icon name="artboard" />
    </Button>
  </div>
</div>

<style lang="postcss">
  .wrapper {
    border-bottom: 1px solid var(--border-color);
    background: rgba(0, 0, 0, 0.05);
    height: 38px;
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &.macos {
      padding-left: 76px;
    }
  }
  .right_side,
  .left_side {
    display: flex;
    gap: 10px;
  }
</style>
