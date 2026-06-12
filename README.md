# Jobnique.com – Full Job Search Website

Built with Next.js 15, Tailwind CSS, ready to deploy on Vercel.

## Pages
- `/` – Homepage with job search, categories, CV downloads, salary data, career advice
- `/jobs` – Live job search powered by Adzuna API
- `/career-advice` – Career guides and articles
- `/cv-templates` – Free CV template downloads
- `/cover-letters` – Free cover letter template downloads
- `/salaries` – US salary checker by job title

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Get your free Adzuna API keys
1. Go to https://developer.adzuna.com
2. Create a free account
3. Get your App ID and App Key
4. Add to `.env.local`:
```
ADZUNA_APP_ID=your_id
ADZUNA_APP_KEY=your_key
```

### 3. Set up newsletter (choose one)
**Brevo (free up to 300 emails/day):**
- Sign up at brevo.com
- Get API key from dashboard
- Add `BREVO_API_KEY` to `.env.local`
- Update `/app/api/newsletter/route.ts` with Brevo integration

**Mailchimp:**
- Add `MAILCHIMP_API_KEY`, `MAILCHIMP_LIST_ID`, `MAILCHIMP_DC`
- Uncomment the Mailchimp code in `/app/api/newsletter/route.ts`

### 4. Run locally
```bash
npm run dev
```

### 5. Deploy to Vercel
```bash
npx vercel
```
Or connect your GitHub repo to Vercel dashboard.

Add your environment variables in Vercel dashboard → Settings → Environment Variables.

## SEO Features
- Metadata on every page
- Open Graph tags
- Sitemap at /sitemap.xml
- Robots.txt at /robots.txt
- Schema.org structured data (WebSite + SearchAction)
- Semantic HTML headings

## To reach 1M monthly visits
1. Add Adzuna API keys — real jobs = real content
2. Publish 3+ career articles/week targeting long-tail keywords
3. Create individual salary pages per job title (programmatic SEO)
4. Create individual CV example pages per profession
5. Build backlinks via guest posts on HR blogs
6. Post career tips on TikTok/Instagram linking back to site

## Add Google AdSense
1. Apply at adsense.google.com (need 20+ pages of content)
2. Add your AdSense script to `app/layout.tsx`
3. Place `<ins class="adsbygoogle">` ad units between content sections
