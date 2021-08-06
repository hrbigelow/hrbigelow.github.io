<script>
import { Sync } from './sync';
import { numberDisplay } from './presentation';
import * as d3 from 'd3';
import { onMount } from 'svelte';

export let sig, cn, cfg, pp, gridarea;
let s, divh, svg, mounted = false;
let drag_point = null;

// called in response to a notify() call from any component
// that shares sig with this component
function update() {
  if (! mounted) return;
  pp.updateBasis();
  pp.plot.touch++;
  pp.touch++;
}


onMount(() => {
  s = new Sync(sig, cn, update);
  mounted = true;
  resize(divh)
  update();
});

function onMouseDown(evt) {
  drag_point = evt.target;
}

function onMouseMove(evt) {
  if (drag_point == null) return;
  if (drag_point.id == 'fhat') {
    pp.updateY(evt.offsetX, evt.offsetY);
    cfg.cmd = 'mu_xy_changed';
  }
  else {
    pp.updateF(evt.offsetX, evt.offsetY);
    cfg.cmd = 'update_alpha';
  }
  update();
  s.notify();
  
}

function onMouseUp(evt) {
  drag_point = null;
}

function resize(dummy) {
  if (! mounted) return;
  var h = svg.clientHeight;
  svg.setAttribute('width', h);
  pp.resize(h, h);
  pp.plot.touch++;
  pp.touch++;
}

$: resize(divh);

</script>

<div class='{gridarea} framed z3' bind:clientHeight={divh}></div>
<svg class='{gridarea} framed' bind:this={svg}
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

<!-- 
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
-->

<style>

  .z3 {
    z-index: -3;
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

  .framed {
    border: 1px solid gray;
  }

  .draggable:hover {
    stroke: rgba(255,0,0,1);
    fill: rgba(255,0,0,1);
  }

</style>
