<script>
    import KernelMethods from './kernel_methods.md'; 

</script>

<main>

  <KernelMethods/>

  <!--
    <d-front-matter>
    <script type="text/json">{
        "title": "Introduction to Kernel Regression",
      "description": "A gentle introduction to Kernel Regression",
      "authors": [ { "author": "Henry Bigelow" } ] }
    </script>

    </d-front-matter>

    <d-title style="padding-bottom: 0">
        <h1>Introduction to Kernel Regression</h1>
    </d-title>

    <d-byline></d-byline>


    <d-article>

        <figure class="l-page-outset" >
            <Figure1/> 
            <figcaption>Interctive plot.  You can drag the black 
                <d-math>(x_i, y_i)</d-math> data points and triangles
                (<d-math>\mu_i</d-math> values).  <b>Top</b>: gray curves are
                Gaussians centered at the <d-math>\mu_i</d-math>.  Blue curve is the
                <d-math>\vec\alpha</d-math> linear combination of the gray curves.
                <b>Bottom left</b>: A heatmap showing the family of Gaussians
                with the same <d-math>\sigma</d-math> at every
                <d-math>\mu</d-math> value.  Red dots show the locations of evaluation points.
                <b>Bottom right</b>:  The matrix of values of evaluation
                points organized by <d-math>\mu_i</d-math> and <d-math>x_i</d-math>.
                Other details provided in text.  <a href="full.html">Full Page Figure</a>.
            </figcaption>
        </figure>

        <figure class="l-page-outset">
            <Figure2/>
            <figcaption>
                <b>Left</b>: The curves plot as before with only two curves.
                <b>Right</b>: The plane in feature space spanned by vectors
                <d-math>\vec\phi(\mu_1)</d-math> and
                <d-math>\vec\phi(\mu_2)</d-math> The blue arrow is
                <d-math>\alpha_1 \vec\phi(\mu_1) + \alpha_2
                    \vec\phi(\mu_2)</d-math>.  
            </figcaption>
        </figure>

        <KernelMethods/>

    </d-article>
    -->

</main>

<style>

  main {
    max-width: 50vw;
    font-size: 1.06rem;
    line-height: 1.7em;
    align: center;
  }

</style>
