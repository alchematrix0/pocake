console.log(`custom=-w.js`)
self.addEventListener('push', (e) => {
  e.waitUntil(
    self.registration.showNotification('Order up!', {
      body: 'Your order from Presta is ready!',
      icon: './icons/favicon.ico',
    })
  )
})
self.addEventListener('message', (e) => {
  console.dir(e.data)
})
self.addEventListener('install', function (e) {
  console.log('Custom SW is installed :: ' + Math.random())
})

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        return response;
      }
      return fetch(event.request).then(function(response) {
        return response;
      }).catch(function(error) {
        throw error;
      });
    })
  );
});
