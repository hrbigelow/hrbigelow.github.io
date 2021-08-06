import { Plot } from './plot.js';
import { Context } from './context.js';
import * as d3 from 'd3';
import { Matrix, inverse } from 'ml-matrix';

const XMIN = -4;
const XMAX = 4;

function dotp(p, q) {
  return p[0] * q[0] + p[1] * q[1];
}

function norm2(p) {
  return dotp(p, p);
}

function scale(p, factor) {
  return [p[0] * factor, p[1] * factor];
}

// calculate the vector projection of arg to onto
function proj(onto, arg) {
  return scale(onto, dotp(onto, arg) / norm2(onto));
}


export class PhiSpace {
  constructor(max_alpha) {
    this.basis = new Matrix([[1,0], [0,0]]);
    this.xTou = d3.scaleLinear().domain([-max_alpha, max_alpha]);
    this.yTov = d3.scaleLinear().domain([-max_alpha, max_alpha]);

    var ctx = new Context(10, 10, [XMIN, XMAX], [XMIN, XMAX]);
    this.plot = new Plot(ctx, 2);
    this.updateBasis();
    this.plot.init_metrics();
    this.plot.initCurveCache();
  }

  toUV(xy) {
    return [this.xTou(xy[0]), this.yTov(xy[1])];
  }

  toXY(val) {
    return [this.xTou.invert(val[0]), this.yTov.invert(val[1])];
  }

  resize(w, h) {
    this.xTou.range([0, w]);
    this.yTov.range([h, 0]);
    this.plot.resize(w, h);
  }

  // update the second basis vector, assuming the kernel with k(v, v) = 1 for
  // all v
  updateBasis() {
    var kv = this.plot.ppt[0][1];
    var ang = Math.acos(kv);
    this.basis[1][0] = Math.cos(ang);
    this.basis[1][1] = Math.sin(ang);
  }

  // update the current function f
  updateF(u, v) {
    var f = this.toXY([u, v]);
    var F = new Matrix([f]);
    this.plot.alpha = F.mmul(inverse(this.basis)).flat();
  }

  F() {
    var [x, y] = this.alpha().mmul(this.basis).flat();
    var [u, v] = [this.xTou(x), this.yTov(y)];
    var deg = Math.atan2(y, x) * (-180.0 / Math.PI);
    return {u, v, deg};
  }

  updateY(u, v) {
    var F = new Matrix([this.toXY([u, v])]);
    var alpha  = F.mmul(inverse(this.basis));
    var y = alpha.mmul(this.plot.pft);
    // console.log(y);
    this.plot.y = y.flat();
  }
  
  _fHat() {
    var alpha_hat = new Matrix([this.plot.solutionAlpha()]);
    var f_hat = alpha_hat.mmul(this.basis).flat();
    return f_hat;
  }

  // c'th component of the solution vector
  fHat() {
    var f_hat = this._fHat();
    return this.toUV(f_hat);
  }

  fHatProj(b) {
    var fhp = proj(this.basis[b], this._fHat());
    return this.toUV(fhp);
  }

  alpha() {
    return new Matrix([this.plot.alpha]);
  }

  scr(i) {
    return this.toUV(this.basis[i]);
  }

}

