<script>
  import * as phi from './phi_space.js';
  import * as d3 from 'd3';
  import { onMount } from 'svelte';

  // arrow display will be from [-max_alpha, -max_alpha] for both x and y
  let phi_width, phi_height;
  let vis_width, vis_height;
  let drag_point = null;
  let x2 = -4;
  let log_sigma=0;

  var max_alpha = 4;
  let pp = new phi.PhiSpace(max_alpha);

  onMount(() => {
    pp.resizePhi(phi_width, phi_height);
    pp.resizeCtx(vis_width, vis_height);
    pp.touch++;
    pp.plot.nonce++;
  });

  function onMouseDown(evt) {
    drag_point = evt.target;
  }

  function onMouseMove(evt) {
    if (drag_point == null) return;
    pp.updateF(evt.offsetX, evt.offsetY);
    pp.plot.nonce++;
    pp.touch++;
  }

  function onMouseUp(evt) {
    drag_point = null;
  }

  function set_sigma(log_sigma) {
    pp.plot.set_sigma(log_sigma);
    pp.updateBasis(x2);
    pp.touch++;
    pp.plot.nonce++;
  }

  function set_x(x2) {
    pp.plot.setDataPoint(1, pp.plot.ctx.u(x2), pp.plot.ctx.v(0));
    pp.updateBasis(x2);
    pp.touch++;
    pp.plot.nonce++;
  }

  function numberDisplay(n) {
    var ns = Math.abs(n) > 1000 ? n.toExponential(2) : n.toFixed(2);
    return ns;
  }
    
// $: console.log(`drag_point: ${drag_point}`);
$: set_sigma(log_sigma); 
  $: set_x(x2);
  $: set_sigma(log_sigma);

</script>

<style>
  .row {
    display: flex;
    flex-direction: row;
  }

  .basis {
    fill: none;
    stroke: rgba(200, 200, 200, 1);
    stroke-width: 2px;
  }

  .basis-arrow {
    fill: rgba(200, 200, 200, 1);
  }

  .curve {
    fill: none;
    stroke: rgba(200, 200, 200, 1);
    stroke-width: 2px;
  }
    
  .solution-curve {
    fill: none;
    stroke: rgba(0,0,255,1);
    stroke-width: 2px;
  }

  .solution-arrow {
    fill: rgba(0,0,255,1);
  }

  .drag {
    fill: transparent;
  }

  .svg-wrap {
    flex-grow: 1;
  }

  .inner-plot {
    border: 1px solid gray;
  }

  .pad {
    padding: 10px;
  }

  .full {
    width: 100%;
    height: 100%;
  }

</style>

<div class='row full'>
  <div class='col full'>
    <div class='svg-wrap pad full'
         bind:clientWidth={vis_width} bind:clientHeight={vis_height}>
      <svg class='inner-plot full'> 
        {#each d3.range(pp.plot.n) as i}
          <path class="curve" d="{pp.plot.curve(i)}" />
        {/each}
        <path class="solution-curve" d="{pp.plot.solutionCurve()}" />
      </svg>
    </div>
    <div class='col'>
      <div class='row'>
        <label class='pad-small'>x2:<input type='range' min="{pp.plot.ctx.xmin}" max="{pp.xp - 0.01}" step=0.01 bind:value={x2}>{x2}</label>
      </div>

      <div class='row'>
        <label class='pad-small'><d-math>\log(\sigma)</d-math><input type="range" bind:value={log_sigma} min=-5 max=2 step=0.1>{Math.pow(10, log_sigma).toFixed(3)}</label>
      </div>
    </div>
  </div>

  <div class='col full'>
    <div class='svg-wrap pad full'
         bind:clientWidth={phi_width} bind:clientHeight={phi_height}>
      <svg class='inner-plot full' 
           on:mousemove={onMouseMove}
           on:mouseup={onMouseUp}>
        <defs>
          <marker id="solution-arrow" 
            class='solution-arrow'
            viewBox="0 0 10 10" refX="5" refY="5"
            markerWidth="6" markerHeight="6"
            orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" />
          </marker>

          <marker id="basis-arrow"
            class='basis-arrow'
            viewBox="0 0 10 10" refX="5" refY="5"
            markerWidth="6" markerHeight="6"
            orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" />
          </marker>
        </defs>


        {#each d3.range(pp.plot.n) as i}
          <line class='basis' x1="{pp.xTou(0)}"
                              y1="{pp.yTov(0)}" 
                              x2="{pp.scr(i,0)}"
                              y2="{pp.scr(i,1)}" 
                              marker-end="url(#basis-arrow)" />
        {/each}

        <line class='solution-curve'
              x1="{pp.xTou(0)}"
              y1="{pp.yTov(0)}"
              x2="{pp.F(0)}" 
              y2="{pp.F(1)}" 
              marker-end="url(#solution-arrow)" />

        <circle class="drag" r="6" cx="{pp.F(0)}" cy="{pp.F(1)}"
        on:mousedown={onMouseDown} />
      </svg>
    </div>
    <div class='pad'>
      <p>Plane spanned by vectors 
      <d-math>\phi</d-math>({numberDisplay(pp.plot.x[0])}; <d-math>\sigma</d-math>={numberDisplay(Math.pow(10, log_sigma))}) and
      <d-math>\phi</d-math>({numberDisplay(pp.plot.x[1])}; <d-math>\sigma</d-math>={numberDisplay(Math.pow(10, log_sigma))})
      </p>
    </div>
  </div>
</div>



