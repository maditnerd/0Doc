var docTitle = "snos";
var version = "2";

//https://www.smashingmagazine.com/2016/02/making-a-service-worker/
//Udacity : Google Developer Challenge
staticCacheName = `${docTitle}-static-dev-${version}`;
contentImgsCache = `${docTitle}-content-imgs`;
const allCaches = [
  staticCacheName,
  contentImgsCache
];

//Install cache
self.addEventListener('install', event => {
    console.log("... Download content in cache for later use");
    event.waitUntil(
        caches.open(staticCacheName).then(
            cache => cache.addAll([
                '0doc.js',
                'index.html',
                'favicon.ico',
                'logo.png',
                'style.css',
                'https://cdnjs.cloudflare.com/ajax/libs/jquery/1.12.4/jquery.min.js'
            ]).then( 
                _ => console.log("Cache OP")
            ).catch(
                error => console.log("Cache Error")
            )
        )
    );
});

//Activate new cache
self.addEventListener('activate', event => {
    console.log("... Cache is ready");
    event.waitUntil(
      //Only remove cache that start with {docTitle}
        caches.keys().then(
            cacheNames => Promise.all(
              cacheNames.filter(
                cacheName => cacheName.startsWith(docTitle) &&
                             !allCaches.includes(cacheName)
                ).map(cacheName => caches.delete(cacheName))
            )
        )
    );
});

//Display page / errors
self.addEventListener('fetch',event => {
/*
    const requestUrl = new URL(event.request.url);
    if(requestUrl.origin === location.origin){
        if(requestUrl.pathname === '/'){
            console.log("Loading cache");
            event.respondWith(caches.match('index.html'));
            return;
        }
    }
*/

    event.respondWith(
        caches.match(event.request).then(response => {
            // Fetch from Cache
            if (response) {
                console.log(`CACHE: ${event.request.url}`);
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
                console.log(`SERVER: ${event.request.url}`);
                return response;
            });       
        }).catch(function(){
            //Fetch failed
            return new Response("Unexpected Error: cannot fetch page");
        })
    );
});
