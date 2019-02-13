import React from "react"

const MenuOption = (props) => (
  <div
    onClick={props.addItemToOrder}
    data-item={props.item.name}
    className="column is-2-tablet is-6-mobile"
  >
    <div className={`${props.currentItem.name === props.item.name && "selected"} card optionCard`}>
      <div className="card-image">
        <figure className="image is-3by4">
          <img
            className="card-image imageOption"
            alt={props.item.name}
            src={props.item.image}
            data-item={props.item.name}
          />
        </figure>
      </div>
      <div className="card-content" data-item={props.item.name}>
        <div className="card-header" style={{display: "flex", boxShadow: "none"}}>
          <div className="media">
            <div className="media-content">
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
