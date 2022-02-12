<script lang="ts">
  export let type: string;
  export let payload;

  let ref: HTMLDivElement;
  let tempCustomView: HTMLDivElement;

  const initPreview = (
    node: HTMLDivElement,
    size: { width: number; height: number }
  ) => {
    document.body.style.cursor = "grabbing";
    ref.style.cursor = "grabbing";
    tempCustomView = node;
    tempCustomView.style.height = size.height + "px";
    tempCustomView.style.width = size.width + "px";
    tempCustomView.style.backgroundColor = "var(--base-box-color)";
    document.body.appendChild(tempCustomView);
  };

  const cleanUpPreview = () => {
    tempCustomView.remove();
    tempCustomView = null;
    document.body.style.cursor = "default";
    ref.style.cursor = "default";
  };

  const onDragStart = (e: DragEvent) => {
    initPreview((e.target as HTMLElement).cloneNode(true) as HTMLDivElement, {
      width: (e.target as HTMLDivElement).clientWidth,
      height: (e.target as HTMLDivElement).clientHeight,
    });

    setTimeout(() => {
      e.dataTransfer.setDragImage(tempCustomView as any, 0, 0);
    });
    e.dataTransfer.setData("gogteat", JSON.stringify({ type: type, payload }));
  };
  const onDragEnd = (e: DragEvent) => {
    console.log("end");
    // cleanUpPreview();
  };
</script>

<div
  class="wrapper"
  bind:this={ref}
  on:dragstart={onDragStart}
  on:dragend={onDragEnd}
  draggable="true"
>
  <slot />
</div>
