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

        function getBaseCardPaymentMethod() {
            return Object.assign({}, this.baseCardPaymentMethod);
        }

        function setAllowedAuthMethods(allowedAuthMethods) {
            this.baseCardPaymentMethod.parameters.allowedAuthMethods = allowedAuthMethods;
        }

        function setAllowedCardNetworks(allowedCardNetworks) {
            this.baseCardPaymentMethod.parameters.allowedCardNetworks = allowedCardNetworks;
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
            let gatewayInfo = this.getGatewayInfo();
            return {
                type: 'PAYMENT_GATEWAY',
                parameters: {
                    'gateway': gatewayInfo.gateway,
                    'gatewayMerchantId': gatewayInfo.gatewayMerchantId
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
        
        function createPaymentDataRequest(props) {
            return new GooglePaymentDataRequest({
                allowedPaymentMethods: [paymentsClient.$BlazorGooglePay.getCardPaymentMethod()],
                transactionInfo: new GoogleTransactionInfo({
                    displayItems: props.displayItems,
                    countryCode: props.countryCode,
                    currencyCode: props.currencyCode,
                    totalPriceStatus: props.totalPriceStatus,
                    totalPrice: props.totalPrice,
                    totalPriceLabel: props.totalPriceLabel,
                }),
                merchantInfo: paymentsClient.$BlazorGooglePay.getMerchantInfo()
            });
        }
        
        /**
         * An initialized google.payments.api.PaymentsClient object or null if not yet set
         *
         * @see {@link getGooglePaymentsClient}
         */
        let paymentsClient = null;

        /**
         * Configure support for the Google Pay API
         *
         * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#PaymentDataRequest|PaymentDataRequest}
         */
        class GooglePaymentDataRequest {
            constructor(props) {
                Object.assign(this, baseRequest);
                this.allowedPaymentMethods = props.allowedPaymentMethods;
                this.transactionInfo = props.transactionInfo;
                this.merchantInfo = props.merchantInfo;
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
                paymentsClient.$BlazorGooglePay.createPaymentDataRequest = createPaymentDataRequest;
                paymentsClient.$BlazorGooglePay.setAllowedAuthMethods = setAllowedAuthMethods;
                paymentsClient.$BlazorGooglePay.setAllowedCardNetworks = setAllowedCardNetworks;
                paymentsClient.$BlazorGooglePay.setGatewayInfo = setGatewayInfo;
                paymentsClient.$BlazorGooglePay.setMerchantInfo = setMerchantInfo;
                if (environment === 'TEST') {
                    paymentsClient.$BlazorGooglePay.setGatewayInfo(
                        'example',
                        'exampleGatewayMerchantId');
                    paymentsClient.$BlazorGooglePay.setMerchantInfo(
                        undefined,
                        'Example Merchant'
                    );
                }
                paymentsClient.$BlazorGooglePay.getGatewayInfo = getGatewayInfo;
                paymentsClient.$BlazorGooglePay.getMerchantInfo = getMerchantInfo;
                paymentsClient.$BlazorGooglePay.getTokenizationSpecification = getTokenizationSpecification;
                paymentsClientDotNetRef = browserInterop.storeObjectRef(paymentsClient);
            }
            return paymentsClientDotNetRef;
        }

        this.isReadyToPay = async function(paymentsClient) {
            let response = null;
            try {
                response = await paymentsClient.isReadyToPay(new GooglePaymentDataRequest({
                    allowedPaymentMethods: [paymentsClient.$BlazorGooglePay.getBaseCardPaymentMethod()]
                }));
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

        this.setAllowedAuthMethods = function(paymentsClient, authMethods) {
            paymentsClient.$BlazorGooglePay.setAllowedAuthMethods(authMethods);
        }

        this.setAllowedCardNetworks = function(paymentsClient, cardNetworks) {
            paymentsClient.$BlazorGooglePay.setAllowedCardNetworks(cardNetworks);
        }
        
        /**
         * Prefetch payment data to improve performance
         *
         * @see {@link https://developers.google.com/pay/api/web/reference/client#prefetchPaymentData|prefetchPaymentData()}
         */
        this.prefetchGooglePaymentData = function(paymentsClient, currencyCode) {
            const paymentDataRequest = paymentsClient.$BlazorGooglePay.createPaymentDataRequest({
                totalPriceStatus: 'NOT_CURRENTLY_KNOWN',
                currencyCode: currencyCode,
            });
            paymentsClient.prefetchPaymentData(paymentDataRequest);
        }

        this.processPayment = async function (paymentsClient, transactionInfo) {
            console.log(`transactionInfo is ${JSON.stringify(transactionInfo)}`)
            const paymentDataRequest = paymentsClient.$BlazorGooglePay.createPaymentDataRequest(transactionInfo);
            try {
                let paymentData = await paymentsClient.loadPaymentData(paymentDataRequest);
                return paymentData.paymentMethodData.tokenizationData.token;
            } catch(err) {
                // show error in developer console for debugging
                console.error(err);
            }
        }
    })();
})();
