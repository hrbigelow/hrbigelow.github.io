<script>
    import MainPlot from './MainPlot.svelte';
    let w, h; 
    $: console.log(`in FullPagePlot: w=${w}, h=${h}`);
</script>

<style>

  .view {
    padding: 3%;
    height: 100%;
    width: 100%;
  }

  .vwrap {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    flex-grow: 1;
    height: 100px;
  }

</style>


<div class="view"> 
  <MainPlot/> 
</div>


