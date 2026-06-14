const cacheName = "hay-day-trading-v2";
const appShell = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./images/hayday-trading-mark.png",
    "./images/trash-light.png",
    "./images/BEM Set.png",
    "./images/LEM Set.png",
    "./images/SEM Set.png",
    "./images/TEM Set.png"
];

self.addEventListener("install", event =>
{
    event.waitUntil(caches.open(cacheName).then(cache => cache.addAll(appShell)));
    self.skipWaiting();
});

self.addEventListener("activate", event =>
{
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys.filter(key => key !== cacheName).map(key => caches.delete(key))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", event =>
{
    const request = event.request;
    if(request.method !== "GET")
        return;

    const url = new URL(request.url);
    const isProductImage = request.destination === "image";
    const isHayDayWikiRequest = url.hostname === "hayday.fandom.com";
    if(!isProductImage && !isHayDayWikiRequest)
        return;

    if(isHayDayWikiRequest && !isProductImage)
    {
        const refreshPromise = caches.open(cacheName).then(cache =>
            fetch(request).then(response =>
            {
                if(response.ok)
                    cache.put(request, response.clone());
                return response;
            })
        );
        event.waitUntil(refreshPromise.catch(() => undefined));
        event.respondWith(
            caches.match(request).then(cachedResponse => cachedResponse || refreshPromise)
        );
        return;
    }

    event.respondWith(caches.open(cacheName).then(async cache =>
    {
        const cachedResponse = await cache.match(request);
        if(cachedResponse)
            return cachedResponse;

        const response = await fetch(request);
        if(response.ok || response.type === "opaque")
            cache.put(request, response.clone());
        return response;
    }));
});
