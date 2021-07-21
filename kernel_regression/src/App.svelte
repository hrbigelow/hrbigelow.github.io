<script>
    import Figure1 from './Figure1.svelte';
    import PhiVectors from './PhiVectors.svelte';
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
        <h3>A problem for Kernel Regression to solve</h3>

        <figure class="l-page-outset" style="height: 500px;">
            <Figure1/>
        </figure>

        <figure class="l-page-outset" style="height: 500px;">
            <PhiVectors />
        </figure>

    </d-article>

    <d-appendix>
    </d-appendix>

</main>
