# An illustration of Kernel Regression

$\small {1 \over 2}$


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




## The three design choices underlying all Kernel methods

Underlying all Kernel methods are three choices for how to construct the function to fit a given data set.  Like all machine learning methods, these chocies are guided by classic requirements.  First, the approach must be a "universal approximator", thus be able to fit any data set.  Second, it should be possible to regularize.  Finally, it should be computationally tractable.  The three design choices serve these requirements as you will see.

The **first design choice** is, we specify a family of functions $f_i: \mathcal{X} \mapsto \mathcal{Y}$, such that there is exactly one member of the family, $f_i$, corresponding to each element $x_i \in \mathcal{X}$.  We then use the subset of this family corresponding to our $x_i$ to build a solution function as a linear combination of them.  The fact that the functions are already indexed makes the approach automatic.  There is no hand-specifying a set of functions tailor made for each new data set.  This choice also serves the purpose of regularization, to be proved later.

The **second choice** is that the family of functions should have the following property:  For any value of $n$, and for any $n$ functions from the family, and for any choice of $n$ evaluation points in $\mathcal{X}$, the set of $n$ *vectors of evaluation* of the chosen functions should be linearly independent.  A "vector of evaluation" is my term for the vector of function values in some order of data set points.  For example, $(f_i(x_1), f_i(x_2), \cdots, f_i(x_n))$ is function $f_i(x)$'s vector of evaluation.  This choice allows the approach to fit any data set, as argued above by appealing to the linear algebra expansion theorem.  This makes the approach a "universal approximator".  As an aside, there are choices of families that don't have this property, but since we are speaking generally about the approach of Kernel methods, it is important that some families do exhibit this property.

The **third choice** is the biggest leap.  It is that the functions in the family have the following form:  $f_i(x) \equiv \B{p}_i \cdot \B{\phi}(x)$.  That is, each function is identified by a distinct "parameter vector" $\B{p}_i$, and the function is defined as the dot product between its parameter vector and some as-yet undefined vector-valued function of the input.  As I will show soon, this third provides a way to regularize the method, and makes finding the solution function readily computable.  It also maintains the first goal of having arbitrary capacity to fit any data.

To motivate these ideas and make the discussion more concrete, I will show that the gaussian family of functions, all with the same $\sigma$ and indexed over $\mu$, fit these three design requirements.



## The set of gaussians sharing the same $\sigma$

The values of the gaussian distribution turn out to be a dot product between two infinite dimensional vectors.  The first vector is a function of $\mu$, and the second, the same function of $x$.  To show this, we first show how the simpler formula $e^{axy}$ can be written as a dot product.  Then, using this first result, we show that $e^{-\half a(x-y)^2}$ can also be written as a dot product.  The gaussian is just a scaled version with a special choice for $a$.

$
\begin{aligned}
e^{axy} & = \sum_{i=0} { \dfrac{a^i(xy)^i}{i!} } & \mbox{Taylor expansion} \\
& = \sum_{i=0} { \dfrac{(a^\half x)^i}{(i!)^\half} \dfrac{(a^\half y)^i}{(i!)^\half} } & \mbox{Separate $x$ and $y$ terms to symmetric roles} \\
& = \sum_{i=0} { \psi_{a,i}(x) \psi_{a,i}(y) } & \mbox{Let $\psi_{a,i}(p) \equiv \dfrac{(a^\half p)^i}{(i!)^\half}$ }\\
& = \vec{\psi_a}(x) \cdot \vec{\psi_a}(y) & \mbox{Let $\vec{\psi_a}(p) \equiv (\psi_{a,1}(p), \psi_{a,2}(p), \cdots)$ } \\
\end{aligned}
$

We've shown that $e^{axy}$ can be written as a dot product between the vector valued function of $x$ and the same function of $y$.  Now:

