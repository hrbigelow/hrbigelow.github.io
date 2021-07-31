<script>
import { Sync } from './sync';
import { numberDisplay } from './presentation';

export let sig, cn, plot;

function update() {
  plot.touch++;
}

var s = new Sync(sig, cn, update);

// generic handler
function h(e) {
  var id = e.target.id;
  if (id == 'reset-alpha') plot.resetAlpha(); 
  if (id == 'del-point') plot.delPoint();
  if (id == 'add-point') plot.addPoint();
  if (id.match(/update-alpha/)) { 
    // no need to do anything since plot.alpha member gets updated through bound
    // value
  } 
  update();
  s.notify();
}

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

  .pad {
    padding: 10px;
  }

  .pad-small {
    padding: 2px;
  }

  .alphas {
    min-width: 7em;
  }

</style>


<div class="pad col">
  <div class="pad-small">
    <button id='reset-alpha' on:click={h}>Reset Alpha</button>
  </div> 
  <div class="row">
    <div class="pad-small"><button id='del-point' on:click={h}>Del Point</button></div>
    <div class="pad-small"><button id='add-point' on:click={h}>Add Point</button></div>
  </div>
  {#each plot.alpha as a, i}
    <div class="row pad-small">
      <input id='update-alpha{i}' type=range
             bind:value={a}
             on:input={h}
             min=-10 max=10 step=0.01>
      <code class="alphas">{numberDisplay(a)}</code>
    </div>
  {/each}
</div>

