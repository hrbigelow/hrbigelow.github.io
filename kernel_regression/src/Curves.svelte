<script>
import { Sync } from './sync';
import { range } from 'd3';
import { onMount } from 'svelte';

export let sig, cfg, plot, cn, klass;
let w=0, h=0;
let drag_point = null;
let s, mounted = false;


function solve(do_solve, msg) {
  // console.log(`in solve: ${msg}, do_solve=${do_solve}`);
  if (! do_solve) return;
  const NSTEPS = 50;
  var start_alpha = plot.alpha;
  var end_alpha = plot.solutionAlpha();

  function transition(step, nsteps) {
    var delta = step / nsteps;
    for (let i = 0; i != plot.n; i++) {
      plot.alpha[i] = delta * end_alpha[i] + (1 - delta) * start_alpha[i];
    }
    s.notify();
    if (step != nsteps) {
      setTimeout(() => transition(step+1, nsteps), 10);
    }
  }
  transition(0, NSTEPS);
}


function update() {
  if (! mounted) return;
  var cmd = cfg.cmd;
  if (cmd == 'reset_alpha') plot.resetAlpha();
  if (cmd == 'del_point') plot.delPoint();
  if (cmd == 'add_point') plot.addPoint();
  if (cmd == 'new_data') plot.populate();
  if (cmd == 'auto_solve') solve(cfg.auto_solve);
  if (cmd == 'mu_tracks_x' && cfg.mu_tracks_x) plot.recenter_mu();
  if (cmd == 'scramble') plot.set_scramble(cfg.scramble);
  if (cmd == 'set_sigma') plot.set_sigma(cfg.log_sigma);
  if (cmd && cmd.match(/update_alpha/)) { 
    // do nothing
  } 
  else if (cmd == 'set_sigma' || cmd == 'mu_x_changed') {
    if (cfg.auto_solve)
      plot.alpha = plot.solutionAlpha();
  } else if (cmd != 'reset_alpha') {
    solve(cfg.auto_solve);
  }

  plot.touch++;
  cfg.cmd = null;
  s.notify();
}


function resize(width, height) {
  if (! mounted) return;
  console.log(`in resize with ${width} x ${height}`);
  plot.resize(width, height);
  update();
}



onMount(() => {
  s = new Sync(sig, cn, update);
  mounted = true;
  resize(w, h);
});

function onMouseDown(evt) {
  drag_point = evt.target;
}


function onMouseMove(evt) {
  if (drag_point == null) return;
  var g = drag_point.id.match(/(?<code>\D+)(?<num>\d+)/).groups
  if (g.code == 'mu')
    plot.setMu(g.num, evt.offsetX);
  else if (g.code == 'xy') {
    plot.setDataPoint(g.num, evt.offsetX, evt.offsetY);
    if (cfg.mu_tracks_x)
      plot.setMu(g.num, evt.offsetX);
  }
  cfg.cmd = 'mu_x_changed';
  update();
  // s.notify();
}

function onMouseUp(evt) {
  drag_point = null;
}

$: resize(w, h);

</script>

<div class='framed {klass} z3' bind:clientWidth={w} bind:clientHeight={h}></div>
<svg class='framed {klass}'
     on:mousemove={onMouseMove}
     on:mouseup={onMouseUp}
     >
     <defs>
     <polygon id='mu-select' points="-5,0 5,0 0,10"/>
     </defs>
  {#each plot.getMuX() as [mu,x], i}
    <use class='marker draggable'
         id='mu{i}' x="{mu}" y="0" xlink:href='#mu-select'
                             on:mousedown={onMouseDown}/>

  {/each}

  {#each range(plot.n) as i}
    {#if cfg.curves}
      <path class="curve" d="{plot.curve(i)}"/>
    {/if}

    {#if cfg.points}
      {#each plot.points(i) as [u,v]}
        <circle class="point" cx="{u}" cy="{v}" r="4"/>
      {/each}
    {/if}
  {/each}

  {#if cfg.solution}
    <path class="solution-curve" d="{plot.solutionCurve()}"/>
  {/if}

  {#if cfg.show_data}
    {#each plot.data() as [u,v], i}
      <circle
        id='xy{i}'
        class="marker draggable" 
        cx="{u}" cy="{v}" r="5"
        on:mousedown={onMouseDown}/>
    {/each}
  {/if}

</svg>

<style>

  .z3 {
    z-index: -3;
  }

  .marker {
    fill: #000000;
    stroke: #000000;
  }

  .curve {
    fill: none;
    stroke: rgba(200, 200, 200, 1);
    stroke-width: 2px;
  }

  .point {
    fill: rgba(200, 200, 200, 1);
    stroke-width: 1px;
  }

  .framed {
    border: 1px solid gray;
  }

  .solution-curve {
    fill: none;
    stroke: rgba(0,0,255,1);
    stroke-width: 2px;
  }

  .draggable:hover {
    stroke: rgba(255,0,0,1);
    fill: rgba(255,0,0,1);
  }


</style>