$
\begin{aligned}
e^{-\half a(x-y)^2} & = e^{-\half a(x^2-2xy+y^2)} \\[1em]
& = e^{-\half a x^2} e^{axy} e^{-\half a y^2} \\[1em]
& = e^{-\half a x^2} ( \vec{\psi_a}(x) \cdot \vec{\psi_a}(y) ) e^{-\half a y^2} & \mbox{substitute formula above} \\[1em]
& = (e^{-\half a x^2} \vec{\psi_a}(x) \cdot e^{-\half a y^2} \vec{\psi_a}(y)) & \mbox{By bilinearity of dot product} \\[1em]
& = \vec{\phi_a}(x) \cdot \vec{\phi_a}(y) & \mbox{Let $\vec{\phi_a}(p) \equiv e^{-\half ap^2} \vec{\psi_a}(p)$} \\
\end{aligned}
$

Letting $a = \tfrac{1}{\sigma^2}$, we have $e^{-\tfrac{1}{2} {(\tfrac{x - \mu}{\sigma})}^2 }$ and all that remains is to scale both vectors by $\dfrac{1}{\sigma^\half (2 \pi)^{\small 1 \over 4}}$

In particular, this emphasizes the symmetric roles of $x$ and $\mu$ in a gaussian:  evaluating a gaussian centered at $\mu$ at $x$ is the same as one centered at $x$ evaluated at $\mu$.  So, each member of the family of gaussians corresponds to some $\mu \in \mathcal{X}$.  This doesn't prove that gaussians have an arbitrary ability to produce linearly independent vectors of evaluation, but for the moment, just accept it.

Another thing that is apparent from this is that the height at the peak of every gaussian, the location where $x = \mu$, is the value of $\vec{\phi_a}(\mu) \cdot \vec{\phi_a}(\mu)$.  Since all the heights are the same, this means all the feature vectors are the same length.  The value of the gaussian as you move away from the peak approaches zero.  This represents the angle between two vectors $\vec{\phi_a}(x)$ and $\vec{\phi_a}(\mu)$ approaching $90^\circ$.  And, since the gaussian is positive everywhere, the angle ranges in $[0^\circ, 90^\circ)$ in the infinite dimensional feature space.

Note also that, although $\sigma$ is also called a "parameter" of the gaussian, $\sigma$'s role here is a constant baked into the $\vec{\phi_a}(\cdot)$ function induced by the gaussian, while $\mu$ is an *argument* to the function, and treated in a symmetric role with the $x$.



## Things to do in the plot to build intuition

3. Illustrate in the Kernel figure how a selection of data induces a matrix

5. Describe tasks to try on the interactive chart:
   A.  Function Norm
     * Shrink sigma until the gray curves are well separated, so that at each
       curve's peak, all the other curves are near zero
     * Reset the alphas to 1.0
     * Notice that the function norm for that function is just sqrt(num points)
   B.  Exploding Norm
     * Start with a data set that has a reasonable norm solution
     * In auto-solve mode, drag one of the data points circularly around another
       point
     * Notice that the function norm explodes as the second point passes over
       the first
     * Adjust the sigma to be small, and notice that, with smaller sigma, the
       norm doesn't explode as fast
   C.  


## Consequences of the choice of a Kernel

There are a few exercises you can do in the interactive chart that are illuminating.  Try dragging one of the black dots while *auto solve* is checked.  You will notice that if you drag the dot near another dot, the blue curve is forced to become almost vertical, and the function norm explodes.  In kernel terms, what is happening is that two data points that are extremely close according to the kernel, are in fact distant in terms of their y-values.  The kernel's idea of distance is mismatched with that of the data labels.

Leaving one pair of black dots close to each other on the X-axis, you can reduce the function norm by reducing the Sigma slider.  This changes the kernel so that it considers those two data points far apart.  This allows a smaller norm function to fit the data.  In the limit of small sigma, the kernel considers every pair of points to be maximally far away (orthogonal in feature space).  Thus, the contributions of each individual curve to the overall function have no influence on each other.  But, the function also doesn't interpolate at all.  In other words, if you consider a particular pair of points to be "close", you would then expect their y-values to be similar, but the kernel does not, so the resulting solution function will be useless for predicting values of unseen data.

