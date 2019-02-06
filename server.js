const express = require("express")
const app = express()
const path = require("path")
if (process.env.NODE_ENV !== "production") { require("dotenv").config({path: "./server.env"}) }
const stripe = require("stripe")(process.env.STRIPE_PRIV_KEY)
app.use(require("body-parser").json())

const Airtable = require("airtable")
const db = new Airtable({apiKey: process.env.AIRTABLE_KEY}).base("appFhYtU2XMJZRS8e")
const pushNotifs = require("./dispatchPush.js")

if (process.env.NODE_ENV === "production") {
  console.log("is production, serve statics")
  app.use(express.static(path.resolve(__dirname, "./build")))
  app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./build/index.html"))
  })
  app.get("/.well-known/apple-developer-merchantid-domain-association", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./.well-known/apple-developer-merchantid-domain-association"))
  })
}
app.post("/charge", async (req, res) => {
  console.log("got charge request")
  console.log(typeof req.body)
  console.dir(req.body)
  let now = new Date().toISOString()
  try {
    let charge = await stripe.charges.create({
      amount: Number(req.body.total) * 100,
      currency: "usd",
      description: `Order for ${req.body.customerName} on ${now}`,
      source: req.body.id
    })
    if (charge.paid) {
      const thisOrder = req.body.order
        .map(o => o.type === 'icecream' ?
          `${o.scoops} scoops of ${o.flavor} in a ${o.vessel}` :
          `${o.flavor} ${o.type}`)
      console.dir(thisOrder)
      return db("salt&straw").create({
        "Name": req.body.customerName,
        "Order": thisOrder.length > 1 ? thisOrder.reduce((a, b) => a.concat(`\n${b}`)) : thisOrder[0],
        "Order IN": now,
        "Total": req.body.total
      }, function (err, record) {
        if (err) {
          console.log('airtable error')
          console.error(err)
        }
        console.log('created an entry')
        console.dir(record)
        res.json({status: charge.status, orderId: record.getId()})
      })
    }
  } catch (err) {
    console.error(err)
    res.status(500).end()
  }
})
app.post("/receivePushSubscription", (req, res) => {
  console.log("receivePushSubscription on server")
  console.dir(req.body)
  db("salt&straw").update(req.body.orderId, { "Notify": JSON.stringify(req.body.subscription) }, function (err, record) {
    if (err) {
      console.log('airtable error')
      console.error(err)
    } else {
      console.log('updated an entry')
      res.json({order: record})
    }
  })
})
app.post("/markOrderReady", (req, res) => {
  console.log(`mark order ready`)
  console.dir(req.body)
  db("salt&straw").update(req.body.orderId || req.body.id, {"Called": true}, function (err, record) {
    if (err) console.error(err)
    else res.json(record)
  })
})
// route to artificially mark an order ready for demo purposes
// this route is hit by Zapier after markOrderReady is called on a 5 minute poll. simulates order being made and called out.
app.post("/handleOrderReady", (req, res) => {
  console.dir(req.body)
  let now = new Date().toISOString()
  if (req.body.notify) {
    // if Airtable had the notify set when this webhook was fired
    try {
      pushNotifs.sendPush(req.body.notify, `${req.body.name}, great news! Your order of ${req.body.order} is up!`, {})
      res.sendStatus(200)
    }
    catch (err) {
      console.error(err)
      res.sendStatus(400)
    }
  } else {
    // Airtable didn't have the push sub at the time, let's check for it now.
    console.log(`Mark ready [Internal]`)
    db("salt&straw").find(req.body.orderId, function(err, record) {
      if (err) {
        console.error(err)
        res.sendStatus(204)
      } else {
        if (record.get("Notify")) {
          console.log(`Send push via record: ${record.get("Notify")}`)
          pushNotifs.sendPush(record.get("Notify"), `${record.get('Name')}, great news! Your order of ${record.get('Order')} is up!`, {})
          res.json({notify: record.get("Notify")})
        } else {
          console.log(`this record has no notify`)
          res.sendStatus(204)
        }
      }
    })
  }
})
// util route to check if push is working
app.get("/testPush", (req, res) => {
  let sub = {
    endpoint: 'https://updates.push.services.mozilla.com/wpush/v2/gAAAAABcSLUkr1bRSYvLJKiHgieUzFlkxbtsVyoTaSbNrkDpmFPGQ4kp1LjqOYuhbLjrIfaDJnFv_87NiEmTLr7gpMcyEXIPEhO4lYq73e-jQsHrGvm0WV-_rlsDVYdM0_LE05eyPvt9MI4GqRLUvq4wRhV-wjBRuYBMopwWEQEECFctR5zYO0Q',
    keys: {
      auth: 'MJJ3hFLTjXK-ELxvkmq3rA',
      p256dh: 'BNAZvXKSO3FuL5Jr9c2KCZSMEPYKqdfYq4ugHWkbhiHGUS8HI2zd4p2375-wgy0Z1KY9OAu2csm8FNTZFyiU8n8'
      }
    }
  console.dir(sub)
  pushNotifs.sendPush(sub, `Michel, great news! Your order of vanilla ice cream is up!`, {})
  res.sendStatus(200)
})
app.set("port", process.env.PORT || 8888)
app.listen(app.get("port"), () => console.log(`Listening on port ${app.get("port")}`))
