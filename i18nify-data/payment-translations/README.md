# Payment Translations — 7 Indian Languages

Canonical payment UI string translations for i18nify.
Covers Hindi, Bengali, Marathi, Gujarati, Tamil, Telugu, and Kannada.

## Schema

- **Root key**: `payment_translations_information`
- **Entry key**: BCP 47 language code (`hi`, `bn`, `mr`, `gu`, `ta`, `te`, `kn`)
- **Total entries**: 7
- **Strings per locale**: 22

## String keys

| Key | Description |
|-----|-------------|
| `pay_now` | "Pay Now" button |
| `amount` | Amount field label |
| `cancel` | Cancel button |
| `confirm` | Confirm/Submit button |
| `payment_successful` | Success message |
| `payment_failed` | Failure message |
| `processing` | Processing spinner label |
| `total` | Order total label |
| `retry` | Retry button |
| `enter_amount` | Amount input placeholder |
| `card_number` | Card number field |
| `card_expiry` | Card expiry field |
| `cvv` | CVV field |
| `name_on_card` | Cardholder name field |
| `upi_id` | UPI ID field |
| `net_banking` | Net banking option |
| `wallet` | Wallet option |
| `transaction_id` | Transaction ID label |
| `back` | Back button |
| `error_try_again` | Error + retry message |
| `order_id` | Order ID label |
| `receipt` | Receipt/acknowledgement |

## Source

Translations are hand-curated and human-verified.
Not derived from a machine-readable T1/T2 source.
Language codes follow BCP 47 / ISO 639-1.

## Release note

The Go module at `i18nify-data/go/paymenttranslations` uses a `replace` directive
pointing to the local path during development. Tag and publish `v1.0.0` before
removing the directive (consistent with other i18nify-data Go modules).
