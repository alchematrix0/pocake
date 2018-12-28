import van from "./img/vanilla.jpg";
import peppermint from "./img/peppermint.jpg";
import eggnog from "./img/eggnog.jpg";
import brownie from "./img/brownie.jpg";
import coffee from "./img/coffee.jpg";
import gingerbread from "./img/gingerbread.jpg";
import honeylav from "./img/honeylav.jpg";
import strawberry_whiteChoco from "./img/strawberry_whiteChoco.jpg";
import almond_ganache from "./img/almond_ganache.jpg";
import cone from "./img/cone.png"
import waffle from "./img/waffle.png"
import cup from "./img/cup.png"

export const menu = [
  {
    name: "vanilla",
    type: "icecream",
    humanName: "Double Fold Vanilla",
    image: van
  }, {
    name: "peppermint",
    type: "icecream",
    humanName: "Peppermint",
    image: peppermint
  }, {
    name: "eggnog",
    type: "icecream",
    humanName: "Vegan Eggnog Cinnamon Coconut",
    image: eggnog
  }, {
    name: "brownie",
    type: "icecream",
    humanName: "Brownie",
    image: brownie
  }, {
    name: "gingerbread",
    type: "icecream",
    humanName: "Gingerbread",
    image: gingerbread
  }, {
    name: "honeylav",
    type: "icecream",
    humanName: "Honey Lavender",
    image: honeylav
  }, {
    name: "strawberry_whiteChoco",
    type: "icecream",
    humanName: "Strawberry & White Chocolates",
    image: strawberry_whiteChoco
  }, {
    name: "coffee",
    type: "icecream",
    humanName: "James Coffee & Bourbon",
    image: coffee
  }, {
    name: "almond_ganache",
    type: "icecream",
    humanName: "Almod Ganache",
    image: almond_ganache
  }
]
export const vessels = [ {name: 'cup', image: cup}, {name: 'cone', image: cone}, {name: 'waffle', image: waffle} ]
export const blankItem = {
  type: '', // ['icecream', 'sundae', 'milkshake']
  scoops: 0, // [1, 2, 3]
  flavor: '', // [string array of flavors]
  vessel: '', // ['cone', 'cup', 'waffle']
  cost: 0
}
