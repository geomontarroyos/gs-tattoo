import { offlineFallback, warmStrategyCache } from "workbox-recipes";
import { CacheFirst, StaleWhileRevalidate } from "workbox-strategies";
import { registerRoute, Route } from "workbox-routing";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { ExpirationPlugin } from "workbox-expiration";

//configure o cache
const pageCache = new CacheFirst({
cacheName: 'GS-Tatto',
plugins: [
new CacheableResponsePlugin({
statuses: [0, 200],
}),
new ExpirationPlugin({
maxAgeSeconds: 30 * 24 * 60 * 60,
}),
],
});

//indicando o cache de página
warmStrategyCache({
urls: ['/index.html', '/js/main.js', '/css/style.css','/js/db.js','/js/app.js', '/css/css.css','/css/estilo.css' ,
"https://fonts.googleapis.com/css?family=Poppins&display=swap"],
strategy: pageCache,
});

//registrando a rota
registerRoute(({request}) => request.mode === 'navigate', pageCache);

registerRoute(//configurando cache de assets
({request}) => ['style', 'script', 'worker']
.includes(request.destination),
new StaleWhileRevalidate({
cacheName: 'asset-cache',
plugins: [
new CacheableResponsePlugin({
statuses: [0, 200],
}),
],
}),
);

//configurando offline fallback
offlineFallback({
pageFallback: '/offline.html',
});

const imageRoute = new Route(({request}) => {
return request.destination === 'image';
},new CacheFirst({
cacheName: 'images',
plugins:[
new ExpirationPlugin({
maxAgeSeconds: 60 * 60 * 24 * 30,
})
]
}));
registerRoute(imageRoute);