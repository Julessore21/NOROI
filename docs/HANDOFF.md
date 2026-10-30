# NOROI — PROJECT HANDOFF
**Date:** 30 October 2026  
**Destination:** GitHub + Claude Code  
**Status:** Prototype Shopify, not ready for paid public sales

## 1. Executive summary
NOROI is a premium independent e-commerce brand for mystery-box anime collectibles. The first planned drop is the **POP MART Jujutsu Kaisen — The Culling Game Series**, sold as a single blind box, 3-box discovery bundle, or sealed 6-box display. The target storefront language is **English**. Design blends minimalist premium commerce with the cinematic, supernatural visual atmosphere of Jujutsu Kaisen. The operating brand is **NOROI / Collect the unknown**. Do not present NOROI as an official POP MART or JJK store or as an authorized retailer until verified.

## 2. Product and commercial strategy
- **Single Mystery Box**: preliminary **€17.90**. One random sealed box.
- **Trio Mystery (3 boxes)**: preliminary **€47.90**. Three independently random boxes; **duplicates possible**.
- **6-Box Display**: preliminary **€89.90**. Full display of six sealed boxes; confirm sealed case and assortment with supplier, and do not promise no duplicates unless verified.
- Shopify screenshot showed all three created, marked **Active**, **Stock not tracked**, vendor **NOROI**, and images present. A prior CSV even included `Variant Inventory Policy=continue`; this can permit overselling. Immediately disable buying/publishing until inventory and fulfilment are established.
- For this POP MART series, the **official six standard characters** are **Yuji Itadori, Megumi Fushiguro, Yuta Okkotsu, Choso, Maki Zen'in and Naoya Zen'in**. **Official secret** is **Yuji Itadori with Panda**, not Satoru Gojo. Cited source to re-check: https://www.popmart.com/en-US/products/8963 .
- Product dimensions listed by POP MART approximately **8–10 cm**, PVC/ABS, not suitable for under 15s.
- Official FR site has been observed listing ~€15 per individual box; verify current pricing before final pricing.
- A sourced Alibaba listing was discussed: https://french.alibaba.com/product-detail/Authentic-POP-MART-Jujutsu-Kaisen-the-1601966074157.html . A seller's claim of authenticity is not verification. Need invoice, supply chain provenance, EEA resale rights, costs shipped France, fulfilment terms, real stock, packaging and product samples.
- No fake scarcity, fake discounts, invented testimonials or guaranteed secret-figure claims. Prominent explanation of random boxes.

## 3. Design / brand
**Name:** NOROI (provisional, trademark/domain availability not researched conclusively).  
**Tagline:** "Collect the unknown."  
**Brand language:** English. Configure Shopify primary language, translations of product data, checkout, policies and transactional emails; a Liquid theme translation alone is insufficient.

**Visual DNA:**
- Premium dark Japanese supernatural aesthetic; restrained and professional, not generic RGB gaming.
- Background almost-black/navy: approximately `#0C0D15` / `#101116`.
- Crimson red accents `#B34B59` and cool electric blue reserved for mystery aura.
- Warm ivory/off-white typography `#F6F1EB`, gray subdued copy.
- Bold uppercase condensed display typography; clean readable sans for UI; sparing Japanese characters.
- Earlier proposed type system: **Barlow Condensed ExtraBold**, **Manrope**, **Noto Sans JP**. Verify licensing/loading and have fallback fonts.
- Original logo iterations: use `assets/branding/emblème_occulte_rouge_et_ivoire_noroi.png` (simpler square), but it remains raster art: plan to redraw an accessible SVG and derive favicon, wordmark and monochrome variants.
- Negative space around product photography. Depth and subtle scroll reveal, not noisy animations or obstructive graphics. Mobile performance, accessibility and `prefers-reduced-motion` required.
- Large cinematic hero with figurines in blue/red ruined city. Banner *without the POP MART display box* preferred for header.
- User likes **blue aura, glowing eye, concealed silhouette, question mark** as an artistic tease reminiscent of Gojo. **Do not label this as the official secret**, do not imply Gojo can be drawn from this actual series. Clearly identify the official secret separately, or change the campaign treatment to avoid customer deception.

## 4. Site pages / information architecture
1. Home `/`: hero, offers, lineup, secret odds, concept, FAQs, final CTA.
2. Shop / collections: curated collections and product cards.
3. PDPs `/products/...`: genuine photo gallery, price from Shopify, variants/bundle choices, delivery, stock, add to cart, detailed mystery rules.
4. Concept / How it works: blind boxes, randomness, duplicates, secret probabilities.
5. FAQ & Contact: fulfilment and after-sales expectations.
6. Optional Journal / Drops as brand scales.
7. Required service and legal pages: Shipping, Returns/Withdrawal, Privacy, Terms of Sale, Legal Notices, Cookie Controls. Complete according to business's legal facts; not invented.
8. 404 and list-collections templates.
9. Cart and Shopify Checkout.

