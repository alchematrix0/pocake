import React from 'react'

const squarePaymentForm = () => (
  <div id="form-container">
    <div id="sq-walletbox">
      <button className="button" id="sq-apple-pay">Apply Pay</button>
      <button className="button" id="sq-masterpass">MasterPass</button>
      <button id="sq-google-pay" className="button button-google-pay">G Pay</button>
      <div id="sq-walletbox-divider">
        <span id="sq-walletbox-divider-label">Or</span>
        <hr/>
      </div>
    </div>

    <div id="sq-ccbox">
      {/* Be sure to replace the action attribute of the form with the path of the Transaction API charge endpoint URL you want to POST the nonce to (for example, "/process-card") --> */}
      <form id="nonce-form" noValidate="novalidate" action="/handleCardInput" method="post">
        <fieldset>
          <span className="label">Card Number</span>
          <div id="sq-card-number"></div>

          <div className="third">
            <span className="label">Expiration</span>
            <div id="sq-expiration-date"></div>
          </div>

          <div className="third">
            <span className="label">CVV</span>
            <div id="sq-cvv"></div>
          </div>

          <div className="third">
            <span className="label">Postal</span>
            <div id="sq-postal-code"></div>
          </div>
        </fieldset>

        <button id="sq-creditcard" className="button-credit-card" onClick="requestCardNonce(event)">Pay $1.00</button>
        <div id="error"></div>

        {/* After a nonce is generated it will be assigned to this hidden input field. */}
        <input type="hidden" id="card-nonce" name="nonce" />
      </form>
    </div>
  </div>
)

export default squarePaymentForm
