# MyPlot by 7Ai — Website

Static site for MyPlot (myplot.ng), covering three products: CheckMyPlot,
SellMyPlot, and BuyMyPlot. Plain HTML, CSS, and JavaScript, no build step,
no framework, no backend server required.

## Structure

```
index.html          Homepage — overview of all three products
check/index.html     CheckMyPlot — plot risk check request form
sell/index.html      SellMyPlot — plot or estate listing request form
buy/index.html        BuyMyPlot — "notify me" interest form
report/index.html     Report a suspicious plot or agent
css/style.css         Shared stylesheet, all pages use this one file
js/main.js             Shared JS — handles form submission and one small UI toggle
assets/logo/icon.svg   The MyPlot icon mark, used as the favicon and in headers
CNAME                  GitHub Pages custom domain file (contains myplot.ng)
```

Every page links to the same `css/style.css` and `js/main.js`, so a global
style change only needs to happen in one place.

## 1. Deploying to GitHub Pages

1. Push this repository to GitHub (public or private, GitHub Pages works
   with either on a paid plan; public repos get Pages free).
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to `Deploy from a branch`,
   branch `main`, folder `/ (root)`.
4. Save. GitHub will publish the site at `https://<username>.github.io/<repo>/`
   within a minute or two.

## 2. Connecting the myplot.ng domain

The `CNAME` file in this repo already contains `myplot.ng`, which is what
GitHub Pages needs to serve the custom domain. Two more steps are needed
outside GitHub, at wherever myplot.ng is registered (e.g. a Nigerian
registrar or a reseller):

1. Add these DNS records at the domain registrar:
   - **A records** for the root domain (`myplot.ng`) pointing to GitHub
     Pages' IP addresses:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   - **CNAME record** for `www.myplot.ng` pointing to
     `<username>.github.io` (or the org name, if this repo lives under a
     GitHub organization).
2. Back in **Settings → Pages** on GitHub, enter `myplot.ng` under
   **Custom domain** and save. Once DNS propagates (can take a few hours),
   tick **Enforce HTTPS**.

Full GitHub reference: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site

## 3. Wiring up the forms

There are four forms (CheckMyPlot, SellMyPlot, BuyMyPlot, Report Land).
None of them have a live backend yet, they're built to submit to
[Formspree](https://formspree.io), a free service that turns a plain HTML
form into a working email submission with zero backend code.

**Setup, about 10 minutes total:**

1. Create a free account at https://formspree.io.
2. Create **four separate forms** (one per page keeps submissions easy to
   filter), or one form if you'd rather route everything to a single inbox.
   Each form gives you an endpoint that looks like:
   `https://formspree.io/f/abcdwxyz`
3. In each of these four files, find the `<form action="...">` line and
   replace the placeholder with your real endpoint:
   - `check/index.html` → replace `REPLACE_WITH_CHECK_FORM_ID`
   - `sell/index.html` → replace `REPLACE_WITH_SELL_FORM_ID`
   - `buy/index.html` → replace `REPLACE_WITH_BUY_FORM_ID`
   - `report/index.html` → replace `REPLACE_WITH_REPORT_FORM_ID`
4. Done. `js/main.js` already handles the submission via `fetch()`, shows a
   success or error message inline, and resets the form, no further code
   changes needed.

If you'd rather use a different form backend (Web3Forms, Netlify Forms,
your own API, etc.), the same pattern works, just point each `<form
action="">` at your endpoint. `js/main.js` only assumes the endpoint
returns a normal HTTP success/failure status.

## 4. Things that are still placeholders

- **Formspree endpoints** — see above, required before forms will actually
  send anywhere.
- **Contact email** — currently `kayode.femi@7ai.africa` in each footer.
  Update if a dedicated MyPlot address is set up.
- **BuyMyPlot listings** — the Buy page currently only has a "notify me"
  form, since there's no listings backend yet. Once SellMyPlot has real
  submissions flowing in, BuyMyPlot's actual browsing/listing grid is the
  next real engineering piece to build (out of scope for this static
  handoff).

## 5. Brand reference

- Navy `#112038` — primary dark color, headers, footers, hero backgrounds
- Sage `#A8CDB8` — decorative accent, use on dark backgrounds or as solid
  button fills
- Deepened green `#5A8A70` — use for small text/labels that need to sit on
  a light background (the pale sage fails contrast as text on white)
- Fonts: Space Grotesk (display/headings), Inter (body), IBM Plex Mono
  (labels, coordinates, small caps text), all loaded from Google Fonts in
  each page's `<head>`

All colors and fonts are defined once as CSS custom properties at the top
of `css/style.css` under `:root`.
