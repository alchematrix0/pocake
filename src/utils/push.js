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

const pushMethods = {
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
  sendSubscriptionToServer : (pushSubscription, orderId) => fetch("/receivePushSubscription", {
    method: "POST",
    headers: { "Content-type": "application/json"},
    body: JSON.stringify({ subscription: pushSubscription, orderId })
  })
  .then(updateResponse => updateResponse)
  .catch(error => console.error(error)),
  subscribeToPush: function (orderId) {
    const applicationServerKey = process.env.REACT_APP_VAPID_PUBLIC_KEY || "BOrHb0d2ZL2jnqi17RXwuHz359bszFd-TrqrTmdrIWDR_0b_kkDq_inBRnkOvg50v6TDNUMf7jPaAVexa0urJJM"
    const subscribeOptions = {
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(applicationServerKey)
    }
    return navigator.serviceWorker.ready.then(swreg => {
      console.log("SW ready push.js:43")
      swreg.pushManager.getSubscription()
      .then(function(subscription) {
        let isSubscribed = !(subscription === null)
        if (isSubscribed) {
          // TODO might be a good time to stick this in session storage
          return pushMethods.sendSubscriptionToServer(subscription, orderId)
        } else {
          return swreg.pushManager.subscribe(subscribeOptions)
          // TODO might be a good time to stick this in session storage
          .then(pushSubscription => pushMethods.sendSubscriptionToServer(pushSubscription, orderId))
        }
      }).catch(pushSubscriptionError => pushSubscriptionError)
    })
  },
  requestPushPermissionAndSubscribe: function (orderId) {
    return pushMethods.requestPushPermission()
    .then(permissionResult => {
      if (permissionResult === 'granted') {
        return pushMethods.subscribeToPush(orderId)
      } else return false
    })
  },
  triggerOrderReady: function (orderId) {
    setTimeout(async () => {
      // TODO: option here to retrieve subscription from session storage
      fetch("/markOrderReady", {
        method: "POST",
        headers: {"Accept": "application/json", "Content-Type": "application/json"},
        body: JSON.stringify({ orderId, notify: "" })
      })
    }, 5000)
  }
}
export default pushMethods
