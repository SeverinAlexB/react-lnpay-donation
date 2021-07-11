# react-lnpay-donation

Code snippets for the donation component on [lnrouter.app/about#donation](https://lnrouter.app/about#donation).

### Dependencies

- react
- qrcode.react
- react-loader-spinner
- canvas-confetti
- react-number-format
- react-copy-to-clipboard

## Apis used
- [lnpay.com](https://lnpay.com)
- [coindesk.com](https://api.coindesk.com/v1/bpi/currentprice.json)

## Notes

- LnRouter uses a custom Telegram api to notify the owner on new donations/messages. This is not included in this library because it is server side code.
- Make sure you use the `Wallet invoice` access key. This allows the user solely to generate invoices. You do not want to have the admin access key publicly available.
- Stilling is done with [tailwindcss](https://tailwindcss.com/) classes.


