let swRegistration;
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./custom-sw.js', {scope: '/'})
  .then(swReg => {
    swRegistration = swReg
    if (swRegistration.pushManager) {
      swRegistration.pushManager.getSubscription()
      .then(function(subscription) {
        let isSubscribed = !(subscription === null)
        if (isSubscribed) {
          console.log('User IS subscribed.')
        } else {
          console.log('User is NOT subscribed.')
        }
      })
    } else {
      console.log('no push manager available atm... :(')
    }
  })
  .catch(function(error) {
    console.error('Service Worker Error', error)
  })
}
