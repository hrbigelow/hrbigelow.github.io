<script>
import { writable } from 'svelte/store';
import { Plot } from './plot';
import { Context } from './context';
import * as phi from './phi_space';
import Curves from './Curves.svelte';
import PhiSpace from './PhiSpace.svelte';
import LowPanelControls from './LowPanelControls.svelte';

let box = { w: 10, h: 10 };

let cfg = {
  show_data: true,
  show_scaled: true,
  show_solution: true,
  show_points: false,
  auto_solve: true,
  log_sigma: 0
};

var max_alpha = 4;
let pp = new phi.PhiSpace(max_alpha); 
let sig = writable(0); 

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

  .full {
    width: 100%;
    height: 100%;
  }

</style>


<div class='row full'>
  <div class='col full'>
    <Curves sig={sig} box={box} cfg={cfg} cn=1 plot={pp.plot} />
    <LowPanelControls sig={sig} cfg={cfg} cn=2 plot={pp.plot} />
  </div>
  <PhiSpace sig={sig} cn=3 pp={pp} />
</div>


