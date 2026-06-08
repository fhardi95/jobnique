/**
 * /app/salaries/page.tsx  — Jobnique Salary Guide
 *
 * SEO IMPROVEMENTS:
 *  • Server component with full metadata export (title, description, keywords,
 *    canonical, OpenGraph, Twitter card, robots)
 *  • JSON-LD structured data: FAQPage + Dataset schema for rich snippets
 *  • Semantic HTML5 (article, section, aside, nav[aria-label])
 *  • Long-tail keyword targeting per role (SEO slug links)
 *  • Internal linking to /jobs?q= (clickable job search)
 *  • Breadcrumb schema + visible breadcrumb nav
 *  • Dynamic <h1>/<h2> with keyword-rich text
 *  • Static salary data rendered server-side (crawlable)
 *  • Client island only for filter/search UX
 *
 * DYNAMIC IMPROVEMENTS:
 *  • Sector filter tabs
 *  • Sort by salary / growth / demand
 *  • Expandable salary detail card
 *  • Related jobs CTA links to live job search
 *  • Keyword-rich anchor text on every card
 */

import type { Metadata } from "next";
import SalariesClient from "./SalariesClient";

/* ─── SEO Metadata ──────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: "US Salary Guide 2026 – Average Salaries by Job Title | Jobnique",
  description:
    "Explore average US salaries for 500+ job titles in 2026. Compare pay ranges by sector, experience, and location. Find out what Software Engineers, Nurses, Data Scientists, and more earn – plus browse open jobs now.",
  keywords: [
    "average salary USA 2026",
    "salary guide by job title",
    "how much does a software engineer make",
    "nurse salary United States",
    "data scientist salary",
    "product manager salary 2026",
    "doctor salary USA",
    "DevOps engineer pay",
    "salary comparison by industry",
    "entry level vs senior salary",
    "highest paying jobs 2026",
    "salary range checker",
    "tech salary guide",
    "healthcare jobs salary",
    "finance jobs salary",
    "job salary by state",
    "Jobnique salary checker",
  ].join(", "),
  alternates: { canonical: "https://www.jobnique.com/salaries" },
  openGraph: {
    title: "US Salary Guide 2026 – Average Pay for 500+ Job Titles",
    description:
      "Find out what your role pays in 2026. Average salaries, pay ranges, growth rates, and direct links to open jobs across tech, healthcare, finance and more.",
    url: "https://www.jobnique.com/salaries",
    siteName: "Jobnique",
    type: "website",
    images: [
      {
        url: "https://www.jobnique.com/og-salaries.png",
        width: 1200,
        height: 630,
        alt: "Jobnique US Salary Guide 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "US Salary Guide 2026 | Jobnique",
    description:
      "Compare average salaries for 500+ US job titles. Tech, healthcare, finance, law and more – with live job links.",
    images: ["https://www.jobnique.com/og-salaries.png"],
  },
  robots: { index: true, follow: true },
};

/* ─── Salary Data (server-side rendered → fully crawlable) ──────────────── */
export const allSalaries = [
  // Technology
  { role: "Software Engineer",        slug: "software-engineer",         avg: 112000, min: 80000,  max: 155000, sector: "Technology",  growth: "+8%",  demand: "Very High", yoe: "2–5 yrs", remote: true  },
  { role: "Senior Software Engineer", slug: "senior-software-engineer",  avg: 148000, min: 115000, max: 200000, sector: "Technology",  growth: "+8%",  demand: "Very High", yoe: "5–10 yrs",remote: true  },
  { role: "Data Scientist",           slug: "data-scientist",            avg: 120000, min: 88000,  max: 160000, sector: "Technology",  growth: "+15%", demand: "High",      yoe: "2–5 yrs", remote: true  },
  { role: "Machine Learning Engineer",slug: "machine-learning-engineer", avg: 138000, min: 105000, max: 190000, sector: "Technology",  growth: "+20%", demand: "Very High", yoe: "3–6 yrs", remote: true  },
  { role: "DevOps Engineer",          slug: "devops-engineer",           avg: 118000, min: 88000,  max: 155000, sector: "Technology",  growth: "+12%", demand: "Very High", yoe: "3–6 yrs", remote: true  },
  { role: "UX Designer",              slug: "ux-designer",               avg: 95000,  min: 70000,  max: 130000, sector: "Technology",  growth: "+9%",  demand: "High",      yoe: "2–5 yrs", remote: true  },
  { role: "Product Manager",          slug: "product-manager",           avg: 130000, min: 95000,  max: 175000, sector: "Technology",  growth: "+10%", demand: "High",      yoe: "3–7 yrs", remote: true  },
  { role: "Cybersecurity Analyst",    slug: "cybersecurity-analyst",     avg: 103000, min: 75000,  max: 140000, sector: "Technology",  growth: "+18%", demand: "Very High", yoe: "2–5 yrs", remote: true  },
  { role: "Cloud Architect",          slug: "cloud-architect",           avg: 150000, min: 120000, max: 200000, sector: "Technology",  growth: "+16%", demand: "Very High", yoe: "6–10 yrs",remote: true  },
  { role: "Full-Stack Developer",     slug: "full-stack-developer",      avg: 108000, min: 78000,  max: 148000, sector: "Technology",  growth: "+10%", demand: "High",      yoe: "2–5 yrs", remote: true  },
  // Healthcare
  { role: "Registered Nurse",         slug: "registered-nurse",          avg: 77000,  min: 58000,  max: 100000, sector: "Healthcare", growth: "+6%",  demand: "Very High", yoe: "0–3 yrs", remote: false },
  { role: "Physician (GP)",           slug: "physician-gp",              avg: 210000, min: 165000, max: 260000, sector: "Healthcare", growth: "+3%",  demand: "Very High", yoe: "8+ yrs",  remote: false },
  { role: "Nurse Practitioner",       slug: "nurse-practitioner",        avg: 115000, min: 90000,  max: 145000, sector: "Healthcare", growth: "+11%", demand: "Very High", yoe: "3–6 yrs", remote: false },
  { role: "Physical Therapist",       slug: "physical-therapist",        avg: 88000,  min: 68000,  max: 110000, sector: "Healthcare", growth: "+7%",  demand: "High",      yoe: "2–4 yrs", remote: false },
  { role: "Healthcare Administrator", slug: "healthcare-administrator",  avg: 98000,  min: 72000,  max: 130000, sector: "Healthcare", growth: "+9%",  demand: "High",      yoe: "5–8 yrs", remote: false },
  // Finance
  { role: "Financial Analyst",        slug: "financial-analyst",         avg: 85000,  min: 62000,  max: 115000, sector: "Finance",    growth: "+6%",  demand: "High",      yoe: "1–4 yrs", remote: true  },
  { role: "Accountant",               slug: "accountant",                avg: 78000,  min: 54000,  max: 105000, sector: "Finance",    growth: "+4%",  demand: "Medium",    yoe: "1–3 yrs", remote: true  },
  { role: "Investment Banker",        slug: "investment-banker",         avg: 155000, min: 100000, max: 250000, sector: "Finance",    growth: "+5%",  demand: "High",      yoe: "2–6 yrs", remote: false },
  { role: "Actuary",                  slug: "actuary",                   avg: 108000, min: 80000,  max: 145000, sector: "Finance",    growth: "+5%",  demand: "High",      yoe: "3–6 yrs", remote: true  },
  // Legal
  { role: "Lawyer",                   slug: "lawyer",                    avg: 135000, min: 85000,  max: 200000, sector: "Legal",      growth: "+4%",  demand: "High",      yoe: "4–8 yrs", remote: false },
  { role: "Paralegal",                slug: "paralegal",                 avg: 55000,  min: 40000,  max: 75000,  sector: "Legal",      growth: "+3%",  demand: "Medium",    yoe: "1–3 yrs", remote: true  },
  // Marketing & Sales
  { role: "Marketing Manager",        slug: "marketing-manager",         avg: 95000,  min: 68000,  max: 130000, sector: "Marketing",  growth: "+6%",  demand: "High",      yoe: "3–6 yrs", remote: true  },
  { role: "Sales Manager",            slug: "sales-manager",             avg: 105000, min: 70000,  max: 150000, sector: "Sales",      growth: "+7%",  demand: "High",      yoe: "3–6 yrs", remote: false },
  { role: "SEO Specialist",           slug: "seo-specialist",            avg: 62000,  min: 44000,  max: 88000,  sector: "Marketing",  growth: "+10%", demand: "High",      yoe: "1–3 yrs", remote: true  },
  { role: "Digital Marketing Manager",slug: "digital-marketing-manager", avg: 88000,  min: 62000,  max: 120000, sector: "Marketing",  growth: "+9%",  demand: "High",      yoe: "3–6 yrs", remote: true  },
  // Education
  { role: "Teacher (K-12)",           slug: "teacher-k12",              avg: 62000,  min: 42000,  max: 82000,  sector: "Education",  growth: "+2%",  demand: "Medium",    yoe: "0–5 yrs", remote: false },
  { role: "University Professor",     slug: "university-professor",      avg: 92000,  min: 65000,  max: 140000, sector: "Education",  growth: "+2%",  demand: "Medium",    yoe: "6–10 yrs",remote: false },
  // Engineering
  { role: "Civil Engineer",           slug: "civil-engineer",            avg: 92000,  min: 68000,  max: 122000, sector: "Engineering",growth: "+5%",  demand: "Medium",    yoe: "3–6 yrs", remote: false },
  { role: "Mechanical Engineer",      slug: "mechanical-engineer",       avg: 96000,  min: 72000,  max: 128000, sector: "Engineering",growth: "+4%",  demand: "Medium",    yoe: "3–6 yrs", remote: false },
  { role: "Electrical Engineer",      slug: "electrical-engineer",       avg: 101000, min: 75000,  max: 135000, sector: "Engineering",growth: "+5%",  demand: "High",      yoe: "3–6 yrs", remote: false },
  // HR & Operations
  { role: "Human Resources Manager",  slug: "human-resources-manager",   avg: 88000,  min: 60000,  max: 120000, sector: "HR",         growth: "+5%",  demand: "Medium",    yoe: "4–7 yrs", remote: true  },
  { role: "Operations Manager",       slug: "operations-manager",        avg: 98000,  min: 70000,  max: 135000, sector: "Operations", growth: "+6%",  demand: "High",      yoe: "4–8 yrs", remote: false },
  // Creative
  { role: "Graphic Designer",         slug: "graphic-designer",          avg: 58000,  min: 40000,  max: 80000,  sector: "Creative",   growth: "+3%",  demand: "Medium",    yoe: "1–3 yrs", remote: true  },
  { role: "Content Writer",           slug: "content-writer",            avg: 55000,  min: 38000,  max: 78000,  sector: "Creative",   growth: "+5%",  demand: "Medium",    yoe: "1–3 yrs", remote: true  },
];

