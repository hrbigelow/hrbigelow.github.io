<script>
import { Sync } from './sync';
import { range } from 'd3';
import { onMount } from 'svelte';

export let sig, box, cfg, plot, cn;
let drag_point = null;


function update() {
  plot.touch++;
}

var s = new Sync(sig, cn, update);

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
  var g = drag_point.id.match(/(?<code>\D+)(?<num>\d+)/).groups
  if (g.code == 'mu')
    plot.setMu(g.num, evt.offsetX);
  else if (g.code == 'xy') 
    plot.setDataPoint(g.num, evt.offsetX, evt.offsetY);
  else 
    console.log(`got drag_point id ${drag_point.id}`);

  if (cfg.auto_solve) 
    plot.alpha = plot.solutionAlpha(); 
  update();
  s.notify();
}

function onMouseUp(evt) {
  drag_point = null;
}

$: resize(box.w, box.h);
// $: respond($sig);
// $: notify(plot);

</script>

<style>

  .marker {
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

  .full {
    width: 100%;
    height: 100%;
  }


  .svg-wrap {
    flex-grow: 1;
  }


  .inner-plot {
    border: 1px solid gray;
    min-height: 300px;
  }

  .solution-curve {
    fill: none;
    stroke: rgba(0,0,255,1);
    stroke-width: 2px;
  }

  .draggable:hover {
    stroke: rgba(255,0,0,1);
    fill: rgba(255,0,0,1);
  }


</style>

<div class="svg-wrap"
     bind:clientWidth={box.w} bind:clientHeight={box.h}>
  <svg class="inner-plot full"
       on:mousemove={onMouseMove}
       on:mouseup={onMouseUp}
       >
     <defs>
     <polygon id='mu-select' points="-5,0 5,0 0,10"/>
     </defs>
       {#each plot.getMuX() as [mu,x], i}
         <use class='marker draggable' 
         id='mu{i}' x="{mu}" y="0" xlink:href='#mu-select' 
                                    on:mousedown={onMouseDown}/>

       {/each}

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
             id='xy{i}'
             class="marker draggable" cx="{u}" cy="{v}" r="5"
                                            on:mousedown={onMouseDown}
                                            />
         {/each}
       {/if}

  </svg>
</div>


