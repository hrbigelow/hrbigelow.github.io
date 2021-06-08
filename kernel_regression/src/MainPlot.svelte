<script>
import {Plot} from './plot';
import {Context} from './context';

export let showdata = false;
export let showbasis = false;
export let showscaled = false;
export let showsolution = false;

let ctx = new Context(700, 350, [0, 10], [-0.5, 0.5]);
let plot = new Plot(ctx);
let colors = [ '#33cc33', '#cccc00', '#cc0000' ];

</script>

<style>
  .gauss-grid {
    display: inline-grid;
    grid-template-columns: 0.81fr 1fr 0.81fr;
    text-align: center;
  }

  .grid-item {
    margin: 0.3em;
  }

  .data {
    fill: #000000;
    stroke: #000000;
  }

  .curve {
    fill: none;
    stroke-width: 2px;
  }

  .point {
    fill: none;
    stroke-width: 1px;
  }

  .solution-curve {
    fill: none;
    stroke: rgba(0,0,255,1);
    stroke-width: 3px;
  }

  .solution-pt {
    fill: none;
    stroke: rgba(0,0,255,1);
    stroke-width: 3px;
  }

  .ss {
    baseline-shift: sub;
    font-size: 11px;
  }

</style>


<div class="gauss-grid">
  <div class="grid-item">
      <svg width="{plot.width}" height="{plot.height}" viewBox="0 0
                  {plot.width} {plot.height}" class="plot">

        {#if showdata}
          {#each plot.dataset as [x, y, beta]}
            <circle class="data" 
                    style="stroke: #000000"
                    cx="{plot.u(x)}" 
                    cy="{plot.v(y)}" 
                    r="5"/>
          {/each}
        {/if}

        {#if showbasis}
          {#each plot.dataset as [x, y, beta], i}
            <path class="curve" d="{plot.curve(x, 1.0)}"
                                style="stroke: {colors[i]}"></path>
            {#each plot.x as x2}
              <circle class="point" cx="{plot.u(x2)}"
                                       cy="{plot.curvePoint(x, 1.0, x2)}" 
                                       r="3" style="stroke: {colors[i]}"/>
            {/each}
          {/each}
        {/if}

        {#if showscaled}
          {#each plot.dataset as [x, y, beta], i}
            <path class="curve"
                  style="stroke: {colors[i]}"
                  d="{plot.curve(x, beta)}"
                  >
            </path>
            {#each plot.x as x2}
              <circle class="point" cx="{plot.u(x2)}"
                                       cy="{plot.curvePoint(x, beta, x2)}" 
                                       r="3" style="stroke: {colors[i]}"/>
            {/each}
          {/each}
        {/if}

        {#if showsolution}
          <path class="solution-curve" d="{plot.solutionCurve()}"></path>
          {#each plot.x as x}
            <circle class="solution-pt" cx="{plot.u(x)}"
                                        cy="{plot.solutionPoint(x)}" r="3"/>
          {/each}
        {/if}
      
      </svg>
      <svg width="{plot.width}" height="40" viewBox="0 0
                  {plot.width} 40">
        {#each plot.x as x, i}
          <text x={plot.u(x)} y=25>x<tspan class="ss">{i}</tspan></text>
        {/each}
      </svg>
  </div>
</div>

