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
let plot_svg = null;
let plot = null, ctx;
let outer_div, outer_div_height;

let log_sigma=0;

ctx = new Context(width, height, [-4, 4], [-4, 4]);
plot = new Plot(ctx, 3);

// NOTE: Statements starting with '$:' are only interpreted as reactive
// statements if they occur at the top-level.
// This means you really must 
$: console.log(`line 17: width = ${width}, height = ${height}`);

function resize(width, height) {
  console.log(`in resize with ${width} x ${height}`);
  ctx.setWidth(width);
  ctx.setHeight(height);
  plot.updateContext(ctx);
  plot.nonce++;
  // plot = plot; // needed for Svelte introspection to see that plot is modified.
}

onMount(() => {
  console.log(`entering onMount`);
  resize(width, height);
  console.log(`exiting onMount`);
});


$: { plot.set_sigma(log_sigma); plot = plot }

// guard function.  hides mention of 'plot' so that reactive statement
// won't trigger.
function chirp() {
  console.log('in toplevel chirp');
  plot.chirp();
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

// $: chirp();
// $: plot.chirp();

</script>

<style>
  .row {
    display: flex;
  }

  .padded {
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

  .control {
    min-width: 700px;
    margin: auto;
    padding: 10px;
    /* background-color: #17ad37; */
  }

  .top_div {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    /* border: 1px solid #000; */
  }

  .svg_wrap {
    flex-grow: 1;
    width: 100%;
    height: 100%;
  }

  .inner_plot {
    width: 100%;
    height: 100%;
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


<div class="top_div">
  <div class="svg_wrap"
    bind:clientWidth={width} bind:clientHeight={height}>
    <svg class="inner_plot">
      <!-- viewBox="0 0 {plot.width} {plot.height}"> -->

      {#if show_data}
        {#each zip(plot.x, plot.y) as [x, y]}
          <circle class="data" 
                  style="stroke: #000000"
                  cx="{plot.u(x)}" 
                  cy="{plot.v(y)}" 
                  r="5"/>
        {/each}
      {/if}


      {#each zip(plot.x, plot.alpha) as [x, alpha]}
        {#if show_scaled}
          <path class="curve" d="{plot.curve(x, alpha)}"/>
        {/if}

        {#if show_points}
          {#each plot.x as x2}
            <circle class="point" 
                    cx="{plot.u(x2)}"
                                     cy="{plot.point(x, alpha, x2)}" 
                                         r="4"
                                            />
          {/each}
        {/if}
      {/each}

      {#if show_solution}
        <path class="solution-curve" d="{plot.solutionCurve()}"/>
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

  <div class="row control">
    <div style="flex-grow: 1">
      <div class="padded"><button on:click={() => { plot.reset(); plot = plot;}}>New Data</button></div>
      <div class="row">
        <div class="padded"><button on:click={() => { plot.delPoint(); plot = plot;}}>Del Point</button></div>
        <div class="padded"><button on:click={() => { plot.addPoint(); plot = plot;}}>Add Point</button></div>
      </div>
      <div class="padded">
        <label>Sigma: <input type="range" bind:value={log_sigma} min=-3 max=2 step=0.1>{Math.pow(10, log_sigma).toFixed(3)}</label>
      </div>
    </div>
    <div style="flex-grow: 1">
      <div class="padded"><button on:click={() => { solve(); }}>Solve</button></div>
      <div class="padded"><button on:click={() => { plot.toggle_scramble(); plot = plot;}}>
          {plot.scrambled() ? 'Unscramble' : 'Scramble'}
        </button>
      </div>
    </div>
    <div style="flex-grow: 1">
      <div class="padded"><button on:click={() => { plot.resetAlpha(); plot = plot;}}>Reset Alpha</button></div> 
      {#each plot.alpha as a, i}
        <div>
          <label><input type=range bind:value={a} min=-10 max=10 step=0.01>{a.toFixed(2)}</label>
        </div>
      {/each}
    </div>
    <div style="flex-grow: 1: align: right;">
      <div><label><input type="checkbox" bind:checked="{show_points}">points</label></div>
      <div><label><input type="checkbox" bind:checked="{show_scaled}">curves</label></div>
      <div><label><input type="checkbox" bind:checked="{show_solution}">solution</label></div>
    </div>
  </div>
</div>

