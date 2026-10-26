# TechSpecs — Digital Business Card

Static digital business card for **TechSpecs**, matching the branding on [tech-specs.com.au](https://www.tech-specs.com.au/).

One HTML page. The profile lives in `people.js`. Save, copy, and share run in the browser.

---

## Run locally

```bash
py -m http.server 5501 --bind 127.0.0.1
```

Then open http://127.0.0.1:5501/

`--bind 127.0.0.1` keeps the server on this computer only.

---

## GitHub

Repository: https://github.com/goomoralybeam/TechspecsVirtualCard

Published card, after GitHub Pages is turned on:

https://goomoralybeam.github.io/TechspecsVirtualCard/?person=robert

In the repository, open **Settings → Pages**, choose branch `main` and folder `/ (root)`, then save. The card QR code points at that address.

---

## Profile

Robert Piez, Structural Engineer and Designer.

Company details from the website:

- Logo: TechSpecs Outdoor Living
- Tagline: Outdoor Living. Engineered
- Website: https://www.tech-specs.com.au
- Address: 21/12 Luther James Close, Doolandella QLD 4077

Email on the card: robert@patiotechwholesale.com.au. The site does not publish a phone or opening hours, so those rows stay hidden until you add them in `people.js`.

---

## Add a phone or email

In `people.js`, set `mobileDisplay` and `mobileLink`, or `email`. An empty string hides that row.
