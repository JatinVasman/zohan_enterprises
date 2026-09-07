# Zohan Enterprises — Website

React 19 + Vite 8 marketing and product catalogue website for Zohan Enterprises, a wire processing machinery trader based in Noida, India.

---

## Tech Stack

| Layer | Library |
|-------|---------|
| UI framework | React 19 + Vite 8 |
| Styling | Tailwind CSS v4 (`@theme {}` tokens) |
| Animation | Framer Motion |
| Icons | Lucide React |
| Routing | React Router DOM v6 |
| Form submission | Web3Forms (no backend required) |

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example env file and add your Web3Forms key:

```bash
cp .env.example .env.local
```

Open `.env.local` and set:

```
VITE_WEB3FORMS_ACCESS_KEY=your_access_key_here
```

> **Get a free key:** Go to [https://web3forms.com](https://web3forms.com), enter the email address where you want to receive enquiries, and copy the access key. No account or backend needed.

### 3. Start development server

```bash
npm run dev
```

### 4. Build for production

```bash
npm run build
```

---

## Enquiry / Quote System

### How it works

1. User clicks **Get Latest Price** (product card or product detail page) or submits the **Contact Us** form.
2. The enquiry is **always saved to `localStorage`** first as a local backup under the key `ze_enquiries`.
3. The data is then **POSTed to Web3Forms** (`https://api.web3forms.com/submit`).
4. On success → user is navigated to `/thank-you` with the product details shown.
5. On failure → an error banner is shown with a fallback phone number. The data is already saved locally.

### Fields submitted

| Field | Source |
|-------|--------|
| `name` | User input |
| `phone` | User input (+91 prefix) |
| `email` | User input (optional) |
| `company` | User input (optional) |
| `message` / `requirement` | User input |
| `productName` | Auto-filled from selected product |
| `productPrice` | Auto-filled from selected product |
| `productCategory` | Auto-filled from selected product |
| `productSlug` | Auto-filled from selected product |
| `pageUrl` | Auto-filled (`window.location.href`) |

### Viewing saved local enquiries (dev)

Open browser DevTools → Application → Local Storage → key `ze_enquiries`.

### Upgrading to a real backend later

Replace the fetch call in `src/lib/submitEnquiry.js` with your own API endpoint. The interface stays the same — `{ ok: boolean, error?: string }`.

**Recommended upgrade path:**

| Option | When to use |
|--------|-------------|
| **Web3Forms** (current) | Client demo, early production — free, zero backend |
| **Supabase + Resend** | When you need a leads dashboard / CRM |
| **Node/Express + Nodemailer** | Full custom control, self-hosted |

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_WEB3FORMS_ACCESS_KEY` | Yes (for email delivery) | Web3Forms access key. If blank, submissions save to localStorage only — useful for local development. |

> All `VITE_` prefixed variables are inlined at build time by Vite. Never put secrets (database passwords, private API keys) in `VITE_` variables — they are visible in the browser bundle.

---

## Project Structure

```
src/
├── components/
│   ├── QuoteModal.jsx          # Product quote modal
│   ├── EnquiryForm.jsx         # Contact page form
│   └── ...
├── context/
│   └── QuoteModalContext.jsx   # Global modal open/close state
├── data/
│   ├── products.js             # Full product catalogue (50 products, 8 categories)
│   └── content.js              # Company info, nav items
├── lib/
│   └── submitEnquiry.js        # Shared submission: localStorage + Web3Forms
├── pages/
│   ├── Home.jsx
│   ├── Contact.jsx
│   ├── ThankYou.jsx
│   ├── ProductList.jsx
│   └── ProductDetail.jsx
└── assets/
```

---

## Deployment

The site is a static SPA. Deploy the `dist/` folder to any static host:

- **Vercel** — connect repo, set `VITE_WEB3FORMS_ACCESS_KEY` in Project Settings → Environment Variables.
- **Netlify** — set the variable under Site Settings → Environment Variables.
- **cPanel / any CDN** — run `npm run build`, upload contents of `dist/`.

Ensure your host serves `index.html` for all routes (SPA fallback / `_redirects` file on Netlify).
