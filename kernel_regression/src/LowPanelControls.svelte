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

</script>

<div class='gb gi'>
  <div class='line'>
    <d-math>\|f\| = </d-math>
    {plot.invertible ?  numberDisplay(plot.functionNorm()) : 'Could not solve'}
  </div>
  <div class='line'>
    <d-math>\|f_\parallel\| = </d-math>
    {plot.invertible ?  numberDisplay(plot.functionNorm()) : 'Could not solve'}
  </div>
  <div>
    <label class='line'>
      <input id='auto_solve' 
             type="checkbox" 
             bind:checked={cfg.auto_solve}
             on:change={h}>
      Auto solve
    </label>
  </div>
  <div>
    <label class='line'>
      <input id='mu_tracks_x' 
             type="checkbox"
             bind:checked={cfg.mu_tracks_x}
             on:change={h}>
      <d-math>\mu</d-math> tracks <d-math>x</d-math>
    </label>
  </div>
  <div class='line'>
    <d-math>\|f_\perp\| = </d-math>
    {plot.invertible ?  numberDisplay(plot.functionNorm()) : 'Could not solve'}
  </div>
  <div></div>
  <div>
    <label class='line'>
      <input id='scramble'
             type="checkbox" 
             bind:checked={cfg.scramble}
             on:change={h}>
      Scramble
    </label>
  </div>
  <label class='line'><d-math>\sigma</d-math>: 
    <input id='set_sigma'
           class='short'
           type="range"
           bind:value={cfg.log_sigma} 
           on:input={h}
           min=-5 max=2 step=0.01>
    {numberDisplay(Math.pow(10, cfg.log_sigma))}
  </label>
</div>



<style>

  .gi {
    justify-self: stretch;
  }

  .gb {
    display: grid;
    row-gap: 5px;
    column-gap: 10px;
    justify-items: start;
    align-items: start;
    justify-content: stretch;

    grid-template-columns: 1fr 2fr 1fr 2fr;
    grid-template-rows: auto;
  }

  .line {
    display: inline-block;
    white-space: nowrap;
  }

  .short {
    width: 8em;
  }


</style>
