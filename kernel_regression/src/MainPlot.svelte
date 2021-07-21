<script>
import { Plot } from './plot';
import {Context} from './context';
import {range, zip} from 'd3';
import { onMount } from 'svelte';

let cfg = {
  show_data: true,
  show_scaled: true,
  show_solution: true,
  show_points: false,
  auto_solve: true,
  log_sigma: 0
};

let box = { w: 10, h: 10 };

let drag_point = null;
let cfg = new Config();
let ctx = new Context(box.w, box.h, [-4, 4], [-4, 4]);
let plot = new Plot(ctx, 3);

function resize(width, height) {
  console.log(`in resize with ${width} x ${height}`);
  ctx.setWidth(width);
  ctx.setHeight(height);
  plot.updateContext(ctx);
  plot.nonce++;
}

onMount(() => {
  resize(box.w, box.h);
});


function toggle_scramble() {
  plot.toggle_scramble();
  if (cfg.auto_solve) solve();
  plot.nonce++;
}

function set_sigma(log_sigma) {
  plot.set_sigma(log_sigma);
  if (cfg.auto_solve)
    plot.alpha = plot.solutionAlpha();
  plot.nonce++;
}


function numberDisplay(n) {
  var ns = Math.abs(n) > 1000 ? n.toExponential(2) : n.toFixed(2);
  return ns;
}
  
function onMouseDown(evt) {
  drag_point = evt.target;
}

function onMouseMove(evt) {
  if (drag_point == null) return;
  plot.setDataPoint(drag_point.id, evt.offsetX, evt.offsetY);
  if (cfg.auto_solve) 
    plot.alpha = plot.solutionAlpha(); 

  plot.nonce++;
}

function onMouseUp(evt) {
  drag_point = null;
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
  transition(0, 100);
}

$: resize(box.w, box.h);
$: set_sigma(cfg.log_sigma); 

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

  .alphas {
    min-width: 7em;
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

<div class="row full">
  <div class="col full">
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
        <div class="pad-small"><button on:click={() => { plot.populate(); plot.nonce++;}}>New Data</button></div>
        <div class="pad-small">
          <label>Sigma: <input type="range" bind:value={cfg.log_sigma} min=-5 max=2 step=0.1>{Math.pow(10, cfg.log_sigma).toFixed(3)}</label>
        </div>
        <div class="pad-small">
          <d-math>\|f\| = </d-math>
          {plot.validInv ?  numberDisplay(plot.functionNorm()) : 'Error: non-singular K'}
        </div>
      </div>
      <div style="flex-grow: 1">
        <div class="pad-small"><button on:click={() => { solve(); }}>Solve</button></div>
        <div class="pad-small"><button on:click={() => { toggle_scramble(); }}>
            {plot.scrambled() ? 'Unscramble' : 'Scramble'}
          </button>
        </div>
      </div>
      <div style="flex-grow: 1: align: right;">
        <div><label><input type="checkbox" bind:checked="{cfg.show_points}">points</label></div>
        <div><label><input type="checkbox" bind:checked="{cfg.show_scaled}">curves</label></div>
        <div><label><input type="checkbox" bind:checked="{cfg.show_solution}">solution</label></div>
        <div><label><input type="checkbox" bind:checked="{cfg.auto_solve}">auto solve</label></div>
      </div>
    </div>
  </div>

  <div class="pad col">
    <div class="pad-small">
      <button on:click={() => { plot.resetAlpha(); plot = plot;}}>Reset Alpha</button>
    </div> 
    <div class="row">
      <div class="pad-small"><button on:click={() => { plot.delPoint(); plot = plot;}}>Del Point</button></div>
      <div class="pad-small"><button on:click={() => { plot.addPoint(); plot = plot;}}>Add Point</button></div>
    </div>
    {#each plot.alpha as a, i}
      <div class="row pad-small">
        <input type=range bind:value={a} min=-10 max=10 step=0.01>
        <code class="alphas">{numberDisplay(a)}</code>
      </div>
    {/each}
  </div>

</div>

