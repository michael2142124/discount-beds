# Discount Beds Belfast: launch checklist

Everything the shop needs to supply lives in `js/config.js`. Blank values are safe: the feature just stays off.

## 1. Things only the shop can provide

| What | Where | Why (textbook link) |
|---|---|---|
| GA4 measurement ID | `ga4Id` | CRO: "make changes based on data" |
| Form endpoint (e.g. Formspree) | `formEndpoint` | Without it the forms run in demo mode and **no leads are sent** |
| Call-tracking numbers (CallRail, or Google Ads forwarding numbers) | `phone.bySource`, `phone.byPage` | Page Elements: track calls from each landing page |
| 2 to 3 real Google reviews + star rating | `reviews` | Trust symbols: testimonials. **Never invent reviews** |
| Professional showroom photo or 30s walkthrough video | `showroom` | Trust symbols: professional photography, video |
| Delivery prices outside the free local area | FAQ in `index.html` | Removes the "ask for a price" step |
| Check the draft privacy policy (retention period) | `privacy.html` | Accessible privacy policy is a trust symbol + UK GDPR |
| Confirm "reserving is free, deposit after we call" | `ottoman-offer.html` | Policy wording written for the redesign |

## 2. Measure a baseline BEFORE launching

The textbook warns against full redesigns because you can't tell which change caused the result. So:

1. Add GA4 to the **current** site for 2 to 4 weeks.
2. Record: sessions, phone-link clicks, contact form sends, and calls (from the phone system).
3. Conversion rate = (calls + forms) / sessions.
4. Launch the redesign and compare the same numbers, or run old vs new as an A/B split.

## 3. A/B test already built in

- Hero headline: A = "Discount beds you can try first." (price-led), B = "Beds you can try before you buy."
- Visitors are split 50/50 and remembered. Force one with `?v=a` or `?v=b`.
- Events sent to GA4: `ab_exposure`, `phone_call_click`, `cta_click`, `generate_lead`, `category_click`, each tagged with `variant` and `source`.

A small local shop may not get enough traffic for a statistically significant result. If so, use user experience tests (below) as the textbook recommends.

## 4. User experience test (5 people, 20 minutes each)

Ask each person to do these tasks while you watch silently. Note where they hesitate or click the wrong thing.

1. Find a double mattress under £200 and ask the shop about it.
2. Find out whether they deliver to Bangor and what it costs.
3. Find the shop's opening hours and get directions.
4. Your bed arrived with a broken slat. What do you do?
5. (Starting from the Facebook ad in `ad-creative.html`) reserve the Armagh in kingsize.

## 5. Campaign links

See `ad-creative.html`. Every ad links to `ottoman-offer.html` with UTM tags (`utm_content=storage | price | showroom`), which changes the page's intro line to echo the ad.
