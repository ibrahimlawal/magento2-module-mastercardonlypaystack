<?php
namespace Profibro\MastercardOnlyPaystack\Model;

use Magento\Payment\Helper\Data as PaymentHelper;
use Yabacon\Paystack;
use Exception;

class Payment implements \Profibro\MastercardOnlyPaystack\Api\PaymentInterface
{
    const CODE = 'profibro_mastercardonlypaystack';

    protected $config;
    protected $paystack;
    protected $checkoutSession;

    public function __construct(
        PaymentHelper $paymentHelper
    )
    {
        $this->config = $paymentHelper->getMethodInstance(self::CODE);

        $secretKey = $this->config->getConfigData('live_secret_key');
        if ($this->config->getConfigData('test_mode')) {
            $secretKey = $this->config->getConfigData('test_secret_key');
        }

        $this->paystack = new Paystack($secretKey);
    }

    /**
     * @return bool
     */
    public function verifyPayment($ref_quote)
    {
        // we are appending quoteid
        $ref = explode('_-~-_', $ref_quote);
        $reference = $ref[0];
        $quoteId = $ref[1];
        try{
            $transaction_details = $this->paystack->transaction->verify([
                'reference' => $reference
            ]);
            if($transaction_details->data->metadata->quoteId === $quoteId){
                if($transaction_details->data->metadata->custom_filters->card_brands[0] === 'mastercard'){
                    return json_encode($transaction_details);
                }
            }
        } catch(Exception $e) {
            return json_encode([
                'status'=>0,
                'message'=>$e->getMessage()
            ]);
        }
        return json_encode([
            'status'=>0,
            'message'=>"quoteId doesn't match transaction"
        ]);
    }
}
