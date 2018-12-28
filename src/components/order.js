import React from 'react'
const names = {
  vanilla: "Double Fold Vanilla",
  peppermint: "Peppermint",
  eggnog: "Vegan Eggnog Cinnamon Coconut",
  brownie: "Brownie",
  gingerbread: "Gingerbread",
  honeylav: "Honey Lavender",
  strawberry_whiteChoco: "Strawberry & White Chocolates",
  coffee: "James Coffee & Bourbon",
  almond_ganache: "Almond Ganache",
  icecream: "ice cream",
  sundae: "sundae",
  milkshake: "milk shake",
  cone: "sugar cone",
  waffle: "waffle cone",
  cup: "cup"
}

const Order = (props) => (
  <div>
    {props.order.map((o, i) => (
      <p key={`order_${i}`}>{names[o.flavor]} {names[o.type]} {o.type === 'icecream' ? `- ${o.scoops} scoops in a ${names[o.vessel]}` : ''}</p>
    ))}
    <p className="orderCost">Total: ${props.cost}</p>
  </div>
)

export default Order
