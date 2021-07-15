<script>
    import MainPlot from './MainPlot.svelte';
    // console.log(document.getElementById('testid').clientWidth);
</script>

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

        <p>Consider the following:  you are given a dataset <d-math>\textbf{D} =
            \{(x_i, y_i)\}_{i \in (1, \cdots, n)}</d-math>, with
        <d-math>\mathcal{X} \times \mathcal{Y} \in \mathbb{R} \times
            \mathbb{R}</d-math>.  There is nothing known about the true
        relationship between <d-math>X</d-math> and <d-math>Y</d-math> except that
        it is deterministic, continuous, and with some bounded first derivative.
        In other words, "smooth".  So you would like to find a smooth function to
        fit the data.</p> 

        <figure class="l-page-outset" style="height: 500px;">
            <MainPlot/>
            <!-- <d-figure> <MainPlot/> </d-figure> -->
        </figure>

        <p>With this smoothness goal in mind, you have decided to create a function
        which is a linear combination of <d-math>n</d-math> gaussians, each one
        centered at one of the <d-math>x_i</d-math>.  Since the gaussians themselves
        are smooth, the resulting linear combination will also be smooth.  The goal
        will be to adjust the weight of each gaussian and hopfully fit the
        <d-math>y_i</d-math> at each point <d-math>x_i</d-math>.</p>    

        <p>Here are the functions we have chosen to use, now shown with the data.
        Notice that there is one function per data point, centered at the
        <d-math>x_i</d-math> coordinate.  The goal will be to find some weight vector
        <d-math>\beta</d-math> that combines these together to form a curve that goes through all of
        the <d-math>y_i</d-math> values.</p> 

        <p>How do we find <d-math>\beta</d-math>?  At first it seems like a hard problem.  We could
        easily weight the <d-math>i^{th}</d-math> function so that its peak equals
        <d-math>y_i</d-math>.  But, the resulting function would miss the
        <d-math>y_i</d-math> due to the additional contribution of the other functions
        at that point, since these functions are non-zero everywhere.  Every time you
        adjust one of the <d-math>\beta_i</d-math>, the values of the solution function changes
        everywhere, so it isn't obvious how to find a solution, or if one exists at
        all.</p> 

        <h3>The approach</h3>

        <p>For the moment, we are only concerned with the values of the solution
        function at positions <d-math>x_i</d-math>.  Each value of the solution
        function at <d-math>x_i</d-math> will be the same linear combination of the
        curve heights at <d-math>x_i</d-math>, so we have highlighted them here.</p>

        <p>Recall from linear algebra, that if you have a set of <d-math>n</d-math>
        linearly independent vectors in <d-math>\mathbb{R}^n</d-math>, those vectors
        are said to <i>span</i> <d-math>\mathbb{R}^n</d-math>. This means every other
        vector in <d-math>\mathbb{R}^n</d-math> may be formed as a unique linear
        combination of these spanning vectors.</p>

        <p>Looking at the graph again, you can now see that each curve, evaluated at
        the <d-math>x_i</d-math> in order, provides one of these spanning vectors (this
        isn't proven but let's for the moment accept it).  And, the set of
        <d-math>y_i</d-math> values is just our target vector.  So, all we need is to
        express it as the unique linear combination <d-math>\beta</d-math> which must
        exist.</p>

        <p>To make this explicit, let:</p>


        <d-math block>
            \begin{aligned}
            k_i(x) & \equiv \text{curves centered at $x_i$} \\
            f(x) & \equiv \beta_1 k_1(x) + \cdots + \beta_n k_n(x) & \text{the solution function} \\[1em]
            D_x & \equiv (x_1, \cdots, x_n) & \text{vector of $x_i$ values in the dataset} \\
            (k_i)_{D_x} & \equiv (k_i(x_1), \cdots, k_i(x_n)) & \text{values of $k_i$ along $D_x$ (the spanning vectors)} \\
            (f)_{D_x} & \equiv (f(x_1), \cdots, f(x_n)) & \text{values of $f$ along $D_x$ (the target vector)} \\
            \end{aligned}
        </d-math>

        <p>Now, shown above are the same curves, each scaled by a candidate
        <d-math>\beta</d-math>.  The goal is for the sum of these scaled curves to form
        a function that goes through the <d-math>y_i</d-math>.  Using the linear
        algebra fact that an expansion exists, we can assert that there exists such a
        <d-math>\beta</d-math>, formally:</p> 

        <d-math block>
            \begin{aligned}
            (f)_{D_x} = \beta_1 (k_1)_{D_x} + \cdots + \beta_n (k_n)_{D_x} = Y & \\
            \end{aligned}
        </d-math>

        <p>Or, in matrix notation, let:</p>

        <d-math block>
            \begin{aligned}
            K & \equiv
            \begin{bmatrix}
            - (k_1)_{D_x} - \\
            - (k_2)_{D_x} - \\
            \cdots \\
            - (k_n)_{D_x} -
            \end{bmatrix} \\[1em]
            \beta & \equiv [\beta_1, \cdots, \beta_n] & \text{row vector} \\[1em]
            \end{aligned}
        </d-math>

        <p>So, the unique function that goes through all values <d-math>y_i</d-math> uses <d-math>\beta</d-math> that
        satisfies <d-math>\beta K = Y</d-math>.</p>

        <h3>Where is the Kernel?</h3>

        <p>Notice that the family of functions <d-math>k_i(x)</d-math> are all related by a
        two-argument gaussian formula (if we consider <d-math>\sigma</d-math> to be constant) with
        signature <d-math>\mathcal{X} \times \mathcal{X} \rightarrow \mathbb{R}</d-math>.  One
        argument is the mean parameter, and the other the position.   We could call
        that function <d-math>k</d-math> (with no subscript):</p>

        <d-math block>
            \begin{aligned}
            k(x, x') & \equiv \tfrac{1}{\sigma \sqrt{2 \pi}} e^{-\tfrac{(x - x')^2}{2 \sigma^2}} & : \mathcal{X} \times \mathcal{X} \rightarrow \mathbb{R} \\
            \end{aligned}
        </d-math>

        <p>More generally, we designed our solution function at the very beginning to
        be a linear combination of functions which were 1) parameterized by a point in
        <d-math>\mathcal{X}</d-math> and 2) defined over domain
        <d-math>\mathcal{X}</d-math>.  Implicitly, the two-argument function that was
        needed to define these functions was already there.</p>

        <p>This function <d-math>k(x, x')</d-math> is known as a "kernel".  We can now express the
        matrix, and our solution function in terms of the kernel:</p>

        <d-math block>
            \begin{aligned}
            K & \equiv
            \begin{bmatrix}
            k(x_1, x_1), \cdots, k(x_1, x_n) \\
            k(x_2, x_1), \cdots, k(x_2, x_n) \\
            \cdots \\
            k(x_n, x_1), \cdots, k(x_n, x_n) 
            \end{bmatrix} \\[1em]
            f(x) & \equiv \sum_i { \beta_i k(x_i, x) }\\
            \end{aligned}
        </d-math>


    </d-article>

    <d-appendix>
    </d-appendix>

</main>

<style>
</style>
