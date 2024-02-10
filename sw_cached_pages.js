const cacheName = "v1";

//Way1
const cacheAssets = [
    "index.html",
    "about.html",
    "/css/style.css",
    "/js/main.js"
]

//Call INstall Event
self.addEventListener("install", (e) => {
    console.log(`Service Worker installed`) //this message will come and go away. To see that In Console, Turn on "Preserve Log"
    e.waitUntil( //to wait until our promise is finished.
        caches
        .open(cacheName)
        .then(cache => {
            console.log("Service Worker : Caching files")
            cache.addAll(cacheAssets)
        })
        .then(() => self.skipWaiting()) //forces the waiting service worker to become the active service worker.
    )
})

//Call Activate Event -- here we cleanup the previous ones, else previous and new caches will be added
self.addEventListener("activate", e => {
    console.log("Service Worker : Activated")
    //Remove unwanted caches
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => { //can use filter 
                    if(cache !== cacheName) { //cacheName current cache variableName
                        console.log("Service Worker : CLearing old Cache")
                        return caches.delete(cache)
                    }
                })
            )
        })
    )
})

//Call Fetch Event
self.addEventListener("fetch", e => {
    console.log("Service Worker fetching")
    e.respondWith( //if there is no connection, it fails so it goes to catch and we will load that page from catch
        fetch(e.request).catch(() => caches.match(e.request))
    )
})