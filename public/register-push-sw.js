let swRegistration;
if ('serviceWorker' in navigator) {
  console.log(`register-push-sw will register its own SW`)
  navigator.serviceWorker.register("./custom-sw.js")
  .then(swReg => {
    console.log('push manager sw is registered')
    swRegistration = swReg
    console.dir(swRegistration)
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
