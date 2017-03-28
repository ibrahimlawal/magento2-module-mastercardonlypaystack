<?php
namespace Profibro\MastercardOnlyPaystack\Api;

interface PaymentInterface
{
    /**
     * @param string $reference
     * @return bool
     */
    public function verifyPayment(
        $reference
    );
}
