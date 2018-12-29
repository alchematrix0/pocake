import React from 'react';

const OK = (props) => (
  <div style={props.show === false ? {visibility: 'hidden'} : {}}>
    <button
      className="OK"
      onClick={props.scroll}
      data-scrollto={props.target}
      style={props.style || {}}
      >
      {props.text || 'OK'}
    </button>
    {!props.hideEnter && <small className="buttonAside">press <b>ENTER</b></small>}
  </div>
)

export default OK
