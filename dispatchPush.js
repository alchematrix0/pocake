const webPush = require("web-push")
console.log(`set vapid details: typeof pubkey: ${typeof process.env.VAPID_PUBLIC_KEY_PRESTA}\ntypeof privkey: ${typeof process.env.VAPID_PRIVATE_KEY_PRESTA}`)
webPush.setVapidDetails(
  'mailto:alchematrix0@gmail.com',
  process.env.VAPID_PUBLIC_KEY_PRESTA,
  process.env.VAPID_PRIVATE_KEY_PRESTA
)

module.exports = {
  sendPush: function (subscription, payload, options = {}, isJson = false) {
    try {
      console.log(`call sendPush from dispatchPush.js`)
      if (!process.env.VAPID_PUBLIC_KEY_PRESTA || !process.env.VAPID_PRIVATE_KEY_PRESTA) {
        console.log("You must set the VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY "+
        "environment variables. You can use the following ones:")
        console.log(webPush.generateVAPIDKeys())
        return
      }
      console.dir(subscription)
      console.dir(payload)
      console.dir(options)
      console.log(isJson)
      let ps = isJson ? subscription : JSON.parse(subscription)
      const pushSubscription = {
        endpoint: ps.endpoint,
        keys: ps.keys
      }
      console.log(`call webPush.sendNotification to ${pushSubscription.endpoint}`)
      return webPush.sendNotification(pushSubscription, payload)
      .then(function(data) {
        console.log('push sent')
        console.dir(data)
        return data
      })
      .catch(function(error) {
        console.error(error)
        return error
      })
    } catch (error) {
      console.error(error)
      return error
    }
  }
}
