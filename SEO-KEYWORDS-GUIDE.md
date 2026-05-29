# Jobnique /salaries — SEO Strategy & Keyword Guide
**Updated: December 2026**

---

## 1. Architecture Changes (What Was Done)

### Server Component Split
The page is now split into two files:

| File | Type | Purpose |
|---|---|---|
| `app/salaries/page.tsx` | **Server Component** | Metadata, JSON-LD, static salary HTML (crawlable) |
| `app/salaries/SalariesClient.tsx` | **Client Component** | Filters, sort, expand, search UX |

**Why this matters for SEO:** Next.js server components render to static HTML that Googlebot can crawl without executing JavaScript. All 30+ salary rows are in the initial HTML response — no hydration required for indexing.

---

## 2. Metadata Implemented

```tsx
export const metadata: Metadata = {
  title: "US Salary Guide 2026 – Average Salaries by Job Title | Jobnique",
  description: "Explore average US salaries for 500+ job titles in 2026...",
  keywords: [...],
  alternates: { canonical: "https://www.jobnique.com/salaries" },
  openGraph: { ... },
  twitter: { card: "summary_large_image", ... },
  robots: { index: true, follow: true },
};
```

---

## 3. JSON-LD Structured Data (3 schemas)

### a) FAQPage Schema
Triggers **FAQ rich snippets** in Google search results — can double click-through rate.
Targets questions like:
- *"average software engineer salary usa"*
- *"highest paying tech jobs 2026"*
- *"how much does a nurse make"*

### b) Dataset Schema
Signals to Google that this is a **structured data resource**, eligible for the Dataset carousel and knowledge panels.

### c) BreadcrumbList Schema
Displays `jobnique.com › Salary Guide 2026` breadcrumbs in SERPs, improving CTR.

---

## 4. Primary Keyword Targets

### High Volume (10k–100k/mo searches)
| Keyword | Difficulty | Intent |
|---|---|---|
| average salary by job title | Medium | Informational |
| salary guide 2026 | Medium | Informational |
| software engineer salary usa | High | Informational |
| data scientist salary | High | Informational |
| nurse salary united states | Medium | Informational |
| highest paying jobs 2026 | High | Informational |
| product manager salary | Medium | Informational |
| DevOps engineer salary | Medium | Informational |

### Mid-Tail (1k–10k/mo searches)
| Keyword | Difficulty | Intent |
|---|---|---|
| machine learning engineer salary 2026 | Low-Med | Informational |
| cloud architect salary usa | Low | Informational |
| cybersecurity analyst salary | Low-Med | Informational |
| investment banker salary entry level | Low | Informational |
| nurse practitioner salary vs registered nurse | Low | Informational |
| how much does a lawyer make usa | Low-Med | Informational |
| UX designer salary 2026 | Low | Informational |
| financial analyst salary united states | Low | Informational |

### Long-Tail (100–1k/mo, easy wins)
| Keyword | Difficulty | Intent |
|---|---|---|
| average salary for full stack developer usa 2026 | Very Low | Informational |
| civil engineer average annual salary united states | Very Low | Informational |
| graphic designer pay range united states | Very Low | Informational |
| how much do SEO specialists make | Very Low | Informational |
| HR manager salary range usa | Very Low | Informational |
| operations manager average salary 2026 | Very Low | Informational |
| actuary salary united states per year | Very Low | Informational |
| paralegal annual salary usa | Very Low | Informational |

### Transactional (job-search intent — links to /jobs)
| Keyword | CTA Target |
|---|---|
| software engineer jobs usa | /jobs?q=software+engineer |
| remote data scientist jobs | /jobs?q=data+scientist&location=remote |
| nurse jobs near me | /jobs?q=nurse |
| product manager jobs 2026 | /jobs?q=product+manager |
| devops engineer remote jobs | /jobs?q=devops+engineer&location=remote |
| cloud architect jobs usa | /jobs?q=cloud+architect |

---

## 5. On-Page SEO Checklist

