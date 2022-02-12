import ContextMenu from "./ContextMenu.svelte";
import type { ContextMenuItem } from "./types";

export const useContextMenu =
  (actions: ContextMenuItem[]) => (listener: (type: string) => void) => {
    return (event: MouseEvent) => {
      const pos = {
        x: event.clientX,
        y: event.clientY,
      };
      const wrapper = document.createElement("div");
      document.body.appendChild(wrapper);
      const menu = new ContextMenu({
        target: wrapper,
      });

      menu.$set({
        x: pos.x,
        y: pos.y,
        items: actions,
      });

      const close = () => {
        menu.$destroy();
        wrapper.remove();
        document.removeEventListener("mousedown", closeHandler);
        window.removeEventListener("blur", close);
      };

      const closeHandler = (e: MouseEvent) => {
        if (wrapper.contains(e.target as HTMLElement)) return;
        close();
      };

      document.body.addEventListener("mousedown", closeHandler);
      window.addEventListener("blur", close);

      menu.$on("select", (e) => {
        listener(e.detail.type);
        close();
      });
    };
  };
