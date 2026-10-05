// BEHB service worker: makes the app installable and keeps it usable on a
// flaky connection. API calls are never cached so prices and availability
// are always live.
const VERSION = "behb-v1";
const SHELL = `${VERSION}-shell`;
const ASSETS = `${VERSION}-assets`;
const IMAGES = `${VERSION}-images`;
const PRECACHE = ["/", "/offline.html", "/icon.png", "/icons/icon-192.png", "/manifest.webmanifest"];
const MAX_IMAGES = 80;

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(SHELL).then((cache) => cache.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const trim = async (name, max) => {
  const cache = await caches.open(name);
  const keys = await cache.keys();
  await Promise.all(keys.slice(0, Math.max(0, keys.length - max)).map((k) => cache.delete(k)));
};

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  // Pages: network first so deploys show up straight away; offline falls back
  // to the cached app shell, then to a friendly offline page.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(SHELL).then((cache) => cache.put("/", copy));
          return res;
        })
        .catch(async () => (await caches.match("/")) || caches.match("/offline.html"))
    );
    return;
  }

  // Hashed build files never change, so cache first.
  if (url.origin === self.location.origin && url.pathname.startsWith("/assets/")) {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ||
          fetch(request).then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(ASSETS).then((cache) => cache.put(request, copy));
            }
            return res;
          })
      )
    );
    return;
  }

  // Hotel photos and fonts: serve from cache, refresh in the background.
  if (request.destination === "image" || request.destination === "font" || url.hostname === "fonts.googleapis.com") {
    event.respondWith(
      caches.open(IMAGES).then(async (cache) => {
        const hit = await cache.match(request);
        const network = fetch(request)
          .then((res) => {
            if (res.ok || res.type === "opaque") {
              cache.put(request, res.clone());
              trim(IMAGES, MAX_IMAGES);
            }
            return res;
          })
          .catch(() => hit);
        return hit || network;
      })
    );
  }
  // Everything else (including the API) goes straight to the network.
});
