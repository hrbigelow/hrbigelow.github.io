<script>
import { make_sync } from './component_sync';
import { numberDisplay } from './presentation';

export let sig, plot;

function update() {
  plot.touch++;
}

var [ respond, notify ] = make_sync(update, sig);

$: respond($sig);
$: notify(plot);

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
    <button on:click={() => { plot.resetAlpha(); plot.touch++;}}>Reset Alpha</button>
  </div> 
  <div class="row">
    <div class="pad-small"><button on:click={() => { plot.delPoint(); plot.touch++;}}>Del Point</button></div>
    <div class="pad-small"><button on:click={() => { plot.addPoint(); plot.touch++;}}>Add Point</button></div>
  </div>
  {#each plot.alpha as a, i}
    <div class="row pad-small">
      <input type=range bind:value={a} min=-10 max=10 step=0.01>
      <code class="alphas">{numberDisplay(a)}</code>
    </div>
  {/each}
</div>

