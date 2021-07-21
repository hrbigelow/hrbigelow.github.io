import { Plot } from './plot.js';
import { Context } from './context.js';
import * as d3 from 'd3';
import { Matrix, inverse } from 'ml-matrix';

const XMIN = -4;
const XMAX = 4;

export class PhiSpace {
  constructor(max_alpha) {
    this.basis = new Matrix([[1,0], [0,0]]);
    this.alpha = new Matrix([[1, 1]]);
    this.xp = XMAX - 2;
    this.xTou = d3.scaleLinear().domain([-max_alpha, max_alpha]);
    this.yTov = d3.scaleLinear().domain([-max_alpha, max_alpha]);

    var ctx = new Context(10, 10, [XMIN, XMAX], [XMIN, XMAX]);
    this.plot = new Plot(ctx, 2);
    this.plot.x[0] = this.xp;
    this.plot.x[1] = this.xp - 2;
    this.updateBasis(this.plot.x[1]);
    this.plot.alpha = this.alpha.flat();
    this.plot.initK();
    this.plot.initCurveCache();
  }

  toUV(val, i) {
    if (i == 0) return this.xTou(val);
    return this.yTov(val);
  }

  toXY(val, i) {
    if (i == 0) return this.xTou.invert(val);
    return this.yTov.invert(val);
  }

  resizePhi(w, h) {
    this.xTou.range([0, w]);
    this.yTov.range([h, 0]);
  }

  resizeCtx(w, h) {
    this.plot.ctx.setWidth(w);
    this.plot.ctx.setHeight(h);
    this.plot.updateContext(this.plot.ctx);
  }

  // update the second basis vector, assuming the kernel with k(v, v) = 1 for
  // all v
  updateBasis(x2) {
    var kv = this.plot.kernel(this.xp, x2);
    var ang = Math.acos(kv);
    this.basis[1][0] = Math.cos(ang);
    this.basis[1][1] = Math.sin(ang);
  }

  // update the current function f
  updateF(u, v) {
    var fx = this.toXY(u, 0);
    var fy = this.toXY(v, 1);
    var F = new Matrix([[fx, fy]]);
    this.alpha = F.mmul(inverse(this.basis));
    this.plot.alpha = this.alpha.flat();
  }

  F(i) {
    var xy = this.alpha.mmul(this.basis).flat();
    return this.toUV(xy[i], i);
  }

  // calculate the projection of F onto the j'th component of the i'th basis
  Fproj(i,j) {
    var l = this.alpha.mmul(this.plot.K)[0][i];
    return this.toUV(this.basis[i][j] * l, j);
  }

  scr(i,c) {
    return this.toUV(this.basis[i][c], c);
  }

}

