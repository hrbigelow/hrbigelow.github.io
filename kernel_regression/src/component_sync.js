export function make_sync(updater, sig) {
	var flag = false;

  /* Synopsis: 
   * import { writable } from 'svelte/store';
   * let sig = writable(0);
   * 
   * $: respond($sig);
   * $: notify(obj);
   *
   */
	var respond = (val) => {
			updater();
			flag = true;
	};

	var notify = (val) => {
		 if (flag) {
			 flag = false;
			 return;
		 } 
		 sig.update(n => n + 1);
	};
	return [respond, notify];
}

