import { Plot } from './plot.js';
import { Context } from './context.js';
import * as d3 from 'd3';
import * as mat from 'ml-matrix';

const XMIN = -4;
const XMAX = 4;

export class PhiSpace {
  constructor(max_alpha) {
    this.basis = new mat.Matrix([[1,0], [0,0]]);
    this.alpha = new mat.Matrix([[1, 1]]);
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
    var fx = this.xTou.invert(u);
    var fy = this.yTov.invert(v);
    var F = new mat.Matrix([[fx, fy]]);
    this.alpha = F.mmul(mat.inverse(this.basis));
    this.plot.alpha = this.alpha.flat();
  }

  F(i) {
    var [x, y] = this.alpha.mmul(this.basis).flat();
    return [this.xTou(x), this.yTov(y)][i];
  }

  scr(i,c) {
    if (c == 0) return this.xTou(this.basis[i][0]);
    else return this.yTov(this.basis[i][1]);
  }

}

