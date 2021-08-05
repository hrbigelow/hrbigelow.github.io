<script>
import { Sync } from './sync';
import { numberDisplay } from './presentation';

export let sig, cn, cfg, plot;

function update() {
  plot.touch++;
}

var s = new Sync(sig, cn, update);

// generic handler
function h(evt) {
  cfg.cmd = evt.target.id;
  s.notify();
  update();
}

</script>

<div class='gb'>
  {#each plot.alpha as a, i}
    <div class='slider'>
      <label><d-math plain>{@html '\\alpha_'}{i}</d-math>
        <input id='update_alpha{i}'
               class='short'
               type=range
               bind:value={a}
               on:input={h}
               min=-10 max=10 step=0.01>
      <div class="alphas">{numberDisplay(a)}</div>
      </label>
    </div>
  {/each}
  <button id='new_data' on:click={h}>New Data</button>
  <button id='reset_alpha' on:click={h}>Reset <d-math>\alpha</d-math></button>
  <button id='del_point' on:click={h}>Del Point</button>
  <button id='add_point' on:click={h}>Add Point</button>
</div>


<style>

  .gb {
    display: grid;
    row-gap: 5px;
    column-gap: 5px;
    justify-items: stretch;
    align-items: stretch;
    align-content: start;

    grid-template-columns: repeat(2, min-content);
    grid-template-rows: min-content;
  }

  .slider {
    grid-column: 1/3;
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    justify-self: stretch;
  } 

  .short {
    width: 8em;
  }

  .alphas {
    display: inline-block;
    min-width: 4em;
  }

</style>

