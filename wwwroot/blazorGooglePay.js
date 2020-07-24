(async function() {
    'use strict';

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
         * Card authentication methods supported by your site and your gateway
         *
         * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#CardParameters|CardParameters}
         * @todo confirm your processor supports Android device tokens for your
         * supported card networks
         */
        const defaultAllowedCardAuthMethods = ["PAN_ONLY", "CRYPTOGRAM_3DS"];
        
        /**
         * Card networks supported by your site and your gateway
         *
         * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#CardParameters|CardParameters}
         * @todo confirm card networks supported by your site and gateway
         */
        const defaultAllowedCardNetworks = ["AMEX", "DISCOVER", "INTERAC", "JCB", "MASTERCARD", "VISA"];

        /**
         * Describe your site's support for the CARD payment method and its required
         * fields
         *
         * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#CardParameters|CardParameters}
         */
        const defaultBaseCardPaymentMethod = {
            type: 'CARD',
            parameters: {
                allowedAuthMethods: defaultAllowedCardAuthMethods,
                allowedCardNetworks: defaultAllowedCardNetworks
            }
        };

        function getPrefetchGooglePaymentDataRequest(currencyCode) {
            return new GooglePaymentDataRequest(
                [this.getCardPaymentMethod()],
                new GoogleTransactionInfo({
                    totalPriceStatus: 'NOT_CURRENTLY_KNOWN',
                    currencyCode: currencyCode
                }),
                this.getMerchantInfo());
        }
        
        /**
         * Describe your site's support for the CARD payment method including optional
         * fields
         *
         * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#CardParameters|CardParameters}
         */
        function getCardPaymentMethod() {
            return Object.assign(
                {},
                this.getBaseCardPaymentMethod(),
                {
                    tokenizationSpecification: this.getTokenizationSpecification()
                }
            );
        }

        function getBaseCardPaymentMethod() {
            return Object.assign({}, this.baseCardPaymentMethod);
        }

        function setAllowedAuthMethods(allowedAuthMethods) {
            this.baseCardPaymentMethod.allowedAuthMethods = allowedAuthMethods;
        }

        function setAllowedCardNetworks(allowedCardNetworks) {
            this.baseCardPaymentMethod.allowedCardNetworks = allowedCardNetworks;
        }
        
        /**
         * Identify your gateway and your site's gateway merchant identifier
         *
         * The Google Pay API response will return an encrypted payment method capable
         * of being charged by a supported gateway after payer authorization
         *
         * @todo check with your gateway on the parameters to pass
         * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#gateway|PaymentMethodTokenizationSpecification}
         */
        function getTokenizationSpecification() {
            return {
                type: 'PAYMENT_GATEWAY',
                parameters: {
                    'gateway': this.gatewayInfo.gateway,
                    'gatewayMerchantId': this.gatewayInfo.gatewayMerchantId
                }
            };
        }
        
        function setGatewayInfo(gateway, gatewayMerchantId) {
            this.gatewayInfo = {
                gateway: gateway,
                gatewayMerchantId: gatewayMerchantId,
            };
        }

        function getGatewayInfo() {
            return Object.assign(
                {},
                this.gatewayInfo
            );
        }
        
        function setMerchantInfo(merchantId, merchantName) {
            this.merchantInfo = {
                merchantId: merchantId,
                merchantName: merchantName,
            };
        }
        
        function getMerchantInfo() {
            return Object.assign(
                {},
                this.merchantInfo
            );
        }
        
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
        class GoogleIsReadyToPayRequest {
            constructor(allowedPaymentMethods) {
                Object.assign(this, baseRequest);
                this.allowedPaymentMethods = allowedPaymentMethods;
            }
        }
        
        /**
         * Configure support for the Google Pay API
         *
         * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#PaymentDataRequest|PaymentDataRequest}
         */
        class GooglePaymentDataRequest {
            constructor(allowedPaymentMethods, transactionInfo, merchantInfo) {
                Object.assign(this, baseRequest);
                this.allowedPaymentMethods = allowedPaymentMethods;
                this.transactionInfo = transactionInfo;
                this.merchantInfo = merchantInfo;
            }
        }

        /**
         * Provide Google Pay API with a payment amount, currency, and amount status
         *
         * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#TransactionInfo|TransactionInfo}
         */
        class GoogleTransactionInfo {
            constructor(props) {
                this.displayItems = props.displayItems;
                this.countryCode = props.countryCode;
                this.currencyCode = props.currencyCode;
                this.totalPriceStatus = props.totalPriceStatus;
                this.totalPrice = props.totalPrice;
                this.totalPriceLabel = props.totalPriceLabel;
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
                paymentsClient = new google.payments.api.PaymentsClient({
                    environment: environment
                });
                paymentsClient.$BlazorGooglePay = {};
                paymentsClient.$BlazorGooglePay.baseCardPaymentMethod = Object.assign({}, defaultBaseCardPaymentMethod);
                paymentsClient.$BlazorGooglePay.getBaseCardPaymentMethod = getBaseCardPaymentMethod;
                paymentsClient.$BlazorGooglePay.getCardPaymentMethod = getCardPaymentMethod;
                paymentsClient.$BlazorGooglePay.setAllowedAuthMethods = setAllowedAuthMethods;
                paymentsClient.$BlazorGooglePay.setAllowedCardNetworks = setAllowedCardNetworks;
                paymentsClient.$BlazorGooglePay.setGatewayInfo = setGatewayInfo;
                if (environment === 'TEST') {
                    paymentsClient.$BlazorGooglePay.setGatewayInfo(
                        undefined,
                        'Example Merchant');
                }
                paymentsClient.$BlazorGooglePay.getGatewayInfo = getGatewayInfo;
                paymentsClient.$BlazorGooglePay.setMerchantInfo = setMerchantInfo;
                paymentsClient.$BlazorGooglePay.getMerchantInfo = getMerchantInfo;
                paymentsClient.$BlazorGooglePay.getTokenizationSpecification = getTokenizationSpecification;
                paymentsClient.$BlazorGooglePay.getPrefetchGooglePaymentDataRequest = getPrefetchGooglePaymentDataRequest;
                paymentsClientDotNetRef = browserInterop.storeObjectRef(paymentsClient);
            }
            return paymentsClientDotNetRef;
        }

        this.isReadyToPay = async function(paymentsClient) {
            let response = null;
            try {
                response = await paymentsClient.isReadyToPay(new GoogleIsReadyToPayRequest([paymentsClient.$BlazorGooglePay.getBaseCardPaymentMethod()]));
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
        this.prefetchGooglePaymentData = function(paymentsClient, currencyCode) {
            const paymentDataRequest = paymentsClient.$BlazorGooglePay.getPrefetchGooglePaymentDataRequest(currencyCode);
            paymentsClient.prefetchPaymentData(paymentDataRequest);
        }

        /**
         * Process payment data returned by the Google Pay API
         *
         * @param {object} paymentData response from Google Pay API after user approves payment
         * @see {@link https://developers.google.com/pay/api/web/reference/response-objects#PaymentData|PaymentData object reference}
         */
        this.processPayment = function(paymentData) {
            return paymentData.paymentMethodData.tokenizationData.token;
        }
    })();
})();
