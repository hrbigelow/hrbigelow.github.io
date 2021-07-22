import * as gauss from './gaussian.js';

export class RBFKernel {
  constructor() {
    this.g = new gauss.Gaussian([0], [[1]]);
    this.scale = 1.0 / this.g.at([0]);
  }

  call(x1, x2) {
    return this.g.at([x1 - x2]) * this.scale;
  }

  // find +x solving call(0, x) = y
  inv0(y) {
    var sigma2 = this.get_sigma2();
    var ys = y / this.scale;
    const sspi = Math.sqrt(sigma2 * 2.0 * Math.PI);
    const dssq = -2.0 * sigma2; 
    var x = Math.sqrt(dssq * Math.log(ys * sspi));
    return x;
  }

  set_sigma(sigma) {
    this.g = new gauss.Gaussian([0], [[sigma * sigma]]);
    this.scale = 1.0 / this.g.at([0]);
  }

  get_sigma2() {
    return this.g.cov[0][0];
  }

  cuts(x, beg, end) {
    return [];
  }
}

export class RBFShuffleKernel {
  constructor(cut_size) {
    this.g = new gauss.Gaussian([0], [[1]]);
    this.scale = 1.0 / this.g.at([0]);
    this.cut_size = cut_size;
  }

  call(x1, x2) {
    var c = this.cut_size;
    var d = Math.floor(x2 / c);
    var r = x2 - d * c;
    if (Math.abs(d % 2) == 1) 
      x2 += c - 2 * r;

    return this.g.at([x2 - x1]) * this.scale;
  }

  set_sigma(sigma) {
    this.g = new gauss.Gaussian([0], [[sigma * sigma]]);
    this.scale = 1.0 / this.g.at([0]);
  }

  get_sigma2() {
    return this.g.cov[0][0];
  }

  // return a list of points of discontinuity in [beg, end] for the
  // representer function of x
  cuts(x, beg, end) {
    var s = beg; 
    var p = [];
    while (s < end) {
      p.push(s);
      s += this.cut_size;
    }
    return p;
  }
}



