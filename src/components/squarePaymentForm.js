import React, { Component } from "react";
import pushMethods from "../utils/push.js";
const applicationId = "sandbox-sq0idp-QvAf1SYKv1GcCxHovvIHUg";
const locationId = "CBASEGfUh3nYh1sAUqIu9eu2eS0gAQ";

export default class squarePaymentForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      SqPaymentFormLoaded: false,
      error: false,
      processing: false,
      success: false,
      order: props.order
    }
  }
  requestCardNonce = (event) => {
    console.log('sq payment form requestCardNonce function in squarePaymentForm')
    // Don't submit the form until SqPaymentForm returns with a nonce
    event.preventDefault();
    // Request a nonce from the SqPaymentForm object
    this.paymentForm.requestCardNonce()
  }

  componentWillMount() {
    let sqPaymentScript = document.createElement("script");
    sqPaymentScript.src = "https://js.squareup.com/v2/paymentform";
    sqPaymentScript.type = "text/javascript";
    sqPaymentScript.async = false;
    sqPaymentScript.onload = () => {
      this.setState({SqPaymentFormLoaded: true})
      this.paymentForm = new window.SqPaymentForm({

        // Initialize the payment form elements
        applicationId: applicationId,
        locationId: locationId,
        inputClass: 'sq-input',
        autoBuild: false,

        // Customize the CSS for SqPaymentForm iframe elements
        inputStyles: [{
          fontSize: '16px',
          fontFamily: 'Helvetica Neue',
          padding: '16px',
          // color: '#373F4A',
          color: 'black',
          backgroundColor: 'transparent',
          lineHeight: '24px',
          placeholderColor: '#271414',
          // placeholderColor: '#CCC',
          _webkitFontSmoothing: 'antialiased',
          _mozOsxFontSmoothing: 'grayscale'
        }],

        applePay: { elementId: 'sq-apple-pay' },
        masterpass: { elementId: 'sq-masterpass' },
        googlePay: { elementId: 'sq-google-pay' },
        // Initialize the credit card placeholders
        cardNumber: {
          elementId: 'sq-card-number',
          placeholder: '• • • •  • • • •  • • • •  • • • •'
        },
        cvv: {
          elementId: 'sq-cvv',
          placeholder: 'CVV'
        },
        expirationDate: {
          elementId: 'sq-expiration-date',
          placeholder: 'MM/YY'
        },
        postalCode: {
          elementId: 'sq-postal-code',
          placeholder: '12345'
        },

        // SqPaymentForm callback functions
        callbacks: {
          /* callback function: methodsSupported
           * Triggered when: the page is loaded. */
          methodsSupported: function (methods) {

            var walletBox = document.getElementById('sq-walletbox');
            var applePayBtn = document.getElementById('sq-apple-pay');
            var googlePayBtn = document.getElementById('sq-google-pay');
            var masterpassBtn = document.getElementById('sq-masterpass');

            // Only show the button if Apple Pay for Web is enabled
            // Otherwise, display the wallet not enabled message.
            if (methods.applePay === true) {
              walletBox.style.display = 'block';
              applePayBtn.style.display = 'block';
            }
            // Only show the button if Masterpass is enabled
            // Otherwise, display the wallet not enabled message.
            if (methods.masterpass === true) {
              walletBox.style.display = 'block';
              masterpassBtn.style.display = 'block';
            }
            // Only show the button if Google Pay is enabled
            if (methods.googlePay === true) {
              walletBox.style.display = 'block';
              googlePayBtn.style.display = 'inline-block';
            }
          },
          /* callback function: createPaymentRequest
           * Triggered when: a digital wallet payment button is clicked. */
          createPaymentRequest: function () {

            return {
              requestShippingAddress: false,
              requestBillingInfo: true,
              currencyCode: "USD",
              countryCode: "US",
              total: {
                label: "Presta Coffee",
                amount: this.state.order.map(i => Number(i.cost) * Number(i.quantity)).reduce((a, b) => a + b, 0),
                pending: false
              },
              lineItems: this.state.order.map(i => Object.assign({}, {
                label: i.humanName,
                amount: (Number(i.cost) * Number(i.quantity)).toFixed(2),
                pending: false
              }))
            }
          },

          /*
           * callback function: validateShippingContact
           * Triggered when: a shipping address is selected/changed in a digital
           *                 wallet UI that supports address selection.
           */
          validateShippingContact: function (contact) {
            var validationErrorObj;
            /* ADD CODE TO SET validationErrorObj IF ERRORS ARE FOUND */
            return validationErrorObj;
          },
          /*
           * callback function: cardNonceResponseReceived
           * Triggered when: SqPaymentForm completes a card nonce request
           */
          cardNonceResponseReceived: (errors, nonce, cardData) => {
            if (errors) {
              // Log errors from nonce generation to the Javascript console
              console.log("Encountered errors:");
              this.setState({error: true})
              errors.forEach(error => {
                this.setState({errorMessage: error.message})
              });
              return;
            }
            this.postNonceToServer(nonce, cardData)
          },
          unsupportedBrowserDetected: function () {
            console.log(`unsupportedBrowserDetected`)
            /* PROVIDE FEEDBACK TO SITE VISITORS */
          },
          inputEventReceived: function (inputEvent) {
            switch (inputEvent.eventType) {
              case 'focusClassAdded':
                /* HANDLE AS DESIRED */
                console.log('input should have focus')
                break;
              case 'focusClassRemoved':
                /* HANDLE AS DESIRED */
                break;
              case 'errorClassAdded':
                document.getElementById("error").innerHTML = "Please fix card information errors before continuing.";
                break;
              case 'errorClassRemoved':
                /* HANDLE AS DESIRED */
                document.getElementById("error").style.display = "none";
                break;
              case 'cardBrandChanged':
                /* HANDLE AS DESIRED */
                break;
              case 'postalCodeChanged':
                /* HANDLE AS DESIRED */
                break;
              default:
                console.log('default of switch')
            }
          },
          paymentFormLoaded: function () {
            /* HANDLE AS DESIRED */
            console.log("The form loaded!");
          }
        }
      });

      if (window.SqPaymentForm.isSupportedBrowser()) {
        console.log('isSupported from component, building form')
        window.paymentForm = this.paymentForm
        this.paymentForm.build();
        this.paymentForm.recalculateSize();
      }
    }
    document.getElementsByTagName("head")[0].appendChild(sqPaymentScript);
  }
  postNonceToServer = async (nonce, cardDetails) => {
    this.setState({processing: true})
    const idempotency_key = parseInt(Math.random() * 10000000).toString()
    try {
      let sendToken = await fetch("/chargeSquareNonce", {
        method: "POST",
        headers: {"Accept": "application/json", "Content-Type": "application/json"},
        body: JSON.stringify({
          idempotency_key,
          card_nonce: nonce,
          "amount_money": {
            "amount": Number(this.props.total) * 100,
            "currency": "CAD"
          },
          customerName: this.props.customerName,
          order: this.props.order
        })
      })
      let serverResponse = await sendToken.json()
      console.dir(serverResponse)
      if (serverResponse.transaction) {
        this.setState({processing: false, success: true})
        // At this point, we have created the charge and will request push for when the order is called out
        return pushMethods.requestPushPermissionAndSubscribe(serverResponse.recordId)
        .then((data) => {
          console.log('now trigger from SQ Payment form')
          console.dir(data)
          // triggerOrderReady = Artificial implementation of order being called after 5 seconds for demo purposes
          pushMethods.triggerOrderReady(serverResponse.recordId, data.subscription)
        })
      } else {
        this.setState({processing: false})
        if (serverResponse.error) {
          this.setState({
            error: serverResponse.error,
            message: serverResponse.message ? serverResponse.message.errors[0].detail : 'Payment failed. Please try again or pay at the till.'
          })
        }
      }
    } catch (error) {
      console.error(error)
      this.setState({error, errorMessage: error.message})
    }
  }
  render () {
    return !this.state.SqPaymentFormLoaded ? null : (
      <div style={{marginBottom: `${this.props.offset}px`}} id="form-container">
        {this.state.success ? null : (
          <div id="sq-walletbox">
            <button id="sq-apple-pay"></button>
            <button id="sq-masterpass"></button>
            <button id="sq-google-pay" className="button-google-pay"></button>
            <div id="sq-walletbox-divider">
              <span id="sq-walletbox-divider-label">Or</span>
              <hr/>
            </div>
          </div>
        )}
        <div id="sq-ccbox">
          {/* Be sure to replace the action attribute of the form with the path of the Transaction API charge endpoint URL you want to POST the nonce to (for example, "/process-card") --> */}
          <form id="nonce-form" noValidate="novalidate" action="/chargeCard" method="post">
            {this.state.success ? null : (
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
                <p style={{margin: "1em 0"}}>
                  TEST num 4532 7597 3454 5858 zip: 94103
                </p>
              </fieldset>
            )}
            {this.state.success ? (
              <section className="hero is-medium">
                <div className="hero-body">
                  <h4 className="title is-spaced">Success! Your order will be up shortly.</h4>
                  <h6 className="subtitle is-spaced">This app is in demo mode. Expect a notification in T-minus 00:10 <span role="img" aria-label="pointing right">👉 </span></h6>
                  <p>Like what you see? Order a version for you website today: <a href="mailto:alchematrix0@gmail.com">alchematrix0@gmail.com</a></p>
                </div>
              </section>
            ) : (
              <button type="button" id="sq-creditcard" className="button-credit-card" onClick={this.requestCardNonce}>
                {this.state.processing ? 'Processing...' : 'Pay with credit card'}
              </button>
            )}
            <div id="error">{this.state.errorMessage || null}</div>
          </form>
        </div>
      </div>
    )
  }
}
