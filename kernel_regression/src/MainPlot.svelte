<script>
import {Plot} from './plot';
import {Context} from './context';

export let show_data = true;
export let show_scaled = true;
export let show_solution = true;
export let show_points = false;

export let context_width;
let nPoints = 3;

// $: console.log('standalone reactive statement with no dependencies.');
let ctx = new Context(context_width, 400, [0, 10], [-2, 2]);
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
    stroke-width: 1px;
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
                  <!--
                  on:mousemove={(evt) => {
                      if (selectedElem !== null) {
                          plot.beta[selectedElem.id] -= 0.01 * evt.movementY;
                          plot.updateBeta();
                      }
                         }}
                  on:mouseup={(evt) => {
                         if (selectedElem !== null) {
                             // console.log('on mouse up with ', evt);
                             selectedElem = null;
                         }
                         }}
                                              -->

{#if context_width}
<div class="gauss-grid">
  <div class="grid-item">
      <svg width="{plot.width}" height="{plot.height}" viewBox="0 0
                  {plot.width} {plot.height}" class="plot" >

        {#if show_data}
          {#each plot.data() as [x, y, beta]}
            <circle class="data" 
                    style="stroke: #000000"
                    cx="{plot.u(x)}" 
                    cy="{plot.v(y)}" 
                    r="5"/>
          {/each}
        {/if}


        {#each plot.data() as [x, y, beta], i}
            {#if show_scaled}
                <path class="curve"
                      d="{plot.curve(x, beta)}">
                </path>
            {/if}

            {#if show_points}
                {#each plot.getx() as x2, j}
                    <circle class="point" 
                                     cx="{plot.u(x2)}"
                                     cy="{plot.curvePoint(x, beta, x2)}" 
                                     r="4"
                                     />
                {/each}
            {/if}
        {/each}


        {#if show_solution}
          <path class="solution-curve" d="{plot.solutionCurve()}"></path>
        {/if}
      
      </svg>
      <svg width="{plot.width}" height="40" viewBox="0 0
                  {plot.width} 40">
        {#each plot.getx() as x, i}
          <text x={plot.u(x)} y=25>x<tspan class="ss">{i}</tspan></text>
        {/each}
      </svg>
      <div>
          <!-- <p>numPoints: {nPoints}</p> -->
          <button on:click={() => { plot.addPoint(); plot = plot;}}> + </button>
          <button on:click={() => { plot.delPoint(); plot = plot;}}> - </button>
          <button on:click={() => { plot.populate(); plot = plot;}}>Reset</button>
          <button on:click={() => { plot.solve(); plot = plot;}}>Solve</button>
          <label>
              <input type="checkbox" bind:checked="{show_points}">
              Toggle points
          </label>
          <label>
              <input type="checkbox" bind:checked="{show_scaled}">
              Toggle basis curves 
          </label>
      </div>
      <div>
          {#each plot.getbeta() as b, i}
              <label>
                  <input type=range bind:value={b} min=-10 max=10 step=0.01>
                  {b.toFixed(2)}
              </label>
          {/each}
      </div>
  </div>
</div>
{:else}
    <div class="gauss-grid">
    </div>
{/if}