## 5. Homepage planned flow
**Top banner:** "DROP 001 — JUJUTSU KAISEN / THE CULLING GAME" — branding without claims of affiliation.  
**Hero:** "UNBOX THE UNKNOWN." / short support copy / strong "SHOP THE DROP" CTA / banner showing lineup. Place text where figures aren't obscured; reduce overlay thickness.  
**Offers:** 1 box, 3-box pack, 6-box display. Real Shopify prices; highlight six-box display visually, no fictional discount badge.  
**Lineup:** 6 correct standard characters; do not replace official Maki with a mystery slot in factual product information. For *artistic campaign* may use an additional blue mystery slot, labeled as **campaign artwork / not a guaranteed product**.
**Secret:** explain real official secret: Yuji with Panda. Publicly announced probability ~1/72 per box should be reverified in official documentation.
**Concept:** Choose / Unbox / Collect, with no false odds.
**Detail macro:** close-ups, authentic packaging, practical size.
**FAQ:** real shipping times, genuine authenticity status, exact random-selection rules, duplicates, returns.
**Newsletter:** voluntary opt-in with privacy controls.

## 6. Product pages — requirements
- Product prices and inventory state from Shopify (`product`, `variant`), no hardcoded stock or pricing.
- Product images must be faithful to physical items. Use official or supplier-authorized product photos on purchase sections; label AI mood images clearly as conceptual. No materially altered figurines as packshots.
- 1-box, 3-box, 6-box may remain separate actual Shopify products (already created), cross-link with appropriate upsells.
- When sold as bundle, ensure inventory synchronization: 3-pack must deduct 3 singles; 6-pack must deduct one whole display (not necessarily identical to six randomly picked boxes). Use Shopify Bundles/appropriate inventory rules or supplier's actual SKUs.
- Confirm sealed and non-sealed display semantics before promises of different figures. Secret never guaranteed.
- Product age warning / country of origin / merchant identity and required labels.
- Product description SEO in English and complete English locale/notifications.

## 7. Assets
### Original user-supplied photos
`assets/originals/original-01.jpg` through `original-06.jpg`. These show:
1. POP MART full display / sealed presentation.
2. Blonde-haired figure with translucent blue panel.
3. Black-haired figure with blade.
4. Dark-haired figure with red tendril effect.
5. Black-haired figure with rabbits.
6. Pink-haired Yuji with blue effect.
**Use these as factual photo references**. Confirm commercial usage rights; delivered by user does not automatically grant marketing license.
### Generated promotional images
In `assets/generated/`:
- `présentoir_jujutsu_kaisen_en_ambiance_urbaine.png` — cinematic display concept.
- `figurine_chibi_dans_un_décor_cyber_noir.png` — cinematic character.
- `figurine_chibi_au_katana_dans_les_ruines_néon.png`.
- `figurine_guerrière_brisant_la_glace.png`.
- `figurine_chibi_dans_les_brumes_rouges.png`.
- `figurine_chibi_dans_les_ruines_embrumées.png`.
- `figurines_chibi_dans_une_cité_néon_en_ruines.png` — **final accepted product-lineup banner WITHOUT display box**, featuring blue mystery silhouette.
- `figurines_chibi_dans_une_cité_cyberpunk_en_ruines.png`.
- `figurines_chibi_dans_une_ruelle_cyberpunk_en_ruine.png`.
- `gamme_de_figurines_chibi_dans_la_cité_en_ruines.png`.
Some AI visuals visually deviate from the real figurines, so DO NOT treat them as literal catalogue photography.
### Brand and logo
`assets/branding/` — square emblem, earlier embellished version, identity board.
### Screenshots
`references/` — captured real Shopify theme and product admin states. These document **V5 visible and active** and current products. They are **not proof V7 works**.

