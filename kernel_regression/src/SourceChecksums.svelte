<script>

let script_digest;

async function content_digest(path)
{
  const res = await fetch(path);
  const text = await res.text();
  if (res.ok) {
    const hex = await digestMessage(text);
    return hex;
  } else {
    throw new Error(text);
  }
}

async function digestMessage(message) {
  const msgUint8 = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);           // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
  return hashHex;
}


</script>

{#each ['build/bundle.css', 'build/bundle.js'] as path}
  {#await content_digest(path)}
    <p>...waiting</p>
  {:then digest}
    <div>{path} digest: {digest}</div>
  {:catch error}
    <div>{path} Error: {error.message}</div>
  {/await}
{/each}


