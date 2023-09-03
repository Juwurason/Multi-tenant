// cacheUtils.js

export function emptyCache() {
    if ('caches' in window) {
        caches.keys().then((names) => {
            names.forEach((name) => {
                caches.delete(name);
            });
        });

        window.location.reload(true);
    }
}