When you hit the 'scramble' button, you can see that the kernel has a definition of distance that runs counter to the spatial distance of the graph.  A pair of points that are nearly adjacent along the X-axis, but span a jump in the kernel values are considered distant, while a pair of points separated along the X-axis might have nearly the same kernel value.  Consequently, with this "kernel" (it is actually not a proper kernel, but it still is capable of perfectly fitting the data), one can set a pair of points such that they are far in X-axis distance, but very close in kernel distance.  In that case, the function norm will be very sensitive to the difference in y-values of the two points.  And, you can adjust a pair of points to be on either side of a discontinuity.  In that case, the two points may have very different y-values and still allow to be fit with a small-norm solution function (blue curve).

All of this is to emphasize that it is the Kernel's notion of distance which determines the interpolation behavior of kernel methods.

## A Natural choice for parameter vectors

Below we write the vectors of evaluation of the $f_i(x)$ as row vectors.  We would like them to be linearly independent.  Given the definition of the functions as dot products of feature vectors, this expression is simply a product of matrices.  
$
\begin{aligned}
\B{E} & \equiv
\begin{bmatrix}
f_1(x_1) & f_1(x_2) & \cdots & f_1(x_n) \\
f_2(x_1) & f_2(x_2) & \cdots & f_2(x_n) \\
& & \cdots & \\
f_n(x_1) & f_n(x_2) & \cdots & f_n(x_n) \\
\end{bmatrix}
& \mbox{The matrix of row vectors of evaluation on the $x_i$} \\[1em]
\B{E} & =
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
\end{bmatrix} & \mbox{By definition of the $f_i(x)$} \\[1em]
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
& = \B{P F}^T & \mbox{Defining matrices $\B{P}$ and $\B{F}$ appropriately} \\
\end{aligned}
$


It is apparent that we need the $\B{\phi}(x_i)$ to be linearly independent at least.  Indeed, the arbitrary capacity of this family of functions to fit any data comes directly from the capacity of $\B{\phi}(\cdot)$ to generate linearly independent vectors for any set of $x_i$, however large.  To achieve this, $\B{\phi}(\cdot)$ must be infinite-dimensional.  If, for example, $\B{\phi}(\cdot)$ were 10-dimensional, the resulting family would only have the capacity to perfectly fit up to 10 data points.


Besides this property of $\B{\phi}(\cdot)$, we need to choose the $\B{p}_i$ such that their projection onto $\texttt{span}(\B{\phi}(x_i))$ is also linearly independent.  Explicitly:

$
\begin{aligned}
\B{PF}^T & = (\B{P}_\parallel + \B{P}_\perp) \B{F}^T & \mbox{by bilinearity of dot product} \\
& = \B{P}_\parallel \B{F}^T & \mbox{since $\B{P}_\perp$ has zero contribution} \\[2em]
\mbox{where: }
\B{P}_\parallel & \equiv
\begin{bmatrix}
- \B{p}_{\parallel,1} - \\
- \B{p}_{\parallel,2} - \\
\cdots \\
- \B{p}_{\parallel,n} - \\
\end{bmatrix} & \mbox{matrix of parallel parts, relative to $\texttt{span}(\B{\phi}(x_i))$} \\
\end{aligned}
$



Explicitly, the above is decomposing each $\B{p}_i = \B{p}_{\parallel i} + \B{p}_{\perp i}$, relative to $\texttt{span}(\B{F})$.   In order for the vectors of evaluation to be linearly independent and thus achieve the goal of arbitrary fitting capacity, the $\B{p}_i$ must be chosen such that $\texttt{span}(\B{P}_\parallel) = \texttt{span}(\B{F})$.  Furthermore, for any function in the space, any values of $\B{P}_\perp$ has zero contribution to the vectors of evaluation.  Although it will have a non-zero contribution to values elsewhere, since we have no labeled data, we have no criterion for preferring one choice over another.

Finally, we want to find some linear combination $\B{\alpha}$ of the vectors of evaluation $\B{E}$ that equals the target values $\B{y}$.  If $\B{E}$ is full rank, must exist for any $\B{y}$.  Notice that, because the functions $y_i(x)$ are defined as dot products of feature vectors, a linear combination of functions is equivalent to the function whose parameter vector is the *same* linear combination of the combining functions' feature vectors:

