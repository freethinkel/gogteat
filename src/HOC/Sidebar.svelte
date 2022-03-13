<script lang="ts">
  import ProjectGroup from "../components/ProjectGroup.svelte";
  import { projectsStore } from "../store/projects";
  $: projects = $projectsStore.projects.filter((p) => !p.isRemoved);
</script>

<div class="wrapper">
  <ul>
    <li>
      <ProjectGroup isOpen isDraft project={$projectsStore.drafts} />
    </li>
    {#each projects as project}
      <li>
        <ProjectGroup {project} />
      </li>
    {/each}
  </ul>
</div>

<style lang="postcss">
  .wrapper {
    height: 100%;
    border-right: 1px solid var(--border-color);
    overflow: auto;
  }
  ul {
    margin: 0;
    padding: 0;
    & li {
      margin: 0;
      padding: 0;
      list-style: none;
      & + li {
        border-top: 1px solid var(--border-color);
      }
    }
  }
</style>
