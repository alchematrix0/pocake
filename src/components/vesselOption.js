import React from "react"

const VesselOption = (props) => (
  <div key={props.option.name + props.index} className={`column is-2-desktop is-4-mobile`}>
    <div
      className={`card optionCard ${props.currentItem.vessel === props.option.name && "selected"}`}
      onClick={props.assignVessel}
      data-vessel={props.option.name}
    >
      <div className="card-image imageOption">
        <figure className="image is-square">
          <img
            alt={props.option.name}
            src={props.option.image}
            data-vessel={props.option.name}
          />
        </figure>
      </div>
      <div className="card-content" style={{padding: "1rem"}}>
        <div className="card-header" style={{display: "flex", boxShadow: "none"}}>
          <div className="media">
            <div className="media-content">
              <p data-vessel={props.option.name} style={{color: "rgb(63, 69, 69)", textAlign: props.currentItem.type !== "icecream" ? "center": "left"}}>
                {props.option.humanName}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)
export default VesselOption
