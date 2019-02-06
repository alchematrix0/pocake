self.addEventListener('push', function (e) {
  console.log('service worker heard a push event!')
  console.dir(e.data)
  self.registration.showNotification('Order up!', {
    body: 'Your order is ready!',
    icon: './icecream.ico',
    badge: './icecream.ico'
  })
})
self.addEventListener('message', (e) => {
  console.log('service worker heard a message event!')
  console.dir(e.data)
})
self.addEventListener('install', function (e) {
  console.log('SW is installed')
})
