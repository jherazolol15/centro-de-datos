// Guarda la app en el teléfono para que abra sin señal.
const CACHE = "cdd-v21-2";
const CORE = ["./", "index.html", "adapter.js", "extra.js", "jugador.html", "manifest.webmanifest", "manifest-jugador.webmanifest", "icon-192.png", "icon-512.png"];
const LIBS = ["https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js", "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE).then(() => Promise.all(LIBS.map(u => c.add(u).catch(() => {}))))).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("cdd-") && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET") return;
  const propio = u.origin === location.origin && u.pathname.startsWith(new URL(self.registration.scope).pathname);
  const cacheable = propio || u.hostname === "cdnjs.cloudflare.com" || u.hostname.endsWith("fonts.googleapis.com") || u.hostname.endsWith("fonts.gstatic.com");
  if (!cacheable) return;
  // Red primero (para recibir versiones nuevas); copia guardada si no hay señal.
  e.respondWith(fetch(e.request, propio ? { cache: "no-cache" } : undefined).then(r => { if (r.ok || r.type === "opaque") { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); } return r; })
    .catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || (e.request.mode === "navigate" ? caches.match(u.pathname.endsWith("jugador.html") ? "jugador.html" : "index.html") : Response.error()))));
});
