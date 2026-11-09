const CACHE='vowgarden-easy-1-5-compliance-20261109';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('vowgarden-easy-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
if(e.request.method!=='GET')return;
const url=new URL(e.request.url),scope=new URL(self.registration.scope);
if(url.origin!==scope.origin||!url.pathname.startsWith(scope.pathname))return;
e.respondWith(fetch(e.request).then(resp=>{if(resp.ok){const dup=resp.clone();caches.open(CACHE).then(c=>c.put(e.request,dup)).catch(()=>{});}return resp;}).catch(()=>caches.match(e.request).then(x=>x||caches.match('./'))));
});
