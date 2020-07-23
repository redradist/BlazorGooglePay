(async function() {
    'use strict';
    const googlePayScriptPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        document.body.appendChild(script);
        script.onload = resolve;
        script.onerror = reject;
        script.async = true;
        script.src = 'https://pay.google.com/gp/p/js/pay.js';
    });
    await googlePayScriptPromise;

    let browserInteropScript = null;
    let scripts = document.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; i++) {
        const script = scripts[i];
        if (script.src === '_content/BrowserInterop/scripts.js') {
            browserInteropScript = script;
            break;
        }
    }
    if (browserInteropScript === null) {
        const browserInteropScriptPromise = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            document.body.appendChild(script);
            script.onload = resolve;
            script.onerror = reject;
            script.async = true;
            script.src = '_content/BrowserInterop/scripts.js';
        });
        await browserInteropScriptPromise;
    }
    
    window.blazorGooglePay = new (function () {
        'use strict';
        /**
         * Define the version of the Google Pay API referenced when creating your
         * configuration
         *
         * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#PaymentDataRequest|apiVersion in PaymentDataRequest}
         */
        const baseRequest = {
            apiVersion: 2,
            apiVersionMinor: 0
        };

        /**
         * Card networks supported by your site and your gateway
         *
         * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#CardParameters|CardParameters}
         * @todo confirm card networks supported by your site and gateway
         */
        const allowedCardNetworks = ["AMEX", "DISCOVER", "INTERAC", "JCB", "MASTERCARD", "VISA"];

        /**
         * Card authentication methods supported by your site and your gateway
         *
         * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#CardParameters|CardParameters}
         * @todo confirm your processor supports Android device tokens for your
         * supported card networks
         */
        const allowedCardAuthMethods = ["PAN_ONLY", "CRYPTOGRAM_3DS"];

        /**
         * Identify your gateway and your site's gateway merchant identifier
         *
         * The Google Pay API response will return an encrypted payment method capable
         * of being charged by a supported gateway after payer authorization
         *
         * @todo check with your gateway on the parameters to pass
         * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#gateway|PaymentMethodTokenizationSpecification}
         */
        const tokenizationSpecification = {
            type: 'PAYMENT_GATEWAY',
            parameters: {
                'gateway': 'example',
                'gatewayMerchantId': 'exampleGatewayMerchantId'
            }
        };

        /**
         * Describe your site's support for the CARD payment method and its required
         * fields
         *
         * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#CardParameters|CardParameters}
         */
        const baseCardPaymentMethod = {
            type: 'CARD',
            parameters: {
                allowedAuthMethods: allowedCardAuthMethods,
                allowedCardNetworks: allowedCardNetworks
            }
        };

        /**
         * Describe your site's support for the CARD payment method including optional
         * fields
         *
         * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#CardParameters|CardParameters}
         */
        const cardPaymentMethod = Object.assign(
            {},
            baseCardPaymentMethod,
            {
                tokenizationSpecification: tokenizationSpecification
            }
        );

        /**
         * An initialized google.payments.api.PaymentsClient object or null if not yet set
         *
         * @see {@link getGooglePaymentsClient}
         */
        let paymentsClient = null;

        /**
         * Configure your site's support for payment methods supported by the Google Pay
         * API.
         *
         * Each member of allowedPaymentMethods should contain only the required fields,
         * allowing reuse of this base request when determining a viewer's ability
         * to pay and later requesting a supported payment method
         *
         * @returns {object} Google Pay API version, payment methods supported by the site
         */
        this.getGoogleIsReadyToPayRequest = function() {
            return Object.assign(
                {},
                baseRequest,
                {
                    allowedPaymentMethods: [baseCardPaymentMethod]
                }
            );
        }

        /**
         * Configure support for the Google Pay API
         *
         * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#PaymentDataRequest|PaymentDataRequest}
         */
        class GooglePaymentDataRequest {
            constructor(props) {
                Object.assign(this, baseRequest);
                this.allowedPaymentMethods = [cardPaymentMethod];
                this.transactionInfo = new GoogleTransactionInfo();
                this.merchantInfo = {
                    // @todo a merchant ID is available for a production environment after approval by Google
                    // See {@link https://developers.google.com/pay/api/web/guides/test-and-deploy/integration-checklist|Integration checklist}
                    // merchantId: '12345678901234567890',
                    merchantName: 'Example Merchant'
                };
            }
        }

        /**
         * Provide Google Pay API with a payment amount, currency, and amount status
         *
         * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#TransactionInfo|TransactionInfo}
         */
        class GoogleTransactionInfo {
            constructor(props) {
                this.countryCode = props.countryCode;
                this.currencyCode = props.currencyCode;
                this.totalPriceStatus = props.totalPriceStatus;
                // set to cart total
                this.totalPrice = props.totalPrice;
            }
        }

        let paymentsClientDotNetRef = null;
        /**
         * Return an active PaymentsClient or initialize
         *
         * @see {@link https://developers.google.com/pay/api/web/reference/client#PaymentsClient|PaymentsClient constructor}
         * @returns {google.payments.api.PaymentsClient} Google Pay API client
         */
        this.getGooglePaymentsClient = function(environment) {
            if (paymentsClient === null) {
                paymentsClient = new google.payments.api.PaymentsClient({environment: environment});
                paymentsClientDotNetRef = browserInterop.storeObjectRef(paymentsClient);
            }
            return paymentsClientDotNetRef;
        }

        this.isReadyToPay = async function(paymentsClient) {
            let response = null;
            try {
                response = await paymentsClient.isReadyToPay(this.getGoogleIsReadyToPayRequest());
            } catch (err) {
                // show error in developer console for debugging
                console.error(err);
            }
            return response;
        }

        this.createButton = function(paymentsClient, onGooglePaymentButtonClicked, buttonType) {
            const button = paymentsClient.createButton({
                onClick: onGooglePaymentButtonClicked,
                buttonType: buttonType,
            });
            return browserInterop.storeObjectRef(button);
        }

        this.attachButton = function(htmlElement, button) {
            htmlElement.appendChild(button);
        }

        /**
         * Prefetch payment data to improve performance
         *
         * @see {@link https://developers.google.com/pay/api/web/reference/client#prefetchPaymentData|prefetchPaymentData()}
         */
        this.prefetchGooglePaymentData = function(paymentsClient) {
            const paymentDataRequest = new GooglePaymentDataRequest();
            // transactionInfo must be set but does not affect cache
            paymentDataRequest.transactionInfo = {
                totalPriceStatus: 'NOT_CURRENTLY_KNOWN',
                currencyCode: 'USD'
            };
            paymentsClient.prefetchPaymentData(paymentDataRequest);
        }

        /**
         * Process payment data returned by the Google Pay API
         *
         * @param {object} paymentData response from Google Pay API after user approves payment
         * @see {@link https://developers.google.com/pay/api/web/reference/response-objects#PaymentData|PaymentData object reference}
         */
        this.processPayment = function(paymentData) {
            // show returned data in developer console for debugging
            console.log(paymentData);
            // @todo pass payment token to your gateway to process payment
            let paymentToken = paymentData.paymentMethodData.tokenizationData.token;
        }
    })();
})();
