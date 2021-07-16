import * as gauss from './gaussian.js';
import * as ker from './kernel.js';
import * as d3 from 'd3';
import * as mat from 'ml-matrix';

const STEP = 0.05;
const CUT_SIZE = 1;
const ALPHA_RANGE = 5;

export class Plot {
  constructor(context, n) {
    this.nonce = 0;
    this.ctx = context; 
    this.height = this.ctx.height;
    this.width = this.ctx.width;
    this.unitToAlpha = d3.scaleLinear().domain([0, 1]).range([-ALPHA_RANGE, ALPHA_RANGE]);
    this.n = n;
    this.kernels = [null, null];
    this.kernels[0] = new ker.RBFKernel();
    this.kernels[1] = new ker.RBFShuffleKernel(CUT_SIZE);
    this.active_ker = 0;
    this.populate();

  }

  toggle_scramble() {
    this.active_ker = 1 - this.active_ker;
  }

  scrambled() {
    return this.active_ker == 1;
  }

  reset() {
    this.active_ker = 0;
    this.populate();
  }

  resetAlpha() {
    this.alpha.fill(1);
  }

  set_sigma(log_sigma) {
    for (let i = 0; i != this.kernels.length; i++)
      this.kernels[i].set_sigma(Math.pow(10, log_sigma))
  }

  populate() {
    var n = this.n;
    this.x = new Array(n);
    this.y = new Array(n);
    this.alpha = new Array(n);

    for (let i = 0; i != n; i++) {
      this.x[i] = this.ctx.unitToX(Math.random());
      this.alpha[i] = this.unitToAlpha(Math.random());
    }
    for (let i = 0; i != n; i++) {
      this.y[i] = this._point(this.x, this.alpha, this.x[i]);
    }

    for (let i = 0; i != n; i++) {
      this.alpha[i] = 1.0;
    }
  }

  setDataPoint(i, u, v) {
    // update the value of the i'th data point
    this.x[i] = this.ctx.x(u);
    this.y[i] = this.ctx.y(v);
  }

  kernel(x1, x2) {
    return this.kernels[this.active_ker].call(x1, x2);
  }


  jumps(x) {
    var k = this.kernels[this.active_ker];
    return k.cuts(x, this.ctx.xmin, this.ctx.xmax);
  }

  solutionAlpha() {
    var n = this.n;
    var K = mat.Matrix.zeros(n, n);
    var y = new mat.Matrix([this.y]);
    var xi, xj;
    for (let i = 0; i != n; i++) {
      xi = this.x[i];
      for (let j = 0; j != n; j++) {
        xj = this.x[j];
        K.set(i, j, this.kernel(xi, xj));
      }
    }
    var alpha;
    try {
      var invK = mat.inverse(K);
      alpha = y.mmul(invK).flat();
    } catch(err) {
      console.log('Error during solutionAlpha: ', err);
      alpha = plot.alpha;
    }
    return alpha;

  }


  updateContext(context) {
    this.ctx = context;
    this.height = this.ctx.height;
    this.width = this.ctx.width;
  }

  addPoint() {
    this.n++;
    this.populate();
  }

  delPoint() {
    if (this.n == 0) return;
    this.n--;
    this.populate();
  }

  updateAlpha(delta, index) {
    this.alpha[index] += delta;
  }

  makeLine(xs, ys) {
    const path = d3.line()
      .x(d => this.ctx.u(d[0]))
      .y(d => this.ctx.v(d[1]))(d3.zip(xs,ys));
    return path || '';
  }


  // provide the xs and ys for the given segment 
  _curveSegment(args1, alphas, xbeg, xend) {
    var xs = d3.range(xbeg, xend, STEP);
    var ys = xs.map(
      x => d3.zip(args1, alphas).map(
        ([x1, alpha]) => alpha * this.kernel(x1, x)
      )
      .reduce((p, q) => p + q, 0)
    );
    return this.makeLine(xs, ys);
  }

  _curveFull(args1, alphas) {
    var line = '';
    var cuts = [this.ctx.xmin, this.ctx.xmax];
    for (let arg of args1) cuts.push(...this.jumps(arg));
    cuts.sort((a, b) => a - b);

    for (let s = 0; s != cuts.length - 1; s++) 
      line += this._curveSegment(args1, alphas, cuts[s], cuts[s+1]);

    return line;
  }

  curve(x, alpha) {
    return this._curveFull([x], [alpha]);
  }

  solutionCurve() {
    return this._curveFull(this.x, this.alpha);
  }


  // returns y value for weighted combo of curves 
  _point(args1, alphas, x) {
    var y = d3.zip(args1, alphas).map(
      ([x1, alpha]) => alpha * this.kernel(x1, x)
    ).reduce((p, q) => p + q, 0);
    return y;
  }

  // return the plot point
  point(x1, alpha, x) {
    const y = this._point([x1], [alpha], x);
    return y;
    // return this.ctx.v(y);
  }

  
  points(x1, alpha) {
    return this.x.map(x => [
      this.ctx.u(x),
      this.ctx.v(alpha * this.kernel(x1, x))
    ]);
  }

  data() {
    return d3.zip(this.x, this.y).map(([x,y]) => 
      [this.ctx.u(x), this.ctx.v(y)]
    );
  }


  solutionPoint(x) {
    const y = this._point(this.x, this.alpha, x);
    return this.ctx.v(y);
  }


  u(x) {
    return this.ctx.u(x);
  }

  v(y) {
    return this.ctx.v(y);
  }


}

