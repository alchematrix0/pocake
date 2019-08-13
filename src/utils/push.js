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
        console.log(`We weren"t granted permission. User selected ${permissionResult}`)
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
  .then(updateResponse => updateResponse.json())
  .then(serverResponse => serverResponse)
  .catch(error => console.error(error)),
  subscribeToPush: function (orderId) {
    console.log(`subscribeToPush says nav.sw is of type: ${typeof navigator.serviceWorker}`)
    const applicationServerKey = "BEIgtyz_0BCHgNjhRRKMTlRgjDtij4OSNmn3U4Li-qGa2GnnXOpDngB5r4dEO2roAm64yoUlW1nqFkzGpOnYfmQ"
    const subscribeOptions = {
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(applicationServerKey)
    }
    if ('serviceWorker' in navigator) {
      return navigator.serviceWorker.ready.then(async (swreg) => {
        console.log("SW ready [called subscribeToPush] push.js:43")
        let subscription = await swreg.pushManager.getSubscription()
        let isSubscribed = !(subscription === null)
        if (isSubscribed) {
          console.log(`isSubscribed`)
          localStorage.setItem('pushSubscription', JSON.stringify(subscription))
          // TODO might be a good time to stick this in session storage
          return pushMethods.sendSubscriptionToServer(subscription, orderId)
        } else {
          console.log(`not subscribed`)
          return swreg.pushManager.subscribe(subscribeOptions)
          // TODO might be a good time to stick this in session storage
          .then(pushSubscription => {
            console.dir(pushSubscription)
            localStorage.setItem('pushSubscription', JSON.stringify(pushSubscription))
            return pushMethods.sendSubscriptionToServer(pushSubscription, orderId)
          })
        }
      }).catch(pushSubscriptionError => pushSubscriptionError)
    } else {
      console.log(`serviceWorker was not in navigator`)
      console.dir(navigator)
    }
  },
  requestPushPermissionAndSubscribe: function (orderId) {
    return pushMethods.requestPushPermission()
    .then(permissionResult => {
      if (permissionResult === 'granted') {
        console.log('requestPushPermission result was granted')
        return pushMethods.subscribeToPush(orderId)
      } else {
        console.log('requestPushPermission result was not granted. returning false.')
        return false
      }
    })
  },
  triggerOrderReady: function (orderId, subscriptionFromServer) {
    console.log(`triggerOrderReady ${orderId}. typeof subscriptionFromServer: ${typeof subscriptionFromServer}`)
    // setTimeout(async () => {
    //   // TODO: option here to retrieve subscription from session storage
    //   fetch("/markOrderReady", {
    //     method: "POST",
    //     headers: {"Accept": "application/json", "Content-Type": "application/json"},
    //     body: JSON.stringify({ orderId, notify: "" })
    //   })
    // }, 5000)
    console.log(`typeof localStorage pushSub: ${typeof localStorage.getItem('pushSubscription')}`)
    console.log(`typeof subscriptionFromServer: ${typeof subscriptionFromServer}`)
    let subscription = localStorage.getItem('pushSubscription') || JSON.stringify(subscriptionFromServer)
    if (subscription) {
      setTimeout(async () => {
        console.log(`setTimeout call to fetch("/dispatchPush"). subscription:`)
        console.dir(subscription)
        // TODO: option here to retrieve subscription from session storage
        fetch("/dispatchPush", {
          method: "POST",
          headers: {"Accept": "application/json", "Content-Type": "application/json"},
          body: JSON.stringify({subscription, orderId})
        })
      }, 10000)
    } else console.log('no subscription was available')
  }
}
export default pushMethods
