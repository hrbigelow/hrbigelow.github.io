<script>
import { make_sync } from './component_sync';
import { range } from 'd3';
import { onMount } from 'svelte';

export let sig, box, cfg, plot;
let drag_point = null;


function update() {
  plot.touch++;
}

var [ respond, notify ] = make_sync(update, sig);


function resize(width, height) {
  console.log(`in resize with ${width} x ${height}`);
  plot.resize(width, height);
  update();
}

onMount(() => {
  resize(box.w, box.h);
});
  
function onMouseDown(evt) {
  drag_point = evt.target;
}

function onMouseMove(evt) {
  if (drag_point == null) return;
  plot.setDataPoint(drag_point.id, evt.offsetX, evt.offsetY);
  if (cfg.auto_solve) 
    plot.alpha = plot.solutionAlpha(); 
  update();
}

function onMouseUp(evt) {
  drag_point = null;
}

$: resize(box.w, box.h);
$: respond($sig);
$: notify(plot);

</script>

<style>

  .data {
    fill: #000000;
    stroke: #000000;
  }

  .curve {
    fill: none;
    stroke: rgba(200, 200, 200, 1);
    stroke-width: 2px;
  }

  .point {
    fill: rgba(200, 200, 200, 1);
    stroke-width: 1px;
  }

  .pad {
    padding: 10px;
  }

  .full {
    width: 100%;
    height: 100%;
  }


  .svg-wrap {
    flex-grow: 1;
  }


  .inner-plot {
    border: 1px solid gray;
  }

  .solution-curve {
    fill: none;
    stroke: rgba(0,0,255,1);
    stroke-width: 2px;
  }


</style>

<div class="svg-wrap"
     bind:clientWidth={box.w} bind:clientHeight={box.h}>
  <svg class="inner-plot full"
       on:mousemove={onMouseMove}
       on:mouseup={onMouseUp}
       >

       {#each range(plot.n) as i}
         {#if cfg.show_scaled}
           <path class="curve" d="{plot.curve(i)}"/>
         {/if}

         {#if cfg.show_points}
           {#each plot.points(i) as [u,v]}
             <circle class="point" cx="{u}" cy="{v}" r="4"/>
           {/each}
         {/if}
       {/each}

       {#if cfg.show_solution}
         <path class="solution-curve" d="{plot.solutionCurve()}"/>
       {/if}

       {#if cfg.show_data}
         {#each plot.data() as [u,v], i}
           <circle
             id={i} 
             class="data" cx="{u}" cy="{v}" r="5"
                                            on:mousedown={onMouseDown}
                                            />
         {/each}
       {/if}

  </svg>
</div>