$
\begin{aligned}
f(x) & \equiv \sum_i { \alpha_i f_i(x) } \\
& = \sum_i {\alpha_i (\B{p}_i \cdot \B{\phi}(x)) } & \mbox{by definition of the $f_i(x)$} \\
& = (\sum_i {\alpha_i \B{p}_i}) \cdot \B{\phi}(x) & \mbox{by linearity of dot product} \\
& = \B{\alpha P} \cdot \B{\phi}(x) & \mbox{in matrix form} \\
\end{aligned}
$

So, the parameter vector associated with the solution function $f(x)$ is of the form $\B{\alpha P}$.  The vector of evaluation of $f(x)$ on each $x_i$ is simply $\B{\alpha P F}^T$.  

But notice that because we are restricted to choose $\B{P}$ to satisfy $\texttt{span}(\B{P}_\parallel) = \texttt{span}(\B{F})$, $\B{P_\parallel}$ can be written as $\B{P_\parallel} = \B{T} \B{F}$ for some $n \times n$ transformation matrix $\B{T}$.  But, that means we could express the evaluation as:

$
\begin{aligned}
\B{\alpha P F}^T & = \B{\alpha (P_\parallel + P_\perp) F}^T & \mbox{orthogonal decomposition}\\
& = \B{\alpha P_\parallel F}^T & \mbox{perpendicular component has zero contribution} \\
& = \B{\alpha TFF}^T & \mbox{substituting from above} \\
& = (\B{\alpha T}) \B{FF}^T & \mbox{reexpressing using a transformed $\B{\alpha}$} \\
\end{aligned}
$


Any solution $\B{\alpha}$ one finds using $\B{P}$ as a set of parameter vectors, is equivalent to the solution $\B{\alpha T}$ found using $\B{F}$ as the set of parameter vectors.  In fact, any permutation of the rows of $\B{F}$ would also produce an equivalent solution.

Kernel methods then choose $\B{P} \equiv \B{F}$ as the set of parameter vectors, thus choosing to set the perpendicular component of all parameter vectors to zero.  It is still not justified why it is actually *preferable* to have $\B{P}$ itself be in the span.  But, setting $\B{P} \equiv \B{F}$ turns out to find the minimum norm parameter vector for any given set of target values.  It turns out that certain "smoothness" properties of the function are related to the norm of its parameter vector.





## Function Norm as a regularizer

In Kernel parlance, the term "function norm" just means "norm of the function's associated parameter vector".  Our solution function $f(x) = \sum_i { \alpha_i f_i(x) }$ has associated parameter vector $\B{p} = \sum_i { \alpha_i \B{p}_i }$.  Consider two arbitrary inputs $a, b \in \mathcal{X}$.  How do the values $f(a)$ and absolute difference in values $|f(a) - f(b)|$ relate to the norm of its parameter vector?

$
\begin{aligned}
\bp{a} & \equiv \B{\phi}(a) & \mbox{notation} \\
f(a) & = \B{p} \cdot \bp{a} & \mbox{definition of $f(x)$} \\
& = \|\B{p}\| \|\bp{a}\| \cos \theta_{\B{p},\bp{a}} & \mbox{definition of dot product} \\
\implies |f(a)| & \le \|\B{p}\|\|\bp{a}\| & \mbox{Cauchy Schwarz inequality} \\[2em]
f(a) - f(b) & = \B{p} \cdot \bp{a} - \B{p} \cdot \bp{b} &\mbox{definition of $f(x)$} \\
& = \B{p} \cdot (\bp{a} - \bp{b}) & \mbox{bilinearity of dot product} \\
& = \|\B{p}\| \|\bp{a} - \bp{b}\| \cos \theta_{\B{p}, \bp{a} - \bp{b}} & \mbox{definition of dot product} \\
\implies |f(a) - f(b)| & \le \|\B{p}\| \|\bp{a} - \bp{b}\| & \mbox{Cauchy Schwarz inequality} \\
\end{aligned}
$