### Implemented ✅
- [x] Keyword-rich `<h1>`: *"US Salary Guide 2026"*
- [x] Keyword-rich `<h2>`: *"Average US Salaries by Job Title"*
- [x] Each salary card uses `<h3>` with exact role name (e.g. *"Software Engineer"*)
- [x] `<article>` tags with `aria-label` containing salary data (readable by crawlers)
- [x] Visible breadcrumb nav (`Home › Salary Guide 2026`)
- [x] Canonical URL set
- [x] FAQ section using native `<details>/<summary>` (crawlable, maps to FAQPage schema)
- [x] Internal links to `/jobs?q=` for every role (passes PageRank + drives conversions)
- [x] Internal links to `/career-advice`, `/cv-templates` (silo linking)
- [x] `role="search"` + `aria-label` on search input (accessibility & SEO signals)
- [x] `role="list"` + `role="listitem"` on results
- [x] OpenGraph image specified (use 1200×630 image at `/public/og-salaries.png`)
- [x] `robots: { index: true, follow: true }`
- [x] Data source attribution: *"BLS, Glassdoor, LinkedIn · Updated December 2026"*

### Recommended Next Steps 🔧
- [ ] Create individual salary pages: `/salaries/software-engineer`, `/salaries/data-scientist` etc. Each page = a standalone keyword target with full article content (500–800 words), location data, and company comparisons.
- [ ] Add a `sitemap.xml` entry for `/salaries` and all future `/salaries/[slug]` pages
- [ ] Create `/public/og-salaries.png` (1200×630) with text overlay
- [ ] Add `last_modified` to sitemap entry (use `2026-12-01`)
- [ ] Fetch live salary data from an API (e.g. Glassdoor API, LinkedIn Salary API) so the page updates automatically — Google rewards freshness
- [ ] Add location filter → enables geo-targeted pages like `/salaries?location=new-york`
- [ ] Submit updated sitemap to Google Search Console after deploying

---

## 6. Content SEO — What to Add

### Page intro paragraph (add above the salary cards)
```
Looking for a reliable US salary guide for 2026? Jobnique aggregates average annual 
salaries, pay ranges, and job demand data for over 500 job titles across technology, 
healthcare, finance, legal, and more. Whether you're negotiating your next offer or 
planning a career change, use our salary checker to benchmark your compensation.
```

### Per-role slug pages (future — high SEO value)
Create `app/salaries/[slug]/page.tsx` with:
- H1: `"Software Engineer Salary in the US (2026 Guide)"`
- 600+ word article: what affects salary, top cities, skills that pay more
- Salary by experience table
- "Browse open Software Engineer jobs" CTA → `/jobs?q=software+engineer`
- Related roles section with internal links

---

## 7. Technical SEO Notes

### Page Speed
- The client island (`SalariesClient`) only activates after the server-rendered HTML is painted — First Contentful Paint is fast.
- Avoid importing heavy chart libraries. The current bar uses pure CSS positioning (zero JS weight).

### Core Web Vitals targets
| Metric | Target | Notes |
|---|---|---|
| LCP | < 2.5s | Hero H1 is text — fast |
| CLS | < 0.1 | Fixed-height salary bars prevent layout shift |
| INP | < 200ms | Filter/sort updates are synchronous state changes |

### Robots.txt
Ensure `/salaries` is not blocked:
```
User-agent: *
Disallow: /admin/
Allow: /salaries
```

### Internal Linking Strategy
Every role card links to `/jobs?q=[role]` — this is both a user conversion path **and** an SEO internal link signal. Google sees these as content-relevant links, which strengthens the `/jobs` page's authority for those role keywords.

---

## 8. Quick Wins (Do This Week)

1. **Deploy this page** and submit to Google Search Console → Request Indexing
2. **Add OG image** at `/public/og-salaries.png`
3. **Write one long-form salary article** (e.g. `Software Engineer Salary Guide 2026`) — 800 words, targets "software engineer salary usa 2026" (high volume, high intent)
4. **Get 2–3 backlinks** to `/salaries` from job advice blogs or HR publications — salary data pages are highly linkable
5. **Share on LinkedIn/Twitter** with "2026 US Salary Data" messaging — social signals help initial indexing speed

---

*Generated by Jobnique SEO audit — Jobnique.com*
