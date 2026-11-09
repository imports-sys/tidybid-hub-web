const CACHE="vowgarden-v14-20261109-v1";
const STATIC=["./","./index.html","./payload.bin","./manifest.webmanifest","./icon-192.png","./icon-512.png"];
self.addEventListener("install",event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(STATIC)).then(()=>self.skipWaiting())));
self.addEventListener("activate",event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith("vowgarden-v14-")&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",event=>{
 if(event.request.method!=="GET")return;
 const url=new URL(event.request.url), scope=new URL(self.registration.scope);
 if(url.origin!==scope.origin||!url.pathname.startsWith(scope.pathname))return;
 event.respondWith(fetch(event.request).then(response=>{
  if(response.ok){const duplicate=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,duplicate)).catch(()=>{});}
  return response;
 }).catch(()=>caches.match(event.request).then(saved=>saved||caches.match("./"))));
});