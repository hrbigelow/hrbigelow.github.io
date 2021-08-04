<script>
import { Sync } from './sync';
import { numberDisplay } from './presentation';
import * as d3 from 'd3';
import { onMount } from 'svelte';

export let sig, cn, pp;

function update() {
  pp.updateBasis();
  pp.plot.touch++;
  pp.touch++;
}

var s = new Sync(sig, cn, update);

let phi_side;
let vis_width, vis_height;
let drag_point = null;
let log_sigma=0;

onMount(() => {
  pp.resizePhi(phi_side, phi_side);
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
  s.notify();
  
}

function onMouseUp(evt) {
  drag_point = null;
}

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
    stroke: rgba(0,0,255,1);
  }

  .solution-curve {
    fill: none;
    stroke: rgba(0,0,255,1);
    stroke-width: 2px;
  }

  .perp-target {
    fill: rgba(0,0,0,1);
  }

  .perp {
    stroke: rgba(0,0,0,1);
    stroke-width: 2px;
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

  .draggable:hover {
    stroke: rgba(255,0,0,1);
    fill: rgba(255,0,0,1);
  }

</style>

<div class='grow col'>
  <div class='pad' bind:clientWidth={phi_side}>
    <svg class='inner-plot' 
         width="{phi_side}" height="{phi_side}"
         on:mousemove={onMouseMove}
         on:mouseup={onMouseUp}>
      <defs>

        <marker id="basis-arrow"
          class='basis-arrow'
          viewBox="0 0 10 10" refX="10" refY="5"
          markerWidth="6" markerHeight="6"
          orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" />
        </marker>

        <polygon id='pointer' points="-10,-5 0,0 -10,5"/>

      </defs>


      {#each [pp.toUV([0,0])] as [x1, y1]}
        {#each [pp.scr(0),pp.scr(1)] as [x2,y2]}
        <line class='basis' x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}"
            marker-end="url(#basis-arrow)" />
        {/each}
      {/each}

      {#if 1}
      {#each [pp.fHat()] as [x1, y1]}
        {#each [pp.fHatProj(0), pp.fHatProj(1)] as [x2, y2]}
        <line class='perp' x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}"
              stroke-dasharray="4 4" />

        <circle id="fhat" class='perp-target draggable' r="6" 
              cx="{x1}" cy="{y1}" 
              on:mousedown={onMouseDown}/>
        {/each}
      {/each}
      {/if}

      {#each [{ p1: pp.toUV([0,0]), p2: pp.F()} ] as {p1, p2}}
        <line class='solution-curve'
              x1="{p1[0]}" y1="{p1[1]}" x2="{p2.u}" y2="{p2.v}" />

        <use class='solution-arrow draggable'
             xlink:href='#pointer'
             id='f' x="{p2.u}" y="{p2.v}" 
             transform="rotate({p2.deg}, {p2.u}, {p2.v})"
             on:mousedown={onMouseDown} />
      {/each}

    </svg>
  </div>
  <div class='pad'>
    {#each [numberDisplay([...pp.plot.mu, Math.sqrt(pp.plot.get_sigma2())])] as
      [mu1, mu2, sigma]}

      <div>
      Plane spanned by vectors
        <d-math>\vec{\phi_{\sigma}}(\mu_1)</d-math> and 
        <d-math>\vec{\phi_{\sigma}}(\mu_2)</d-math>
      </div>
      <div><d-math>\sigma = </d-math>{sigma}</div>
      <div><d-math>\mu_1 = </d-math>{mu1}</div> 
      <div><d-math>\mu_2 = </d-math>{mu2}</div>
    {/each}
  </div>
</div>

