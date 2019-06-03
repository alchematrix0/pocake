import espresso from "./img/nemesis/espresso.jpg"
import cortado from "./img/nemesis/cortado.jpg"
import cappuccino from "./img/nemesis/capp.jpg"
import affogato from "./img/nemesis/affogato.jpg"
import coldBrewAffogato from "./img/nemesis/coldbrewAffogato.jpg"
import v60 from "./img/nemesis/pourOver.jpg"
import tea from "./img/nemesis/tea.jpg"
import brownie from "./img/nemesis/honeycombBrownie.jpg"
import hazelPearTart from "./img/nemesis/hazelPearTart.jpg"
import beefSquashHash from "./img/nemesis/beefSquashHash.jpg"
import frenchtoast from "./img/nemesis/frenchtoast.jpg"
import hash from "./img/nemesis/hash.jpg"
import mimosa from "./img/nemesis/mimosa.jpg"
import salmonroesti from "./img/nemesis/salmonroesti.jpg"
import steak from "./img/nemesis/steak.jpg"
import sunchokeWalnutSalad from "./img/nemesis/sunchokeWalnutSalad.jpg"
// NB: name must be unique for the cart to function properly
const menuItemBase = {
    name: "Coffee",
    type: "drink",
    subtype: "espresso",
    quantity: 1,
    cost: 3.50,
    humanName: "Drink",
    image: cappuccino,
    options: [],
    forHere: true,
    toGo: true,
    activeOption: ''
  }
export const menu = [
  Object.assign({}, menuItemBase, {
    name: "espresso",
    humanName: "Espresso",
    image: espresso,
  }), Object.assign({}, menuItemBase, {
    name: "cortado",
    humanName: "Cortado",
    cost: 4.00,
    image: cortado,
    options: [{name: 'wholemilk', humanName: 'Whole Milk'}, {name: 'oatmilk', humanName: 'Minor Figure Oat m*lk', cost: 1.00}],
  }), Object.assign({}, menuItemBase, {
    name: "cappuccino",
    cost: 4.50,
    humanName: "Cappuccino",
    image: cappuccino,
    options: [{name: 'wholemilk', humanName: 'Whole Milk'}, {name: 'oatmilk', humanName: 'Minor Figure Oat m*lk', cost: 1.00}],
  }), Object.assign({}, menuItemBase, {
    name: "v60",
    subtype: "filter",
    cost: 4.50,
    humanName: "V60",
    image: v60,
    options: [{name: 'wendelbow', humanName: 'Tim Wendelbowe - Oslo'}, {name: 'luna', humanName: 'Lüna Coffee - Vancouver'}, {name: 'colonna', humanName: 'Colonna - Bath', cost: 1.00}],
  }), Object.assign({}, menuItemBase, {
    name: "affogato",
    cost: 4.75,
    humanName: "Affogato",
    image: affogato,
  }), Object.assign({}, menuItemBase, {
    name: "cbaffogato",
    cost: 5.50,
    humanName: "Cold Brew Affogato",
    image: coldBrewAffogato,
  }), Object.assign({}, menuItemBase, {
    name: "tea",
    cost: 3.00,
    humanName: "05 Teas",
    options: [{name: 'green', humanName: 'Fancy green tea'}, {name: 'black', humanName: 'Fancy black tea'}, {name: 'rooibos', humanName: 'Rooibos'}],
    image: tea,
  }), Object.assign({}, menuItemBase, {
    name: "mimosa",
    subtype: "cocktail",
    cost: 9.00,
    humanName: "Bloody Mimosa",
    image: mimosa,
    toGo: false
  }), Object.assign({}, menuItemBase, {
    name: "hash",
    subtype: "savoury",
    type: "food",
    cost: 11.00,
    humanName: "The Raddest Cauli Hash",
    image: hash,
  }), Object.assign({}, menuItemBase, {
    name: "beefHash",
    subtype: "savoury",
    type: "food",
    cost: 12.00,
    humanName: "Beef and Squash Hash",
    image: beefSquashHash,
  }), Object.assign({}, menuItemBase, {
    name: "frenchtoast",
    type: "food",
    subtype: "brunch",
    cost: 11.00,
    humanName: "French Toast Brulée",
    image: frenchtoast,
  }), Object.assign({}, menuItemBase, {
    name: "sunchokeWalnutSalad",
    type: "food",
    subtype: "savoury",
    cost: 10.00,
    humanName: "Sunchoke and Walnut Salad",
    image: sunchokeWalnutSalad,
  }), Object.assign({}, menuItemBase, {
    name: "steak",
    type: "food",
    subtype: "savoury",
    cost: 19.00,
    humanName: "Not Your Usual Steak & Eggs",
    image: steak,
  }), Object.assign({}, menuItemBase, {
    name: "salmonroesti",
    type: "food",
    subtype: "brunch",
    cost: 17.00,
    humanName: "Salmon & Hollandaise",
    image: salmonroesti,
  }), Object.assign({}, menuItemBase, {
    name: "brownie",
    type: "food",
    subtype: "sweet",
    cost: 5.00,
    humanName: "Honeycomb Brownie",
    image: brownie,
  }), Object.assign({}, menuItemBase, {
    name: "hazelPearTart",
    type: "food",
    subtype: "sweet",
    cost: 5.00,
    humanName: "Hazelnut & Pear Tart",
    image: hazelPearTart,
  })
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
