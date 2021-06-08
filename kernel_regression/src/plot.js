import * as gauss from './gaussian';
import * as d3 from 'd3';

const STEP = 0.1;

export class Plot {
  constructor(context) {
    this.ctx = context; 
    // this.x = [1, 4, 5, 7.5, 9];
    // this.y = [-0.4, 0.10, 0.25, -0.10, 0.05];
    this.x = [1, 6.5, 7.5];
    this.y = [-0.4, 0.30, 0.05];
    this.beta = [-0.95, 1.15, -0.4];
    // this.beta = this.y.map(y => y / 0.45);
    this.dataset = d3.zip(this.x, this.y, this.beta);
    this.height = this.ctx.height;
    this.width = this.ctx.width;
  }

  makeLine(points) {
    const path = d3.line()
      .x(d => this.ctx.u(d[0]))
      .y(d => this.ctx.v(d[1]))(points);
    return path;
  }

  curve(mean, scale) {
    const g = new gauss.Gaussian([mean], [[1]]);
    const xs = d3.range(this.ctx.xmin, this.ctx.xmax + STEP, STEP);
    const ys = xs.map(x => scale * g.at([x]));
    const pts = d3.zip(xs,ys);
    return this.makeLine(pts);
  }

  curvePoint(mean, scale, x) {
    // returns the gaussian value with mean at point x
    const g = new gauss.Gaussian([mean], [[1]]);
    const v = this.ctx.v(scale * g.at([x]));
    return v;
  }

  solutionCurve() {
    const g = new gauss.Gaussian([0], [[1]]);
    const xs = d3.range(this.ctx.xmin, this.ctx.xmax + STEP, STEP);
    const ys = xs.map(x => this.dataset.map(([m,_,b]) => b * g.at([m-x]))
      .reduce((p, q) => p + q, 0)
    );
    const pts = d3.zip(xs,ys);
    return this.makeLine(pts);
  }

  solutionPoint(x) {
    const g = new gauss.Gaussian([0], [[1]]);
    const y = this.dataset.map(([m,_,b]) => b * g.at([m-x]))
      .reduce((p, q) => p + q, 0);
    return this.ctx.v(y);
  }


  u(x) {
    return this.ctx.u(x);
  }

  v(y) {
    return this.ctx.v(y);
  }


}

