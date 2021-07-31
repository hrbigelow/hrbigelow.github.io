/* To synchronize two or more components that share data,
 * see https://svelte.dev/repl/a2e5e34a08b4491a975d523ded3b82c2?version=3.41.0
 * 
 */
export class Sync {
  constructor(sig, component_num, update_fn) {
		component_num = parseInt(component_num);
		if (isNaN(component_num) || component_num <= 0)
      throw `sync.js: component_num must be integer > 0, got ${component_num}`;
		
		this.sig = sig;
		this.cnum = component_num;
		this.sig.subscribe((val) => {
  		if (Math.abs(val) != this.cnum) {
	  		// console.log(`updating component ${this.cnum}`)
  	  	update_fn();
		  }    
		});
	}
	
	notify() {
		// console.log(`notify from component ${this.cnum}`);
		this.sig.update(n => {
  		var sign = Math.sign(n) || 1;
      return -sign * this.cnum;
		});
	}
}

