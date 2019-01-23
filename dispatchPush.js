const webPush = require("web-push")
module.exports = {
  sendPush: function (subscription, payload, options = {}) {
    if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
      console.log("You must set the VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY "+
        "environment variables. You can use the following ones:")
      console.log(webPush.generateVAPIDKeys())
      return
    }
    webPush.setVapidDetails(
      'mailto:alchematrix0@gmail.com',
      process.env.VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    )
    console.log(process.env.VAPID_PUBLIC_KEY)
    console.log(process.env.VAPID_PRIVATE_KEY)
    console.log(payload)
    let ps = JSON.parse(subscription)
    const pushSubscription = {
      endpoint: ps.endpoint,
      keys: ps.keys
    }
    console.log(typeof pushSubscription)
    console.dir(pushSubscription)
    options = {
      TTL: 24 * 60 * 60,
      vapidDetails: {
        subject: 'mailto:alchematrix0@gmail.com',
        publicKey: process.env.VAPID_PUBLIC_KEY,
        privateKey: process.env.VAPID_PRIVATE_KEY
      }
    }
    webPush.sendNotification(pushSubscription, payload, options)
    .then(function(data) {
      console.dir(data)
      return true
    })
    .catch(function(error) {
      console.error(error)
      return false
    })
  }
}
