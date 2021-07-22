<script>
import { make_sync } from './component_sync';
import { numberDisplay } from './presentation';
import * as d3 from 'd3';
import { onMount } from 'svelte';

export let sig, pp;

function update() {
  pp.updateBasis();
  pp.plot.touch++;
  pp.touch++;
}

var [ respond, notify ] = make_sync(update, sig);

let phi_width, phi_height;
let vis_width, vis_height;
let drag_point = null;
let log_sigma=0;

onMount(() => {
  pp.resizePhi(phi_width, phi_height);
  pp.resizeCtx(vis_width, vis_height);
  update();
});

function onMouseDown(evt) {
  drag_point = evt.target;
}

function onMouseMove(evt) {
  if (drag_point == null) return;
  if (drag_point.id == 'fhat')
    pp.updateY(evt.offsetX, evt.offsetY);
  else 
    pp.updateF(evt.offsetX, evt.offsetY);
  update();
}

function onMouseUp(evt) {
  drag_point = null;
}

$: respond($sig);
$: notify(pp);

</script>

<style>

  .col {
    display: flex;
    flex-direction: column;
  }

  .basis {
    fill: none;
    stroke: rgba(200, 200, 200, 1);
    stroke-width: 2px;
  }

  .basis-arrow {
    fill: rgba(200, 200, 200, 1);
  }

  .solution-arrow {
    fill: rgba(0,0,255,1);
  }

  .solution-curve {
    fill: none;
    stroke: rgba(0,0,255,1);
    stroke-width: 2px;
  }

  .perp-target {
    fill: rgba(0,0,0,1);
  }

  .target-y {
    fill: transparent;
  }

  .proj {
    fill: rgba(255,0,0,1);
  }

  .perp {
    stroke: rgba(0,0,0,1);
    stroke-width: 2px;
  }

  .drag {
    fill: transparent;
  }

  .grow {
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

<div class='col full'>
  <div class='grow pad'
       bind:clientWidth={phi_width} bind:clientHeight={phi_height}>
    <svg class='inner-plot full' 
         on:mousemove={onMouseMove}
         on:mouseup={onMouseUp}>
      <defs>
        <marker id="solution-arrow" 
          class='solution-arrow'
          viewBox="0 0 10 10" refX="10" refY="5"
          markerWidth="6" markerHeight="6"
          orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" />
        </marker>

        <marker id="basis-arrow"
          class='basis-arrow'
          viewBox="0 0 10 10" refX="10" refY="5"
          markerWidth="6" markerHeight="6"
          orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" />
        </marker>

        <marker id="flat-head"
          class='flat-head'
          viewBox="0 0 10 10" refX="5" refY="5"
          markerWidth="10" markerHeight="10"
          orient="auto-start-reverse">
          <path d="M 3 0 L 6 0 L 6 10 L 3 10 z" />
        </marker>

      </defs>


      {#each [0, 1] as i}
        <line class='basis' x1="{pp.xTou(0)}"
                            y1="{pp.yTov(0)}" 
                            x2="{pp.scr(i,0)}"
                            y2="{pp.scr(i,1)}" 
                            marker-end="url(#basis-arrow)" />

        <line class='perp' 
              x1="{pp.fHat(0)}"
              y1="{pp.fHat(1)}"
              x2="{pp.fHatProj(i,0)}"
              y2="{pp.fHatProj(i,1)}" 
              stroke-dasharray="4 4" />
                                                 
      {/each}

      <circle id="fhat" class='perp-target' r="6" 
                                            cx="{pp.fHat(0)}" cy="{pp.fHat(1)}" 
                                                              on:mousedown={onMouseDown}/>

      <line class='solution-curve'
            x1="{pp.xTou(0)}"
            y1="{pp.yTov(0)}"
            x2="{pp.F(0)}" 
            y2="{pp.F(1)}" 
            marker-end="url(#solution-arrow)" />

      <circle id="f" class="drag" r="6" cx="{pp.F(0)}" cy="{pp.F(1)}" 
      on:mousedown={onMouseDown} />

    </svg>
  </div>
  <div class=''>
    <p>Plane spanned by vectors 
    <d-math>\phi</d-math>({numberDisplay(pp.plot.x[0])}; <d-math>\sigma</d-math>={numberDisplay(Math.sqrt(pp.plot.get_sigma2()))}) and
    <d-math>\phi</d-math>({numberDisplay(pp.plot.x[1])}; <d-math>\sigma</d-math>={numberDisplay(Math.sqrt(pp.plot.get_sigma2()))})
    </p>
  </div>
</div>



