<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  import ContextMenu from "../components/ContextMenu.svelte";
  import { appStore } from "../store/app";

  $: x = $appStore.contextMenu.props?.x || 0;
  $: y = $appStore.contextMenu.props?.y || 0;
  let menuEl: HTMLElement;

  function onPageClick(e) {
    if (
      e.target === menuEl ||
      menuEl?.contains(e.target) ||
      !$appStore.contextMenu.isOpen
    )
      return;
    appStore.closeContextMenu(null);
  }

  const blurHandler = () => {
    appStore.closeContextMenu(null);
  };

  onMount(() => {
    window.addEventListener("blur", blurHandler);
  });

  onDestroy(() => {
    window.removeEventListener("blur", blurHandler);
  });

  const onSelect = (payload) => {
    appStore.closeContextMenu(payload);
  };
</script>

<div class="wrapper" bind:this={menuEl}>
  {#if $appStore.contextMenu.isOpen && $appStore.contextMenu.items?.length}
    <ContextMenu
      {y}
      {x}
      items={$appStore.contextMenu.items}
      on:select={({ detail }) => onSelect(detail)}
    />
  {/if}
</div>

<svelte:body on:mousedown={onPageClick} on:contextmenu={onPageClick} />
