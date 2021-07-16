<script>
import {Plot} from './plot';
import {Context} from './context';
import {zip} from 'd3';
import { onMount } from 'svelte';

export let show_data = true;
export let show_scaled = true;
export let show_solution = true;
export let show_points = false;
export let width=10, height=10;
let plot = null, ctx;
let drag_point = null;
let auto_solve = false;
let log_sigma=0;

ctx = new Context(width, height, [-4, 4], [-4, 4]);
plot = new Plot(ctx, 3);

// NOTE: Statements starting with '$:' are only interpreted as reactive
// statements if they occur at the top-level.
// This means you really must 
// $: console.log(`line 17: width = ${width}, height = ${height}`);

function resize(width, height) {
  // console.log(`in resize with ${width} x ${height}`);
  ctx.setWidth(width);
  ctx.setHeight(height);
  plot.updateContext(ctx);
  plot.nonce++;
}

onMount(() => {
  resize(width, height);
});


function set_sigma(log_sigma) {
  plot.set_sigma(log_sigma);
  if (auto_solve)
    plot.alpha = plot.solutionAlpha();
  plot.nonce++;
}


// $: console.log(`drag_point: ${drag_point}`);
$: set_sigma(log_sigma); 

function onMouseDown(evt) {
  // console.log('onMouseDown');
  drag_point = evt.target;
  // console.log(evt);
}

function onMouseMove(evt) {
  if (drag_point == null) return;
  plot.setDataPoint(drag_point.id, evt.offsetX, evt.offsetY);
  if (auto_solve) 
    plot.alpha = plot.solutionAlpha(); 

  plot.nonce++;
  // console.log('onMouseMove');
  // console.log(evt);
}

function onMouseUp(evt) {
  drag_point = null;
  // console.log('onMouseUp');
  // console.log(evt);
}


function solve() {
  var start_alpha = plot.alpha;
  var end_alpha = plot.solutionAlpha();

  function transition(step, nsteps) {
    var delta = step / nsteps;
    for (let i = 0; i != plot.n; i++) {
      plot.alpha[i] = delta * end_alpha[i] + (1 - delta) * start_alpha[i];
    } 
    if (step != nsteps) {
      setTimeout(() => transition(step+1, nsteps), 10);
    }
  }
  transition(0, 50);
}

$: resize(width, height);

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

  .pad-small {
    padding: 2px;
  }

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

  .control {
    min-width: 700px;
    margin: auto;
    /* background-color: #17ad37; */
  }

  .svg_wrap {
    flex-grow: 1;
  }

  .inner_plot {
    border: 1px solid gray;
  }

  .solution-curve {
    fill: none;
    stroke: rgba(0,0,255,1);
    stroke-width: 3px;
  }

  .ss {
    baseline-shift: sub;
    font-size: 11px;
  }

  .slider {
  }


</style>

<div class="row full">
  <div class="col full">
    <div class="svg_wrap full"
         bind:clientWidth={width} bind:clientHeight={height}>
      <svg class="inner_plot full"
           on:mousemove={onMouseMove}
           on:mouseup={onMouseUp}
           >

           {#each zip(plot.x, plot.alpha) as [x, alpha]}
             {#if show_scaled}
               <path class="curve" d="{plot.curve(x, alpha)}"/>
             {/if}

             {#if show_points}
               {#each plot.points(x, alpha) as [u,v]}
                 <circle class="point" cx="{u}" cy="{v}" r="4"/>
               {/each}
             {/if}
           {/each}

           {#if show_solution}
             <path class="solution-curve" d="{plot.solutionCurve()}"/>
           {/if}

           {#if show_data}
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

    <!--
      <div class="grid-item">
      <svg width="{plot.width}" height="40" viewBox="0 0
      {plot.width} 40">
      {#each plot.x as x, i}
        <text x={plot.u(x)} y=25>x<tspan class="ss">{i}</tspan></text>
      {/each}

      </svg>
      </div>
    -->

    <div class="row control pad">
      <div style="flex-grow: 1">
        <div class="pad-small"><button on:click={() => { plot.reset(); plot.nonce++;}}>New Data</button></div>
        <div class="row">
          <div class="pad-small"><button on:click={() => { plot.delPoint(); plot = plot;}}>Del Point</button></div>
          <div class="pad-small"><button on:click={() => { plot.addPoint(); plot = plot;}}>Add Point</button></div>
        </div>
        <div class="pad-small">
          <label>Sigma: <input type="range" bind:value={log_sigma} min=-3 max=2 step=0.1>{Math.pow(10, log_sigma).toFixed(3)}</label>
        </div>
      </div>
      <div style="flex-grow: 1">
        <div class="pad-small"><button on:click={() => { solve(); }}>Solve</button></div>
        <div class="pad-small"><button on:click={() => { plot.toggle_scramble(); plot = plot;}}>
            {plot.scrambled() ? 'Unscramble' : 'Scramble'}
          </button>
        </div>
      </div>
      <div style="flex-grow: 1: align: right;">
        <div><input type="checkbox" bind:checked="{show_points}"><label>points</label></div>
        <div><input type="checkbox" bind:checked="{show_scaled}"><label>curves</label></div>
        <div><input type="checkbox" bind:checked="{show_solution}"><label>solution</label></div>
        <div><input type="checkbox" bind:checked="{auto_solve}"><label>Auto Solve</label></div>
      </div>
    </div>
  </div>

  <div class="pad col">
    <div class="pad-small">
      <button on:click={() => { plot.resetAlpha(); plot = plot;}}>Reset Alpha</button>
    </div> 
    {#each plot.alpha as a, i}
      <div class="row pad-small">
        <input type=range bind:value={a} min=-10 max=10 step=0.01>
        <label class="pad">{a.toFixed(2)}</label>
      </div>
    {/each}
  </div>

</div>

