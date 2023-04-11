import { TSE_CIO_CONFIG } from "./helpers/cio-helpers.js";
if (TSE_CIO_CONFIG.siteID && TSE_CIO_CONFIG.region){
  /* altered for ES6 module usage */
  window._cio = window._cio || [];
  (async function () {
  var a,b,c;a=function(f){return function async(){_cio.push([f].
  concat(Array.prototype.slice.call(arguments,0)))}};b=["load","identify",
  "sidentify","track","page","on","off"];for(c=0;c<b.length;c++){_cio[b[c]]=a(b[c])};
  var t = document.createElement('script'),
  s = document.getElementsByTagName('script')[0];
  t.async = true;
  t.id    = 'cio-tracker';
  t.setAttribute('data-site-id', TSE_CIO_CONFIG.siteID );
  t.setAttribute('data-use-array-params', 'true');
  t.setAttribute('data-auto-track-page', 'true');
  t.setAttribute('data-use-in-app', 'true');
  /* altered for dynamic region selection */
  if (/eu/.test(`${TSE_CIO_CONFIG.region}`.toLowerCase()) == false) {
    t.src = 'https://assets.customer.io/assets/track.js';
  } else {
    //account is in the EU, use:
    t.src = 'https://assets.customer.io/assets/track-eu.js'
  }
  
  s.parentNode.insertBefore(t, s);
  })();
}