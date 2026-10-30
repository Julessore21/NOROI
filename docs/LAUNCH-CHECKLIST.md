# Launch checklist (before removing the store password)

## Business / legal — blocking
- [ ] Supplier verified (invoice, provenance, real stock). The theme says "factory-sealed", which must be true.
- [ ] Rights to resell in the EEA and to use the product photos confirmed.
- [ ] Legal pages filled in Settings > Policies: refund, shipping, privacy, terms, legal notice (Shopify lists them in the footer automatically).
- [ ] The secret odds (≈ 1 in 72) re-checked against POP MART's official page. Edit them in `templates/index.json` and `product.json`, or in the theme editor.
- [ ] Remove the compare-at prices (19.90 / 52.90 / 99.90) unless they are real previous prices. EU Omnibus rule: a strikethrough price must be the lowest price of the last 30 days.

## Shopify admin
- [ ] Products: track inventory and set "Continue selling when out of stock" to OFF (currently `continue`, so overselling is possible).
- [ ] Translate product titles and descriptions to English. Handles can become English too, but add URL redirects and update `templates/*.json` and `config/settings_data.json`.
- [ ] Optional: add a `custom.box_count` integer metafield (1 / 3 / 6) to the products.
- [ ] Store language = English, plus the checkout and notification languages.
- [ ] Navigation: `main-menu` (Shop, Lineup → `/#lineup`, How it works → `/#how-it-works`, FAQ → `/#faq`) and `footer` (Contact, Shipping, Returns).
- [ ] Create a `contact` page (template `page`). The FAQ links to `/pages/contact`.
- [ ] Free shipping: if you offer it, create the rate in Shipping, then set the same amount in Theme settings > Cart.
- [ ] Add a real Maki Zen'in photo in the Lineup section. No Maki image exists in the assets. Note: `noroi-maki-editorial.jpg` from V7 actually shows Naoya.
- [ ] Place a test order (Bogus Gateway / test mode).
