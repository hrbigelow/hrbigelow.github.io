import * as gauss from './gaussian.js';
import * as ker from './kernel.js';
import * as d3 from 'd3';
import * as mat from 'ml-matrix';

const STEP = 0.0125;
// const STEP = 0.5;
const CUT_SIZE = 2;
const ALPHA_RANGE = 5;

export class Plot {
  constructor(context, n) {
    this.touch = 0;
    this.ctx = context; 
    this.height = this.ctx.height;
    this.width = this.ctx.width;
    this.unitToAlpha = d3.scaleLinear().domain([0, 1]).range([-ALPHA_RANGE, ALPHA_RANGE]);
    this.n = n;
    this.kernels = [null, null];
    this.kernels[0] = new ker.RBFKernel();
    this.kernels[1] = new ker.RBFShuffleKernel(CUT_SIZE);
    this.active_ker = 0;

    // matrix p = row i is phi(mu_i)
    // matrix f = row i is phi(x_i)
    // pft means P F^T, ppt means P P^T
    // when mu_i = x_i, then P = F, and PF^T = FF^T = K
    this.pft = mat.Matrix.zeros(this.n, this.n);
    this.ppt = mat.Matrix.zeros(this.n, this.n);
    this.invpft = mat.Matrix.zeros(this.n, this.n);
    this.curveCache = null; // cc[ci][xi] = y.  (curve_idx, x_idx)
    this.xCache = null;
    this.invertible = true;

    this.populate();

  }

  get_xrange() {
    return [this.ctx.xmin, this.ctx.xmax];
  }

  // if i is undefined, initialize the whole matrix
  // otherwise, initialize i'th row and column only
  init_metrics() {
    this.init_ppt();
    this.init_pft();
  }

  init_ppt() {
    var n = this.n;
    this.ppt = mat.Matrix.zeros(this.n, this.n);
    for (let i = 0; i != n; i++) {
      for (let j = 0; j != n; j++) {
        this.ppt[i][j] = this.kernel(this.mu[i], this.mu[j]); 
      }
    }
  }

  update_ppt(i) {
    for (let j = 0; j != this.n; j++){
      this.ppt[i][j] = this.kernel(this.mu[i], this.mu[j]);
      this.ppt[j][i] = this.kernel(this.mu[j], this.mu[i]);
    }
  }

  init_pft() {
    var n = this.n;
    this.pft = mat.Matrix.zeros(this.n, this.n);
    for (let i = 0; i != n; i++) {
      for (let j = 0; j != n; j++) {
        this.pft[i][j] = this.kernel(this.mu[i], this.x[j]); 
      }
    }
  }

