import cappuccino from "./img/presta/cappuccino.png"
import cherry from "./img/presta/cherry.png"
import coldBrew from "./img/presta/cold-brew.png"
import filter from "./img/presta/filter.png"
import cortado from "./img/presta/cortado.png"
import espresso from "./img/presta/espresso.png"
import latte from "./img/presta/latte.png"
import lavenderCapp from "./img/presta/lavender-capp.png"
import spicy from "./img/presta/spicy.png"
import turmeric from "./img/presta/turmeric.png"
import pourOver from "./img/presta/pour-over.png"
export const menu = [
  {
    name: "cappuccino",
    type: "drink",
    cost: 3.75,
    humanName: "Cappuccino",
    image: cappuccino,
    options: [{name: 'oatmilk', humanName: 'Oat milk', cost: 0.75}, {name: 'soymilk', humanName: 'Soy milk', cost: 0.5}]
  }, {
    name: "cherry",
    type: "drink",
    cost: 4.50,
    humanName: "Cherry Pie Cold Brew",
    image: cherry,
    options: []
  }, {
    name: "coldBrew",
    type: "drink",
    cost: 3.50,
    humanName: "Cold Brew",
    image: coldBrew,
    options: []
  }, {
    name: "filter",
    type: "drink",
    cost: 2.50,
    humanName: "Filter Coffee",
    image: filter,
    options: []
  }, {
    name: "cortado",
    type: "drink",
    cost: 3.50,
    humanName: "Cortado",
    image: cortado,
    options: [{name: 'oatmilk', humanName: 'Oat milk', cost: 0.75}, {name: 'soymilk', humanName: 'Soy milk', cost: 0.5}]
  }, {
    name: "espresso",
    type: "drink",
    cost: 3.50,
    humanName: "Espresso & Tonic",
    image: espresso,
    options: []
  }, {
    name: "latte",
    type: "drink",
    cost: 4.50,
    humanName: "Latté",
    image: latte,
    options: [{name: 'oatmilk', humanName: 'Oat milk', cost: 0.75}, {name: 'soymilk', humanName: 'Soy milk', cost: 0.5}]
  },
  {
    name: "lavenderCapp",
    type: "drink",
    cost: 4.75,
    humanName: "Lavender Honey Cappuccino",
    image: lavenderCapp,
    options: [{name: 'oatmilk', humanName: 'Oat milk', cost: 0.75}, {name: 'soymilk', humanName: 'Soy milk', cost: 0.5}]
  },
  {
    name: "pourOver",
    type: "drink",
    cost: 4.50,
    humanName: "V60 Pour Over",
    image: pourOver,
    options: []
  },
  {
    name: "spicy",
    type: "drink",
    cost: 4.50,
    humanName: "Agave Cayenne Cappuccino",
    image: spicy,
    options: [{name: 'oatmilk', humanName: 'Oat milk', cost: 0.75}, {name: 'soymilk', humanName: 'Soy milk', cost: 0.5}]
  },
  {
    name: "turmeric",
    type: "drink",
    cost: 5.00,
    humanName: "Honey Turmeric Chaï Latté",
    image: turmeric,
    options: [{name: 'oatmilk', humanName: 'Oat milk', cost: 0.75}, {name: 'soymilk', humanName: 'Soy milk', cost: 0.5}]
  }
]
// export const vessels = [ {name: 'cup', humanName: 'Cup', image: cup}, {name: 'cone', humanName: 'Sugar Cone', image: cone}, {name: 'waffle', humanName: 'Waffle Cone (+.5)', image: waffle} ]
export const blankItem = {
  type: '', // ['icecream', 'sundae', 'milkshake']
  cost: 0,
  qty: 0
}
// export const Item = {
//   type: 'icecream', // ['icecream', 'sundae', 'milkshake']
//   scoops: 2, // [1, 2, 3]
//   flavor: 'coffee', // [string array of flavors]
//   vessel: 'cone', // ['cone', 'cup', 'waffle']
//   cost: 6.5
// }

// let offMennu = [
//   {
//     name: "honeylav",
//     type: "drink",
//     humanName: "Honey Lavender",
//     image: honeylav
//   }, {
//     name: "strawberry_whiteChoco",
//     type: "icecream",
//     humanName: "Strawberry & White Chocolates",
//     image: strawberry_whiteChoco
//   }
// ]
