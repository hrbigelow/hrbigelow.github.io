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

export class Scramble {
  constructor(n_segments, beg, end) {
    this.ns = n_segments;

    this.beg = beg;
    this.end = end;
    var sbeg = [beg]; // segment begin position
    this.inds = []; // segment index order
    this.y = []; // start y position of segment
    this.x = []; // start x position of segment
    this.up = []; // if this segment slopes up
    var j;

    for (let s = 0; s < this.ns - 1; s++) {
      sbeg.push(beg + (end - beg) * Math.random());
      this.inds.push(s);
    }

    // dummy segment begin at the end
    sbeg.push(end);
    this.inds.push(this.ns - 1);

    this.inds = shuffle(this.inds);
    sbeg.sort((a, b) => a - b);
    var sb = beg;

    for (let s = 0; s < this.ns; s++) {
      this.up.push(Math.random() < 0.5);
      j = this.inds[s];
      this.x.push(sb);
      sb += sbeg[j+1] - sbeg[j];
      this.y.push(this.up[s] ? sbeg[j] : sbeg[j+1]); 
    }
    this.x.push(end);

  }

  static identity(beg, end) {
    var scr = new Scramble(1, beg, end);
    scr.y[0] = scr.beg;
    scr.up[0] = true;
    return scr;
  }

  is_identity() {
    return this.ns == 1 && this.y[0] == this.beg && this.up[0];
  }

  get(x) {
    if (x < this.beg || x > this.end) {
      throw `invalid input to Scramble::get (${x}).  ` +
      `must be in [${this.beg}, ${this.end}]`;
    }

    var s;
    for (s = 0; s != this.ns; s++) {
      if (x < this.x[s]) break;
    }
    s--;
    var del = x - this.x[s];
    return this.up[s] ? this.y[s] + del : this.y[s] - del;
  }
      
}


