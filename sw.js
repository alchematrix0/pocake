console.log(`custom-sw.js`)
self.addEventListener('push', (e) => {
  console.log('[sw.js] Event listener push event!!!')
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
self.addEventListener('message', function (e) {
  console.log(`Custom-SW heard a message!`)
  e.waitUntil(
    self.registration.showNotification('Order up!', {
      body: 'Your order from Nemesis is ready!',
      icon: './icons/favicon.ico',
    })
  )
})

//     "gcm_sender_id": "412755447731"
