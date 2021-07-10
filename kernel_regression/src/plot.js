import * as gauss from './gaussian';
import * as d3 from 'd3';
import * as mat from 'ml-matrix';

const STEP = 0.1;
const MAX_N = 20;

function shuffle(array) {
  var currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

class Scramble {
  constructor(k) {
    var cuts = [0];
    var inds = [0];
    var y = [];
    var slope = [];
    var j;

    for (let i = 0; i != k; i++) {
      cuts.push(Math.random());
      inds.push(i+1);
    }
    inds = shuffle(inds);
    cuts.sort();
    for (let i = 0; i != k+1; i++) {
      slope.push(Math.random() < 0.5);
      j = inds[i];
      y.push(slope[-1] ? cuts[j] : cuts[j+1]);
    }

    this.x = cuts;
    this.y = y;
    this.slope = slope;
  }
      
}


export class Plot {
  constructor(context, n) {
    console.log('in constructor with ', n);
    this.ctx = context; 
    this.height = this.ctx.height;
    this.width = this.ctx.width;
    this.unitToBeta = d3.scaleLinear().domain([0, 1]).range([-3, 3]);
    this.n = n;
    this.g = new gauss.Gaussian([0], [[1]]);
    this.populate();

  }

  kernel(x1, x2) {
    return this.g.at([x1 - x2]);
  }

  populate() {
    this.x = new Array(MAX_N);
    this.y = new Array(MAX_N);
    this.beta = new Array(MAX_N);

    for (let i = 0; i != MAX_N; i++) {
      this.x[i] = this.ctx.unitToX(Math.random());
      this.beta[i] = this.unitToBeta(Math.random());
    }
    var prev_n = this.n;
    this.n = MAX_N;
    for (let i = 0; i != MAX_N; i++) {
      this.y[i] = this.f(this.x[i]);
    }
    this.n = prev_n;

    for (let i = 0; i != MAX_N; i++) {
      this.beta[i] = 1.0;
    }
  }

  getx() {
    return this.x.slice(0, this.n);
  }

  gety() {
    return this.y.slice(0, this.n);
  }

  getbeta() {
    return this.beta.slice(0, this.n);
  }

  data() {
    return d3.zip(this.getx(), this.gety(), this.getbeta());
  }

  chirp() {
    console.log('in chirp: ', this);
  }


  solve() {
    var n = this.n;
    var K = mat.Matrix.zeros(n, n);
    var y = new mat.Matrix([this.gety()]);
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
  }

  delPoint() {
    if (this.n == 0) return;
    this.n--;
  }

  updateBeta(delta, index) {
    this.beta[index] += delta;
  }

  makeLine(points) {
    const path = d3.line()
      .x(d => this.ctx.u(d[0]))
      .y(d => this.ctx.v(d[1]))(points);
    return path;
  }

  curve(mean, scale) {
    const xs = d3.range(this.ctx.xmin, this.ctx.xmax + STEP, STEP);
    const ys = xs.map(x => scale * this.kernel(x, mean));
    const pts = d3.zip(xs,ys);
    return this.makeLine(pts);
  }

  curvePoint(mean, scale, x) {
    // returns the gaussian value with mean at point x
    const v = this.ctx.v(scale * this.kernel(x, mean));
    return v;
  }

  solutionCurve() {
    const xs = d3.range(this.ctx.xmin, this.ctx.xmax + STEP, STEP);
    const ys = xs.map(x => this.data().map(
      ([m,_,b]) => b * this.kernel(m, x))
      .reduce((p, q) => p + q, 0)
    );
    const pts = d3.zip(xs,ys);
    return this.makeLine(pts);
  }


  f(x) {
    const y = this.data().map(([m,_,b]) => b * this.kernel(m, x))
      .reduce((p, q) => p + q, 0);
    return y;
  }

  solutionPoint(x) {
    var y = this.f(x);
    return this.ctx.v(y);
  }


  u(x) {
    return this.ctx.u(x);
  }

  v(y) {
    return this.ctx.v(y);
  }


}

