<script>
    // import TextSection1 from './TextSection1.md';
    // import TestDMath from './TestDMatn.svelte';
    import KernelMethods from './kernel_methods.md'; 
    import Figure1 from './Figure1.svelte';
    import Figure2 from './Figure2.svelte';
    // import KernelHeatmap from './KernelHeatmap.svelte';
    import KernelMatrix from './KernelMatrix.svelte';
</script>

<style>

</style>

<main>

    <d-front-matter>
    <script type="text/json">{
        "title": "Introduction to Kernel Regression",
      "description": "A gentle introduction to Kernel Regression",
      "authors": [
      {
          "author": "Henry Bigelow"
      }
      ]
      }
    </script>

    </d-front-matter>

    <d-title style="padding-bottom: 0">
        <h1>Introduction to Kernel Regression</h1>
    </d-title>

    <d-byline></d-byline>


    <d-article>

        <figure class="l-page-outset" >
            <Figure1/> 
            <figcaption>Interactive plot.  You can drag the black points
            </figcaption>
        </figure>

        <!-- 
        <figure class="l-page-outset">
            <Figure2/>
        </figure>
        -->

        <!-- <KernelMethods/> -->

    </d-article>

    <d-appendix>
    </d-appendix>

</main>
