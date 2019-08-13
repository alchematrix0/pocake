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
        console.log(`Permission granted: ${permissionResult}`)
        return permissionResult
      }
    })
  },
  sendSubscriptionToServer : function (subscription, orderId) {
    console.log(`calling sendSubscriptionToServer`)
    return fetch("/receivePushSubscription", {
      method: "POST",
      headers: { "Accept": "application/json", "Content-type": "application/json" },
      body: JSON.stringify({ subscription, orderId })
    })
    .then(updateResponse => updateResponse.json())
    .then(serverResponse => {
      console.log(`sendSubscriptionToServer responded with:`)
      console.dir(serverResponse)
      return subscription
    })
    .catch(error => {
      console.error(error);
      return subscription
    })
  },
  subscribeToPush: function (orderId) {
    // const applicationServerKey = "BEIgtyz_0BCHgNjhRRKMTlRgjDtij4OSNmn3U4Li-qGa2GnnXOpDngB5r4dEO2roAm64yoUlW1nqFkzGpOnYfmQ"
    const applicationServerKey = "BD7-pcfHwzz08j6jlA7YAhKYELJH86uvWP8gV1vmE5GPGrjI3Sg3cXsxrWC24mHzTNJoY_Q0q1prgyCAYBKtpNA";
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
          console.log(`isSubscribed, set subscription to localStorage`)
          console.dir(subscription)
          localStorage.setItem('pushSubscription', JSON.stringify(subscription))
          // TODO might be a good time to stick this in session storage
          console.log(`sendSubscriptionToServer`)
          console.dir(subscription)
          return pushMethods.sendSubscriptionToServer(subscription, orderId)
        } else {
          console.log(`not subscribed, call pushManager.subscribe`)
          return swreg.pushManager.subscribe(subscribeOptions)
          // TODO might be a good time to stick this in session storage
          .then(pushSubscription => {
            console.log('returning from pushManager.subscribe without error')
            console.dir(pushSubscription)
            localStorage.setItem('pushSubscription', JSON.stringify(pushSubscription))
            console.log(`sendSubscriptionToServer`)
            console.dir(pushSubscription)
            return pushMethods.sendSubscriptionToServer(pushSubscription, orderId)
          })
          .catch(error => {
            console.log(`swreg.pushManager.subscribe(subscribeOptions) hit an error:`)
            console.error(error)
            return swreg.pushManager.subscribe({userVisibleOnly: true})
            .then(pushSub => {
              console.log('succesfully subscribed without an applicationServerKey!')
              localStorage.setItem('pushSubscription', JSON.stringify(pushSub))
              return pushMethods.sendSubscriptionToServer(pushSub, orderId)
            })
            .catch(error => {
              console.log('secondary catch handler, failed to subscribe without an applicationServerKey')
              return error
            })
          })
        }
      }).catch(pushSubscriptionError => {
        console.log('caught pushSubscriptionError')
        console.error(pushSubscriptionError)
        return pushSubscriptionError
      })
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
    //   fetch("/markOrderReady", {
    //     method: "POST",
    //     headers: {"Accept": "application/json", "Content-Type": "application/json"},
    //     body: JSON.stringify({ orderId, notify: "" })
    //   })
    // }, 5000)
    console.log(`typeof localStorage pushSub: ${typeof localStorage.getItem('pushSubscription')}`)
    console.dir(localStorage.getItem('pushSubscription'))
    console.log(`typeof subscriptionFromServer: ${typeof subscriptionFromServer}`)
    let subscription = localStorage.getItem('pushSubscription') || JSON.stringify(subscriptionFromServer)
    setTimeout(async () => {
      console.log(`setTimeout call to fetch("/dispatchPush"). subscription:`)
      console.dir(subscription)
      fetch("/dispatchPush", {
        method: "POST",
        headers: {"Accept": "application/json", "Content-Type": "application/json"},
        body: JSON.stringify({subscription, orderId})
      })
    }, 10000)
  }
}
export default pushMethods
