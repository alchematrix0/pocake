let swRegistration;
// 
// function requestPush() {
//   const applicationServerKey = "BD1LaRsI1LcJGCi0yQe3_CmAKgfvule6-HySAjcbpp1zpXr8sCyOA7QeM2ZfcOIv3TIRruugX-OuU8hKxysxfCM"
//   console.log('requestPush')
//   // Begin PUSH implementation, registration has succeeded
//   if (!('PushManager' in window)) {
//     console.log('no push in window')
//     // Push isn't supported on this browser, disable or hide UI.
//   } else {
//     requestPushPermission()
//       .then(permission => {
//         if (permission === 'granted' && swRegistration) {
//           console.log('permission is granted, create the subscription')
//           const subscribeOptions = {
//             userVisibleOnly: true,
//             applicationServerKey: urlBase64ToUint8Array(applicationServerKey)
//           };
//           navigator.serviceWorker.ready.then(swreg => {
//             console.log('.ready then')
//             console.dir(swreg)
//             swreg.pushManager.subscribe(subscribeOptions)
//             .then(function(pushSubscription) {
//               console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));
//             })
//             .catch(function(pushSubscriptionError) {
//               console.log('Failed to subscribe to push: ', pushSubscriptionError);
//             })
//           })
//         }
//       })
//     }
// }
//
// // request push permissions and return the result as a Promise
// // returns 'granted', 'default' or 'denied'.
// function requestPushPermission() {
//   console.log('request push from push-helpers')
//   return new Promise(function(resolve, reject) {
//     const permissionResult = Notification.requestPermission(function(result) {
//       console.log(result)
//       resolve(result);
//     });
//     if (permissionResult) {
//       permissionResult.then(resolve, reject);
//     }
//   })
//   .then(function(permissionResult) {
//     if (permissionResult !== 'granted') {
//       throw new Error(`We weren't granted permission. User selected ${permissionResult}`);
//     } else {
//       console.log(permissionResult)
//       return permissionResult
//     }
//   });
// }
//
// function urlBase64ToUint8Array(base64String) {
//   const padding = '='.repeat((4 - base64String.length % 4) % 4);
//   const base64 = (base64String + padding)
//     .replace(/-/g, '+')
//     .replace(/_/g, '/');
//
//   const rawData = window.atob(base64);
//   const outputArray = new Uint8Array(rawData.length);
//
//   for (let i = 0; i < rawData.length; ++i) {
//     outputArray[i] = rawData.charCodeAt(i);
//   }
//   return outputArray;
// }

if ('serviceWorker' in navigator) {
  console.log(`push-helper will register its own SW`)
  navigator.serviceWorker.register("../custom-sw.js")
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
