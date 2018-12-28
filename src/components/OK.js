import React from 'react';

const OK = (props) => (
  <div>
    <button className="OK" onClick={props.scroll} data-scrollto={props.target}>OK</button>
    <small className="buttonAside">press <b>ENTER</b></small>
  </div>
)

export default OK
