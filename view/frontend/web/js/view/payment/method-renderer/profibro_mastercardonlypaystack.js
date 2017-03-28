/*browser:true*/
/*global define*/
define(
    [
        'jquery',
        'Magento_Checkout/js/view/payment/default',
        'Magento_Checkout/js/action/place-order',
        'Magento_Checkout/js/model/payment/additional-validators',
        'Magento_Checkout/js/model/quote'
    ],
    function ($, Component, placeOrderAction, additionalValidators, quote, fullScreenLoader) {
        'use strict';

        return Component.extend({
            defaults: {
                template: 'Profibro_MastercardOnlyPaystack/payment/form',
                customObserverName: null
            },

            initialize: function () {
                this._super();
                // Add Paystack Gateway script to head
                $("head").append('<script src="https://js.paystack.co/v1/inline.js">');
                return this;
            },

            getCode: function () {
                return 'profibro_mastercardonlypaystack';
            },

            getData: function () {
                return {
                    'method': this.item.method,
                    'additional_data': {}
                };
            },

            isActive: function() {
                return true;
            },

            /**
             * @override
             */
            placeOrder: function () {
                var checkoutConfig = window.checkoutConfig;
                var paymentData = quote.billingAddress();
                var MastercardOnlyPaystackConfiguration = checkoutConfig.payment.profibro_mastercardonlypaystack;

                if (checkoutConfig.isCustomerLoggedIn) {
                    var customerData = checkoutConfig.customerData;
                    paymentData.email = customerData.email;

                } else {
                    var storageData = JSON.parse(localStorage.getItem('mage-cache-storage'))['checkout-data'];
                    paymentData.email = storageData.validatedEmailValue;
                }

                var _this = this;
                _this.isPlaceOrderActionAllowed(false);
                var handler = PaystackPop.setup({
                  key: MastercardOnlyPaystackConfiguration.public_key,
                  email: paymentData.email,
                  amount: checkoutConfig.totalsData.grand_total * 100,
                  phone: paymentData.telephone,
                  currency: checkoutConfig.totalsData.quote_currency_code,
                  metadata: {
                     quoteId: checkoutConfig.quoteId,
                     custom_filters:{
                        card_brands: ['mastercard']
                     },
                     custom_fields: [
                        {
                         display_name: "QuoteId",
                         variable_name: "quote id",
                         value: checkoutConfig.quoteId
                        },
                        {
                            display_name: "Address",
                            variable_name: "address",
                            value: paymentData.street[0] + ', ' + paymentData.street[1]
                        },
                        {
                            display_name: "Postal Code",
                            variable_name: "postal_code",
                            value: paymentData.postcode
                        },
                        {
                            display_name: "City",
                            variable_name: "city",
                            value: paymentData.city + ', ' + paymentData.countryId
                        },
                     ]
                  },
                  callback: function(response){
                        $.ajax({
                            method: 'GET',
                            url: MastercardOnlyPaystackConfiguration.api_url + 'mastercardonlypaystack/verify/' + response.reference + '_-~-_' + checkoutConfig.quoteId,
                        }).success(function (data) {
                            if(data.status){
                                if(data.data.status === 'success'){
                                    _this.processPayment();
                                    return;
                                }
                            }
                            _this.isPlaceOrderActionAllowed(true);
                            _this.messageContainer.addErrorMessage({
                                message: "Error, please try again"
                            });
                        });
                  }
                });
                handler.openIframe();
            },

            processPayment: function () {
                var self = this,
                    placeOrder;

                if (this.validate() && additionalValidators.validate()) {
                    this.isPlaceOrderActionAllowed(false);
                    placeOrder = placeOrderAction(this.getData(), this.messageContainer);
                    $.when(placeOrder).fail(function () {
                        self.isPlaceOrderActionAllowed(true);
                    }).done(
                        function () {
                            self.afterPlaceOrder();
                        }
                    );

                    return true;
                }

                return false;
            },
        });
    }
)
;
