let swRegistration;
if ('serviceWorker' in navigator) {
  console.log(`push-helper will register its own SW`)
  navigator.serviceWorker.register("../push-sw.js")
  .then(swReg => {
    console.log('push manager sw is registered')
    swRegistration = swReg
    console.dir(swRegistration)
    swRegistration.pushManager.getSubscription()
    .then(function(subscription) {
      let isSubscribed = !(subscription === null)
      if (isSubscribed) {
        console.log('User IS subscribed.')
      } else {
        console.log('User is NOT subscribed.')
      }
    })
  })
  .catch(function(error) {
    console.error('Service Worker Error', error)
  })
}