The first inequality tells us that the magnitude of values of the function $f$ is bounded by a fixed multiple of $\len{\B{p}}$.  The multiple itself, $\len{\bp{a}}$ we have no control over - it is determined by the choice of $\B{\phi}(\cdot)$.  But by controlling $\len{\B{p}}$ we can control the range of values of $f$.  

The second inequality tells us that the absolute difference in value between any two points is proportional to $\len{\bp{a} - \bp{b}}$.  As the distance shrinks, the values will be equal.  By bounding $\len{\B{p}}$, we can control how sensitive the function could be to distance between input feature vectors.

It also says something about the choice of $\B{\phi}(\cdot)$.  Ideally, we would like to choose a $\B{\phi}(\cdot)$ such that $\len{\bp{a} - \bp{b}}$ is roughy proportional to $|y_a - y_b|$ in the data set for all pairs $(a, b) \in \mathcal{X}$.

It is not yet explained visually how the distance $\len{\bp{a} - \bp{b}}$ relates to the curves on the plot.  But recall that each gray curve shows one of the $f_i(x)$ functions, defined as:

$
\begin{aligned}
f_i(x) & = \B{p}_i \cdot \B{\phi}(x) \\
& = \B{\phi}(x_i) \cdot \B{\phi}(x)
\end{aligned}
$

It has not been shown yet, (see below section) but the gaussian curves are indeed of this form.  Each gaussian centered at $\mu$ has parameter vector $\B{\phi}(\mu)$ and in fact, the $\B{\phi}(\cdot)$ function dictated by the gaussian has the same norm for all inputs $x \in \mathcal{X}$.  Therefore, each gaussian attains its peak when $x = \mu$, because then the two feature vectors are facing in the same direction.

The distance in feature space thus is given indirectly by the height of the gaussian:

$
\begin{aligned}
\len{\bp{\mu} - \bp{x}}^2 & = (\bp{\mu} - \bp{x}) \cdot (\bp{\mu} - \bp{x}) \\
& = \bp{\mu} \cdot \bp{\mu} - 2 \bp{\mu} \cdot \bp{x} + \bp{x} \cdot \bp{x} \\
\bp{\mu} \cdot \bp{x} & & \mbox{height of gaussian with location $\mu$ at $x$} \\
\bp{\mu} \cdot \bp{\mu}, \,\, \bp{x} \cdot \bp{x} & & \mbox{height of any gaussian at peak}
\end{aligned}
$

Here, the interactive plot is useful to build intuition.  Selecting 'auto-solve', drag one of the data points, let's call it $(x_b, y_b)$, in a path from one side to the other side of another data point, say $(x_a, y_a)$, passing over it by some non-negligible distance $|y_b - y_a|$.  Because 'auto-solve' is checked, the system is updating $\B{p}$ so that $f(x_a) = y_a, f(x_b) = y_b$.  But, as $x_a$ approaches $x_b$, $\len{\bp{x_a} - \bp{x_b}}$ shrinks to zero, so $\len{\B{b}}$ must be magnified to infinity to maintain the spread.  It is a case in which the distance as defined by $\B{\phi}(\cdot)$ is a gross underestimate of the difference in labels.





## Finally, enter the Kernel

Recall from the previous section that using $\B{P} \equiv \B{F}$ as the set of parameter vectors ensures 1) the method has arbitrary fitting capacity and 2) the solution will be the lowest norm solution possible.  So we have the following:

$
\begin{aligned}
\B{F} & \equiv 
\begin{bmatrix}
- \B{\phi}(x_1) - \\
- \B{\phi}(x_2) - \\
\cdots \\
- \B{\phi}(x_n) - \\
\end{bmatrix} & \mbox{definition from before} \\
\B{\alpha F} & & \mbox{The parameter vector for the solution function $f(\cdot)$}\\
\B{\alpha F F}^T & & \mbox{vector of evaluation of the solution function $f(\cdot)$} \\
\end{aligned}
$

To find $\B{\alpha}$, solve:

