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
  <div class='col1 line'>
    <d-math>\|f\| = </d-math>
    {plot.invertible ?  numberDisplay(plot.functionNorm()) : 'Could not solve'}
  </div>
  <div class='col2 line'>
    <d-math>\|f_\parallel\| = </d-math>
    {plot.invertible ?  numberDisplay(plot.functionNorm()) : 'Could not solve'}
  </div>
  <div class='col2 row2 line'>
    <d-math>\|f_\perp\| = </d-math>
    {plot.invertible ?  numberDisplay(plot.functionNorm()) : 'Could not solve'}
  </div>
  <div class='col4 row1 line'>
    <label class='ib'>
      <input id='auto_solve' 
             type="checkbox" 
             bind:checked={cfg.auto_solve}
             on:change={h}>
      Auto solve
    </label>
  </div>
  <div class='col4 row2 line'>
    <label class='ib'>
      <input id='mu_tracks_x' 
             type="checkbox"
             bind:checked={cfg.mu_tracks_x}
             on:change={h}>
      <d-math>\mu</d-math> tracks <d-math>x</d-math>
    </label>
  </div>
  <div class='col5 row1 line'>
    <label class='ib'>
      <input id='scramble'
             type="checkbox" 
             bind:checked={cfg.scramble}
             on:change={h}>
      Scramble
    </label>
  </div>
  <div class='col5 row2 line'>
    <label class='ib'><d-math>\sigma</d-math>: 
      <input id='set_sigma'
             class='short'
             type="range"
             bind:value={cfg.log_sigma} 
             on:input={h}
             min=-5 max=2 step=0.01>
      {numberDisplay(Math.pow(10, cfg.log_sigma))}
    </label>
  </div>
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

    grid-template-columns: min-content min-content auto min-content min-content;
    grid-template-rows: auto;
  }

  .col1 {
    grid-column: 1;
  }

  .col2 {
    grid-column: 2;
  }

  .col4 {
    grid-column: 4;
  }

  .col5 {
    grid-column: 5;
  }

  .row1 {
    grid-row: 1;
  }

  .row2 {
    grid-row: 2;
  }

  .line {
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    width: 8em;
  }


  .short {
    width: 8em;
  }


</style>
