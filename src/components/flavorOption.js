import React from "react"

const FlavorOption = (props) => (
  <div
    onClick={props.assignFlavor}
    data-flavor={props.flavor.name}
    className="column is-3-tablet is-2-desktop is-6-mobile">
    <div className={`${props.currentItem.flavor === props.flavor.name && "selected"} card optionCard`}>
      <div className="card-image">
        <figure className="image is-3by4">
          <img
            className="card-image imageOption"
            alt={props.flavor.name}
            src={props.flavor.image}
            data-flavor={props.flavor.name}
          />
        </figure>
      </div>
      <div className="card-content" data-flavor={props.flavor.name}>
        <div className="card-header" style={{display: "flex", boxShadow: "none"}}>
          <div className="media">
            <div className="media-content">
              <p
                style={{color: "rgb(63, 69, 69)"}}
                data-flavor={props.flavor.name}
                className="flavorName"
                >
                {props.flavor.humanName}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)
export default FlavorOption