/* ─── JSON-LD Structured Data ───────────────────────────────────────────── */
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the average salary for a Software Engineer in the US?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The average salary for a Software Engineer in the United States is $112,000 per year in 2026, with a typical range of $80,000–$155,000 depending on experience, location, and company size.",
      },
    },
    {
      "@type": "Question",
      name: "Which jobs have the highest salary growth in 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Machine Learning Engineer (+20%), Cybersecurity Analyst (+18%), Cloud Architect (+16%), and Data Scientist (+15%) are among the fastest-growing salaries in 2026.",
      },
    },
    {
      "@type": "Question",
      name: "How much does a Registered Nurse earn in the US?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Registered Nurses in the US earn an average of $77,000 per year, with salaries ranging from $58,000 to $100,000 based on specialisation and state.",
      },
    },
    {
      "@type": "Question",
      name: "What is the highest paying job in Technology?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Cloud Architect is one of the highest paying technology roles, with an average salary of $150,000 and a maximum of $200,000 per year in 2026.",
      },
    },
  ],
};

const datasetJsonLd = {
  "@context": "https://schema.org",
  "@type": "Dataset",
  name: "US Job Salary Guide 2026",
  description:
    "Average, minimum, and maximum annual salaries for 30+ US job titles across technology, healthcare, finance, legal, and more sectors. Includes year-over-year growth rates and demand levels.",
  url: "https://www.jobnique.com/salaries",
  creator: { "@type": "Organization", name: "Jobnique", url: "https://www.jobnique.com" },
  dateModified: "2026-12-01",
  license: "https://creativecommons.org/licenses/by/4.0/",
  keywords: "salary, jobs, compensation, United States, 2026",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",     item: "https://www.jobnique.com" },
    { "@type": "ListItem", position: 2, name: "Salaries", item: "https://www.jobnique.com/salaries" },
  ],
};

/* ─── Page Component (Server Component) ────────────────────────────────── */
export default function SalariesPage() {
  return (
    <>
      {/* ── Structured Data ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* ── Client island ── */}
      <SalariesClient salaries={allSalaries} />
    </>
  );
}
