<script>
  import { onMount } from 'svelte';
  // import { twgl } from 'twgl.gs';
  import GlslCanvas from 'glslCanvas';
  import { RBFKernel, RBFShuffleKernel } from './kernel'; 
  import kernel_frag from './shaders/kernel_frag.glsl';

  import * as d3 from 'd3';

  let cut_size = 8;
  let log_sigma = 0;
  let do_scramble = false;

  let sandbox;

  function update_uniforms(log_sigma, cut_size, do_scramble) {
    if (sandbox == null) return;
    sandbox.setUniform("u_sigma", Math.pow(10, log_sigma));
    sandbox.setUniform("cut_size", cut_size);
    sandbox.setUniform("u_do_scramble", do_scramble ? 1 : 0);
  }

  onMount(() => {
    const canvas = document.getElementById('glslCanvas');
    sandbox = new GlslCanvas(canvas);
    sandbox.load(kernel_frag);
    update_uniforms(log_sigma, cut_size, do_scramble);
  });

  $: update_uniforms(log_sigma, cut_size, do_scramble); 

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

  .inner-plot {
    border: 1px solid gray;
  }

  .square {
    max-width: 500px;
    max-height: 500px;
  }

  .center {
    align-items: center;
  }

</style>

<div class="pad col">
  <div class='row center'>
    <div class='col'>
      <d-math>\uparrow</d-math>
      <d-math>\mathcal{X}</d-math>
      <d-math>\downarrow</d-math>
    </div>
    <div class='col center'>
      <div class='square inner-plot'>
        <canvas id='glslCanvas' width="500" height="500"></canvas>
      </div>
      <div>
        <d-math>\longleftarrow \mathcal{X} \longrightarrow</d-math>
      </div>
    </div>
  </div>
  <div class="pad-small col">
    <div class='row pad-small'>
      <label>sigma: <input type="range" bind:value={log_sigma} min=-3 max=1 step=0.1>{Math.pow(10, log_sigma).toFixed(3)}</label>
    </div>
    <div class='row pad-small'>
      <label>cut size: <input type="range" bind:value={cut_size} min=0.01 max=8 step=0.1>{cut_size}</label>
    </div>
    <div class='row pad-small'>
      <label><input type="checkbox" bind:checked={do_scramble}>scramble</label>
    </div>
  </div>
</div>

