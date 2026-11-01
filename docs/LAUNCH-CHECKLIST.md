# Launch checklist

Live QA run on 2026-10-30 against tv82a0-5k.myshopify.com (theme NOROI/main, desktop 1440px + mobile 390px):
every page answers 200 (home, catalogue, 3 products, cart, search, contact, 6 policies, 404 page), no JavaScript
errors, quick add, cart drawer (+ / − / remove / upsell), product add to cart, format switch, cart page and
checkout redirect all work. The contact form renders on `/pages/contact`.

Everything below is done in the Shopify admin, not in the theme.

## 1. Blocking — do before taking real orders
- [ ] **Store name**: Settings > General > Store name = `NOROI` (the browser tab and privacy policy still say "Ma boutique").
- [ ] **Store email**: Settings > General > set a real sender/contact email (currently Shopify's `…@businessmail.shop` placeholder; the contact page hides it until it is changed). Contact form messages go to this address.
- [ ] **Payments**: Settings > Payments, activate Shopify Payments (identity + bank account). Then place one real order and refund it.
- [ ] **Shipping**: Settings > Shipping and delivery, create real rates for France / EU.
- [ ] **Shipping policy**: still contains `[À compléter …]` placeholders. Fill it in.
- [ ] **Policies in English**: refund, shipping, terms, legal notice and contact info are written in French while the site is in English.
- [ ] **Compare-at prices** (19.90 / 52.90 / 99.90): remove them unless they are real previous prices. Under the EU Omnibus rule, a strikethrough price must be the lowest price of the last 30 days.
- [ ] **Inventory**: track quantity and turn OFF "Continue selling when out of stock".
- [ ] Supplier verified (real stock, factory-sealed), since the site promises factory-sealed boxes.

## 2. Content
- [ ] **Products in English**: titles ("Blind Box individuelle", "TRIO MYSTÈRE (3 blinds box)", "Display de 6 Blind Boxes"), descriptions and the option value "Boîte individuelle". Example titles: `Single Blind Box`, `Mystery Trio (3 boxes)`, `Full Display (6 boxes)`. Keep the URL handles as they are, because the theme references them.
- [ ] **Menus in English**: Online Store > Navigation.
  - `main-menu`: Shop → `/collections/all`, Lineup → `/#lineup`, How it works → `/#how-it-works`, FAQ → `/#faq`, Contact → `/pages/contact`.
  - `footer`: rename "Accueil / Catalogue / Rechercher".
- [ ] Optionally add character names (Yuji, Gojo…) to product tags, so that searches find them. The search page already falls back to the 3 boxes.

## 3. Go live
- [ ] Pick a plan (Settings > Plan). The store cannot sell on the trial.
- [ ] **Domain**: Settings > Domains > Buy new domain (e.g. `noroi.shop`), or Connect existing. Then set it as the primary domain. SSL is automatic.
- [ ] Online Store > Preferences: remove the password if one is set, and add the homepage title and meta description.
- [ ] Checkout and notification language = English.

## 4. Conversion boosters (after launch)
- [ ] **Reviews**: install Judge.me (free) and add its app block to the "Reviews & pulls" section. Use real reviews only.
- [ ] **Abandoned checkout emails**: Marketing > Automations.
- [ ] **Box rewards / free-shipping bar**: Theme settings > Cart. Both are off by default; create the matching discount or shipping rate first.
- [ ] **Drop countdown**: enter the real date in the section, or leave it empty.
- [ ] **Customer pulls**: add real unboxing photos as blocks.

## Pricing and fulfilment (decided 2026-11-01)
- Prices: Single €24.90, Trio €64.90, Full Display €119.90 (set in Products; no compare-at price).
- Sourcing: POP MART POP NOW at €15/box, shipped with "Expédier" straight to the customer's address. Copy the tracking number into the Shopify order.
- Shipping rates (Settings > Shipping and delivery): France tracked standard €4.90; free from €100 (theme bar set to 100). Offer an express rate only if POP MART offers express when shipping.
