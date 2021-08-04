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
  update();
  s.notify();
}

</script>

<div class="pad col">
  <div class="pad-small">
    <button id='new_data' on:click={h}>New Data</button>
    <button id='reset_alpha' on:click={h}>Reset Alpha</button>
  </div> 
  <div class="row">
    <div class="pad-small"><button id='del_point' on:click={h}>Del Point</button></div>
    <div class="pad-small"><button id='add_point' on:click={h}>Add Point</button></div>
  </div>
  {#each plot.alpha as a, i}
    <div class="row pad-small">
      <input id='update_alpha{i}' type=range
             bind:value={a}
             on:input={h}
             min=-10 max=10 step=0.01>
      <code class="alphas">{numberDisplay(a)}</code>
    </div>
  {/each}
</div>


<style>
  .row {
    display: flex;
    flex-direction: row;
  }

  .col {
    display: flex;
    flex-direction: column;
  }

  .pad {
    padding: 10px;
  }

  .pad-small {
    padding: 2px;
  }

  .alphas {
    min-width: 4em;
  }

</style>

