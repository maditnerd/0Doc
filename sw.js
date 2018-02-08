var docTitle = "snos";
var version = "13";

//https://www.smashingmagazine.com/2016/02/making-a-service-worker/
//Udacity : Google Developer Challenge
staticCacheName = `${docTitle}-${version}`;

//Install cache
self.addEventListener('install', event => {
    console.log("[INSTALL] Service worker");
    event.waitUntil(
        caches.open(staticCacheName).then(
            cache => cache.addAll([
                '0doc.js',
                'index.html',
                'favicon.ico',
                'logo.png',
                'style.css'
            ]).then( 
                _ => console.log(" ... Cache saved")
            ).catch(
                error => console.log("... Cache failed to save")
            )
        ).then( () => {
            console.log(" ... Skip Waiting");
            self.skipWaiting();
        })
    );
});

//Activate new cache
self.addEventListener('activate', event => {
    console.log("... [ACTIVATE] Service worker");
    event.waitUntil(
      //Only remove cache that start with {docTitle}
        caches.keys().then(
            cacheNames => Promise.all(
              cacheNames.filter(
                cacheName => {
                    console.log(cacheName);
                    return cacheName.startsWith(docTitle) &&
                             !staticCacheName.includes(cacheName);
                }).map(cacheName => caches.delete(cacheName))
            )
        ).then(
            _ => console.log(" ... cache cleaned")
        ).catch(
            error => console.log(" ... failed to clean cache")
        )
    );
});

//Display page / errors
self.addEventListener('fetch',event => {

    caches.has(staticCacheName).then( response => {
        if(!response){
        console.log("Cache issue");
        caches.open(staticCacheName).then(
            cache => cache.addAll([
                '0doc.js',
                'index.html',
                'favicon.ico',
                'logo.png',
                'style.css'
            ]).then( 
                _ => console.log(" ... Cache saved")
            ).catch(
                error => console.log("... Cache failed to save")
            )
        );
    }else {
        console.log("Cache OP");
    }
    });

    const requestUrl = new URL(event.request.url);
    if(requestUrl.origin === location.origin){
        if(requestUrl.pathname === '/'){
            console.log("Loading cache");
            
            event.respondWith(
                caches.match('index.html').then(response => {
                    if (response){
                        console.log("Cache found!");
                        return response;
                    }
                    console.log("Cache corrupted...");
                    return fetch('index.html');
                })
            );
            return;
        }
    }


    event.respondWith(
        caches.match(event.request).then(response => {
            console.log(event.request.url);
            // Fetch from Cache
            if (response) {
                console.log(`[FETCH] [CACHE] Service worker -> ${event.request.url}`);
                return response;
            }
            return fetch(event.request).then(response => {
                // 404 Error
                if(response.status == 404) {
                    return new Response(
                        '<h1>404</h1><b>This page doesn\'t exists</b><br><a href="/">Go back to documentation',
                        {headers : {'Content-Type':'text/html'} }
                    );
                }
                // Fetch from server
                console.log(`[FETCH] [WEB] -> ${event.request.url}`);
                return response;
            });       
        })
    );
});
