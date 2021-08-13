$
\newcommand\B[1]{\boldsymbol{#1}}
\newcommand\norm[1]{\|#1\|}
\newcommand\ang[1]{\theta_{#1}}
\newcommand\dist{\mathrm{dist}}
\newcommand\half{{\small {1 \over 2}}}
\newcommand\FeatSpace{\mathcal{\Phi}}
\newcommand\GSpace{\mathcal{G}_\sigma}
\newcommand\proj[2]{#1_{\small \parallel #2}}
\newcommand\rej[2]{#1_{\small \perp #2}}
\newcommand\V[1]{\vec{#1}}
\newcommand\len[1]{\mathrm{len}(#1)}
\newcommand\disp[1]{\mathrm{disp}(#1)}
$

<script>
import Figure1 from './Figure1.svelte';
import Figure2 from './Figure2.svelte';
</script>


# Introduction

In this article, I introduce the main mathematical apparatus at the core of all Kernel Methods.  To me, the apparatus is best introduced as the inevitable consequence of three design goals, in the same way that a bicycle is the consequence of design goals ("a thing the rider must be able to steer, sit on, accelerate, and stop").

I take a somewhat unconventional approach by first considering a slightly wider class, and then show that a narrower class (still with multiple choices) is the most optimal.  The Kernel method is one choice in this narrower class.  While any choice within this narrower class provides exactly the same solution to a problem, the Kernel method is the only computable member of this class.  This should hopefully make the Kernel Method seem less contrived and arbitrary.



There are two interactive visualizations in this article, using the 1-D Gaussian Kernel.  In writing it, I built a lot of intuition about these core concepts by fiddling with the two figures.

All Kernel methods, such as Kernel Regression, Kernel SVM, PCA, CCA, K-means use the same mathematical apparatus at the core, but solve a different linear problem.  In this article, I use the simplest among these, the perfect-fit Kernel Regression, as a worked example.  Since it is perfect-fit, it has the drawback of not using regularization.  Instead, I introduce the concept of regularization through function norm reduction while considering the design of the Kernel Method itself.   Imperfect-fit (least squares) regression, and other variations serve to further decrease the function norm, or achieve other objectives such as classification.

A core concept of Kernel Methods is the so-called "feature space" - a (possibly) infinite dimensional vector space, whose points correspond one-to-one with functions.  There is a distinct concept called the Reproducing Kernel Hilbert Space.  The RKHS is a more abstract concept; it is also a vector space whose points correspond to the points in the feature space, and the functions.  The feature space and the RKHS are distinct, but represent aspects of the same underlying mathematical object.  But often in the literature, they are spoken about interchangeably, which was a major source of confusion.  I only mention them here to help the reader avoid the same confusion.

Kernel methods, particularly SVMs, were for a time a dominant model used in Machine Learning, but have been eclipsed by deep Neural networks trained by stochastic gradient descent.  More recently, it was recognized that NNs trained by SGD approximate Kernel methods, and this has led to increased interest and new applications.

# An illustration of Kernel Regression

In the interactive figure, data points $(x_i, y_i)$ are shown as black dots.  There is one Gaussian centered at each $x_i$.  The blue curve is a linear combination $(\alpha_1, \cdots, \alpha_n)$ of these Gaussians.  Each slider controls one of the $\alpha_i$.

You can adjust the sliders to make the blue curve perfectly fit the $y_i$.  It may be surprising to note that a unique, perfect-fitting $\alpha$ exists for any set of $(x_i, y_i)$ and for any number of points (click 'Add Points' and/or 'New Data' to adjust).

To see why, note that each gray curve's set of values along the $x_i$ produces a vector, which I call the function's *vector of evaluation*.  Denoting the j'th curve as $k_j(x)$, its vector of evaluation is $(k_j(x_1), k_j(x_2), \cdots, k_j(x_n))$, where the order of components is always the order of the $(x_1, x_2, \cdots, x_n)$.  

<Figure1 />



Note that there isn't any rule that the $x_i$ need be monotonically increasing.  They are simply given in some arbitrary order from the dataset. In the plot, they aren't labeled.  You can adjust the i'th slider and see which curve moves.  The point located horizontally at the peak of that curve is $(x_i, y_i)$.  Ultimately it doesn't matter for the purposes of illustration.  The important thing is that all the gray functions' vectors of evaluation are in the same order.

Also note, although Gaussians are most often interpreted as probability distributions, in this article, there is no such interpretation, and there is no process of sampling from Gaussians.  We are simply using them as curves, like splines, to generate more complex shapes.  So, there is no requirement that they be normalized.

Particularly for a collection of Gaussians all with the same $\sigma$, the set of these $n$ vectors are linearly independent.  This is not at all obvious, but please accept it for now.  Then, by the linear algebra expansion theorem, they span $\mathbb{R}^n$ and so can form any set of $(y_i)$.

Explicitly:

$$
\begin{aligned}
k_j(x) & & \mbox{Gaussians centered at $x_j$, $j = 1 .. n$} \\
f(x) & \equiv \sum_j { \alpha_j k_j(x) } & \mbox{the blue curve}\\
f(x_i) & = \sum_j { \alpha_j k_j(x_i) } = y_i & \mbox{fitting the blue curve to the black points} \\
\B{\alpha K} & = \B{y} , & \mbox{$\B{K}$: rows are vectors of evaluation} \\
\end{aligned}
$$

The $\B{\alpha}$ that fits the data perfectly is found by inverting $\B{K}$, which is possible because $\B{K}$ is full-rank.  That is, its rows are linearly independent, due to the property of a collections of Gaussians of the same $\sigma$.  Even though we are taking linear combinations of functions, it is only the vectors of evaluation $(f_j(x_1), \cdots, f_j(x_n))$ which affect the choice of $\B{\alpha}$.

Of course, the whole purpose is for the curve to specify desirable values at other points, by some criterion.  But, so far the discussion is only concerned with how to make the curve have desired values at the $x_i$.

## Some Observations

**This method can fit any set of data in $\mathbb{R} \times \mathbb{R}$.**  Given a *particular* set $x_i$, you could hand-pick a set of functions $k_j(\cdot)$ which happen to produce linearly independent vectors $(k_j(x_i))$ of evaluation on that particular data set.  However, the procedure shown above can fit any data set $(x_i, y_i)$.  This is useful because it would be laborious to have to hand-pick functions for each new data set.

**There is nothing (yet) special about the Gaussians being centered at the $x_i$**.  It turns out that *any* choice of $n$ Gaussians will span $\mathbb{R}^n$ when evaluated at any $n$ values.  There *is* indeed something special about the Gaussians being centered at the $x_i$, but it has nothing to do with the ability to fit arbitrary data.

**Many functions have this infinite capacity**.  Not just Gaussians, but many other families of functions have this capacity to perfectly fit any data, due to the vectors of evaluation being linearly independent.  Not only that, but families of functions can be found for many different domains, not just $\mathbb{R}$ as shown above.   Both discrete and continuous domains, and of arbitrary dimensions.

**Linear independence is preserved under permutation of components**.  The Gaussians are able to fit any data because they produce vectors that are linearly independent.  But, note that vectors that are linearly independent would still be so, after you permute their elements all in the same way.  For vectors, there is no meaning to the ordering of the elements.  To illustrate, click the 'scramble' button.  This remaps all points in $\mathcal{X}$ in one-to-one fashion by reversing the order of every other interval of some fixed size.  Or think of it as re-ordering the components of the Gaussian "vectors" all in the same way, preserving their linear independence.  You can still toggle 'auto solve' and see that a unique solution exists.

Of course, these permuted Gaussians don't have the same relationship with the original data, so there will be a different $\B{\alpha}$ solution.  This is only to show that the continuity or shape of the original Gaussians is not what gives them this capacity to fit arbitrary data.




## The three design choices underlying all Kernel methods

Underlying all Kernel methods are three choices for how to construct the function to fit a given data set.  Like all machine learning methods, these chocies are guided by classic requirements.  First, the approach must be a "universal approximator", or as I call it, have arbitrary model capacity.  This means, the ability to perfectly fit any data set.  Second, it should be possible to regularize, meaning that the function gives useful interpolation behavior.  Finally, it should be computationally tractable.  The three design choices serve these requirements as you will see.

### First design choice

***Set of functions indexed by $\mathcal{X}$***.  We specify a set of functions $f_i: \mathcal{X} \mapsto \mathcal{Y}$, such that there is exactly one member of the set, $f_i$, corresponding to each element $x_i \in \mathcal{X}$.  We then use the subset of this set corresponding to our $x_i$ in the dataset to build a solution function as a linear combination of them.  The fact that the functions are already indexed by elements of the domain $\mathcal{X}$ makes the choice automatic.  There is no hand-specifying a set of functions tailor made for each new data set.  This choice also serves the purpose of regularization, to be proved later.

### Second design choice

***Members of the set exhibit linearly independent vectors of evaluation***. The members of the set have the following property:  For any value of $n$, and for any $n$ functions from the set, and for any choice of $n$ evaluation points in $\mathcal{X}$, the set of $n$ *vectors of evaluation* of the chosen functions should be linearly independent.  A "vector of evaluation" as explained above is my term for the vector of function values in the order of data set points, $(f_i(x_1), f_i(x_2), \cdots, f_i(x_n))$.  This design choice allows the approach to fit any data set, as argued above by appealing to the linear algebra expansion theorem.  This gives the approach arbitrary capacity.  As an aside, there are choices of families that don't have this property, but since we are speaking generally about the approach of Kernel methods, it is important that some families do exhibit this property.

### Third design choice

***The functions are in the form of dot products of feature vectors***.  This is the biggest leap.  The members of the set are of the form:  $f_i(x) \equiv \V{\phi_f}_i \cdot \B{\phi}(x)$.  That is, each function is identified by a distinct "parameter vector" $\V{\phi_f}_i$, and the function is defined as the dot product between its parameter vector and some as-yet undefined vector-valued function of the input.  As I will show soon, this third choice provides a way to regularize the method, and makes finding the solution function readily computable.  It also maintains the first goal of having arbitrary capacity to fit any data.  For readers already familiar with literature on Kernel methods, the notion of a "parameter vector" is not conventional, but it is my device for motivating Kernels.

To motivate these ideas and make the discussion more concrete, I first show that the Gaussian set of functions, all with the same $\sigma$ and indexed over $\mu \in \mathcal{X}$, fit these three design choices.



## Gaussians have a Dot-product form

The values of the Gaussian function turn out to be a dot product between two infinite dimensional vectors.  The first vector is a vector-valued function of $\mu$, named as $\vec{\phi}(\mu)$.   The second, the same function of $x$, named as $\vec{\phi}(x)$.  Note that the $\sigma$ parameter to a Gaussian will determine $\vec{\phi}(\cdot)$ itself.  $\sigma$ is not an argument like $\mu$ is.  So, below we write the function as $\vec{\phi_\sigma}(\cdot)$.

To show this, we first show how the simpler formula $e^{axy}$ can be written as a dot product.  Then, using this first result, we show that $e^{-\half a(x-y)^2}$ can also be written as a dot product.  The Gaussian is just a scaled version with a special choice for $a$.

$$
\begin{aligned}
e^{axy} & = \sum_{i=0} { \dfrac{a^i(xy)^i}{i!} } & \mbox{Taylor expansion} \\
& = \sum_{i=0} { \dfrac{(a^\half x)^i}{(i!)^\half} \dfrac{(a^\half y)^i}{(i!)^\half} } & \mbox{Separate $x$ and $y$ terms to symmetric roles} \\
& = \sum_{i=0} { \psi_{a,i}(x) \psi_{a,i}(y) } & \mbox{Let $\psi_{a,i}(p) \equiv \dfrac{(a^\half p)^i}{(i!)^\half}$ }\\
& = \vec{\psi_a}(x) \cdot \vec{\psi_a}(y) & \mbox{Let $\vec{\psi_a}(p) \equiv (\psi_{a,1}(p), \psi_{a,2}(p), \cdots)$ } \\
\end{aligned}
$$

Now, using the first result for $e^{axy}$, and letting $y = \mu$:

$$
\begin{aligned}
e^{-\half a(x-\mu)^2} & = e^{-\half a(x^2-2x\mu+\mu^2)} \\[1em]
& = e^{-\half a x^2} e^{ax\mu} e^{-\half a \mu^2} \\[1em]
& = e^{-\half a x^2} ( \vec{\psi_a}(x) \cdot \vec{\psi_a}(\mu) ) e^{-\half a \mu^2} & \mbox{substitute formula above} \\[1em]
& = (e^{-\half a x^2} \vec{\psi_a}(x) \cdot e^{-\half a \mu^2} \vec{\psi_a}(\mu)) & \mbox{By bilinearity of dot product} \\[1em]
& = \vec{\phi_{\sigma}}(x) \cdot \vec{\phi_{\sigma}}(\mu) & \mbox{Let $\vec{\phi_{\sigma}}(p) \equiv e^{-\half a p^2} \vec{\psi_a}(p)$ with $a = {\small 1 \over \sigma^2}$} \\
\end{aligned}
$$

So we have $e^{-\tfrac{1}{2} {(\tfrac{x - \mu}{\sigma})}^2 }$ and all that remains is to scale both vectors by $\dfrac{1}{\sigma^\half (2 \pi)^{\small 1 \over 4}}$



In particular, the Gaussian $\mathcal{N}(x; \mu, \sigma)$ is reinterpreted as a two-argument function $k(x, \mu)$ parameterized by $\sigma$, symmetric in the roles of $x$ and $\mu$, that is: $\mathcal{N}(x;\sigma,\mu) = \mathcal{N}(\mu;\sigma, x)$.  In the *first design choice*, $\mu \in \mathcal{X}$ plays the role of indexing the family of functions.  The *third design choice* is proven.  The *second design choice*, that members of the family have arbitrary ability to produce linearly independent vectors of evaluation, has not been proven, but for the moment please accept it.

Note that the height at the peak of every Gaussian, the location where $x = \mu$, is the value of $\vec{\phi_\sigma}(\mu) \cdot \vec{\phi_\sigma}(\mu) \equiv \norm{\vec{\phi_\sigma}(x)}^2$, implying every feature vector has the same norm since peak heights are the same for all $x$.  To simplify the example further, the family of functions used in the worked example are scaled so that peak height = 1.  In particular this means the values of the dot products are simply the cosine of the angle between the two feature vectors, $\cos \theta_{\vec{\phi}(x), \vec{\phi}(\mu)}$.

The value of the Gaussian as $x$ moves far away from $\mu$ approaches zero.  This indicates the angle between the feature vectors asymptotically approaches $90^\circ$, but never reaches it.  The Gaussian is positive everywhere, therefore the angle ranges in $[0^\circ, 90^\circ)$ in the infinite dimensional feature space.  In particular, considering three far points $x_1, x_2, x_3$, their corresponding feature vectors $\vec{\phi}(x_1), \vec{\phi}(x_2), \vec{\phi}(x_3)$ are nearly mutually orthogonal while still having acute angles between them.  In the infinite dimensional feature space, it is possible to have arbitrarily many of these.  The vectors occupy some $\infty$-tant of the space (like an octant in $\mathbb{R}^3$), if you will.


## The mapping between input and Feature Space

There are two main aims of this article.  The first is to demonstrate that every aspect of Kernel methods is simply a consequence of the classic requirements acting through the three design choices.  The second is to use the worked example of the 1D Gaussian Kernel, and build the habit of simultaneously visualizing the shapes of the curves and their linear combinations in the data domain $\mathcal{X} \times \mathcal{Y}$, and their corresponding feature vectors in the feature space, visualizing angles, planes and lengths.

The following is a list of some of the facts tying the input to the geometry of the feature space.  It can be used as a reference while interacting with the visualizations.

Denoting the family of Gaussians (all with the same $\sigma$) as $\GSpace$, and the feature space as $\FeatSpace$:


1. **Every input has a feature vector**.  Every point $x \in \mathcal{X}$ corresponds to a feature vector $\vec{\phi_\sigma}(x) \in \FeatSpace$.

2. **Every function has a feature vector**.  Every function $f_{\mu_i}(\cdot) \in \GSpace$ corresponds to feature vector $\vec{\phi_\sigma}(\mu_i) \in \FeatSpace$.

3. **Every evaluation is a dot product of feature vectors**.  The evaluation $f_{\mu_i}(x)$ corresponds to the dot product $\vec{\phi_\sigma}(\mu_i) \cdot \vec{\phi_\sigma}(x)$.  It this worked example, since the feature vectors are unit norm, it is the cosine of the angle of feature vectors $\vec{\phi}(\mu_i)$ and $\vec{\phi}(x)$.  For example, $\theta = 0$ at the peak, and $\theta \rightarrow 90^\circ$ asymptotically towards $+ \infty$ or $- \infty$.

And, some consequences from this:

4. **A set of functions defines a linear subspace in feature space**.  For short, one could call this subspace the $\mu$-span.

5. **Every linear combination of those functions is a point in the $\mu$-span**.  The $\vec{\alpha}$ linear combination of functions $f_{\mu_i}(\cdot) \in \GSpace$ corresponds to the *same* $\vec{\alpha}$ linear combination of feature vectors $\vec{\phi_\sigma}(\mu_i)$.  Although the family functions all have the same feature vector length, in general a linear combination will not.  The goal is to find a single point in the $\mu$-span which fits the data and has other desirable properties.

6. **A set of inputs defines a linear subspace in feature space**.  For short, one could call this subspace the $x$-span.

7. **A set of input labels defines a point in that linear subspace**.  Every point $f$ in the $\mu$-span induces a tuple of dot-product values with the $\vec{\phi_\sigma}(x_i)$ of the $x$-span, which also corresponds to its projection $f_\parallel$ onto the $x$-span.  Those dot-product values correspond to the labels ($y_i$ values).

As a spoiler, it will be shown that the $\mu$-span and $x$-span are chosen to be the same subspace.  The motivation for this choice will be made clear, but it is helpful to distinguish the two conceptually at first.


## Interactive Figure 1

Figure 1 has three coordinated panels with different views of the same information.  In the main plot at the top, each gray curve is an individual Gaussian with mean $\mu_i$ indicated by the triangle at the top edge.  They all share the same $\sigma$, controlled by the slider.  Each gray curve is scaled by an $\alpha_i$ shown in a slider to the right.

You may drag any triangle to change $\mu_i$ and the corresponding gray curve will follow.  The $(x_i, y_i)$ points are shown as black circles.  You may change them as well.  If $\mu$ tracks $x$ is checked, the triangles will follow.

The blue curve is simply the sum of the gray curves.  Its shape is thus controlled by choices of the $\alpha_i$ and the $\mu_i$.  If auto solve is checked, the plot will set the $\alpha_i$ to values to fit the $(x_i, y_i)$ data.  While the sliders have a limited range for manual adjustment, the 'auto solve' may set them to very large values positive or negative values depending on the data.

The heatmap at the lower left is a complete space showing where the information in the main plot is situated.  It shows the values of all Gaussian curves of a particular $\sigma$, (0 to 1, white to blue scale).  Each horizontal line shows one curve centered at a particular $\mu$, with $\mu$ increasing downwards.  While the gray curves show the $\alpha_i$-scaled Gaussian, the heatmap shows these Gaussians unscaled so their peak height is 1.  In this worked example of 1D Gaussians, the heatmap depicts the entire family of functions indexed by points in the input domain $\mathcal{X}$

The red dots show the current locations of all combinations of $\mu_i$ and $x_i$.  The heatmap values at the dots in a particular row denote the *vector of evaluation* of Gaussian at $\mu_i$ - that is, height of the gray curve if its $\alpha_i$ were set to 1.  The matrix at the lower right shows these values, organized in the same way.  The same values can be seen as heights of the gray curves at each $x_i$.  Letting the matrix be $\mathrm{K}$, the vector of evalution of the blue curve is just $\alpha \mathrm{K}$.

Notice that if all $\mu_i = x_i$ (check $\mu$ tracks $x$s), then the diagonals of this matrix are equal to 1 since each unscaled curve has a peak height of 1 at $x_i = \mu_i$.  Furthermore the matrix is symmetric since $\mathcal{N}(x; \mu, \sigma) = \mathcal{N}(\mu; x, \sigma)$.  It is not symmetric when $\mu_i \ne x_i$ in general.



### Some experiments

Here are some experiments that I found are useful to build intuition.  In the experiments where $\sigma$ is not the focus, I'll omit the mention of $\sigma$ and abbreviate the feature vector notation $\vec{\phi_\sigma}(x)$ as $\vec{\phi_x}$.  For linear combinations of feature vectors, I'll use the name of the corresponding function.  For example, $f = \sum_i { \alpha_i f_{\mu_i} }$, with feature vector $\sum_i { \alpha_i \V{\phi_{\mu_i}}}$ will be simply notated $\vec{\phi_f}$.

**Interpolation behavior from a single point**.  Click 'Del Point' until there is a single gray curve.  With 'auto solve' checked, drag the black point up and down, and observe how the other values change.  Obviously, points x near $\mu$ change almost the same, while more distant points don't change much.  The central idea here is that height of the gray curve at arbitrary $x$ defines defines a kind of similarity with $\mu_i$.  The $\alpha_i$ scaled gray curve corresponds to the scaled feature vector $\alpha_i \vec{\phi_\sigma}(\mu_i)$.  Because the evaluations are dot products, and the dot product is linear in each argument, the values of the function at every $x$ scale as well.

Now, if you shrink $\sigma$, the similarity of a given point $x$ with $\mu_i$ goes down.  Shrinking $\sigma$ results in the shape of the feature vectors changing, although their norm stays the same.  With a very low $\sigma$, a smaller neighborhood of points are considered similar, and the rest of them don't move much when the value at $\mu_i$ is scaled.  $\sigma$ thus controls the similarity between $\mu_i$ and $x$ in relation to euclidean distance $|\mu_i - x|$.  In the $\sigma \rightarrow 0$ limit, the gray curve interpolates nothing.  In the $\sigma \rightarrow \infty$ limit, every point is considered identical with $\mu$.

Now, check 'scramble'.  The shape of the curve is now the same except that every other unit interval in $\mathcal{X}$ has been reversed.  This new shape is piecewise continuous.  Positioning the black point near a discontinuity and move it up and down, you can see that even points very close in $|\mu - x|$ distance are not as influenced.  The relation between influence of $\mu$ along the curve and euclidean distance from $\mu$ is no longer monotonic.

The notion that a similarity measure on pairs of points in $\mathcal{X}$ may not be related to the geometry of $\mathcal{X}$ is a central idea in kernel methods.  $\mathcal{X}$ need not be a continuous domain or even ordered in any way - the corresponding gray "curves" would not be curves in that case, but they would be capable of interpolating values assigned to points in the domain.  This gives kernel methods great flexibility.

**Interaction between Two Points**

Now increase to two points.  With '$\mu$ tracks $x$' and 'auto solve' checked, move the two data points well apart, and adjust $\sigma$ so the two gray curves are well separated - that is, such that the height at $\mu_2$ of $f_1$ is near zero, and vice versa.  The off-diagonal elements of the matrix at the bottom right should be nearly white.  The feature vectors $\vec{\phi_{\mu_1}}$ and $\vec{\phi_{\mu_1}}$ corresponding to these two functions are approaching right angles with each other.

Now drag one of the data points up and down.  You'll notice that only one of the $\alpha_i$ components moves to solve the curve.  In feature space terms, $\vec{\phi_{\mu_1}}$ and $\vec{\phi_{\mu_1}}$ are nearly orthogonal.  The goal is to find some linear combination $\vec{\phi_f}$ of them such that the signed length (displacement) of the projections $\disp{\proj{\V{\phi_f}}{\V{\phi_{x_i}}}} = y_i$.   Since the $x_i = \mu_i$, $\vec{\phi_{x_1}}$ and $\vec{\phi_{x_2}}$ are the same.  So, scaling one component $\alpha_1$ doesn't affect $\disp{\proj{\V{\phi_f}}{\V{\phi_{x_2}}}}$ and vice versa.  


Now move the points closer together, or increase $\sigma$, so that the off-diagonal elements are bluish.  Then, moving one of the points influences the other, and both $\alpha_i$ need to be adjusted to find the solution.  A limited visualizatoin of this is available in the second interactive figure.


**Exploding Norm**

The blue curve $f$'s associated parameter vector's norm is also called the *function norm*, shown as $\norm{f}$ below the main plot.  For the moment, let's consider only $\norm{f}$ and ignore $\norm{f_\parallel}$ and $\norm{f_\perp}$.

If you move one of the points very close to the other in the $x$ direction, but differing in height, the slope of the curve explodes, as does the magnitude of the $\alpha_i$ and $\|f\|$.  At a given setting for the $(x_i, y_i)$ with high norm, try reducing $\sigma$ until the curves are again well separated, and the function norm will shrink.

In feature space terms, this situation is the opposite of when $\V{\phi_{\mu_1}}$ and $\V{\phi_{\mu_2}}$ were nearly orthogonal.  Now, they are nearly parallel.  In order for some solution vector $\V{\phi_f}$ to achieve very different projection lengths against nearly parallel vectors, it has to be very long to exploit the slight difference in angle.

In semantic terms, one interpretation is, an exploding norm indicates the individual component curves overestimate the degree of similarity of that pair of data points, relative to their *actual* similarity which is a function of their $y_i$ values.  Adjusting $\sigma$ remedies this problem, at the expense of less interpolation.

Since this worked example is doing exact-fit linear regression, we aren't considering the possibility that the $y_i$ values may have noise.  If that is the case, the interpretation is more complicated.

**Changing $\mu$-span away from $x$-span**

Recall that $\V{\phi_f}$ resides in the $\mu$-span, the $n$-dimensional linear subspace $\mathbb{span}(\V{\phi_{\mu_i}})$.   and its projection, $\proj{\V{\phi_f}}{\mathbb{x-span}}$ resides in the $x$-span, $\mathbb{span}(\V{\phi_{x_i}})$.  Up until now, $\mu_i = x_i$ and the two spans coincide.  In that case, $\V{\phi_f} = \V{\phi_{f_\parallel}}$, and $\V{\phi_{f_\perp}} = \V{0}$.
If you unlock '$\mu$ tracks x', you can drag the triangles ($\mu_i$) or the data points and the two spans are allowed to differ, and the orthogonal decomposition of $f$ starts to show.  $\norm{f}$ still shows the length of $\V{\phi_f}$ which exists in the $\mu$-span, but the lengths of orthogonal decomposition $\V{\phi_f} = \V{\phi_{f_\parallel}} + \V{\phi_{f_\perp}}$ taken relative to the $x$-span is also shown.  In the limit, the spans are nearly orthogonal, and the parallel component is extremely small, forcing $\norm{f}$ to grow without bound in order to project onto the $x$-span any particular solution.

As mentioned before, this experiment is only for didactic purposes since Kernel methods assign the $\mu$-span to the $x$-span.  But, it is worth noting that any new unseen data resides in general outside of the $x$-span which is derived from the dataset.  This is a good illustration of why off-manifold data is hard to predict.



# Experiments to try with Figure 2

<Figure2 />

Figure 2 left panel shows the same plot with just two functions.  The right panel shows the 2d $\mu$-span, with the gray vectors denoting $\V{\phi_{\mu_1}}$ and $\V{\phi_{\mu_2}}$, and the blue vector $\V{\phi_f} = \sum_i { \alpha_i \V{\phi_{\mu_i}}}$.  The black dot on the right panel shows the parameter vector which fits the data.  Not shown are the $x$-span or the $\V{\phi_{x_i}}$.  However, when $\mu_i = x_i$, they coincide.  In this case, the black dotted lines show the length of the projection of $\V{\phi_f}$ onto each of the $\V{\phi_{\mu_i}}$, which equals $f(x_i)$.  There are a few informative experiments to try.

**Changing the angle between $\V{\phi_{\mu_1}}$ and $\V{\phi_{\mu_2}}$**.  If you drag one of the $\mu_i$ close to the other one, notice the angle between the gray vectors change.  Dragging them apart causes the gray vectors to asymptotically approach right angles.

**Nearly orthogonal $\V{\phi_{\mu_1}}$ and $\V{\phi_{\mu_2}}$ have independent contributions to the values of $f(\cdot)$ at each $\mu_i$**.  With 'auto solve' and '$\mu$ tracks x' checked, on the left panel, drag the black dots well apart on the $x$ axis.  Then, drag one dot up and down, observing the motion of the blue arrow on the right panel.  It moves back and forth in the direction of one of the $\V{\phi_{\mu_i}}$ while its projection against the other gray arrow remains nearly constant.

**Nearly parallel $\V{\phi_{\mu_1}}$ and $\V{\phi_{\mu_2}}$ have highly dependent contributions to the values of $f(\cdot)$ at each $\mu_i$**.  With 'auto solve' and '$\mu$ tracks x' checked, on the left panel, drag the black dots close together on the $x$ axis.  Now, move one of the dots up and down.  Observe that as the $y$ values of the dots widen, the blue vector on the right panel must grow very long to achieve the differing projection lengths.

## Proof that $\mu_i = x_i$ is optimal

Having highlighted the separate notions of the $\mu$-span and $x$-span for conceptual reasons, we now show that the optimal choice is to set the $\mu$-span equal to it.

The matrix form for a function $f$'s associated parameter vector $\V{\phi_f} = \B{\alpha M}$, with $\B{M}$ the matrix of row vectors $\V{\phi_{\mu_i}}$.  $f$'s *vector of evaluation* on the $x_i$ is then given by $\B{\alpha M X}^T$, where $\B{X}$ is similarly the matrix of row vectors $\V{\phi_{x_i}}$.  We now show why $\B{M} = \B{X}$ is the optimal choice.

Suppose $\B{\alpha M X}^T = \B{y}$ for some $\B{\alpha}$.  By the property of dot products:

$$
\begin{aligned}
\B{a} \cdot \B{b} & = (\proj{\B{a}}{\B{b}} + \rej{\B{a}}{\B{b}}) \cdot \B{b} & \mbox{orthogonal decomposition}\\
& = \proj{\B{a}}{\B{b}} \cdot \B{b} + \rej{\B{a}}{\B{b}} \cdot \B{b} & \mbox{linearity of dot product}\\
& = \proj{\B{a}}{\B{b}} \cdot \B{b} & \mbox{zero orthogonal contribution} \\
\end{aligned}
$$

In matrix form:

$$
\begin{aligned}
\B{\alpha M X}^T & = \B{\alpha} (\proj{\B{M}}{\texttt{span}(\B{X})} + \rej{\B{M}}{\texttt{span}(\B{X})}) \B{X}^T \\
& = \B{\alpha} \proj{\B{M}}{\texttt{span}(\B{X})} \B{X}^T
\end{aligned}
$$

$\proj{\B{M}}{}$ spans either the same subspace as $\texttt{span}(\B{X})$, or a subspace of it.  Thus, the choice of $\mu_i = x_i$ (or any choice of $\mu_i$ such that $\texttt{span}(\B{M}) = \texttt{span}(\B{X})$) will be able to fit any set of labels $\B{y}$ that any other choice of $\mu_i$ can fit, but possibly more.

Furthermore, as will be argued in the next section, any two functions having the same vector of evaluation, the one with smaller parameter norm is preferable.  The squared norm $\norm{\V{\phi_f}}^2$ is given by:

$$
\begin{aligned}
\B{\alpha M X}^T & = \B{\beta X X}^T = \B{y} &\mbox{a $\B{\beta}$ exists, by previous argument}\\
\norm{\V{\phi_f}}^2 & = \B{\alpha M M}^T \B{\alpha}^T \\
& = \B{\alpha} (\proj{\B{M}}{} + \rej{\B{M}}{}) (\proj{\B{M}}{} + \rej{\B{M}}{})^T \B{\alpha}^T \\
& = \B{\alpha} \proj{\B{M}}{} \proj{\B{M}}{}^T \B{\alpha}^T
+ 2 \B{\alpha} \proj{\B{M}}{} \rej{\B{M}}{}^T \B{\alpha}^T
+ \B{\alpha} \rej{\B{M}}{} \rej{\B{M}}{}^T \B{\alpha}^T \\
& \ge \B{\alpha} \proj{\B{M}}{} \proj{\B{M}}{}^T \B{\alpha}^T \\[1em]
& = \B{\beta X X}^T \B{\beta}^T & \mbox{by uniqueness of span}\\
\end{aligned}
$$



## Regularizing by Minimizing the Function Norm

There are two properties a function $f$ has related to its parameter vector norm $\norm{\V{\phi_f}}$.  The first is the overall magnitude (positive and negative) of its values.  The second is the magnitude of the difference between pairs of points, relative to how similar those points are by the measure of the family of functions.

To illustrate, consider two arbitrary inputs $a, b \in \mathcal{X}$.  How do  the magnitudes of values $|f(a)|$ and difference in values $|f(a) - f(b)|$ relate to the norm of its parameter vector?

$$
\begin{aligned}
f(a) & = \V{\phi_f} \cdot \V{\phi_a} & \mbox{definition of $f(x)$} \\
& = \norm{\V{\phi_f}} \|\V{\phi_a}\| \cos \theta_{\V{\phi_f},\V{\phi_a}} & \mbox{definition of dot product} \\
\implies |f(a)| & \le \norm{\V{\phi_f}}\|\V{\phi_a}\| & \mbox{Cauchy Schwarz inequality} \\[2em]
f(a) - f(b) & = \V{\phi_f} \cdot \V{\phi_a} - \V{\phi_f} \cdot \V{\phi_b} &\mbox{definition of $f(x)$} \\
& = \V{\phi_f} \cdot (\V{\phi_a} - \V{\phi_b}) & \mbox{bilinearity of dot product} \\
& = \norm{\V{\phi_f}} \|\V{\phi_a} - \V{\phi_b}\| \cos \theta_{\V{\phi_f}, \V{\phi_a} - \V{\phi_b}} & \mbox{definition of dot product} \\
\implies |f(a) - f(b)| & \le \norm{\V{\phi_f}} \|\V{\phi_a} - \V{\phi_b}\| & \mbox{Cauchy Schwarz inequality} \\
\end{aligned}
$$

The first inequality tells us that the magnitude of values of the function $f$ is bounded by a fixed multiple of $\norm{\V{\phi_f}}$.  The multiple itself, $\norm{\V{\phi_a}}$ we have no control over - it is determined by the choice of $\B{\phi}(\cdot)$.  But by controlling $\norm{\V{\phi_f}}$ we can control the range of values of $f$.

The second inequality tells us that the absolute difference in value between any two points is proportional to $\norm{\V{\phi_a} - \V{\phi_b}}$.  As the distance shrinks, the values will be equal.  By bounding $\norm{\V{\phi_f}}$, we can control how sensitive the function could be to distance between input feature vectors.

Conversely, if you demand the solution function fit a particular set of fixed $y_a$ and $y_b$ values, that is, $|f(a) - f(b)| = |y_a - y_b|$, then $\|\V{\phi_f}\|$ must grow to compensate for small $\|\V{\phi_a} - \V{\phi_b}\|$.  This is the behavior you observe by dragging one of the black dots close on the $x$ axis in 'auto solve' mode, while maintaining a fixed gap in height.  The norm of the function explodes.

It also says something about the choice of $\B{\phi}(\cdot)$.  Ideally, we would like to choose a $\B{\phi}(\cdot)$ such that $\norm{\V{\phi_a} - \V{\phi_b}}$ is roughy proportional to $|y_a - y_b|$ in the data set for all pairs $(a, b) \in \mathcal{X}$.


## Finally, enter the Kernel

Recall from the previous section that using $\B{M} \equiv \B{X}$ as the set of parameter vectors ensures 1) the method has arbitrary fitting capacity and 2) the solution will be the lowest norm solution possible.  So we have the following:

$$
\begin{aligned}
\B{X} & & \mbox{matrix of rows of $\V{\phi_{x_i}}$ as defined before} \\
\V{\phi_f} & = \B{\alpha X} & \mbox{$f$'s parameter vector}\\
(f(x_i))_{(1..n)} &= \B{\alpha X X}^T & \mbox{$f$'s vector of evaluation } \\
\end{aligned}
$$

To find $\B{\hat \alpha}$, solve:

$$
\begin{aligned}
\B{\hat{\alpha}} & = \min_{\alpha} { \norm{\B{\alpha X X}^T - \B{y}}^2 }
\end{aligned}
$$

This will minimize to zero if the assumptions above hold.  To compromise between a perfectly fitting function and the bounds the norm provides, instead solve:

$$
\begin{aligned}
\B{\hat{\alpha}} & = \min_{\alpha} ( \norm{\B{\alpha X X}^T - \B{y}}^2 + \lambda \norm{\B{\alpha X}}^2 ) & \mbox{sum of squared error, regularized by norm of $\V{\phi_f}$}\\
& = \min_{\alpha} ( \norm{\B{\alpha X X}^T - \B{y}}^2 + \lambda \B{\alpha X X}^T \B{\alpha}^T )
\end{aligned}
$$

Finally, to evaluate the function on new data:

$$
\begin{aligned}
f(x) & = \V{\phi_f} \cdot \V{\phi_x} \\
& = \B{\hat{\alpha} X} \cdot \V{\phi_x} \\
& = \sum_i { \hat{\alpha}_i \V{\phi_{x_i}} \cdot \V{\phi_x} } \\
\end{aligned}
$$


So we see that the only quantities dependent on the $\mathcal{X}$ data are dot products $\V{\phi_{x_i}} \cdot \V{\phi_{x_j}}$, appearing in the $\B{X X}^T$ terms or the solution function.  Finally, we define a function called the "kernel" as:

$$
\begin{aligned}
k(x,x') & \equiv \V{\phi_x} \cdot \V{\phi_{x'}} & \mbox{The kernel function} \\
\B{K} & \equiv [ \B{K}_{ij} = k(x_i, x_j) ] & \mbox{The Kernel matrix, metric matrix or Gram matrix} \\
& = \B{X X}^T & \mbox{from above}
\end{aligned}
$$

Then, the general optimization formula simplifies to:

$$
\begin{aligned}
\B{\hat{\alpha}} & = \min_{\alpha} ( \norm{\B{\alpha K}- \B{y}}^2 + \lambda \B{\alpha K} \B{\alpha}^T )
\end{aligned}
$$

and evaluating the solution function is now written as:

$$
\begin{aligned}
f(x) & = \sum_i { \hat{\alpha}_i k(x_i, x) } \\
\end{aligned}
$$

Returning back to the plot, you can see that the blue curve evaluated at any given $x$ is the $\B{\alpha}$ weighted sum of scaled gray curves - individual Gaussians with means equal to the $x_i$'s.  Since $k(x, x') \equiv \mathcal{N}(x; x', \sigma) = \mathcal{N}(x'; x, \sigma)$, the expression above is precisely that.

# Summary and Conclusion

The Kernel Method allow discovering a function to fit an arbitrary data relationship $\mathcal{X} \times \mathbb{R}$, while at the same time providing a computable means to bound the function's overall magnitude at individual inputs, and the magnitude of the difference at pairs of inputs.

Kernel methods achieve this by automatically providing a library of functions, one for each $x_i$ in the data set.  When each is evaluated on the $x_i$, they provide linearly independent sets of values.  Thus a unique linear combination of these functions exists to fit any set of target values $y_i$ at the $x_i$.

The functions are defined as dot products between "feature vectors": $f_{x_i}(x) \equiv \V{\phi_{x_i}} \cdot \V{\phi_x}$.  This has three main benefits:

1. It is possible to prove, using linear algebra alone, that a perfect-fitting solution exists and is of minimal norm.

2. For further regularization, the Cauchy Schwarz inequality shows the "function norm" provides bounds on magnitude of values and differences of pairs of values.

3. Data fitting and regularization are now purely linear problems, and the arsenal of linear optimization techniques can be applied.




# Recommended reading and Notes

In the above essay I intentionally avoided some of the terminology and names of theorems.  When I was learning about Kernel methods, I found that they seemed to hint at giving insight, but ultimately they did not.  Here are some of the concepts, linking them to the above, or a critique why I didn't include them in the main text.


## Positive (semi)Definite matrices

It turns out that all square matrices, if they can be written as the product $XX^T$ for some $X$, are either positive definite (if all rows of $X$ are linearly independent), or positive semidefinite (if the rank of $X$ is less than its number of rows).  Since the central idea of Kernel methods is constructing functions as dot products, it seemed much more of essence to focus on the construction $XX^T$ itself.  This also makes clear why the definition of p.s.d, namely that $\alpha K \alpha^T \ge 0$ for all $\alpha$ implies that $K = XX^T$ for some $X$:  The $X$ are simply a basis in a subspace, $\alpha X$ is a vector, and $\alpha X X^T \alpha^T$ is the dot product of the vector with itself - its length squared.

## The Kernel Trick

The "kernel trick" is the idea that a kernel function $k(x, x') \equiv \V{\phi_x} \cdot \V{\phi_x'}$ can be evaluated without actually evaluating the feature vectors and taking their dot product.  While this is important for computational efficiency, it ultimately is uninformative for the purposes of understanding Kernel methods.  Indeed, the Kernel trick doesn't magically allow one to compute exact Gaussian values - doing so would require an infinite amount of computation.  So, whether or not a given kernel has an infinite or finite dimensional feature space, and whether it is implemented approximately or exactly, doesn't really decide its usefulness as a kernel.  In short, the kernel trick is just one form of mathematical shortcut (if it exists), and doesn't really enlighten one as to the nature of Kernel methods.  One could use a Kernel that has only finite capacity and no known Kernel trick, and it could still be a valid Kernel.


## Distinction between Feature Space and Reproducing Kernel Hilbert Space

In my reading, I found the discussion of feature space and the 'Hilbert space' (from the RHKS) blurred together.  They are distinct mathematical entities.  Although more subtle results in Kernel research are proved with the help of the RKHS, I didn't feel the basics were much helped by them.  But, in the theory elements in the RKHS map one-to-one to elements in feature space and to functions in input space, so they are sometimes spoken of interchangeably.

In an effort to disambiguate them, here is a summary.  In Kernel Methods, functions $f_{x_i}(\cdot): \mathcal{X} \mapsto \mathbb{R}$ *correspond one-to-one* with feature vectors $\V{\phi_{x_i}}: \mathbb{R}^\infty \equiv \mathcal{F}$, because of their definition as a dot product.  As any vector space, the feature space has an inner product defined on it, which is the simple dot product, and the *kernel matrix* $K$ is the matrix of inner products on a basis $(\V{\phi_{x_i}})$, the $x_i$ from the dataset, in this feature space.

Separately from this, the function itself, $f_{x_i}(\cdot)$ associates one real value for each $x \in \mathcal{X}$.  This collection of values could be viewed as the components of *another* infinite-dimensional vector.  In conventional notation, $f_{x_i}(\cdot): \mathbb{R}^\mathcal{X}$.  This is like $\mathbb{R}^3$,  but instead of 3 real components, $|\mathcal{X}|$ components.  Then, the function is not merely *corresponding to a vector* but *is* a vector.  The space $\mathbb{R}^\mathcal{X}$ of such functions-as-vectors is known as the Hilbert Space $\mathcal{H}$.  It has a specific inner product defined on it which links it up to the original feature space: $\langle f_{x_i}, f_{x_j} \rangle \equiv \V{\phi_{x_i}} \cdot \V{\phi_{x_j}} \equiv f_{x_i}(x_j) \equiv f_{x_j}(x_i)$.

Now that the Hilbert space has a set of basis vectors $(f_{x_i})$, and an inner product, a Kernel matrix $K:[K_{ij} = f_{x_i}(x_j)]$ can be defined.  But now, note that the rows and columns of the Kernel matrix are vectors of values.  Unlike the feature space, where the rows of the kernel matrix were not of the same type as the vectors in the space itself, in the Hilbert space they are.  Therefore, $KK^T = K$, because this is just a set of inner products between two rows.   This is what gives rise to the phrase "Reproducing Kernel".  See https://arxiv.org/pdf/1408.0952.pdf.

## Representer Theorem

In the parlance of RHKS theory, the point $f_x \in \mathcal{H}$ corresponding to a given $x \in \mathcal{X}$ is called $x$'s *representer* of evaluation, and more generally, any point in $\mathcal{H}$ is a *representation* of some function in an abstract way.  So, the Representer Theorem asserts that an optimal solution to a data fitting problem exists in the span of the representers of the data.  That is, in the span of $(f_{x_i})$.  The section on this article proving through orthogonal decomposition, that setting $\B{M} = \B{X}$ results in the minimum norm solution without any loss of expressive power, is a simplified version of this theorem.  For more detail, see:  https://alex.smola.org/papers/2001/SchHerSmo01.pdf



