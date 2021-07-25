
# An illustration of Kernel Regression

In the interactive figure, data points $(x_i, y_i)$ are shown as black dots.  There is one Gaussian centered at each $x_i$.  The blue curve is a linear combination $(\alpha_1, \cdots, \alpha_n)$ of these Gaussians.  Each slider controls one of the $\alpha_i$.

You can adjust the sliders to make the blue curve perfectly fit the $y_i$.  It may be surprising to note that a unique, perfect-fitting $\alpha$ exists for any set of $(x_i, y_i)$ and for any number of points.

To see why, note that each gray curve's set of values along the $x_i$ produces a vector.  (You can toggle the 'points' checkbox to see these.  Denoting the j'th curve as $k_j(x)$, the set of values it produces is $(k_j(x_1), k_j(x_2), \cdots, k_j(x_n))$.  Particularly for a collection of Gaussians all with the same $\sigma$, the set of these $n$ vectors are linearly independent.  This is not at all obvious, but please accept it for now.  Then, by the linear algebra expansion theorem, they span $\mathbb{R}^n$ and so can form any set of $(y_i)$.

Explicitly:

$
\begin{aligned}
k_j(x) & & \mbox{Gaussians centered at $x_j$, $j = 1 .. n$} \\
f(x) & \equiv \sum_j { \alpha_j k_j(x) } & \mbox{the blue curve}\\
f(x_i) & = \sum_j { \alpha_j k_j(x_i) } = y_i & \mbox{fitting the blue curve to the black points} \\
\B{\alpha K} & = \B{y} , & \mbox{defining $K_{ji} \equiv k_j(x_i)$, same equations, in matrix form} \\
\end{aligned}
$

The $\B{\alpha}$ that fits the data perfectly is found by inverting $\B{K}$, which is possible because $\B{K}$ is full-rank.  That is, its rows are linearly independent, due to the property of a collections of Gaussians of the same $\sigma$.  Even though we are taking linear combinations of functions, it is only the tuple of function values $(f_j(x_1), \cdots, f_j(x_n))$ which affects the choice of $\B{\alpha}$.

## Some Observations

**This method can fit any set of data in $\mathbb{R} \times \mathbb{R}$.**  Given a *particular* set $x_i$, you could hand-pick a set of functions $k_j(\cdot)$ which happen to produce linearly independent vectors $(k_j(x_i))$ of evaluation on that particular data set.  However, the procedure shown above can fit any data set $(x_i, y_i)$.  This is useful because it would be laborious to have to hand-pick functions for each new data set.

**There is nothing (yet) special about the Gaussians being centered at the $x_i$**.  It turns out that *any* choice of $n$ Gaussians will span $\mathbb{R}^n$ when evaluated at any $n$ values.  There *is* indeed something special about the Gaussians being centered at the $x_i$, but it has nothing to do with the ability to fit arbitrary data.

**Many functions have this infinite capacity**.  Not just Gaussians, but many other families of functions have this capacity to perfectly fit any data, due to the vectors of evaluation being linearly independent.  Not only that, but families of functions can be found for many different domains, not just $\mathbb{R}$ as shown above.   Both discrete and continuous domains, and of arbitrary dimensions.

**Linear independence is preserved under permutation of components**.  The Gaussians are able to fit any data because they produce vectors that are linearly independent.  But, note that vectors that are linearly independent would still be so, after you permute their elements all in the same way.  For vectors, there is no meaning to the ordering of the elements.  To illustrate, click the 'scramble' button.  This reorders the x-axis in one-to-one fashion by reversing the order of every other interval of some fixed size.  Or think of it as re-ordering the components of the Gaussian "vectors" all in the same way, preserving their linear independence.  You can still click 'solve' and a unique solution exists.

Of course, these permuted Gaussians don't have the same relationship with the original data, so there will be a different $\B{\alpha}$ solution.  This is only to show that the continuity or shape of the original Gaussians is not what gives them this capacity to fit arbitrary data.


## A set of spanning functions for general $\mathcal{X}$

In the plot above, our input domain happened to be $\mathbb{R}$.  But for an arbitrary data set with input domain $\mathcal{X}$, we need a source of arbitrarily many distinct functions - as many as there are elements of $\mathcal{X}$.  So it is natural then, that each function correspond to some $x \in \mathcal{X}$.  We could plot all of the functions' values on $\mathcal{X}$ in a heatmap $\mathcal{X} \times \mathcal{X} \mapsto \mathbb{R}$.  In the example above, the individual functions $k_i(x)$ were unit $\sigma$ Gaussians centered at $x_i$.  So, the curves above would correspond to rows in this heatmap:

[Show heatmap]

Recall the statement earlier that any $n$ Gaussians of the same $\sigma$ produce linearly independent vectors when evaluated at any $n$ points.  From the heatmap, this means that, if you choose any $n$ rows and any $n$ columns, the matrix produced from the intersections will be full-rank, thus will allow a unique solution for any set of desired target values.



## Part 1 - Motivating example.  Functions as vector spaces

Functions, and vectors, are really just tuples of values.  Each component of the tuple is identified somehow.  For vectors, say $\B{v} \in \mathbb{R}^3 = (3, \tfrac{4}{3}, 7)$, we write $v_1$ or $v_x$ or $v[1]$, and say "the first component of the vector", or "the x-component".  The names of the components are arbitrary and have no other purpose than to identify each component.  There is no value implied, or ordering, or distance between them.  There is no sense in which the component called "2" is twice as big as component "1".

The general tuple description of $\B{v}$, with the components labeled, would be:

$
\begin{aligned}
(v_1, v_2, v_3) & \in \mathbb{R}^{\{1, 2, 3\}} \\
(v_x, v_y, v_z) & \in \mathbb{R}^{\{x, y, z\}} \\
(v_{s_1}, v_{s_2}, v_{s_3}) & \in \mathbb{R}^\mathcal{S} \, & s_i \in \mathcal{S} \equiv \{ x, y, z \} \\
\end{aligned}
$

The tuple is an element of the set $\mathbb{R}^\mathcal{S}$.  $\mathbb{R}^\mathcal{S}$ itself is a $|\mathcal{S}|$-way cartesian product of the set $\mathbb{R}$, that is:  $\mathbb{R}^\mathcal{S} \equiv \mathbb{R} \times \mathbb{R} \times \cdots \mathbb{R}$, one more cross for each element of $\mathcal{S}$.
