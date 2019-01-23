module.exports = {
  requestPushPermission: function () {
    return new Promise(function(resolve, reject) {
      const permissionResult = Notification.requestPermission(function(result) { resolve(result) })
      if (permissionResult) { permissionResult.then(resolve, reject) }
    })
    .then(function(permissionResult) {
      if (permissionResult !== "granted") {
        throw new Error(`We weren"t granted permission. User selected ${permissionResult}`);
      } else {
        return permissionResult
      }
    })
  },
  subscribeToPush: function (orderId) {
    console.log(`subscribeToPush :: order: ${orderId} at push.js:16`)
    console.log(process.env.REACT_APP_VAPID_PUBLIC_KEY)
    const applicationServerKey = process.env.REACT_APP_VAPID_PUBLIC_KEY || "BOrHb0d2ZL2jnqi17RXwuHz359bszFd-TrqrTmdrIWDR_0b_kkDq_inBRnkOvg50v6TDNUMf7jPaAVexa0urJJM"
    // const applicationServerKey = "BOrHb0d2ZL2jnqi17RXwuHz359bszFd-TrqrTmdrIWDR_0b_kkDq_inBRnkOvg50v6TDNUMf7jPaAVexa0urJJMM"
    const urlBase64ToUint8Array = function (base64String) {
      const padding = "=".repeat((4 - base64String.length % 4) % 4)
      const base64 = (base64String + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/")
      const rawData = window.atob(base64)
      const outputArray = new Uint8Array(rawData.length);
      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
      }
      return outputArray;
    }
    const subscribeOptions = {
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(applicationServerKey)
    }
    const sendSubscriptionToServer = (pushSubscription) => fetch("/receivePushSubscription", {
      method: "POST",
      headers: { "Content-type": "application/json"},
      body: JSON.stringify({ subscription: pushSubscription, orderId })
    })
    .then(updateResponse => {
      console.log('update response push.js[40]:')
      console.dir(updateResponse)
      return updateResponse
    })
    .catch(error => {
      console.error(error)
    })
    return navigator.serviceWorker.ready.then(swreg => {
      console.log("SW ready push.js:48")
      swreg.pushManager.getSubscription()
      .then(function(subscription) {
        let isSubscribed = !(subscription === null)
        if (isSubscribed) {
          console.log('User IS already subscribed. push.js:53')
          // TODO might be a good time to stick this in session storage
          return sendSubscriptionToServer(subscription)
        } else {
          return swreg.pushManager.subscribe(subscribeOptions)
          .then(function(pushSubscription) {
            console.log("send fetch to receivePushSubscription")
            // TODO might be a good time to stick this in session storage
            return sendSubscriptionToServer(pushSubscription)
          })
          .catch(function(pushSubscriptionError) {
            console.log("Failed to subscribe to push: ", pushSubscriptionError)
            return pushSubscriptionError
          })
        }
      })
    })
  }
}
