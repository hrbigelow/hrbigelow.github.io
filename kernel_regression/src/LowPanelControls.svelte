<script>
import { make_sync } from './component_sync';
import { numberDisplay } from './presentation';

export let sig, cfg, plot;

function update() {
  plot.touch++;
}

var [ respond, notify ] = make_sync(update, sig);

function toggle_scramble() {
  plot.toggle_scramble();
  if (cfg.auto_solve) solve();
  plot.touch++;
}

function set_sigma(log_sigma) {
  plot.set_sigma(log_sigma);
  if (cfg.auto_solve)
    plot.alpha = plot.solutionAlpha();
  plot.touch++;
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


$: set_sigma(cfg.log_sigma); 
$: respond($sig);
$: notify(plot);

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
    <div class="pad-small"><button on:click={() => { plot.populate(); plot.touch++;}}>New Data</button></div>
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


