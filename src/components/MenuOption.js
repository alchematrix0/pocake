import React from "react";
import LazyLoad from "react-lazyload";
import coffeeIcon from "../img/presta/coffee-icon.png"
const placeholder = () => <img src={coffeeIcon} alt='coffee icon placeholder'/>
const MenuOption = (props) => (
  <div
    onClick={props.addItemToOrder}
    data-item={props.item.name}
    className="column is-3-desktop is-3-tablet is-6-mobile"
  >
    <div className={`card optionCard`}>
      <div className="card-image">
        <figure className="image is-3by4">
          <LazyLoad once offset={300} placeholder={placeholder()}>
            <img
              className="card-image imageOption"
              alt={props.item.name}
              src={props.item.image}
              data-item={props.item.name}
            />
          </LazyLoad>
        </figure>
      </div>
      <div className="card-content" data-item={props.item.name}>
        <div className="card-header" style={{display: "flex", boxShadow: "none"}}>
          <div className="media">
            <div className="media-content flavorNameParent">
              <p
                style={{color: "rgb(63, 69, 69)"}}
                data-item={props.item.name}
                className="flavorName"
              >
                {props.item.humanName}
                <small className="itemCost">{props.item.cost}</small>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)
export default MenuOption
