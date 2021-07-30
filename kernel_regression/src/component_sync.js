export function make_sync(updater, sig, owner_component) {
  var ready = true;
  var source = owner_component;

  /* Synopsis: 
   * import { writable } from 'svelte/store';
   * let sig = writable(0);
   * 
   * $: respond($sig);
   * $: notify(obj);
   *
   */
  function respond(val) {
    console.log(`in ${source} respond(${val})`);
    if (val != source && ready) {
      ready = false;
      updater();
      ready = true;
    }
    // flag = true;
  };

  function notify(debug_msg) {
    if (! ready) return;
    /*
    if (flag) {
      flag = false;
      return;
    } 
    */
    if (debug_msg)
      console.log(`in ${source}'s notify: ${debug_msg}`);
    sig.update(() => source);
  };
  return [respond, notify];
}

