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

        function getAllowedAuthMethods() {
            return Array.from(this.baseCardPaymentMethod.parameters.allowedAuthMethods);
        }
        
        function setAllowedCardNetworks(allowedCardNetworks) {
            this.baseCardPaymentMethod.parameters.allowedCardNetworks = allowedCardNetworks;
        }

        function getAllowedCardNetworks() {
            return Array.from(this.baseCardPaymentMethod.parameters.allowedCardNetworks);
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

        function setGatewayInfo(gatewayInfo) {
            this.gatewayInfo = {
                gateway: gatewayInfo.gateway,
                gatewayMerchantId: gatewayInfo.gatewayMerchantId,
            };
        }

        function getGatewayInfo() {
            return Object.assign(
                {},
                this.gatewayInfo
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
                    'gateway': gatewayInfo.gateway === null ? undefined : gatewayInfo.gateway,
                    'gatewayMerchantId': gatewayInfo.gatewayMerchantId === null ? undefined : gatewayInfo.gatewayMerchantId
                }
            };
        }
        
        function setMerchantInfo(merchantInfo) {
            this.merchantInfo = {
                merchantId: merchantInfo.merchantId === null ? undefined : merchantInfo.merchantId,
                merchantName: merchantInfo.merchantName === null ? undefined : merchantInfo.merchantName,
            };
        }
        
        function getMerchantInfo() {
            return Object.assign(
                {},
                this.merchantInfo
            );
        }

        function createPaymentDataRequest(paymentsClient, tranProps, customPaymentProps) {
            let props = Object.assign(
                {},
                {
                    allowedPaymentMethods: [paymentsClient.$BlazorGooglePay.getCardPaymentMethod()],
                    transactionInfo: new GoogleTransactionInfo(tranProps),
                    merchantInfo: paymentsClient.$BlazorGooglePay.getMerchantInfo(),
                },
                customPaymentProps);
            return new GooglePaymentDataRequest(props);
        }

        function setDisplayShippingOptions(displayShippingOptions) {
            this.displayShippingOptions = displayShippingOptions;
        }

        function getDisplayShippingOptions() {
            return this.displayShippingOptions;
        }
        
        function setCalculateTransactionInfo(transactionInfo) {
            this.transactionInfo = transactionInfo;
        }

        function getCalculateTransactionInfo() {
            return this.transactionInfo;
        }
        
        /**
         * Configure support for the Google Pay API
         *
         * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#PaymentDataRequest|PaymentDataRequest}
         */
        class GooglePaymentDataRequest {
            constructor(props) {
                Object.assign(this, baseRequest, props);
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

        /**
         * Return an active PaymentsClient or initialize
         *
         * @see {@link https://developers.google.com/pay/api/web/reference/client#PaymentsClient|PaymentsClient constructor}
         * @returns {google.payments.api.PaymentsClient} Google Pay API client
         */
        this.getGooglePaymentsClient = function(
                environment,
                merchantInfo,
                processPaymentCallback,
                displayShippingOptionsCallback,
                calculateTransactionInfoCallback) {
            let paymentsClient;
            let paymentsClientProps = {
                environment: environment,
            };
            if (processPaymentCallback) {
                if (paymentsClientProps.paymentDataCallbacks === undefined) {
                    paymentsClientProps.paymentDataCallbacks = {};
                }
                paymentsClientProps.paymentDataCallbacks.onPaymentAuthorized = async (paymentData) => {
                    return await this.onPaymentAuthorized(paymentsClient, paymentData)
                };
            }
            if (displayShippingOptionsCallback && calculateTransactionInfoCallback) {
                if (paymentsClientProps.paymentDataCallbacks === undefined) {
                    paymentsClientProps.paymentDataCallbacks = {};
                }
                paymentsClientProps.paymentDataCallbacks.onPaymentDataChanged = async (intermediatePaymentData) => {
                    return await this.onPaymentDataChanged(paymentsClient, intermediatePaymentData)
                };
            }

            paymentsClient = new google.payments.api.PaymentsClient(paymentsClientProps);
            paymentsClient.$BlazorGooglePay = {};
            paymentsClient.$BlazorGooglePay.paymentAuthorized = {
                processPayment: processPaymentCallback
            };
            paymentsClient.$BlazorGooglePay.paymentDataChanged = {
                getDisplayShippingOptions: async function(shippingAddressJsObjRef) {
                    await displayShippingOptionsCallback(shippingAddressJsObjRef);
                    return paymentsClient.$BlazorGooglePay.getDisplayShippingOptions();
                },
                calculateTransactionInfo: async function(shippingAddressJsObjRef) {
                    await calculateTransactionInfoCallback(shippingAddressJsObjRef);
                    return paymentsClient.$BlazorGooglePay.getCalculateTransactionInfo();
                },
            };
            paymentsClient.$BlazorGooglePay.baseCardPaymentMethod = Object.assign({}, defaultBaseCardPaymentMethod);
            paymentsClient.$BlazorGooglePay.getBaseCardPaymentMethod = getBaseCardPaymentMethod;
            paymentsClient.$BlazorGooglePay.getCardPaymentMethod = getCardPaymentMethod;
            paymentsClient.$BlazorGooglePay.createPaymentDataRequest = createPaymentDataRequest;
            paymentsClient.$BlazorGooglePay.setAllowedAuthMethods = setAllowedAuthMethods;
            paymentsClient.$BlazorGooglePay.getAllowedAuthMethods = getAllowedAuthMethods;
            paymentsClient.$BlazorGooglePay.setAllowedCardNetworks = setAllowedCardNetworks;
            paymentsClient.$BlazorGooglePay.getAllowedCardNetworks = getAllowedCardNetworks;
            paymentsClient.$BlazorGooglePay.setGatewayInfo = setGatewayInfo;
            paymentsClient.$BlazorGooglePay.setMerchantInfo = setMerchantInfo;
            if (environment === 'TEST') {
                paymentsClient.$BlazorGooglePay.setGatewayInfo({
                    gateway: 'example',
                    gatewayMerchantId: 'exampleGatewayMerchantId'
                });
                paymentsClient.$BlazorGooglePay.setMerchantInfo({
                    merchantId: undefined,
                    merchantName: 'Example Merchant'
                });
            }
            paymentsClient.$BlazorGooglePay.getGatewayInfo = getGatewayInfo;
            paymentsClient.$BlazorGooglePay.getMerchantInfo = getMerchantInfo;
            paymentsClient.$BlazorGooglePay.getTokenizationSpecification = getTokenizationSpecification;
            paymentsClient.$BlazorGooglePay.setDisplayShippingOptions = setDisplayShippingOptions;
            paymentsClient.$BlazorGooglePay.getDisplayShippingOptions = getDisplayShippingOptions;
            paymentsClient.$BlazorGooglePay.setCalculateTransactionInfo = setCalculateTransactionInfo;
            paymentsClient.$BlazorGooglePay.getCalculateTransactionInfo = getCalculateTransactionInfo;
            let jsObjectRef = browserInterop.storeObjectRef(paymentsClient);
            paymentsClient.$BlazorGooglePay.jsObjectRef = jsObjectRef;
            return jsObjectRef;
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

        this.getAllowedAuthMethods = function(paymentsClient) {
            return paymentsClient.$BlazorGooglePay.getAllowedAuthMethods();
        }
        
        this.setAllowedCardNetworks = function(paymentsClient, cardNetworks) {
            paymentsClient.$BlazorGooglePay.setAllowedCardNetworks(cardNetworks);
        }

        this.getAllowedCardNetworks = function(paymentsClient) {
            return paymentsClient.$BlazorGooglePay.getAllowedCardNetworks();
        }
        
        this.setGatewayInfo = function (paymentsClient, gatewayInfo) {
            paymentsClient.$BlazorGooglePay.setGatewayInfo(gatewayInfo);
        }
        
        this.getGatewayInfo = function (paymentsClient) {
            return paymentsClient.$BlazorGooglePay.getGatewayInfo();
        }

        this.setMerchantInfo = function (paymentsClient, merchantInfo) {
            paymentsClient.$BlazorGooglePay.setMerchantInfo(merchantInfo);
        }

        this.getMerchantInfo = function (paymentsClient) {
            return paymentsClient.$BlazorGooglePay.getMerchantInfo();
        }

        this.setDisplayShippingOptions = function (paymentsClient, displayShippingOptions) {
            paymentsClient.$BlazorGooglePay.setDisplayShippingOptions(displayShippingOptions);
        }

        this.setCalculateTransactionInfo = function (paymentsClient, transactionInfo) {
            paymentsClient.$BlazorGooglePay.setCalculateTransactionInfo(transactionInfo);
        }
        
        /**
         * Prefetch payment data to improve performance
         *
         * @see {@link https://developers.google.com/pay/api/web/reference/client#prefetchPaymentData|prefetchPaymentData()}
         */
        this.prefetchGooglePaymentData = function(paymentsClient, currencyCode) {
            const paymentDataRequest = paymentsClient.$BlazorGooglePay.createPaymentDataRequest(paymentsClient,{
                totalPriceStatus: 'NOT_CURRENTLY_KNOWN',
                currencyCode: currencyCode,
            });
            paymentsClient.prefetchPaymentData(paymentDataRequest);
        }

        this.loadPaymentData = async function (paymentsClient, transactionInfoProps, customPaymentProps) {
            const paymentDataRequest = paymentsClient.$BlazorGooglePay.createPaymentDataRequest(
                paymentsClient,
                transactionInfoProps,
                customPaymentProps);
            try {
                let paymentData = await paymentsClient.loadPaymentData(paymentDataRequest);
                if (paymentData) {
                    return paymentData.paymentMethodData.tokenizationData.token;    
                }
            } catch(err) {
                // show error in developer console for debugging
                console.error(err);
            }
        }

        this.onPaymentAuthorized = async function(paymentsClient, paymentData) {
            try {
                let paymentToken = paymentData.paymentMethodData.tokenizationData.token;
                await paymentsClient.$BlazorGooglePay.paymentAuthorized.processPayment(paymentToken);
                return { transactionState: 'SUCCESS' };
            } catch (e) {
                console.log(`e is ${e}`);
                return {
                    transactionState: 'ERROR',
                    error: {
                        intent: 'PAYMENT_AUTHORIZATION',
                        message: 'Insufficient funds',
                        reason: 'PAYMENT_DATA_INVALID'
                    }
                };
            }
        }

        function getGoogleUnserviceableAddressError() {
            return {
                reason: "SHIPPING_ADDRESS_UNSERVICEABLE",
                message: "Cannot ship to the selected address",
                intent: "SHIPPING_ADDRESS"
            };
        }

        this.onPaymentDataChanged = async function(paymentsClient, intermediatePaymentData) {
            try {
                let shippingAddress = intermediatePaymentData.shippingAddress;
                let shippingOptionData = intermediatePaymentData.shippingOptionData;
                let paymentDataRequestUpdate = {};

                if (intermediatePaymentData.callbackTrigger === "INITIALIZE" ||
                    intermediatePaymentData.callbackTrigger === "SHIPPING_ADDRESS") {
                    if (shippingAddress.administrativeArea === "NJ")  {
                        paymentDataRequestUpdate.error = getGoogleUnserviceableAddressError();
                    } else {
                        paymentDataRequestUpdate.newShippingOptionParameters = await paymentsClient.$BlazorGooglePay.paymentDataChanged.getDisplayShippingOptions({
                            jsObjectRef: paymentsClient.$BlazorGooglePay.jsObjectRef,
                            shippingAddress,
                        });
                        
                        let selectedShippingOptionId = paymentDataRequestUpdate.newShippingOptionParameters.defaultSelectedOptionId;
                        paymentDataRequestUpdate.newTransactionInfo = await paymentsClient.$BlazorGooglePay.paymentDataChanged.calculateTransactionInfo({
                            jsObjectRef: paymentsClient.$BlazorGooglePay.jsObjectRef,
                            selectedShippingOption: {
                                shippingAddress,
                                shippingOptionId: selectedShippingOptionId
                            }
                        });
                    }
                } else if (intermediatePaymentData.callbackTrigger === "SHIPPING_OPTION") {
                    paymentDataRequestUpdate.newTransactionInfo = await paymentsClient.$BlazorGooglePay.paymentDataChanged.calculateTransactionInfo({
                        jsObjectRef: paymentsClient.$BlazorGooglePay.jsObjectRef,
                        selectedShippingOption: {
                            shippingAddress,
                            shippingOptionId: shippingOptionData.id
                        }
                    });
                }

                return paymentDataRequestUpdate;
            } catch(e) {
                console.log(`e is ${e}`);
            }
        }
    })();
})();
