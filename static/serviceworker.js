var urls = ["/"];

self.addEventListener("install", function(event) {
    console.log("[SW] install");
    event.waitUntil(caches.open("converter").then(function(cache) {
        return cache.addAll(urls);
    }));
});

self.addEventListener('activate', function(e) {
    console.log("[SW] activate");
});

self.addEventListener('fetch', function(event) {
    console.log("[SW] fetch");

    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Even if the response is in the cache, we fetch it
                // and update the cache for future usage
                var fetchPromise = fetch(event.request).then(
                    function(networkResponse) {
                        // console.log(networkResponse);
                        caches.open(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                // We use the currently cached vers ion if it's there
                // console.log(event.request.url)
                // console.log(response)
                // console.log(fetchPromise)
                return response || fetchPromise;
            })
    );
});