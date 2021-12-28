<script lang="ts">
  import { unified } from "unified";
  import remarkParse from "remark-parse";
  import remarkGfm from "remark-gfm";
  import remarkRehype from "remark-rehype";
  import rehypeStringify from "rehype-stringify";
  import rehypeHighlight from "rehype-highlight";
  import { editorStore } from "../../store/editor";
  import "./preview.postcss";

  $: html = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeHighlight, {
      ignoreMissing: true,
    })
    .use(rehypeStringify)
    .processSync($editorStore.document.content || "");
</script>

<div class="wrapper preview markdown-body">
  {@html html}
</div>

<style>
  .wrapper {
    padding: 16px 12px;
    overflow: auto;
    height: 100%;
  }
</style>
