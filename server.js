if (process.env.TARGET !== "now") { require("dotenv").config({path: "./server.env"}) }
const express = require("express")
const app = express()
const path = require("path")
app.use(require("body-parser").json())
app.use(require("body-parser").urlencoded({ extended: true }))
const Airtable = require("airtable")
const db = new Airtable({apiKey: process.env.AIRTABLE_KEY}).base("appFhYtU2XMJZRS8e")
const pushNotifs = require("./dispatchPush.js")

console.log('EXECUTING SERVER.JS')

const square = require("square-connect")
var squareClient = square.ApiClient.instance;
var oauth2 = squareClient.authentications['oauth2'];
oauth2.accessToken = process.env.SQUARE_PRIV_KEY;

if (process.env.NODE_ENV === "production" && process.env.TARGET !== "now") {
  console.log("is production, serve statics")
  app.use(express.static(path.resolve(__dirname, "./build")))
  app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./build/index.html"))
  })
}
app.get("/.well-known/apple-developer-merchantid-domain-association", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./.well-known/apple-developer-merchantid-domain-association"))
})
function addOrderToAirtable (body, returnRecord) {
  db("presta").create({
    "Name": body.customerName,
    "Order": body.order.length > 1 ? body.order.map(o => `${o.quantity}x ${o.name}`).reduce((a, b) => a.concat(`\n${b}`)) : body.order[0].name,
    "Order IN": new Date().toISOString(),
    "Total": body.total,
    "URL": "https://pocake-presta.alchematrix.net/"
  }, returnRecord)
}
app.post("/chargeSquareNonce", async (req, res) => {
  // create an order here then pass along to the rest of this code and use transaction API to pay for it right away
  try {
    const orders_api = new square.OrdersApi();
    const { order } = await orders_api.createOrder(process.env.SQUARE_LOCATION_ID, {
      "idempotency_key": parseInt(Math.random() * 10000000).toString(),
      "line_items": req.body.order.map(item => Object.assign({
          quantity: item.quantity.toString() || "1",
          name: item.humanName,
          variationName: item.activeOption || '',
          base_price_money: {
            amount: item.cost * 100,
            currency: "CAD"
          }
        })
      ),
      "fulfillments": [
        {
          "type": "PICKUP",
          "state": "PROPOSED",
          "pickup_details": {
            "is_square_pickup_order": true,
            "recipient": { "display_name": req.body.customerName },
            "schedule_type": "ASAP"
          }
        }
      ]
    })
    const transactions_api = new square.TransactionsApi();
    const { transaction } = await transactions_api.charge(process.env.SQUARE_LOCATION_ID, {
      order_id: order.order_id,
      idempotency_key: req.body.idempotency_key,
      card_nonce: req.body.card_nonce,
      amount_money: req.body.amount_money
    })
    try {
      addOrderToAirtable(Object.assign(req.body, {id: transaction.id}), function (err, record) {
        if (record) {
          let id = record.getId()
          console.log('got record :: ' + id)
          res.json(Object.assign({recordId: id, transaction}))
        } else res.json(transaction)
      })
    } catch (error) {
      console.error(error)
      res.json(transaction)
    }
  } catch (error) {
    console.error(error)
    res.status(400).json(error)
  }
})

app.post("/charge", async (req, res) => {
  console.log("got charge request")
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
      return db("presta").create({
        "Name": req.body.customerName,
        "Order": thisOrder.length > 1 ? thisOrder.reduce((a, b) => a.concat(`\n${b}`)) : thisOrder[0],
        "Order IN": now,
        "Total": req.body.total,
        "URL": "https://pocake-presta.alchematrix.net/"
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
  db("presta").update(req.body.orderId, { "Notify": JSON.stringify(req.body.subscription) }, function (err, record) {
    if (err) {
      console.log('airtable error')
      console.error(err)
      res.json(err)
    } else {
      console.log('updated an entry')
      res.json({order: record, subscription: req.body.subscription})
    }
  })
})
app.post("/markOrderReady", (req, res) => {
  console.log(`mark order ready`)
  db("presta").update(req.body.orderId || req.body.id, {"Called": true}, function (err, record) {
    if (err) console.error(err)
    else res.json(record)
  })
})
app.post("/dispatchPush", (req, res) => {
  console.log('dispatchPush')
  return pushNotifs.sendPush(req.body.subscription, `Your order is ready!`, {}).then(data => res.sendStatus(200))
})
// route to artificially mark an order ready for demo purposes
// this route is hit by Zapier after markOrderReady is called on a 5 minute poll. simulates order being made and called out.
app.post("/handleOrderReady", (req, res) => {
  console.log('handleOrderReady')
  if (req.body.notify) {
    console.log('handle ready, we have notify')
    // if Airtable had the notify set when this webhook was fired
    try {
      return pushNotifs.sendPush(req.body.notify, `${req.body.name || 'Hey there'}, great news! Your order is up!`, {})
      .then(done => {
        res.sendStatus(200)
      })
    }
    catch (err) {
      console.error(err)
      res.sendStatus(400)
    }
  } else {
    // Airtable didn't have the push sub at the time, let's check for it now.
    console.log(`Mark ready [Internal], retrieve Notify`)
    db("presta").find(req.body.orderId, function(err, record) {
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
  let sub = JSON.stringify({
    "endpoint": "https://updates.push.services.mozilla.com/wpush/v2/gAAAAABcgpCshYZ571W64g2XnysEHloIcL-bAryFfdxrqLeLLv3AmwNU8ZHEPEMyqC9uEx1OscH1e-_1TWiNoWb1t1Kj8dKnMz8_ZnWXX6s1R6Mx1oXC6Ex8aTjFw-62QUzjAULiMNPqaJaB0Br9DQLjww_ztBw1YXXN14BxcsFi6hhJ2TQNo0w",
    "keys": {
      "auth":"cVSBa-qrWtQUQ89iljQpug",
      "p256dh":"BEWPTwboiMxLxlXsOEMBlBruZ7XIJEE-WOv-3Tl30hqfSLhV2oSpxdrORNWFjXsCtZU73Gl-bCRFJ9R8rMjtGXw"
    }
  })
  pushNotifs.sendPush(sub, `Michel, great news! Your order of vanilla ice cream is up!`, {})
  res.sendStatus(200)
})

app.post('/receivePush', (req, res) => {
  console.log(`receivePush ${typeof req.body.endpoint} ${typeof req.body.keys}`)
  return pushNotifs.sendPush(req.body, `Michel, your order is ready!`, null, true)
  .then(done => {
    res.sendStatus(200)
  })
  .catch(err => {
    res.sendStatus(404)
  })
})

app.get("/serverUp", (req, res) => res.json({port: app.get("port")}))

if (process.env.TARGET === "now") {
  module.exports = app
} else {
  app.set("port", process.env.PORT || 8888)
  app.listen(app.get("port"), () => console.log(`Listening on port ${app.get("port")}`))
}
