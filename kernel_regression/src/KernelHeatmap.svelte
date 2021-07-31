<script>
import { onMount } from 'svelte';
import GlslCanvas from 'glslCanvas';
import { RBFKernel, RBFShuffleKernel } from './kernel'; 
import kernel_frag from './shaders/kernel_frag.glsl';
import { Sync } from './sync';
import * as d3 from 'd3';

export let sig, cn, plot;
let xmin, xmax;
let w, sandbox;

function webgl_supported() {
  var canvas = document.createElement('canvas');
}

function xTou(x) {
  return w * (x - xmin) / (xmax - xmin);
}

function yTov(y) {
  return xTou(y);
}

function update() {
  if (sandbox == null) return;
  var sigma = Math.sqrt(plot.get_sigma2());
  var do_scramble = plot.scrambled();
  var cut_size = plot.cut_size(); 
  [xmin, xmax] = plot.get_xrange();

  sandbox.setUniform("u_sigma", sigma);
  sandbox.setUniform("cut_size", cut_size);
  sandbox.setUniform("u_do_scramble", do_scramble ? 1 : 0);
  sandbox.setUniform("u_xmin", xmin); 
  sandbox.setUniform("u_xmax", xmax); 
  plot.touch++;
}

onMount(() => {
  const canvas = document.getElementById('glslCanvas');
  console.log('here in onMount');
  var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  console.log('gl is ', gl);
  if (gl && gl instanceof WebGLRenderingContext) {
    sandbox = new GlslCanvas(canvas);
    sandbox.load(kernel_frag);
  }
  update();
});

var s = new Sync(sig, cn, update);

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
    padding: 3px;
  }

  .inner-plot {
    border: 1px solid gray;
  }

  .full {
    width: 100%;
    height: 100%;
  }

  .square {
    max-width: 300px;
    max-height: 300px;
  }

  .center {
    align-items: center;
  }

  .overlay {
    position: absolute;
    top: 0px;
    left: 0px;
  }

</style>

<div class="pad col">
  <div class='row center'>
    <div class='col pad-small'>
      <d-math>\mu</d-math>
    </div>
    <div class='col center'>
      <div class='square inner-plot' bind:clientWidth={w}>
        <canvas id='glslCanvas' width="{w}" height="{w}"></canvas>
        <svg class='overlay' width="{w}" height="{w}">
          {#each plot.x as x}
            {#each plot.mu as mu} 
              <circle cx="{xTou(x)}" cy="{yTov(mu)}" r="2" fill="rgba(255,0,0,1)" />
            {/each}
          {/each}
        </svg> 
      </div>
      <div class='pad-small'>
        <d-math>x</d-math>
      </div>
      <p>Each row is the Gaussian at <d-math>\mu</d-math></p>
    </div>
  </div>
</div>

