console.log(`custom-sw.js`)
self.addEventListener('push', (e) => {
  console.log('[custom-sw] Event listener push event!!!')
  var message = e.data ? e.data.text() : 'Your order from Nemesis is ready!'
  e.waitUntil(
    self.registration.showNotification('Order up!', {
      body: message || 'Your order from Nemesis is ready!',
      icon: './icons/favicon.ico',
    })
  )
})
self.addEventListener('install', function (e) {
  console.log('Custom-SW is installed :: ' + Math.random())
})

//     "gcm_sender_id": "412755447731"
