<script lang="ts">
  import { editorStore } from "../store/editor";

  $: wordCount =
    $editorStore.document?.content.split(" ").filter((word) => word).length ||
    0;
  $: lineCount = $editorStore.document?.content?.split("\n")?.length || 0;
</script>

<div class="wrapper">
  <div class="word_count">
    Слов: {wordCount}
  </div>
  <div class="line_count">
    Строк: {lineCount}
  </div>
</div>

<style lang="postcss">
  .wrapper {
    border-top: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    padding: 2px 8px;
    gap: 12px;
    font-size: 0.9rem;
  }
</style>
