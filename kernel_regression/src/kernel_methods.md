## Latex Commands

$
\newcommand\B[1]{\boldsymbol{#1}}
\newcommand\len[1]{\|#1\|}
\newcommand\ang[1]{\theta_{#1}}
\newcommand\dist{\mathrm{dist}}
\newcommand\proj{\mathrm{proj}}
$


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

When $\mathcal{S}$ is a set of unrelated identifiers like "x", "y", "z", it is easier.  But when $\mathcal{S}$ is, say $\mathbb{R}$ itself, cognitive dissonance sets in.  But, there is nothing stopping you from identifying components using real numbers, or anything identifiable.

And, on the flip side, there is nothing stopping you from defining a function on a domain of arbitrary things.  Domains don't need to be ordered or continuous or even numbers.

So, to sum up, a *real valued function $f$ defined on a domain $\mathcal{X}$*, is notated $f: \mathcal{X} \mapsto \mathbb{R}$.  It is also a *tuple of real values indexed by the elements of $\mathcal{X}$*.  The tuple itself is an element of the product set $\mathbb{R}^\mathcal{X}$.  The expressions $\mathcal{X} \mapsto \mathbb{R}$ and $\mathbb{R}^\mathcal{X}$ are equivalent.  The tuple has the same "number" of components as $|\mathcal{X}|$, which can be finite (e.g. {"x", "y", "z"}), countably infinite (e.g. $\mathbb{N}$), or uncountably infinite (e.g. $\mathbb{R}$).  $\mathcal{X}$ can even be multi-dimensional, such as $\mathbb{R}^n$.  The only requirement is that $\mathcal{X}$ be a set.  In general, the size of a product set, $|\mathcal{A}^{\mathcal{B}}| \equiv |\mathcal{A}|^{|\mathcal{B}|}$, which is only defined for finite sizes, but the definition provides some intuition.  Explicitly:

To emphasize, nothing has been created here.  The vector definition of a function is completely equivalent to the traditional "mapping" definition.  But, having recognized functions are vectors, one can now apply linear algebra to them in a more straightforward manner.  For example:

$
\begin{aligned}
\B{B} & \equiv \{\B{b}_1, \B{b}_2, \cdots, \B{b}_n\} \subset \mathbb{R}^\mathcal{X} & \mbox{a set of "basis" functions}\\
\texttt{span}(\B{B}) & \equiv \{ \B{f}: \B{f} = \sum_i { \alpha_i \B{b}_i } \, \forall \, \mathbb{\alpha} \in \mathbb{R}^n \} & \mbox{a linear subspace spanned by $\B{B}$} \\[2em]
\end{aligned}
$

Even though the elements of $\texttt{span}(\B{B})$ are infinite-component tuples, they exist in an n-dimensional linear subspace.



### Linear independence

A set of vectors (i.e. functions) $\B{B} \equiv \{\B{b}_1, \B{b}_2, \cdots, \B{b}_n\} \subset \mathbb{R}^\mathcal{X}$ is said to be *linearly independent* if the only linear combination of them which produces the zero vector (all components zero) is the zero linear combination.

$\B{b}_i$ linearly independent $\Longleftrightarrow$ $\sum_i { \alpha_i \B{b}_i } = \B{0} \implies \B{\alpha} = \B{0}$

There can be no more than $n$ $n$-component linearly independent vectors.  Although there are an infinite number of linearly independent vectors with infinite components (functions on domain $\mathbb{N}$ or $\mathbb{R}$, for example), we are interested in evaluating and fitting such functions at a finite number of locations.  If you evaluate some function $f$ at locations $x_1, x_2, \cdots, x_n$, you have an $n$-component vector which is a *slice* of the original function vector.  Explicitly:

$
\begin{aligned}
\mathcal{S} \subset \mathcal{X} & \equiv \{ cat, hat, the \} & \mbox{subset of that set} \\
\texttt{slice}_\mathcal{S}(\B{f}) & = (f_{cat}, f_{hat}, f_{the}) & \mbox{subset of components of $\B{f}$, defined by $\mathcal{S}$ } \\[1em]
\end{aligned}
$

Again, by linear algebra, you cannot have more than $n$ linearly independent $n$-component slices of functions.

### Linear independence of arbitrary n-slices of functions

When using Kernel methods, we will be evaluating functions at specific locations given by the training data set, $\{x_1, x_2, \cdots, x_n\}$, and there is no way to know those locations in advance.  Fortunately, there are functions which produce linearly independent n-slices, for any slice, and any size $n$.  This gives the final space of functions the ability to fit any set of target values $\{y_1, y_2, \cdots, y_n\}$.





## Part 2 - Examples of linear problems

Kernel methods are used for PCA, CCA, K-means, Regression, separating hyperplanes (SVM).  All of these involve finding an optimal point in a space using linear optimization methods.  If possible, show how the inner product is used in some of these formulas.

## Kernel Ridge Regression

## Kernel Linear Regression

## Kernel PCA

Mairal Lecture 9

## Kernel K-means and CCA

Mairal Lecture 10

$\max\limits_{\alpha \in \mathbb{R}^n, \beta \in \mathbb{R}^n} \dfrac{\alpha^T K_\alpha K_\beta \beta}{(\alpha^TK_\alpha^2 \alpha)^{\frac{1}{2}} (\beta^T K_\beta^2 \beta)^{\frac{1}{2}} }$

See Gong and Lazebnik:  https://arxiv.org/pdf/1212.4522.pdf

## Large Margin Classifiers

In binary classification, the *margin* of the function $f$ for $(x, y)$ is $\mu = y f(x)$.  The loss is a decreasing function of the margin: $\phi(\mu)$.

Method | $\phi(\mu)$
--------| -------------
Kernel Logistic Regression | $\log(1 + e^{-\mu}$
1-SVM (hinge loss) | $\max(1-\mu, 0)$
2-SVM | $ \max(1-\mu, 0)^2$
Boosting | $e^{-\mu}$

In all these, we solve:

$
\begin{aligned}
& \min_{f \in \mathcal{H}} { \dfrac{1}{\mu} \sum { \phi(y_i f(x_i)) + \lambda \|f\|^2_{\mathcal{H}} } } \\
f(x) & = \sum { \alpha_i K(x_i, x) } & \mbox{By representer theorem}\\
& \min_{\alpha \in \mathbb{R}^n} { \dfrac{1}{n} \sum { \phi(y_i [K\alpha]_i) + \lambda \alpha^T K \alpha } } & \mbox{plugging in}\\
\end{aligned}
$

The idea of support vectors is to make $\alpha$ sparse, and only non-zero components for samples that are hard to classify (close to the separating hyperplane):

$f(x) = \sum { \alpha_i K(x_i, x) } = \sum\limits_{i \in SV} { \alpha_i K(x_i, x) }$


Kernel Logistic Regression is a large-margin classifier.

## Neural Tangent Kernel

See https://arxiv.org/abs/1806.07572




## Part 3 - The choice of functional form and the inner product and its consequences


Suppose our goal is to find a technique which can perfectly fit any amount of any data $\{(x_1, y_1), (x_2, y_2), \cdots, (x_n, y_n)\}$ with $(x_i, y_i) \in \mathcal{X} \times \mathbb{R}$, with $\mathcal{X}$ an arbitrary set, $n$ arbitrary.  And, nothing is assumed about the relationship $P(Y|X)$.

Taking the approach outlined above, we want a source that provides $n$ functions on $\mathcal{X}$ which are linearly independent across arbitrary n-slices, and in particular the n-slice defined by the data $\{x_i\}$.   By the expansion theorem of linear algebra, we can find some linear combination of them which perfectly fits the $\{y_i\}$.  In terms outlined above, we will be searching for some function $f$ in a linear subspace of $\mathbb{R}^\mathcal{X}$, which is a linear combination of the $n$ starting functions.


In this example, we seek a function which exactly fits the data, which, because of linearity, is the unique solution.  However, in a more general case, we may settle for a function that only fits approximately, while at the same time satisfying some regularization criterion.  The particular choice of regularization in Kernel methods is to either penalize or constrain the slope of the final function to be small - in other words, to favor "smoothly varying functions".  To do this, two simultaneous design choices are made, which work together in an interlocking way.  This is the hardest part to understand about Kernel methods, but it is nonetheless a design choice with practical benefits.

First, the source of functions is chosen to be of the form $f_{\B{p}}(x) \equiv \B{p} \cdot \B{\phi}(x)$.  That is, as a dot product between a parameter vector and a vector-valued function of the input.

Second, an inner product on the space of functions is defined to be $\langle f_\B{p}, f_\B{q} \rangle \equiv \B{p} \cdot \B{q}$.

The form of the source functions $f_\B{p}(\cdot)$ is a dot product between two vectors in a so-called "feature space".  The vector valued function $\B{\phi}(\cdot)$ is determined at the beginning, and is a fixed function throughout the procedure with no trainable parameters.  Therefore, there is a one-to-one correspondence between the parameters $\B{p}$ in this feature space, and the resulting functions $f_\B{p}(\cdot)$ in the function space.

The feature space will be denoted $\mathcal{F}$, equipped with an inner product defined as the dot product.  If we think of $\B{\phi}(\cdot) = \{\phi_1(\cdot), \phi_2(\cdot), \cdots\}$, then each $\phi_i(\cdot)$ defines a feature and indexes a different component of the vectors in $\mathcal{F}$.  So we write $\mathcal{F} = \mathbb{R}^{\{\phi_1(\cdot), \phi_2(\cdot), \cdots\}}$.

A different space, the space of functions $f: \mathcal{X} \mapsto \mathbb{R}$ will be denoted $\mathcal{H}$, for *Hilbert* space.  So, $\mathcal{H} = \mathbb{R}^\mathcal{X}$.  As mentioned, it is endowed with inner product $\langle f_\B{p}, f_\B{q} \rangle_\mathcal{H} \equiv \B{p} \cdot \B{q}$.  Note that our "solution function" which fits the data will lie in an $n$-dimensional linear subspace of $\mathcal{H}$ spanned by a set of $n$ "basis functions", which we define below.

Note that some literature takes $\mathcal{F} \equiv \mathbb{R}^{\{\phi_1(\cdot), \phi_2(\cdot), \cdots\}}$ to be *the* Hilbert space, and implicitly treats the points in that space as functions on the domain $\mathcal{X}$ even though they are over the domain of features.  Technically, $\mathcal{F}$ *is* a Hilbert space, because it is a vector space endowed with an inner product.  But, it is not the Hilbert space where we search for a function.  But as it turns out, there is a bijection between elements in the linear span of basis functions in $\mathcal{H}$ with the linear span of basis parameter vectors in $\mathcal{F}$.  So, authors speak as though they are the same.  For example, see Learning with Kernels, Smola and Scholkopf.


Other authors, especially those focused on the theory of RKHS, speak of the Hilbert space as $\mathcal{H} \equiv \mathbb{R}^\mathcal{X}$.  For example, see "A Primer on Reproducing Kernel Hilbert Spaces" by Manton and Amblard.  I prefer to distinguish $\mathcal{F}$ from $\mathcal{H}$ to avoid confusion.



NEED TRANSITION HERE

So, we need $n$ "basis" functions $(f_{\B{p}_1}, f_{\B{p}_2}, \cdots, f_{\B{p}_n})$, and we want them to have linearly independent n-slices on the dataset.  Using the chosen form of the functions, we now construct the $n \times n$ matrix, each row an n-slice of the i-th function.  In matrix form:

$
\begin{aligned}
\B{K} & \equiv
\begin{bmatrix}
\B{p}_1 \cdot \B{\phi}(x_1) &
\B{p}_1 \cdot \B{\phi}(x_2) &
\cdots & 
\B{p}_1 \cdot \B{\phi}(x_n) \\
\B{p}_2 \cdot \B{\phi}(x_1) &
\B{p}_2 \cdot \B{\phi}(x_2) &
\cdots &
\B{p}_2 \cdot \B{\phi}(x_n) \\
& & \cdots \\
\B{p}_n \cdot \B{\phi}(x_1) &
\B{p}_n \cdot \B{\phi}(x_2) &
\cdots &
\B{p}_n \cdot \B{\phi}(x_n) \\
\end{bmatrix}
& =
\begin{bmatrix}
- \B{p}_1 - \\
- \B{p}_2 - \\
\cdots \\
- \B{p}_n - \\
\end{bmatrix} 
\begin{bmatrix}
- \B{\phi}(x_1) - \\
- \B{\phi}(x_2) - \\
\cdots \\
- \B{\phi}(x_n) - \\
\end{bmatrix}^T \\[1.5em]
\end{aligned}
$



So the rows of $\B{K}$ represent the data n-slices of each of our $n$ starting functions.  To ensure we can fit any data $\{y_i\}$, the rows must be linearly independent.  What to choose for the $\B{p}_i$?  If the $\B{\phi}(x_i)$ are linearly independent, then it turns out [Show Proof] that we can achieve linear independence of the rows of $\B{K}$ by simply choosing $\B{p}_i = \B{\phi}(x_i)$.  This is excellent, because it means that all parameter vectors covering the space of all possible target values is of the form $\B{p} = \sum_i{\alpha_i \B{p}_i}$ for some $\B{\alpha}$.  So the only free parameters in the entire procedure will then be the $\B{\alpha}$ coefficients.  Using this choice for the $\B{p}_i$, the basis functions become:

$f_{p_i}(x) \equiv \B{\phi}(x_i) \cdot \B{\phi}(x)$

and all functions of interest are in $\texttt{span}(f_{p_i})$, an $n$-dimensional linear subspace of $\mathcal{H}$, of the form:

$f(x) = \sum_i { \alpha_i f_{p_i}(x) }$


But, $\B{\phi}(\cdot)$ must be a special vector valued function.  To have infinite capacity, it must have an infinite number of components.  Even more, it must be able to produce a linearly independent set for any set of distinct $x_i$.  Assuming $\B{\phi}(\cdot)$ has this property, the overall approach has unlimited capacity to fit any data.

The second requirement is the ability to limit the absolute value of the range of the final function.  The function itself is a dot product, and the Cauchy Schwarz inequality gives an upper bound on the dot product in terms of the norm of its arguments.  But, conveniently, by defining the inner product as the dot product of parameter vectors, the norm of the function becomes the norm of the parameter vector.  Therefore:

$
\begin{aligned}
f_\B{p}(x) & \equiv \B{p} \cdot \B{\phi}(x) & \mbox{definition} \\
|f_\B{p}(x)| & \le \| \B{p} \|_\mathcal{F} \| \B{\phi}(x) \|_\mathcal{F} & \mbox{Cauchy Schwarz} \\
& \equiv (\sqrt{\B{p} \cdot \B{p}}) \| \B{\phi}(x) \|_\mathcal{F} & \mbox{definition of norm on $\mathcal{F}$} \\
& \equiv (\sqrt{\langle f_\B{p}, f_\B{p} \rangle_\mathcal{H}}) \| \B{\phi}(x) \|_\mathcal{F} & \mbox{definition of inner product on $\mathcal{H}$} \\
& \equiv \|f_\B{p}\|_\mathcal{H} \| \B{\phi}(x) \|_\mathcal{F} & \mbox{definition of norm on $\mathcal{H}$} \\[1em]
\end{aligned}
$





## Part 4 - Expressions using the Kernel and what they solve for geometrically

Show the following.  The Kernel matrix (Gram Matrix) represents both the set of all inner products of pairs of basis functions, and the value of each basis function evaluated at its representative input.

The two-argument Kernel function can be thought of as a function generator that generates a family of one-argument functions.  So the expression $f(x) \equiv \alpha_1 K(x_1, x) + \cdots + \alpha_n K(x_n, x)$ can be thought of as a linear combination of one-argument functions.

Then, the vector of evaluations $(f(x_1), f(x_2), \cdots, f(x_n))$ can be expressed in matrix form as:

$(f(x_1), f(x_2), \cdots, f(x_n)) = \alpha \B{K}$

What is more strange is, the way to calculate $\|f\|^2$.  This is the inner product of f with itself.

$
\begin{aligned}
\|f\|^2 & \equiv \langle f, f \rangle \\
& = \sum_i { \alpha_i \B{\phi}(x_i) } \cdot \sum_i { \alpha_i \B{\phi}(x_i) } & \mbox{by definition of our inner product}\\
& = \sum_i { \sum_j { \alpha_i \alpha_j \B{\phi}(x_i) \cdot \B{\phi}(x_j) } } & \mbox{by bilinearity of the dot product}\\
& = \sum_i { \sum_j { \alpha_i \alpha_j K(x_i, x_j) } } & \mbox{by definition of Kernel} \\
& = \alpha^T K\alpha & \mbox{by matrix convention}\\[0.8em]
& = \alpha^T F^T F \alpha
\end{aligned}
$



# Geometric Justification for the inner product as a concept

This is due to MathTheBeautiful Youtube Channel.

The geometric justification for the inner product proceeds in five steps:

* Given abstract vectors $a$ and $b$, write the Pythagorean formula for $\len{a-b}$
* Expand the terms to the same form
* define the expression for the inner product
* Notice that it is symmetric and bilinear, by definition
* Use these to rewrite and simplify the formula

Without a visualization, assume we have abstract vectors $a$ and $b$, and we know their lengths $\len{a}$ and $\len{b}$ and the angle $\ang{ab}$ between them, but nothing else.  We do not have any notion of the vectors as tuples of coordinates, for example.  They are purely geometric concepts.  Then we have:

$
\begin{aligned}
\len{b} \cos\ang{ab} & \equiv \len{\proj_a b} & \mbox{geometric definition of cosine} \\
\len{b} \sin\ang{ab} & \equiv \len{\proj_{a\bot} b} & \mbox{geometric definition of sin} \\[1em]
\len{a-b}^2 & = (\len{a} - \len{\proj_a b})^2 + \len{\proj_{a\bot} b})^2 & \mbox{Pythagoras definition of distance}\\
& = (\len{a} - \len{b}\cos\ang{ab})^2 + (\len{b}\sin\ang{ab})^2 \\
& = \len{a}^2 - 2\len{a}\len{b}\cos\ang{ab} + \len{b}^2\cos^2\ang{ab} + \len{b}^2\sin^2\ang{ab} \\
& = \len{a}^2 - 2\len{a}\len{b}\cos\ang{ab} + \len{b}^2 \\[1em]
& = \len{a}\len{a}\cos\ang{aa} - 2\len{a}\len{b}\cos\ang{ab} + \len{b}\len{b}\cos\ang{bb} & \mbox{Expand terms to same form} \\[1em]
f(a,b) & \equiv \len{a}\len{b}\cos\ang{ab} & \mbox{Define $f$, the "inner product"} \\[1em]
\len{a-b}^2 & = f(a,a) -2f(a,b) + f(b,b) & \mbox{Substituting in $f$} \\[1em]
\end{aligned}
$

So, by defining $f(a,b)$ in terms of the length of $a$ and $b$, and the angle between them, we can write the distance between two elements purely in terms of the inner product.  It is completely abstract, not requiring any assumption about internal structure of the elements themselves.  This abstraction of the notion of distance on arbitrary objects is perhaps the key insight of Kernel methods.

$
\begin{aligned}
& = f(a,a) -f(a,b) + f(-a,b) + f(b,b) & \mbox{f is symmetric and bilinear} \\
& = f(a,a-b) + f(b-a,b) \\
& = f(a,a-b) + f(-b,a-b) \\
& = f(a-b,a-b) \\[1em]
\len{a-b}^2 & = f(a,a) - 2f(a,b) + f(b,b) & \mbox{Formula that doesn't require any expression $a-b$} \\
\end{aligned}
$


## Geometric Considerations of choice of Kernel

To apply a Kernel method to data $\mathcal{X} \times \mathcal{Y}$ is to adopt the assumption that there is a metric defined on the input domain $\mathcal{X}$.  *Metric* means a definition of distances and angles between any two points in $\mathcal{X}$.  This idea in itself is remarkable.  Although we are used to thinking of elements in $\mathbb{R}^n$ as having length and angles, this idea is even more general.  It does not require $\mathcal{X}$ to have any particular structure at all.  $\mathcal{X}$ may be continuous or discrete, or mixed.  And it can have any natural ordering of its elements, or none.  And, even if $\mathcal{X}$ is naturally ordered, such as $\mathbb{R}^n$, the metric need not be consistent with that ordering at all.


To make this idea concrete, you could think of $\mathcal{X}$ as the set of personalities, or cars, or insects.  We all have an intuitive notion of distance (although not angle) between different instances of these.  Unfortunately this analogy breaks down in the respect that there is no "origin" personality or car or insect.  And, thus, there is no "length" of a personality, etc.

But, this is worth meditating on, because it is precisely this notion which is the foundation of kernel methods.  A Kernel merely quantifies this intuitive notion.  Most discussions about Kernels say they are a measure of "similarity" between two points.  However, I don't like that word since it has no standing in geometry.  It is possible, for instance for $K(a,b) \gt K(a,a)$ for some $a$ and $b$.  If we called $K(\cdot, \cdot)$ a "similarity measure", then $a$ would be more similar to $b$ than to itself.

Rather, a kernel defines the *inner product* on a set $\mathcal{X}$, and the notions of length and angle follow indirectly from that:

$
\begin{aligned}
a, b \in \mathcal{X} \\
K(a, b) & \equiv \len{a} \len{b} \cos\ang{ab} \\
\implies \len{a} & = K(a,a)^\frac{1}{2} \\
\implies \cos \ang{ab} & = \dfrac{K(a, b)}{K(a, a)^\frac{1}{2} K(b, b)^\frac{1}{2}} \\[1em]
\implies \dist(a, b)^2 & = K(a, a) - 2K(a, b) + K(b, b) \\
\end{aligned}
$


The metric itself is abstract, and there is no inherent value in being able to say that "$a$ is this close to $b$" - ultimately, we want to predict associated values.  For $(x_i, y_i), (x_j, y_j)$, if $x_i$ is "close" to $x_j$ (according to the metric), then a Kernel method $f$ will produce values $f(x)$ and $f(y)$ that are close.

The way Kernel methods are defined, all of the candidate solution functions are *continuous* with respect to the metric.  This is true even for discrete $\mathcal{X}$ - and even if there doesn't exist a pair of points $(x_i, x_j)$ with any particular distance.  So, what we want is to write some expression for how close the value of any solution function will be on two points, in terms of the distance between those points.

This property follows from the fact that the *values* of the candidate functions have been defined as dot products.  It is this which ties the distance between two points in the domain with the difference in the values assigned:

$
\begin{aligned}
a, b \in \mathcal{X} \\[1em]
f(a) & \equiv \langle f, \phi(a) \rangle \\
& = \len{f} \len{\phi(a)} \cos\ang{f, \phi(a)}\\[1em]
f(a) - f(b) & \equiv \langle f, \phi(a) \rangle - \langle f, \phi(b) \rangle \\
& = \langle f, \phi(a) - \phi(b) \rangle \\
& = \len{f} \len{\phi(a)-\phi(b)} \cos\ang{f, \phi(a) - \phi(b)} \\[1em]
\end{aligned}
$

The first formula tells us that the magnitude of values of the function $f$ is bounded by $\len{f}$.  

The second equation tells us that the *change* in value between any two points is proportional to $\len{\phi(a) - \phi(b)}$.  In other words, if the distance shrinks, the values will be equal.  This is what is meant by "continuous with respect to the metric".

There are two implications that I draw from these equations.  The first is to ask, what is the consequence of choosing a kernel such that $\dist(a, b)$ is small, while $y_a - y_b$ is large?  In this case, in order to perfectly fit the data, with $f(a) = y_a, f(b) = y_b$, and since $\cos\ang{f,\phi(a)-\phi(b)} \in [-1, 1]$, it means that $\len{f}$ must be large.  But, if that's the case, then the function will have a high bound on its absolute value.  So, if the target values $y_i$ are in a smaller range, this function will poorly generalize.  So, one hopes that the choice of kernel will be such that $\dist(a, b)$ small implies that $y_a - y_b$ is small as well.

The second implication is to ask:  given the $y_i$, what choice of a kernel would minimize the length of a perfect fitting function $f$?  Can we express this ideal kernel in terms of the values on the data pairs $K(x_i, x_j)$?





[INSERT argument about the range $[\theta - \delta, \theta + \delta]$ and the resulting cosine expressions]


Consider a data set in which labels $y_i$ range in $[-1, 1]$, $\mathcal{X}$ can be anything you like.  Given a kernel, you want to find some function $f$ which perfectly fits the data, in other words, $f \cdot \phi(x_i) = y_i$ for all $y_i$.  If you can choose any valid kernel such that $\phi(x_i) \cdot \phi(x_i) = 1$, which kernel will allow $\len{f}$ to be minimal?

Geometrically, we can imagine all of the $\phi(x_i)$ residing on a unit hypersphere, and they are all linearly independent.  Each one is associated with a $y_i$.  Because they are linearly independent, there exists an $f$ satisfying the constraint.  

## Consequences of the choice of a Kernel

There are a few exercises you can do in the interactive chart that are illuminating.  Try dragging one of the black dots while *auto solve* is checked.  You will notice that if you drag the dot near another dot, the blue curve is forced to become almost vertical, and the function norm explodes.  In kernel terms, what is happening is that two data points that are extremely close according to the kernel, are in fact distant in terms of their y-values.  The kernel's idea of distance is mismatched with that of the data labels.

Leaving one pair of black dots close to each other on the X-axis, you can reduce the function norm by reducing the Sigma slider.  This changes the kernel so that it considers those two data points far apart.  This allows a smaller norm function to fit the data.  In the limit of small sigma, the kernel considers every pair of points to be maximally far away (orthogonal in feature space).  Thus, the contributions of each individual curve to the overall function have no influence on each other.  But, the function also doesn't interpolate at all.  In other words, if you consider a particular pair of points to be "close", you would then expect their y-values to be similar, but the kernel does not, so the resulting solution function will be useless for predicting values of unseen data.

When you hit the 'scramble' button, you can see that the kernel has a definition of distance that runs counter to the spatial distance of the graph.  A pair of points that are nearly adjacent along the X-axis, but span a jump in the kernel values are considered distant, while a pair of points separated along the X-axis might have nearly the same kernel value.  Consequently, with this "kernel" (it is actually not a proper kernel, but it still is capable of perfectly fitting the data), one can set a pair of points such that they are far in X-axis distance, but very close in kernel distance.  In that case, the function norm will be very sensitive to the difference in y-values of the two points.  And, you can adjust a pair of points to be on either side of a discontinuity.  In that case, the two points may have very different y-values and still allow to be fit with a small-norm solution function (blue curve).

All of this is to emphasize that it is the Kernel's notion of distance which determines the interpolation behavior of kernel methods.

# Is it beneficial to include unlabeled data in a kernel method?

Suppose we have the following data:

$
\begin{aligned}
((x_1,y_1), \cdots, (x_n,y_n)) & \in \mathcal{X} \times \mathcal{Y} \\
(x_{n+1}, \cdots, x_{n+k}) & \in \mathcal{X} & \mbox{additional unlabeled data} \\[1em]
\alpha & \equiv [\alpha_1, \cdots, \alpha_{n+k}]\ & \mbox{row vector} \\[1em]
F & \equiv
\begin{bmatrix}
-\phi(x_1) - \\
- \phi(x_2) - \\
\cdots \\
- \phi(x_n) - \\
\end{bmatrix} \\[1.5em]
K & \equiv F F^T \\[1em]
\begin{bmatrix}
f(x_1) \\
f(x_2) \\
\cdots \\
f(x_n) \\
\end{bmatrix} & = \alpha K \\
& = \alpha F F^T & \mbox{another way to write $f(X)$} \\[2em]
\|f\|^2 & = \alpha K \alpha^T \\
& = \alpha F F^T \alpha^T\\
G & \equiv
\begin{bmatrix}
-\phi(x_1) - \\
- \phi(x_2) - \\
\cdots \\
- \phi(x_{n+k}) - \\
\end{bmatrix} \\[2em]
f \equiv \alpha G \\[1em]
\|f\|^2 = \alpha G G^T \alpha^T \\
(\alpha G F^T - y)^2 & & \mbox{The objective} \\
\end{aligned}
$

By orthogonal decomposition, $f$ can be written as the sum of a perpendicular and parallel components relative to the span of $\phi(x_1), \cdots, \phi(x_n)$.  Thus, every possible set of target values $(y_1, \cdots, y_n)$ can be realized in that span.  Adding additional vectors from $(\phi(x_{n+1}), \cdots, \phi(x_{n+k}))$ will contribute to both the perpendicular component and the parallel component.  The perpendicular component has no effect on the function's values.  And, any possible parallel component can be realized using only the first $n$ feature vectors.  So, from the point of view of the regularized objective, only the first $n$ vectors are needed.

However, solutions involving the additional $k$ feature vectors will behave differently on new data points.  Of course, not having any labels for them leaves you with no way to train them.
