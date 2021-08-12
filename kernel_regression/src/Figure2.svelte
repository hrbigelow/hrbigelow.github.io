<script>
import { writable } from 'svelte/store';
import { Plot } from './plot';
import { Context } from './context';
import * as phi from './phi_space';
import Curves from './Curves.svelte';
import PhiSpace from './PhiSpace.svelte';
import LowPanelControls from './LowPanelControls.svelte';
import { numberDisplay } from './presentation';

let box = { w: 10, h: 10 };

let cfg = {
  cmd: null,
  points: false,
  curves: true,
  solution: true,
  auto_solve: false, 
  mu_tracks_x: true,
  scramble: false,
  log_sigma: 0,
  show_data: true
};

var max_alpha = 4;
let pp = new phi.PhiSpace(max_alpha); 
let sig = writable(0); 

</script>

<div class='gb screen'>
    <Curves sig={sig} cfg={cfg} cn=1 plot={pp.plot} gridarea='curves'/>
    <PhiSpace sig={sig} cn=2 cfg={cfg} pp={pp} gridarea='phi'/>
    <LowPanelControls sig={sig} cfg={cfg} cn=3 plot={pp.plot} />
    <div>Plane spanned by $\vec\phi_\sigma(\mu_1)$ and $\vec\phi_\sigma(\mu_2)$</div>
</div>


<style>

  .screen {
    height: 60vh;
  }

  .gb {
    display: grid;
    grid-template-columns: auto min-content;
    grid-template-rows: auto min-content;
    row-gap: 5px;
    column-gap: 10px;
    justify-items: center;
    align-items: start;
  }

  .gb :global(.curves) {
    grid-area: 1/1/1/1;
    align-self: stretch;
    justify-self: stretch;
  }

  .gb :global(.phi) {
    grid-area: 1/2/1/2;
    align-self: stretch;
    justify-self: stretch;
  }

</style>

