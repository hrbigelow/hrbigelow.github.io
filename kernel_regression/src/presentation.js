// accept single number or array
// return single number or array
export function numberDisplay(nums) {
  var fn = (n) => Math.abs(n) > 1000 ? n.toExponential(2) : n.toFixed(2);
  if (nums instanceof Array) return nums.map(fn);
  else return fn(nums);
}

