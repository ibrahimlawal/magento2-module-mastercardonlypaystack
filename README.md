[![Latest Version on Packagist][ico-version]][link-packagist]
[![Software License][ico-license]](LICENSE)
[![Total Downloads][ico-downloads]][link-downloads]

# magento2-module-mastercardonlypaystack

Paystack payment gateway Magento2 extension (Mastercard Only)

# Install

* Go to Magento2 root folder

* Enter following command to install module:

```bash
composer require profibro/magento2-module-mastercardonlypaystack
```

* Wait while dependencies are updated.

* Enter following commands to enable module:

```bash
php bin/magento module:enable Profibro_MastercardOnlyPaystack --clear-static-content
php bin/magento setup:upgrade
php bin/magento setup:di:compile
```

* Enable and configure `Paystack` in *Magento Admin* under `Stores/Configuration/Payment` Methods

[ico-version]: https://img.shields.io/packagist/v/profibro/magento2-module-mastercardonlypaystack.svg?style=flat-square
[ico-license]: https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square
[ico-downloads]: https://img.shields.io/packagist/dt/profibro/magento2-module-mastercardonlypaystack.svg?style=flat-square

[link-packagist]: https://packagist.org/packages/profibro/magento2-module-mastercardonlypaystack
[link-downloads]: https://packagist.org/packages/profibro/magento2-module-mastercardonlypaystack