$
\begin{aligned}
\B{\hat{\alpha}} & = \min_{\alpha} { \len{\B{\alpha F F}^T - \B{y}}^2 }
\end{aligned}
$

This will minimize to zero if the assumptions above hold.  To compromise between a perfectly fitting function and its smoothness, instead solve:

$
\begin{aligned}
\B{\hat{\alpha}} & = \min_{\alpha} ( \len{\B{\alpha F F}^T - \B{y}}^2 + \lambda \len{\B{\alpha F}}^2 ) & \mbox{sum of squared error, regularized by norm of $\B{p}$}\\
& = \min_{\alpha} ( \len{\B{\alpha F F}^T - \B{y}}^2 + \lambda \B{\alpha F F}^T \B{\alpha}^T )
\end{aligned}
$

Finally, to evaluate the function on new data:

$
\begin{aligned}
f(x) & = \B{p} \cdot \B{\phi}(x) \\
& = \B{\hat{\alpha} F} \cdot \B{\phi}(x)
\end{aligned}
$


So we see that the only quantities dependent on the $\mathcal{X}$ data are dot products $\B{\phi}(x_i) \cdot \B{\phi}(x_j)$, appearing in the $\B{F F}^T$ terms or the solution function.  Finally, we define a function called the "kernel" as:

$
\begin{aligned}
k(x,x') & \equiv \B{\phi}(x) \cdot \B{\phi}(x') & \mbox{The kernel function} \\
\B{K} & \equiv [ \B{K}_{ij} = k(x_i, x_j) ] & \mbox{The Kernel matrix, metric matrix or Gramm matrix} \\
& = \B{F F}^T & \mbox{from above}
\end{aligned}
$

Then, the general optimization formula simplifies to:

$
\begin{aligned}
\B{\hat{\alpha}} & = \min_{\alpha} ( \len{\B{\alpha K}- \B{y}}^2 + \lambda \B{\alpha K} \B{\alpha}^T )
\end{aligned}
$

and evaluating the solution function is now written as:

$
\begin{aligned}
f(x) & = \sum_i { \hat{\alpha}_i k(x_i, x) } \\
\end{aligned}
$



## Geometric Considerations of choice of Kernel

To apply a Kernel method to data $\mathcal{X} \times \mathcal{Y}$ is to adopt the assumption that there is a metric defined on the input domain $\mathcal{X}$.  *Metric* means a definition of distances and angles between any two points in $\mathcal{X}$.  This idea in itself is remarkable.  Although we are used to thinking of the vectors in $\mathbb{R}^n$ as having lengths, and pairs of vectors having an angle between them, this idea is even more general.  It does not require $\mathcal{X}$ to have any particular structure at all.  $\mathcal{X}$ may be continuous or discrete, or mixed.  And it can have any natural ordering of its elements, or none.  And, even if $\mathcal{X}$ is naturally ordered, such as $\mathbb{R}^n$, the metric need not be consistent with that ordering at all.

Indeed, the very notion of "ordering" itself is a weak concept once you go past one dimension.  Ordering of elements in $\mathbb{R}$ is simply a result of a notion of the length of each element.  Although, the angle is always either zero or $\pi$.

But, this is worth meditating on, because it is precisely this notion which is the foundation of kernel methods.  A Kernel merely quantifies this intuitive notion.  Most discussions about Kernels say they are a measure of "similarity" between two points.  However, I don't like that word since it has no standing in geometry.  It is possible, for instance for $K(a,b) \gt K(a,a)$ for some $a$ and $b$.  If we called $K(\cdot, \cdot)$ a "similarity measure", then $a$ would be more similar to $b$ than to itself.

Rather, a kernel defines the *inner product* on a set $\mathcal{X}$, and the notions of length and angle follow indirectly from that:

