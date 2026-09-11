const BASE=new URL(self.registration.scope).pathname;
const VERSION='dalbong-quiz-island-72c6bed88e5e';const CACHE=VERSION+'-static';
const local=path=>BASE+path.replace(/^\//,'');
const CORE=['','icon.svg','manifest.webmanifest',...['mori','lulu','komi'].flatMap(p=>[0,1,2].map(s=>`renders/${p}-${s}.png`))].map(local);
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE))));
self.addEventListener('message',e=>{if(e.data?.type==='ACTIVATE')self.skipWaiting();});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('dalbong-quiz-island-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);if(r.method!=='GET'||u.origin!==self.location.origin||!u.pathname.startsWith(BASE))return;const relative=u.pathname.slice(BASE.length);if(relative.startsWith('api/')||relative==='sw.js'||relative==='deployment.json')return;
if(r.mode==='navigate'){e.respondWith(fetch(r).then(response=>{if(response.ok&&response.headers.get('content-type')?.includes('text/html')){const copy=response.clone();caches.open(CACHE).then(c=>c.put(BASE,copy));}return response;}).catch(async()=>await caches.match(BASE)??new Response('첫 접속에는 인터넷 연결이 필요합니다.',{status:503})));return;}
if(/^(assets\/|models\/|renders\/|icon|manifest.webmanifest)/.test(relative))e.respondWith(caches.open(CACHE).then(async c=>{const cached=await c.match(r);if(cached)return cached;const response=await fetch(r);if(response.ok&&response.type==='basic')await c.put(r,response.clone());return response;}));});
