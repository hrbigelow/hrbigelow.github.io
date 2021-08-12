<script>
  import { writable } from 'svelte/store';
  import { Plot } from './plot';
  import { Context } from './context';
  import Curves from './Curves.svelte';
  import LowPanelControls from './LowPanelControls.svelte';
  import SliderControls from './SliderControls.svelte';
  import KernelHeatmap from './KernelHeatmap.svelte';
  import KernelMatrix from './KernelMatrix.svelte';

  export let fullscreen = false;
  let topclass = fullscreen ? 'screen100' : 'screen80';

  let cfg = {
    cmd: null,
    points: false,
    curves: true,
    solution: true,
    auto_solve: false,
    mu_tracks_x: true,
    scramble: false,
    log_sigma: 0,
    show_data: true
  };

  let ctx = new Context(0, 0, [-4, 4], [-4, 4]);
  let plot = new Plot(ctx, 3);
  let sig = writable(0); 
  let h;

</script>

<div class='{topclass} fb-vert'>
  <div class='fi-upper gbox-upper'>
    <Curves sig={sig} cn=1 cfg={cfg} plot={plot} gridarea='curves'/>
    <SliderControls sig={sig} cn=3 cfg={cfg} plot={plot}/>
    <LowPanelControls sig={sig} cn=2 cfg={cfg} plot={plot}/> 
  </div>

	<div class='fi-lower gbox-lower'>
    <div class='y1'>$\mu$</div>
    <KernelHeatmap sig={sig} cn=4 plot={plot} gridarea='cell2'/>
		<div class='y2'>$\mu_i$</div>
    <KernelMatrix sig={sig} cn=5 plot={plot} gridarea='cell6'/>
    <div class='x1'>$x$</div>
    <div class='x2'>$x_i$</div>
    <div class='cap1'>$\mathcal{N}(x; \mu, \sigma)$</div>
    <div class='cap2'>$\mathcal{N}(x_i; \mu_i, \sigma)$</div>
  </div>
</div>

<style>
  .gbox-upper {
    display: grid;
    grid-template-columns: auto min-content;
    grid-template-rows: auto min-content;
    row-gap: 5px;
    column-gap: 10px;
    justify-items: center;
    align-items: end;
  }

	.gbox-lower {
		display: grid;
		/* grid-template-columns: min-content min-content 1fr 1fr 1fr min-content min-content; */
    grid-template-columns: 5% min-content min-content 5% 10% 5% min-content min-content 5%;
		grid-template-rows: 60% repeat(2, min-content);
		row-gap: 5px;
		column-gap: 5px;
		justify-items: center;
		align-items: center;
		justify-content: start;
    align-content: center;
	}

  .gbox-upper :global(.curves) {
    grid-area: 1/1/2/2;
    align-self: stretch;
    justify-self: stretch;
  }


	.y1 {
		grid-row: 1;
		grid-column: 2;
	}

	.y2 {
		grid-row: 1;
		grid-column: 7;
	}

	.x1 {
		grid-row: 2;
		grid-column: 3;
	}

	.x2 {
		grid-row: 2;
		grid-column: 8;
	}

	.cap1 {
		grid-row: 3;
		grid-column: 1/5;
	}

	.cap2 {
		grid-row: 3;
		grid-column: 6/10;
	}

	.gbox-lower :global(.cell2) {
		grid-row: 1;
		grid-column: 3;
		align-self: stretch;
	}

	.gbox-lower :global(.cell6) {
		grid-row: 1;
		grid-column: 8;
		align-self: stretch;
	}

	.fb-vert {
		display: flex;
		flex-direction: column;
	}
  
  .fb-horz {
    display: flex;
    fiex-direction: row;
  }

	.fi-upper {
		flex: 4 4 0;
	}
	.fi-lower {
		flex: 2 2 0;
	}


	.screen80 {
    height: 80vh;
  }

  .screen100 {
    height: 95vh;
  }


</style>

