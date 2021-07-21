export function numberDisplay(n) {
  var ns = Math.abs(n) > 1000 ? n.toExponential(2) : n.toFixed(2);
  return ns;
}

