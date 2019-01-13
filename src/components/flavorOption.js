import React from 'react'

const FlavorOption = (props) => (
  <div key={`flavor_${props.index}`} className="flavorWrapper">
    <img
      className={`imageOption ${props.currentItem.flavor === props.flavor.name && "selected"}`}
      onClick={props.assignFlavor}
      data-flavor={props.flavor.name}
      alt={props.flavor.name}
      src={props.flavor.image}
    />
    <div className="flavorName" style={{display: "flex"}}>
      <span style={{color: "rgb(63, 69, 69)", flexGrow: 1, width: 0, textAlign: props.currentItem.type !== 'icecream' ? 'center': 'left'}}>{props.flavor.humanName}</span>
    </div>
  </div>
)
export default FlavorOption
