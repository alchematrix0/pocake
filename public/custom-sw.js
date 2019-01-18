self.addEventListener('push', function (e) {
  console.log('service worker heard a push event!')
})
self.addEventListener('message', (e) => {
  console.dir(e.data)
})
self.addEventListener('install', function (e) {
  console.log('SW is installed')
})
