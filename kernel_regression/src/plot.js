import * as gauss from './gaussian.js';
import * as ker from './kernel.js';
import * as d3 from 'd3';
import * as mat from 'ml-matrix';

const STEP = 0.025;
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
    this.K = mat.Matrix.zeros(this.n, this.n);
    this.invK = mat.Matrix.zeros(this.n, this.n);
    this.validInv = true;
    this.curveCache = null;
    this.xCache = null;

    this.populate();

  }


  initK() {
    var n = this.n, v;
    this.K = mat.Matrix.zeros(this.n, this.n);
    for (let i = 0; i != n; i++) {
      for (let j = i; j != n; j++) {
        v = this.kernel(this.x[i], this.x[j]);
        this.K.set(i,j,v);
        this.K.set(j,i,v);
        // console.log(this.K.flat());
      }
    }
    this.initInvK();
  }

  initInvK() {
    try {
      var inv = mat.inverse(this.K); 
      this.invK = inv;
      this.validInv = true;
    } catch(err) {
      // console.log('could not invert K.  leaving as-is');
      this.validInv = false;
    }
  }

  // updates i'th row/column of K
  updateK(i) {
    var v;
    for (let k = 0; k != this.n; k++) {
      v = this.kernel(this.x[i], this.x[k]);
      this.K.set(k,i,v);
      this.K.set(i,k,v);
    }
  }

  initXCache() {
    var cuts = [this.ctx.xmin, this.ctx.xmax];
    var xs;
    for (let i = 0; i != this.n; i++)
      cuts.push(...this.jumps(this.x[i]));
    cuts.sort((a, b) => a - b);

    this.xCache = new Array(0);
    for (let s = 0; s != cuts.length - 1; s++) {
      xs = d3.range(cuts[s], cuts[s+1], STEP);
      this.xCache.push(xs);
    }
  }

  initCurveCache() {
    var n = this.n;
    this.curveCache = new Array(n);
    this.initXCache();
    for (let i = 0; i != n; i++)
      this.updateCurveCache(i);
  }

  // updates i'th curve Cache
  updateCurveCache(i) {
    var seg;
    this.curveCache[i] = new Array(0);
    for (let s = 0; s != this.xCache.length; s++) {
      seg = this.xCache[s].map(x => this.kernel(this.x[i], x));
      this.curveCache[i].push(seg);
    }
  }

  toggle_scramble() {
    this.active_ker = 1 - this.active_ker;
    this.initK();
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
    for (let k = 0; k != this.kernels.length; k++) {
      this.kernels[k].set_sigma(Math.pow(10, log_sigma))
    }
    for (let i = 0; i != this.n; i++)
      this.updateCurveCache(i);

    this.initK();
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
    this.initK();
    this.initCurveCache();

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
    this.updateK(i);
    this.initInvK();
    this.updateCurveCache(i);
  }

  kernel(x1, x2) {
    return this.kernels[this.active_ker].call(x1, x2);
  }


  jumps(x) {
    var k = this.kernels[this.active_ker];
    return k.cuts(x, this.ctx.xmin, this.ctx.xmax);
  }


  solutionAlpha() {
    var y = new mat.Matrix([this.y]);
    var alpha = y.mmul(this.invK).flat();
    return alpha;

  }

  functionNorm() {
    var a = new mat.Matrix([this.alpha]);
    var norm = a.mmul(this.K).mmul(a.transpose()).flat()[0];
    // console.log(norm);
    return norm;
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


  curve(i) {
    var line = '', ys;
    var a = this.alpha[i];
    for (let s = 0; s != this.xCache.length; s++) {
      ys = this.curveCache[i][s].map(y => a * y);
      line += this.makeLine(this.xCache[s], ys);
    }
    return line;
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

  
  // return the weighted u,v points for the i'th curve
  points(i) {
    var a = this.alpha[i], x1 = this.x[i];
    return d3.range(this.n).map(i => [
      this.ctx.u(this.x[i]),
      this.ctx.v(a * this.K.get(i,j))
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

