import * as gauss from './gaussian.js';

export class RBFKernel {
  constructor() {
    this.g = new gauss.Gaussian([0], [[1]]);
  }

  call(x1, x2) {
    return this.g.at([x1 - x2]);
  }

  set_sigma(sigma) {
    this.g = new gauss.Gaussian([0], [[sigma]]);
  }

  cuts(x, beg, end) {
    return [];
  }
}

export class RBFShuffleKernel {
  constructor(cut_size) {
    this.g = new gauss.Gaussian([0], [[1]]);
    this.cut_size = cut_size;
  }

  call(x1, x2) {
    var c = this.cut_size;
    var d = Math.floor(x2 / c);
    var r = x2 - d * c;
    if (Math.abs(d % 2) == 1) 
      x2 += c - 2 * r;

    return this.g.at([x2 - x1]);
  }

  set_sigma(sigma) {
    this.g = new gauss.Gaussian([0], [[sigma]]);
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



