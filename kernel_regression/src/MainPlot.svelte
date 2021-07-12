<script>
import {Plot} from './plot';
import {Context} from './context';
import {zip} from 'd3';

export let show_data = true;
export let show_scaled = true;
export let show_solution = true;
export let show_points = false;

export let context_width;
let do_scramble = false;

// $: console.log('standalone reactive statement with no dependencies.');
let ctx = new Context(context_width, 700, [0, 10], [-2, 2]);
let plot = new Plot(ctx, 3);
// console.log('standalone ordinary statement');
$: console.log(`context_width = ${context_width}`);
$: console.log(`show_scaled = ${show_scaled}`);
$: console.log(`show_points = ${show_points}`);

// guard function.  hides mention of 'plot' so that reactive statement
// won't trigger.
function chirp() {
    console.log('in toplevel chirp');
    plot.chirp();
}

function resize(width) {
    console.log('in resize');
    ctx.setWidth(width);
    plot.updateContext(ctx);
    // plot.chirp();
}


function set_scramble(do_scramble) {
  plot.set_scramble(do_scramble);
}


$: resize(context_width);

// $: chirp();
// $: plot.chirp();

</script>

<style>
  .gauss-grid {
    display: inline-grid;
    grid-template-columns: 0.81fr 1fr 0.81fr;
    text-align: center;
  }

  .grid-item {
    margin: 0.3em;
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
    stroke: rgba(200, 200, 200, 1);
    stroke-width: 1px;
  }

  .control {
    margin-top: auto;
    margin-bottom: auto;
    text-align: left;
    white-space: nowrap;
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

{#if context_width}
<div class="gauss-grid">
  <div class="grid-item" style="border: 1px">
    <svg width="{plot.width}" height="{plot.height}" viewBox="0 0
                             {plot.width} {plot.height}" class="plot" >

        {#if show_data}
          {#each zip(plot.x, plot.y) as [x, y]}
            <circle class="data" 
                    style="stroke: #000000"
                    cx="{plot.u(x)}" 
                    cy="{plot.v(y)}" 
                    r="5"/>
          {/each}
        {/if}


        {#each zip(plot.x, plot.beta) as [x, beta]}
            {#if show_scaled}
                <path class="curve"
                      d="{plot.curve(x, beta)}">
                </path>
            {/if}

            {#if show_points}
                {#each plot.x as x2}
                    <circle class="point" 
                                     cx="{plot.u(x2)}"
                                     cy="{plot.point(x, beta, x2)}" 
                                     r="4"
                                     />
                {/each}
            {/if}
        {/each}

        {#if show_solution}
          <path class="solution-curve" d="{plot.solutionCurve()}"></path>
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
  <div class="grid-item">
    <div class="control"><button on:click={() => { plot.reset(); plot = plot;}}>Reset</button></div>
    <div class="control"><button on:click={() => { plot.delPoint(); plot = plot;}}>Del Point</button></div>
    <div class="control"><button on:click={() => { plot.addPoint(); plot = plot;}}>Add Point</button></div>
    <div class="control"><button on:click={() => { plot.toggle_scramble(); plot = plot;}}>
        {plot.scrambled() ? 'Unscramble' : 'Scramble'}
      </button>
    </div>
    <div class="control"><button on:click={() => { plot.solve(); plot = plot;}}>Solve</button></div>
    <div class="control"><label><input type="checkbox" bind:checked="{show_points}">Toggle points</label></div>
    <div class="control"><label><input type="checkbox" bind:checked="{show_scaled}">Toggle basis curves</label></div>
    <div class="control"><label><input type="checkbox" bind:checked="{show_solution}">Toggle solution curve</label></div>
    {#each plot.beta as b, i}
      <div class="control">
        <label>
          <input type=range bind:value={b} min=-10 max=10 step=0.01>
          {b.toFixed(2)}
        </label>
      </div>
    {/each}
  </div>
</div>
{:else}
<div class="gauss-grid">
</div>
{/if}

