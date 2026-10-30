# NOROI — Shopify theme

Custom Online Store 2.0 theme for **NOROI — Collect the unknown.**
Drop 001: POP MART × Jujutsu Kaisen — The Culling Game (blind boxes).

Shopify syncs this repo through the GitHub integration (branch `main`, theme at repo root).
Shopify ignores `docs/`.

## Structure

| Folder | Content |
|---|---|
| `layout/` | `theme.liquid` (site), `password.liquid` (pre-launch page) |
| `sections/` | Homepage blocks (`hero`, `offers`, `lineup`, `image-text`, `steps`, `faq`, `newsletter`, `cta-banner`, `trust-bar`) + `main-*` page sections + `cart-drawer` |
| `snippets/` | `head`, `product-card`, `cart-contents`, `box-count`, `icon`, `pagination` |
| `templates/` | JSON templates. `index.json` holds all homepage copy |
| `assets/` | `noroi.css`, `noroi.js`, self-hosted fonts, optimised brand images |
| `docs/` | Handoff, brand sources, catalogue CSVs, launch checklist |

## Conversion features

- Offer cards (1 / 3 / 6 boxes) with an automatic **price per box**, Ajax quick add and a highlighted middle offer
- **Format switcher** on every product page that cross-links the 3 products
- Ajax **cart drawer** with an optional free-shipping progress bar and a "go bigger" upsell
- Sticky add to cart on mobile, express checkout buttons (Shop Pay / Apple Pay)
- Real stock only: "Only X left" shows only when Shopify tracks inventory
- Trust bar, FAQ with FAQPage schema, Product schema, OG tags
- Pre-launch password page that collects emails

Box count comes from the `custom.box_count` product metafield (integer), with the product handle as a fallback.

## Dev

```bash
npm i -g @shopify/cli
shopify theme check --path .          # lint (0 offenses at v1.0.0)
shopify theme dev --store <shop>.myshopify.com
```

See [docs/LAUNCH-CHECKLIST.md](docs/LAUNCH-CHECKLIST.md) before opening the store.
