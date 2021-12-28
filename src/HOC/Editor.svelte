<script lang="ts">
  import { EditorState } from "@codemirror/state";
  import { EditorView, keymap, highlightActiveLine } from "@codemirror/view";
  import { defaultKeymap } from "@codemirror/commands";
  import { history, historyKeymap } from "@codemirror/history";
  import { indentOnInput } from "@codemirror/language";
  import { bracketMatching } from "@codemirror/matchbrackets";
  import { lineNumbers, highlightActiveLineGutter } from "@codemirror/gutter";
  import {
    defaultHighlightStyle,
    HighlightStyle,
    tags,
  } from "@codemirror/highlight";
  import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
  import { languages } from "@codemirror/language-data";
  import { oneDark } from "@codemirror/theme-one-dark";

  import { createEventDispatcher, onMount } from "svelte";
  import { appStore } from "../store/app";

  export let doc: string;
  export let theme = EditorView.theme({
    "&": {
      backgroundColor: "transparent !important",
      height: "100%",
    },
  });

  const syntaxHighlighting = HighlightStyle.define([
    {
      tag: tags.heading1,
      fontSize: "1.6rem",
      fontWeight: "bold",
    },
    {
      tag: tags.heading2,
      fontSize: "1.4rem",
      fontWeight: "bold",
    },
    {
      tag: tags.heading3,
      fontSize: "1.2rem",
      fontWeight: "bold",
    },
  ]);

  const dispatch = createEventDispatcher();

  let editorEl: HTMLDivElement | undefined;

  $: {
    if ($appStore.editorInstance) {
      if (doc !== $appStore.editorInstance.state.doc.toString()) {
        $appStore.editorInstance.dispatch({
          changes: {
            from: 0,
            to: $appStore.editorInstance.state.doc.length,
            insert: doc || "",
          },
        });
      }
    }
  }

  onMount(() => {
    const startState = EditorState.create({
      doc: doc,
      extensions: [
        keymap.of([...defaultKeymap, ...historyKeymap]),
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightActiveLine(),
        markdown({
          base: markdownLanguage,
          codeLanguages: languages,
          addKeymap: true,
        }),
        oneDark,
        theme,
        syntaxHighlighting,
        history(),
        indentOnInput(),
        bracketMatching(),
        defaultHighlightStyle.fallback,
        EditorView.lineWrapping,
        EditorView.updateListener.of((update) => {
          if (update.changes) {
            dispatch("change", update.state);
          }
        }),
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: editorEl,
    });

    appStore.setEditorInstance(view);
  });
</script>

<div class="gogteat__editor" bind:this={editorEl} />

<style lang="postcss">
  .gogteat__editor {
    overflow: auto;
    height: 100%;
  }
</style>
