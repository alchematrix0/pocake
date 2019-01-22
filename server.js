const express = require("express")
const app = express()
const path = require("path")
const shortid = require("shortid")
const bcrypt = require("bcrypt")
const saltRounds = 10;
if (process.env.NODE_ENV !== "production") { require("dotenv").config() }
const stripe = require("stripe")(process.env.STRIPE_PRIV_KEY)
app.use(require("body-parser").json())

const monk = require("monk")
const mlab = monk(process.env.MONGODB_URI_PW)
const database = {
  accounts: mlab.get("accounts"),
  orders: mlab.get("orders")
}

const Airtable = require("airtable")
const db = new Airtable({apiKey: process.env.AIRTABLE_KEY}).base("appFhYtU2XMJZRS8e")

if (process.env.NODE_ENV === "production") {
  console.log("is production, serve statics")
  app.use(express.static(path.resolve(__dirname, "./build")));
  app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./build/index.html"));
  });
  app.get("/.well-known/apple-developer-merchantid-domain-association", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./.well-known/apple-developer-merchantid-domain-association"));
  });
}
app.use(function (req, res, next) {
  req.mongo = database
  next()
})
app.get("/testconn", (req, res) => {
  console.log("get to testconn received, fetch from mongo")
  return database.orders.find()
  .then(orders => {
    return database.orders.count(count => {
      res.json({orders, count})
    })
  })
})
app.post("/charge", async (req, res) => {
  let now = new Date().toISOString()
  let thisOrderId = shortid.generate()
  try {
    let charge = await stripe.charges.create({
      amount: Number(req.body.total) * 100,
      currency: "usd",
      description: `Order for ${req.body.customerName} on ${now}`,
      source: req.body.id
    })
    if (charge.paid) {
      const thisOrder = req.body.order
        .map(o => o.type === "icecream" ?
          `${o.scoops} scoops of ${o.flavor} in a ${o.vessel}` :
          `${o.flavor} ${o.type}`)
      let airtableOrder = {
        "Name": req.body.customerName,
        "Order": thisOrder.length > 1 ? thisOrder.reduce((a, b) => a.concat(`\n${b}`)) : thisOrder[0],
        "Order IN": now,
        "Total": req.body.total,
        "Notify": ""
      }
      let newOrder = {
        "customerName": req.body.customerName,
        "id": thisOrderId,
        "order": thisOrder,
        "order_in": now,
        "order_out": false,
        "total": req.body.total,
        "notify": ""
      }
      console.dir(newOrder)
      return database.orders.insert(newOrder)
      .then(insertResult => res.json({status: charge.status, orderId: thisOrderId}))
      // return db("salt&straw").create(airtableOrder, function (err, record) {
      //   if (err) {
      //     console.log("airtable error")
      //     console.error(err)
      //     res.json({status: "failed", message: err.message})
      //   } else {
      //     console.log("created an entry with id: " + record.getId())
      //     res.json({status: charge.status, airtableId: record.getId()})
      //   }
      // })
    }
  } catch (err) {
    console.error(err)
    res.status(500).end();
  }
});
app.post("/receivePushSubscription", (req, res) => {
  console.log("receivePushSubscription on server")
  console.dir(req.body)
  return database.orders.findOneAndUpdate({id: req.body.orderId}, {$set: {notify: req.body.subscription.endpoint}})
  .then(order => res.json(order))
})
app.post("/orders", (req, res) => {
  database.orders.find()
  .then(orders => res.json(orders))
})
app.post("/login", (req, res) => {
  console.dir(req.body)
  return database.accounts.findOne({company: req.body.company})
  .then(user => {
    async function checkPwMatch () {
      const match = await bcrypt.compare(req.body.password, user.password);
      if (match) {
        console.log("auth success")
        return database.orders.find({company: req.body.company})
        .then(orders => res.json({orders, user}))
      } else {
        console.log("auth failed")
        res.json({orders: [], user: null})
      }
    }
    checkPwMatch()
  })
})
app.post("/handleOrderReady", (req, res) => {
  console.log(`handle order ready`)
  console.dir(req.body)
  let now = new Date().toISOString()
  return database.orders.findOneAndUpdate({id: req.body.orderId}, {$set: {order_out: now}})
  .then(order => {
    console.dir(order)
    console.log("dispatchPushNotification()")
    res.sendStatus(200)
  })
})
app.set("port", process.env.PORT || 8888)
app.listen(app.get("port"), () => console.log(`Listening on port ${app.get("port")}`));