## 8. Code handoff
- The entire **latest V7 theme source**, extracted from `noroi-shopify-v7-corrected-lineup.zip`, is in `/theme`.
- Shopify Liquid architecture: `/layout`, `/templates/*.json`, `/sections/*.liquid`, `/snippets`, `/assets`, `/config`, `/locales`.
- Main section files include `hero-v5.liquid`, `drop-v5.liquid`, `lineup-v5.liquid`, `secret-v5.liquid`, `experience-v5.liquid`, `header.liquid`, `footer.liquid`, `main-product-kurio.liquid`, `main-cart-kurio.liquid`.
- Historical filenames "kurio" and "v5" survive in V7; rename carefully in a dedicated refactor only after functionality is stable.
- A previous 404 problem was fixed by adding `templates/404.json` and `sections/main-404-noroi.liquid`.
- Theme v5 was actually shown live in the Shopify theme editor; V6/V7 supplied as ZIPs but **not visually validated**.
- The V7 was generated by changing the English V6 copy, lineup and secret sections. Its storyline is **commercially misleading** as written: it says "Five figures revealed. One hidden aura", removes Maki and alludes to Gojo as a purchasable hidden slot. **Fix before any public deployment**.
- Audit template JSON, theme section schema, locale consistency, images and alt tags, links, cart add-to-bag logic, responsiveness, a11y, error/404, checkout smoke test and breakpoints.

## 9. Important technical traps / bugs
- **Never** label Maki Zen'in as the mystery figure or Gojo as the secret in POP MART Culling Game.
- `lineup-v5.liquid` is hardcoded to 5 photos + placeholder despite official 6 standard figures.
- Default locale set in the theme is not proof Shopify store language is English; configure admin localization.
- "Active" products with **no tracked inventory** and `continue` policy can sell with no supply. This is a serious risk.
- Bundle inventory must be managed correctly.
- Product cards with add-to-bag should reference actual variant IDs and availability; test Ajax/cart redirects.
- Confirm EEA trademark exhaustion/rights and approval to use commercial product images; licensing and provenance outstanding.
- The brand must not falsely suggest it is POP MART's or JJK's official storefront.
- AI-edited images can be editorial, but catalog pictures should accurately represent the physical product.

## 10. Recommended Claude Code plan
**P0 — Safe state**
- Keep store password protected.
- Pause sales: draft/unpublish all 3 products or configure stock with deny overselling. Supplier not validated.
- Make a git repo, set up `.gitignore`, add this handoff as README.
- Validate product names/official set and legal messaging.

**P1 — Repair factual integrity**
- Show all six **real standard characters** correctly labeled.
- Feature **Yuji with Panda** as official secret.
- Preserve the electric blue Gojo-style silhouette as clearly labeled editorial concept only or remove from conversion sections.
- Translate all product titles/descriptions to English; review locale.

**P2 — Shopify theme quality**
- Validate theme with Shopify CLI / Theme Check; check browser console.
- Ensure 404, home, collection, product, cart, search, page all function.
- Configure products in theme editor (currently require product selection in `NOROI Offers` settings).
- Product PDP, sticky CTA mobile, shipping estimate policy, accessible gallery.
- Audit JS, CSS, image loading (WebP/AVIF options), animated motion limits.

**P3 — Conversion**
- Homepage clear offer hierarchy: 1 / 3 / 6 boxes, truthful explanation, genuine packaging, CTA.
- Live prices only. No manufactured scarcity, reviews or misleading "secret".
- Verify order-funnel through test payments with Shopify.
- Set up analytics/privacy consent per local rules; capture add_to_cart, begin_checkout, purchase.

**P4 — Business readiness**
- Supplier samples, proof authenticity, resale rights for EEA, shipping/DDP/import VAT treatment.
- Margin model (supplier + transport + fees + refunds + CAC).
- Legal/contact/returns/taxes/shipping finished.
- Then switch from password-protected draft to launch.

## 11. GitHub suggested repo layout
```
noroi/
  README.md
  theme/
    assets/
    config/
    layout/
    locales/
    sections/
    snippets/
    templates/
  assets/
    branding/
    originals/
    generated/
  catalog/
    noroi-produits-shopify-brouillons.csv
    noroi-produits-shopify-actifs-ATTENTION.csv
  references/
```
Do not commit Shopify tokens, customer information or supplier credentials. This ZIP does not include such secrets to our knowledge. If you use the Shopify CLI, store tokens in local env / secure secret store.

## 12. First prompt for Claude Code
> You are the lead Shopify theme engineer and conversion-focused e-commerce designer for NOROI. Read this README, inspect the whole `/theme` tree, and do not assume the latest V7 has been tested. The active live theme seen in screenshots is V5. First, perform a factual/legal/commercial audit of product messaging (the official POP MART Culling Game mystery is Yuji with Panda, NOT Gojo), theme validity, localization, mobile UX and cart functionality. Then produce a minimal, premium, English-language theme refinement using the provided assets. Keep the user-approved blue aura lineup art for editorial atmosphere only with non-misleading labeling. Treat any AI-generated product depiction as campaign imagery rather than an exact commercial packshot. Use only real Shopify prices, inventory and verified availability. Do not publish or activate checkout before supplier, stock, rights and legal pages are verified. Commit incremental changes with tested results and a brief changelog.
