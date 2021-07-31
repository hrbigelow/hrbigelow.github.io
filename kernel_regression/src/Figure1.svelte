<script>
  import { writable } from 'svelte/store';
  import { Plot } from './plot';
  import { Context } from './context';
  import Curves from './Curves.svelte';
  import LowPanelControls from './LowPanelControls.svelte';
  import SliderControls from './SliderControls.svelte';
  import KernelHeatmap from './KernelHeatmap.svelte';
  import KernelMatrix from './KernelMatrix.svelte';

  let box = { w: 10, h: 10 };

  let cfg = {
    show_data: true,
    show_scaled: true,
    show_solution: true,
    show_points: false,
    auto_solve: false 
  };

  let ctx = new Context(box.w, box.h, [-4, 4], [-4, 4]);
  let plot = new Plot(ctx, 3);
  let sig = writable(0); 

</script>

<style>
  .row {
    display: flex;
    flex-direction: row;
  }

  .col {
    display: flex;
    flex-direction: column;
  }

  .full {
    width: 100%;
    height: 100%;
  }

</style>


<div class='col full'>
  <div class='row full'>
    <div class='col full'>
      <Curves sig={sig} cn=1 box={box} cfg={cfg} plot={plot} />
       <LowPanelControls sig={sig} cn=2 cfg={cfg} plot={plot} />
    </div>
    <SliderControls sig={sig} cn=3 plot={plot} />
  </div>
  <div class='row full'>
    <KernelHeatmap sig={sig} cn=4 plot={plot}/>
    <KernelMatrix sig={sig} cn=5 plot={plot}/>
  </div>
</div>