  update_pft(i) {
    for (let j = 0; j != this.n; j++){
      this.pft[i][j] = this.kernel(this.mu[i], this.x[j]);
      this.pft[j][i] = this.kernel(this.mu[j], this.x[i]);
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
    this.initXCache();
    this.curveCache = new Array(n);
    for (let ci = 0; ci != n; ci++) 
        this.updateCurveCache(ci);
  }

  // updates i'th curve Cache
  updateCurveCache(ci) {
    var seg;
    this.curveCache[ci] = new Array();
    for (let si = 0; si != this.xCache.length; si++) {
      seg = this.xCache[si].map(x => this.kernel(this.mu[ci], x));
      this.curveCache[ci].push(...seg);
    }
  }

  toggle_scramble() {
    this.active_ker = 1 - this.active_ker;
    this.init_metrics();
    this.initCurveCache();
  }

  scrambled() {
    return this.active_ker == 1;
  }

  cut_size() {
    return CUT_SIZE;
  }

  resetAlpha() {
    this.alpha.fill(1);
  }

  set_sigma(log_sigma) {
    for (let k = 0; k != this.kernels.length; k++) {
      this.kernels[k].set_sigma(Math.pow(10, log_sigma))
    }
    for (let ci = 0; ci != this.n; ci++)
      this.updateCurveCache(ci);

    this.init_metrics();
  }

  recenter_mu() {
    for (let i = 0; i != this.n; i++) {
      this.mu[i] = this.x[i];
    }
    this.init_metrics();
    this.initCurveCache();
  }

  get_sigma2() {
    return this.kernels[this.active_ker].get_sigma2();
  }

  populate() {
    var n = this.n;
    this.x = new Array(n);
    this.y = new Array(n);
    this.mu = new Array(n);
    this.alpha = new Array(n); 

    for (let i = 0; i != n; i++) {
      this.x[i] = this.ctx.unitToX(Math.random());
      this.mu[i] = this.x[i];
      this.alpha[i] = this.unitToAlpha(Math.random());
    }
    this.init_metrics();
    this.initCurveCache();

    for (let i = 0; i != n; i++) 
      this.y[i] = this.solutionPoint(i);

    this.alpha.fill(1.0);
  }

  setDataPoint(i, u, v) {
    // update the value of the i'th data point
    this.x[i] = this.ctx.x(u);
    this.y[i] = this.ctx.y(v);
    this.init_pft(i);
    this.updateCurveCache(i);
  }

  setMu(i, u) {
    this.mu[i] = this.ctx.x(u);
    this.update_ppt(i);
    this.update_pft(i);
    this.updateCurveCache(i);
  }

  kernel(x1, x2) {
    return this.kernels[this.active_ker].call(x1, x2);
  }

  jumps(x) {
    var k = this.kernels[this.active_ker];
    return k.cuts(x, this.ctx.xmin, this.ctx.xmax);
  }


  // return the solution, or if failed,
  // plot.alpha
  solutionAlpha() {
    var y = new mat.Matrix([this.y]);
    try {
      var inv = mat.inverse(this.pft); 
      var alpha = y.mmul(inv).flat();
      self.invertible = true;
      return alpha;

    } catch(err) {
      // console.log('could not invert.  leaving as-is');
      self.invertible = false;
      return plot.alpha;
    }

  }

  functionNorm() {
    var a = new mat.Matrix([this.alpha]);
    /*
    var n = this.n, v;
    var tmp = mat.Matrix.zeros(this.n, this.n);
    for (let i = 0; i != n; i++) {
      for (let j = 0; j != n; j++) {
        v = this.kernel(this.mu[i], this.mu[j]);
        tmp.set(i,j,v);
        tmp.set(j,i,v);
      }
    }
    */
    var norm2 = a.mmul(this.ppt).mmul(a.transpose()).flat()[0];
    // console.log(norm);
    return Math.sqrt(norm2);
  }

  resize(w, h) {
    this.ctx.setWidth(w);
    this.ctx.setHeight(h);
    this.width = this.ctx.width;
    this.height = this.ctx.height;
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
    if (this.n == 1) return;
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

  makeLines(ys) {
    var line = '';
    var off = 0, rng, len;
    for (let si = 0; si != this.xCache.length; si++) {
      rng = this.xCache[si];
      len = rng.length;
      line += this.makeLine(rng, ys.slice(off, off + len));
      off += len;
    }
    return line;
  }

  curve(ci) {
    var line = '', ys;
    var a = this.alpha[ci];
    var ys = this.curveCache[ci].map(y => a * y);
    return this.makeLines(ys);
  }

  solutionCurve() {
    if (this.n == 0) return '';
    var ys = new Array(this.curveCache[0].length).fill(0.0);

    for (let ci = 0; ci != this.n; ci++) {
      var a = this.alpha[ci];
      var cc = this.curveCache[ci];
      for (let xi = 0; xi != cc.length; xi++)
        ys[xi] += cc[xi] * a;
    }
    return this.makeLines(ys);
  }
  
  // return the u,v points for the i'th scaled curve
  points(i) {
    var a = this.alpha[i];
    var pts = d3.range(this.n).map(j => [
      this.ctx.u(this.x[j]), 
      this.ctx.v(a * this.pft.get(i,j))
    ]);
    return pts;
  }

  data() {
    return d3.zip(this.x, this.y).map(([x,y]) => 
      [this.ctx.u(x), this.ctx.v(y)]
    );
  }

  getMuX() {
    return d3.zip(this.mu, this.x).map(([mu,x]) => 
      [this.ctx.u(mu), this.ctx.u(x)]
    );
  }

  // return the y value for the solution at the i'th x location
  // unused currently
  solutionPoint(i) {
    var y = d3.range(this.n).map(j => this.alpha[j] * this.pft.get(i,j))
      .reduce((y1, y2) => y1 + y2, 0);
    return y;
  }


  u(x) {
    return this.ctx.u(x);
  }

  v(y) {
    return this.ctx.v(y);
  }


}

