const V="bunkmess-v1",SHELL=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png"];
const CDN=["cdn.tailwindcss.com","unpkg.com","esm.sh","cdnjs.cloudflare.com","www.gstatic.com","fonts.gstatic.com"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=="GET"||u.pathname.startsWith("/recaptcha"))return;
  if(u.origin!==location.origin&&!CDN.includes(u.hostname))return; // Firebase API calls always go to the network
  if(r.mode==="navigate"){e.respondWith(fetch(r).then(x=>{const c=x.clone();caches.open(V).then(k=>k.put("index.html",c));return x}).catch(()=>caches.match("index.html")));return}
  e.respondWith(caches.match(r).then(h=>{const n=fetch(r).then(x=>{if(x.ok||x.type==="opaque"){const c=x.clone();caches.open(V).then(k=>k.put(r,c))}return x}).catch(()=>h);return h||n}));
});
