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
    <div class='alpha'>
      <label class='ib'><span>$\alpha_{i}$</span>
        <input id='update_alpha{i}'
               class='ib slider'
               type=range
               bind:value={a}
               on:input={h}
               min=-10 max=10 step=0.01>
      <div class='ib'>{numberDisplay(a)}</div>
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

  .ib {
    display: inline-block;
  }

  .alpha {
    grid-column: 1/3;
    white-space: nowrap;
    overflow: hidden;
    width: 12em;
  } 

  .slider {
    width: 8em;
  }

</style>

