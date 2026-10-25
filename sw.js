const C="mes-feux-v4";
const FILES=["./","index.html","manifest.json","icon-192.png","icon-512.png","apple-touch-icon.png",
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"];
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)).catch(()=>{}))});
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
  const u=new URL(e.request.url);
  const mine=u.origin===self.location.origin||u.hostname==="cdnjs.cloudflare.com"||u.hostname.endsWith("googleapis.com")||u.hostname.endsWith("gstatic.com");
  if(!mine||e.request.method!=="GET") return; // carte, itinéraires, recherche : toujours en direct
  e.respondWith(fetch(e.request,{cache:"no-cache"}).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(e.request,cp));return res}).catch(()=>caches.match(e.request)));
});
