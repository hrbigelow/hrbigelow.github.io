import * as gauss from './gaussian.js';
import * as scr from './scramble.js';
import * as d3 from 'd3';
import * as mat from 'ml-matrix';

const STEP = 0.05;
const N_SCRAMBLE = 10;

export class Plot {
  constructor(context, n) {
    console.log('in constructor with ', n);
    this.ctx = context; 
    this.height = this.ctx.height;
    this.width = this.ctx.width;
    this.unitToBeta = d3.scaleLinear().domain([0, 1]).range([-3, 3]);
    this.n = n;
    this.g = new gauss.Gaussian([0], [[1]]);
    this.maps = [null, null];
    this.maps[0] = scr.Scramble.identity(this.ctx.xmin, this.ctx.xmax);
    this.maps[1] = new scr.Scramble(N_SCRAMBLE, this.ctx.xmin, this.ctx.xmax);
    this.active_map = 0;
    this.populate();

  }

  toggle_scramble() {
    console.log('in toggle_scramble');
    this.active_map = 1 - this.active_map;
  }

  scrambled() {
    return this.active_map == 1;
  }

  map() {
    return this.maps[this.active_map];
  }

  reset() {
    this.active_map = 0;
    this.maps[1] = new scr.Scramble(N_SCRAMBLE, this.ctx.xmin, this.ctx.xmax);
    this.populate();
  }

  populate() {
    console.log('in populate');
    var n = this.n;
    this.x = new Array(n);
    this.y = new Array(n);
    this.beta = new Array(n);

    for (let i = 0; i != n; i++) {
      this.x[i] = this.ctx.unitToX(Math.random());
      this.beta[i] = this.unitToBeta(Math.random());
    }
    for (let i = 0; i != n; i++) {
      this.y[i] = this._point(this.x, this.beta, this.x[i]);
    }

    for (let i = 0; i != n; i++) {
      this.beta[i] = 1.0;
    }
  }

  kernel(x1, x2) {
    return this.g.at([x1 - x2]);
  }

  mx(x) {
    return this.maps[this.active_map].get(x);
  }


  solve() {
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
    var invK = mat.inverse(K);
    var beta = y.mmul(invK);
    for (let i = 0; i != n; i++) {
      this.beta[i] = beta.get(0, i);
    }
  }


  updateContext(context) {
    console.log('in updateContext');
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

  updateBeta(delta, index) {
    this.beta[index] += delta;
  }

  makeLine(xs, ys) {
    const path = d3.line()
      .x(d => this.ctx.u(d[0]))
      .y(d => this.ctx.v(d[1]))(d3.zip(xs,ys));
    return path;
  }


  // provide the mapped xs and ys for the provided segment 
  _curve(args1, alphas, segment) {
    var s = segment;
    var xmap = this.map();
    var xs = d3.range(xmap.x[s], xmap.x[s+1], STEP);
    var mxs = xs.map(x => xmap.get(x));
    var ys = xs.map(
      x => d3.zip(args1, alphas).map(
        ([x1, alpha]) => alpha * this.kernel(x1, x)
      )
      .reduce((p, q) => p + q, 0)
    );
    return [mxs, ys];
  }

  // returns i'th scaled curve line
  _curveSegment(args1, alphas, s) {
    var mxs, ys, line = '';
    [mxs, ys] = this._curve(args1, alphas, s);
    var line = this.makeLine(mxs, ys);
    return line;
  }

  _curveFull(args1, alphas) {
    var line = '';
    for (let s = 0; s != this.map().ns; s++) {
      line += this._curveSegment(args1, alphas, s);
    }
    return line;
  }

  curve(x, alpha) {
    return this._curveFull([x], [alpha]);
  }

  solutionCurve() {
    return this._curveFull(this.x, this.beta);
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
    return this.ctx.v(y);
  }


  solutionPoint(x) {
    const y = this._point(this.x, this.beta, x);
    return this.ctx.v(y);
  }


  u(x) {
    return this.ctx.u(this.maps[this.active_map].get(x));
  }

  v(y) {
    return this.ctx.v(y);
  }


}

