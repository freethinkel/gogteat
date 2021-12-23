<script lang="ts">
  import { dialog, fs } from "@tauri-apps/api";
  import { platform } from "@tauri-apps/api/os";

  import { appWindow } from "@tauri-apps/api/window";
  import { onMount } from "svelte";

  import Button from "../components/Button.svelte";
  import Icon from "../components/Icon.svelte";
  import { editorStore } from "../store/editor";
  import { projectsStore } from "../store/projects";

  let isMacos = false;

  onMount(async () => {
    isMacos = (await platform()) === "darwin";
  });

  const openDirPicker = async () => {
    const _dir = await dialog.open({
      directory: true,
    });
    if (_dir) {
      const dir = _dir.toString();
      const _files = await fs.readDir(dir.toString());

      const files = _files.filter(
        (entry) => entry.name.split(".").pop() === "md"
      );

      projectsStore.setProjects(dir, files as { name: string; path: string }[]);
    }
  };
</script>

<div class="wrapper" data-tauri-drag-region={isMacos} class:macos={isMacos}>
  <div class="left_side">
    <Button on:click={openDirPicker}>
      <Icon name="folder" />
    </Button>
  </div>
  <div class="right_side">
    <Button>
      <Icon name="artboard" />
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
