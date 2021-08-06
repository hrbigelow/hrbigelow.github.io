<script>
import { Sync } from './sync';
import { numberDisplay } from './presentation';
import { onMount } from 'svelte';

export let sig, cn, plot, gridarea;
let s, divh;
let sqr_frac = 0.9;
let svg;
let mounted = false;

function color(s) {
  var i = 255*s;
  return `rgba(${255-i}, ${255-i}, 255)`;
}

function get_mat(plot) {
  var dat = [];
  if (plot.n == 0) return dat;
  var h = svg.clientHeight;
  var fill = plot.n == 1 ? h : sqr_frac * h;
  var blank = h - fill;
  var side = fill / plot.n;
  var gap = plot.n > 1 ? blank / (plot.n - 1) : 0;
  var stride = side + gap;

  for (let i = 0; i != plot.n; i++) {
    for (let j = 0; j != plot.n; j++) {
      dat.push({ 
        x: stride * i, 
        y: stride * j, 
        v: plot.pft[i][j], 
        side: side 
      });
    }
  }
  return dat;
}


function resize(dummy) {
  if (! mounted) return;
  var h = svg.clientHeight;
  // console.log(`in KernelMatrix resize with dummy=${dummy}, svg.clientHeight=${h}`);
  svg.setAttribute('width', h);
  update();
}


function update() {
  // console.log(`in KernelMatrix update with ${plot.n}`);
  plot.touch++;
}

onMount(() => {
  s = new Sync(sig, cn, update);
  // console.log(plot.n);
  mounted = true;
  resize(divh);
});


$: resize(divh);

</script>

<div class='invis-framed {gridarea}' bind:clientHeight={divh}></div>
<svg bind:this={svg} class='framed {gridarea}'>
  {#if mounted}
    {#each get_mat(plot) as {x, y, v, side}}
      <rect width="{side}" height="{side}"
            x="{x}" y="{y}" style='fill: {color(v)}' />
    {/each}
  {/if}
  </svg>

<style>

  .framed {
    border: 1px solid gray;
  }

  .invis-framed {
    border: 1px solid transparent;
  }

</style>
