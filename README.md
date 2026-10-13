# Get SMS Codes

Relay is a web app for buying a phone number to receive SMS verification codes. Prices and balance are in naira. Numbers and texts are sample data for now. Deposits use Paystack.

A side menu has Dashboard, Get a number, Inbox, and Wallet, plus the balance and Add funds. On a phone the menu sits across the top.

Dashboard shows balance, active numbers, texts today, recent codes, and owned numbers. A Get a number button is at the top.

Get a number has 3 steps:

1. Search or pick a country. Cards show the city and a naira price range. Popular shortcuts: Nigeria, US, UK, Ghana.

2. Search or pick a service (Indeed, Facebook, WhatsApp, Instagram, Google, Telegram, TikTok, X, LinkedIn, Amazon, Apple, Microsoft, Uber, Netflix, Discord, Snapchat). Sort by popular or cheapest. Show if the balance covers the price.

3. Review the number, service, and price, and show where the text will appear before buying. If the balance is too low, prompt to add funds with Paystack. After buying, open that number’s inbox.

Inbox lists numbers by service. Each thread says texts for that service appear there, and shows the code with a copy button.

Wallet shows the naira balance, Paystack deposits, and payment history.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c834f195-f960-413c-9258-83a64802124a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
