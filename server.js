const express = require("express")
const app = express()
const path = require("path")
if (process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}
const stripe = require("stripe")(process.env.STRIPE_PRIV_KEY);
app.use(require("body-parser").text());

if (process.env.NODE_ENV === 'production') {
  console.log('is production, serve statics')
  app.use(express.static(path.resolve(__dirname, './build')));
  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, './build/index.html'));
  });
}

app.post("/charge", async (req, res) => {
  console.log('got charge request')
  try {
    let {status} = await stripe.charges.create({
      amount: 2000,
      currency: "usd",
      description: "An example charge",
      source: req.body
    });

    res.json({status});
  } catch (err) {
    console.error(err)
    res.status(500).end();
  }
});
app.set('port', process.env.PORT || 8888)
app.listen(app.get('port'), () => console.log(`Listening on port ${app.get('port')}`));
