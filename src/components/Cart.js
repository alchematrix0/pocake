import React from "react"

const Cart = (props) => props.collapseCart ? (
  <nav id="cart" className="panel">
    <div className="panel-block" style={{border: 'none'}}>
      <button onClick={props.checkout} className="button is-link is-outlined is-fullwidth">
        Ready to pay ${props.total}
      </button>
      <span className="panel-icon" style={{margin: "1px 12px 12px 12px"}} onClick={props.toggleCartCollapsed}>
        <svg style={{width:'24px', height:'24px'}} viewBox="0 0 24 24">
          <path fill="#3273dc" d="M12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M17,14L12,9L7,14H17Z" />
        </svg>
      </span>
    </div>
  </nav>
) : (
  <nav id="cart" className={`panel ${props.isHidden ? 'is-hidden' : 'showCart'}`}>
    <p className="panel-heading">
      Your order
      <span className="panel-icon">
        <svg style={{width:'24px',height:'24px'}} viewBox="0 0 24 24" onClick={props.toggleCartCollapsed}>
          <path fill="#3273dc" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M7,10L12,15L17,10H7Z" />
        </svg>
      </span>
      <span className="is-pulled-right">{props.total}</span>
    </p>
    {props.items.map((item, index) => (
      <p className="panel-block" key={index}>
        {item.humanName}
        <span className="price is-pulled-right">{item.cost}</span>
      </p>
    ))}
    <div className="panel-block">
        <button onClick={props.checkout} className="button is-link is-outlined is-fullwidth">
          Ready to pay
        </button>
      </div>
  </nav>
)
export default Cart
