const CACHE='gaden-smart-farm-v1';
const SHELL=['/dashboard/','/dashboard/index.html','/dashboard/css/app.css','/dashboard/js/app.js','/dashboard/js/state.js','/dashboard/js/mqtt.js','/manifest.json','/dashboard/icon.svg'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL))));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;event.respondWith(fetch(event.request).catch(()=>caches.match(event.request).then(r=>r||new Response('Offline',{status:503,headers:{'content-type':'text/plain;charset=utf-8'}}))))});
