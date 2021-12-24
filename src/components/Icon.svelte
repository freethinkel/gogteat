<script lang="ts">
  export let name: string;
</script>

<span class={"icon ti ti-" + name} />

<style>
  .icon {
    font-size: 1.5rem;
    display: flex;
    position: relative;
    top: -1px;
  }
</style>
