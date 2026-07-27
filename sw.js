// Deo Fortis — App Shell Service Worker
// Purpose: let the app itself (index.html, app.js, fonts, icon, CDN libs)
// launch with zero connectivity — not just the flashcard/data caching that
// already lives inside app.js. This only ever touches static shell files;
// it never intercepts Supabase requests, which app.js already handles its
// own way (see the offline flashcard cache + pending-sync queue).

const CACHE_NAME='deo-fortis-shell-v1';

const SHELL_ASSETS=[
  '/',
  '/index.html',
  '/app.js',
  '/manifest.json',
  '/icon-512.png',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
  'https://cdn.jsdelivr.net/npm/dompurify@3.1.6/dist/purify.min.js',
  'https://cdn.jsdelivr.net/npm/twemoji@14.0.2/dist/twemoji.min.js',
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,700;1,400;1,700&family=DM+Mono:wght@400;500&display=swap'
];

self.addEventListener('install',function(event){
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return Promise.all(SHELL_ASSETS.map(function(url){
        return cache.add(url).catch(function(err){
          console.warn('[sw] could not precache',url,err);
        });
      }));
    })
  );
});

self.addEventListener('activate',function(event){
  event.waitUntil(
    caches.keys().then(function(names){
      return Promise.all(names.filter(function(n){return n!==CACHE_NAME;}).map(function(n){return caches.delete(n);}));
    }).then(function(){return self.clients.claim();})
  );
});

self.addEventListener('fetch',function(event){
  var req=event.request;
  if(req.method!=='GET')return;

  var url=new URL(req.url);

  // Never touch Supabase (or any other) API calls — those are dynamic
  // data, and app.js already has its own offline cache + sync queue for
  // flashcards. Let those requests go straight to the network so they
  // fail fast and app.js's own fallback logic can take over.
  if(url.hostname.indexOf('supabase.co')!==-1)return;

  // Stale-while-revalidate for everything else (the app shell + fonts +
  // CDN libraries): serve the cached copy instantly if we have one (this
  // is what makes an offline cold launch possible), while quietly
  // fetching a fresh copy in the background for next time. If there's no
  // cached copy yet, fall back to the network.
  event.respondWith(
    caches.match(req).then(function(cached){
      var networkFetch=fetch(req).then(function(res){
        if(res&&res.status===200){
          var copy=res.clone();
          caches.open(CACHE_NAME).then(function(cache){cache.put(req,copy);});
        }
        return res;
      }).catch(function(){return cached;});
      return cached||networkFetch;
    })
  );
});
