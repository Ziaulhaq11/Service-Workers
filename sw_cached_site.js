//Created this to cache single site not entire project
const cacheName = "v2";

//Call INstall Event
self.addEventListener("install", (e) => {
  console.log(`Service Worker installed`);
});

//Call Activate Event
self.addEventListener("activate", (e) => {
  console.log("Service Worker : Activated");
  //Remove unwanted caches
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          //can use filter
          if (cache !== cacheName) {
            //cacheName current cache variableName
            console.log("Service Worker : CLearing old Cache");
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

//Call Fetch Event
self.addEventListener("fetch", (e) => {
  console.log("Service Worker fetching");
  e.respondWith(
    //if there is no connection, it fails so it goes to catch and we will load that page from catch
    fetch(e.request)
      .then((res) => {
        //Make a clone of response
        const resClone = res.clone();
        //Open cache
        caches.open(cacheName).then((cache) => {
          //Add response to cache
          cache.put(e.request, resClone);
        });
        return res;
      })
      .catch((err) => caches.match(e.request).then((res) => res))
  );
});
