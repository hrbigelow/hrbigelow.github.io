<script>
import { make_sync } from './component_sync';
import { numberDisplay } from './presentation';
import { onMount } from 'svelte';

export let sig, plot;
export let space = 10;
let rad, w;


function color(s) {
  var i = 255*s;
  return `rgba(${255-i}, ${255-i}, 255)`;
}

// calculate the center coordinate
function corner(i) {
  return (2 * rad + space) * i;
}

function center(i) {
  return rad + (2 * rad + space) * i;
}

function range(n) {
  return [...Array(n).keys()];
}

function update() {
  plot.touch++;
  rad = (w - (plot.n - 1) * space) / plot.n / 2;
}

var [ respond, notify ] = make_sync(update, sig, 'KernelMatrix');

$: respond($sig)

onMount(() => {
  update();
  console.log(`Matrix w=${w}`);
});


</script>

<style>

  .col {
    display: flex;
    flex-direction: column;
  }

  .square {
    width: 300px;
    height: 300px;
  }

  .full {
    width: 100%;
    height: 100%;
  }

  .inner-plot {
    border: 1px solid gray;
  }

  .pad {
    padding: 10px;
  }

  .center {
    align-items: center;
  }

</style>

<div class='pad'>
  <div class='col center'>
    <div class='square' bind:clientWidth={w}>
      <svg class='inner-plot full'>
        {#each range(plot.n) as i}
          {#each range(plot.n) as j}
            <rect width="{rad*2}" height="{rad*2}"
                    x="{corner(i)}"
                    y="{corner(j)}" 
                    style='fill: {color(plot.K[i][j])}' />
          {/each}
        {/each}
      </svg>
    </div>
    <div><p>The <d-math>i</d-math>'th row is the vector of evaluation 
      <d-math>(f_i(x_1), f_i(x_2), \cdots, f_i(x_n))</d-math>
      </p>
    </div>
  </div>
</div>

