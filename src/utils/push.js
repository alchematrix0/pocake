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
    console.log('subscribing at push.js:31')
    const applicationServerKey = "BD1LaRsI1LcJGCi0yQe3_CmAKgfvule6-HySAjcbpp1zpXr8sCyOA7QeM2ZfcOIv3TIRruugX-OuU8hKxysxfCM"
    const urlBase64ToUint8Array = function (base64String) {
      const padding = "=".repeat((4 - base64String.length % 4) % 4);
      const base64 = (base64String + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/");

      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);

      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    }
    const subscribeOptions = {
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(applicationServerKey)
    }
    console.dir(subscribeOptions)
    return navigator.serviceWorker.ready.then(swreg => {
      console.log('SW ready push:38')
      console.dir(swreg)
      return swreg.pushManager.subscribe(subscribeOptions)
      .then(function(pushSubscription) {
        console.dir(pushSubscription.toJSON())
        console.log('send fetch to receivePushSubscription')
        return fetch("/receivePushSubscription", {
          method: "POST",
          headers: { "Content-type": "application/json"},
          body: JSON.stringify({
            subscription: pushSubscription,
            orderId
          })
        }).then(updateResponse => {
            console.dir(updateResponse)
            return updateResponse
          })
          .catch(error => {
            console.error(error)
          })
      })
      .catch(function(pushSubscriptionError) {
        console.log("Failed to subscribe to push: ", pushSubscriptionError)
        return pushSubscriptionError
      })
    })

  }
}
