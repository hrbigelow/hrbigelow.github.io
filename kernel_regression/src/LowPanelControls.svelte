<script>
import { make_sync } from './component_sync';
import { numberDisplay } from './presentation';

export let sig, cfg, plot;
let l_log_sigma = 0;

function update() {
  plot.touch++;
}

var [ respond, notify ] = make_sync(update, sig, 'LowPanelControls');

const NSTEPS = 10;

function h(e) {
  var id = e.target.id;
  if (id == 'solve') solve(true);
  if (id == 'recenter_mu') recenter_mu();
  if (id == 'scramble') toggle_scramble(); 
  if (id == 'newdata') {
    plot.populate();
    notify();
  }
}


function toggle_scramble() {
  // console.log('in toggle_scramble');
  plot.toggle_scramble();
  solve(cfg.auto_solve, 'in toggle');
  notify();
}

function set_sigma(log_sigma) {
  plot.set_sigma(log_sigma);
  if (cfg.auto_solve)
    plot.alpha = plot.solutionAlpha();
  notify();
}

function recenter_mu() {
  plot.recenter_mu();
  notify('in recenter_mu');
}


function solve(do_solve, msg) {
  // console.log(`in solve: ${msg}, do_solve=${do_solve}`);
  if (! do_solve) return;
  var start_alpha = plot.alpha;
  var end_alpha = plot.solutionAlpha();

  function transition(step, nsteps) {
    var delta = step / nsteps;
    for (let i = 0; i != plot.n; i++) {
      plot.alpha[i] = delta * end_alpha[i] + (1 - delta) * start_alpha[i];
      // must call notify within the callback, since it is async
    } 
    notify(`in transition step ${step}`);
    if (step != nsteps) {
      setTimeout(() => transition(step+1, nsteps), 10);
    }
  }
  transition(0, NSTEPS);
}


$: solve(cfg.auto_solve, 'reactive statement');
$: set_sigma(l_log_sigma); 

// necessary for function norm to update
$: respond($sig);
// $: notify(plot);

</script>

<style>
  .row {
    display: flex;
    flex-direction: row;
  }

  .pad-small {
    padding: 2px;
  }

  .pad {
    padding: 10px;
  }

  .control {
    min-width: 500px;
    margin: auto;
    /* background-color: #17ad37; */
  }


</style>

<div class="row control pad">
  <div style="flex-grow: 1">
    <div class="pad-small"><button id='newdata' on:click={h}>New Data</button></div>
    <div class="pad-small">
      <label>Sigma: 
        <input type="range" bind:value={l_log_sigma} 
               min=-5 max=2 step=0.1>
               {Math.pow(10, l_log_sigma).toFixed(3)}
      </label>
    </div>
    <div class="pad-small">
      <d-math>\|f\| = </d-math>
      {plot.validInv ?  numberDisplay(plot.functionNorm()) : 'Error: non-singular K'}
    </div>
  </div>
  <div style="flex-grow: 1">
    <div class="pad-small"><button id='solve' on:click={h}>Solve</button></div>
    <div class='pad-small'><button id='recenter_mu' on:click={h}>Recenter <d-math>\mu</d-math>'s</button></div>
    <div class="pad-small"><button id='scramble' on:click={h}>
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


