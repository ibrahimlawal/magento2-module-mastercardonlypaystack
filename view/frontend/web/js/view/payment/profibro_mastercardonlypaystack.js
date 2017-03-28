/*browser:true*/
/*global define*/
define(
    [
        'uiComponent',
        'Magento_Checkout/js/model/payment/renderer-list'
    ],
    function (
        Component,
        rendererList
    ) {
        'use strict';
        rendererList.push(
            {
                type: 'profibro_mastercardonlypaystack',
                component: 'Profibro_MastercardOnlyPaystack/js/view/payment/method-renderer/profibro_mastercardonlypaystack'
            }
        );
        /** Add view logic here if needed */
        return Component.extend({});
    }
);