$
\begin{aligned}
a, b \in \mathcal{X} \\
K(a, b) & \equiv \len{a} \len{b} \cos\ang{ab} & \mbox{The Kernel defines the value of the inner product} \\
\implies \len{a} & = K(a,a)^\half \\
\implies \cos \ang{ab} & = \dfrac{K(a, b)}{K(a, a)^\frac{1}{2} K(b, b)^\frac{1}{2}} \\[1em]
\implies \dist(a, b)^2 & = K(a, a) - 2K(a, b) + K(b, b) \\
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


## Distinction between Feature Space and Hilbert Space

Second, an inner product on the space of functions is defined to be $\langle f_\B{p}, f_\B{q} \rangle \equiv \B{p} \cdot \B{q}$.

The form of the source functions $f_\B{p}(\cdot)$ is a dot product between two vectors in a so-called "feature space".  The vector valued function $\B{\phi}(\cdot)$ is determined at the beginning, and is a fixed function throughout the procedure with no trainable parameters.  Therefore, there is a one-to-one correspondence between the parameters $\B{p}$ in this feature space, and the resulting functions $f_\B{p}(\cdot)$ in the function space.

The feature space will be denoted $\mathcal{F}$, equipped with an inner product defined as the dot product.  If we think of $\B{\phi}(\cdot) = \{\phi_1(\cdot), \phi_2(\cdot), \cdots\}$, then each $\phi_i(\cdot)$ defines a feature and indexes a different component of the vectors in $\mathcal{F}$.  So we write $\mathcal{F} = \mathbb{R}^{\{\phi_1(\cdot), \phi_2(\cdot), \cdots\}}$.

A different space, the space of functions $f: \mathcal{X} \mapsto \mathbb{R}$ will be denoted $\mathcal{H}$, for *Hilbert* space.  So, $\mathcal{H} = \mathbb{R}^\mathcal{X}$.  As mentioned, it is endowed with inner product $\langle f_\B{p}, f_\B{q} \rangle_\mathcal{H} \equiv \B{p} \cdot \B{q}$.  Note that our "solution function" which fits the data will lie in an $n$-dimensional linear subspace of $\mathcal{H}$ spanned by a set of $n$ "basis functions", which we define below.

Note that some literature takes $\mathcal{F} \equiv \mathbb{R}^{\{\phi_1(\cdot), \phi_2(\cdot), \cdots\}}$ to be *the* Hilbert space, and implicitly treats the points in that space as functions on the domain $\mathcal{X}$ even though they are over the domain of features.  Technically, $\mathcal{F}$ *is* a Hilbert space, because it is a vector space endowed with an inner product.  But, it is not the Hilbert space where we search for a function.  But as it turns out, there is a bijection between elements in the linear span of basis functions in $\mathcal{H}$ with the linear span of basis parameter vectors in $\mathcal{F}$.  So, authors speak as though they are the same.  For example, see Learning with Kernels, Smola and Scholkopf.

Other authors, especially those focused on the theory of RKHS, speak of the Hilbert space as $\mathcal{H} \equiv \mathbb{R}^\mathcal{X}$.  For example, see "A Primer on Reproducing Kernel Hilbert Spaces" by Manton and Amblard.  I prefer to distinguish $\mathcal{F}$ from $\mathcal{H}$ to avoid confusion.


## A set of spanning functions for general $\mathcal{X}$

In the plot above, our input domain happened to be $\mathbb{R}$.  But for an arbitrary data set with input domain $\mathcal{X}$, we need a source of arbitrarily many distinct functions - as many as there are elements of $\mathcal{X}$.  So it is natural then, that each function correspond to some $x \in \mathcal{X}$.  We could plot all of the functions' values on $\mathcal{X}$ in a heatmap $\mathcal{X} \times \mathcal{X} \mapsto \mathbb{R}$.  In the example above, the individual functions $k_i(x)$ were unit $\sigma$ Gaussians centered at $x_i$.  So, the curves above would correspond to rows in this heatmap:

[Show heatmap]

Recall the statement earlier that any $n$ Gaussians of the same $\sigma$ produce linearly independent vectors when evaluated at any $n$ points.  From the heatmap, this means that, if you choose any $n$ rows and any $n$ columns, the matrix produced from the intersections will be full-rank, thus will allow a unique solution for any set of desired target values.



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



