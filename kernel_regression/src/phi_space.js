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
    this.plot.resize(w, h);
  }

  // update the second basis vector, assuming the kernel with k(v, v) = 1 for
  // all v
  updateBasis() {
    var kv = this.plot.K[0][1];
    var ang = Math.acos(kv);
    this.basis[1][0] = Math.cos(ang);
    this.basis[1][1] = Math.sin(ang);
  }

  // update the current function f
  updateF(u, v) {
    var fx = this.toXY(u, 0);
    var fy = this.toXY(v, 1);
    var F = new Matrix([[fx, fy]]);
    this.plot.alpha = F.mmul(inverse(this.basis)).flat();
  }

  F(i) {
    var xy = this.alpha().mmul(this.basis).flat();
    return this.toUV(xy[i], i);
  }
  
  updateY(u, v) {
    var fhat = [this.toXY(u, 0), this.toXY(v, 1)];
    var y = new Matrix([fhat]).mmul(this.basis.transpose()).flat();
    this.plot.y = y;
  }

  _fHat() {
    var alpha_hat = new Matrix([this.plot.solutionAlpha()]);
    var f_hat = alpha_hat.mmul(this.basis).flat();
    return f_hat;
  }

  // c'th component of the solution vector
  fHat(c) {
    var f_hat = this._fHat();
    return this.toUV(f_hat[c], c);
  }

  fHatProj(b, c) {
    var fhp = proj(this.basis[b], this._fHat())[c];
    return this.toUV(fhp, c);
  }

  alpha() {
    return new Matrix([this.plot.alpha]);
  }

  // calculate the projection of F onto the j'th component of the i'th basis
  Fproj(b,c) {
    var dp = this.alpha().mmul(this.plot.K)[0][b];
    var proj = dp * this.basis[b][c];
    return this.toUV(proj, c);
  }


  // calculate c'th component of projection of y onto b'th basis.
  Yproj(b,c) {
    var dp = new Matrix([this.plot.y]).mmul(this.basis.transpose())[0][b];
    var proj = dp * this.basis[b][c];
    // console.log(b, c, dp);
    return this.toUV(proj, c);
  }

  scr(i,c) {
    return this.toUV(this.basis[i][c], c);
  }

}

