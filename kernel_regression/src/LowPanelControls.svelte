<script>
import { Sync } from './sync';
import { numberDisplay } from './presentation';

export let sig, cn, cfg, plot;

function update() {
  plot.touch++;
}

var s = new Sync(sig, cn, update);


// catch-all event handler
function h(e) {
  cfg.cmd = e.target.id;
  update();
  s.notify();
}

function dk(k) {
  return k.replaceAll('_', ' ');
}

</script>

<div class="row control pad">
  <div style="flex-grow: 1">
    <div class="pad-small">
      <label>Sigma: 
        <input id='set_sigma'
               type="range"
               bind:value={cfg.log_sigma} 
               on:input={h}
               min=-5 max=2 step=0.01>
               {numberDisplay(Math.pow(10, cfg.log_sigma))}
      </label>
    </div>
    <div class="pad-small">
      <d-math>\|f\| = </d-math>
      {plot.invertible ?  numberDisplay(plot.functionNorm()) : 'Could not solve'}
    </div>
  </div>
  <div style="flex-grow: 1: align: right;">
    {#each ['auto_solve', 'mu_tracks_x', 'scramble'] as k}
      <div><label><input id={k} type="checkbox" bind:checked={cfg[k]} on:change={h}>{dk(k)}</label></div>
    {/each}
  </div>
</div>



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
