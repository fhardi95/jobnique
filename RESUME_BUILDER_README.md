# Resume Builder — Architecture & Roadmap

## Folder Structure

```
app/
├── resume-builder/
│   ├── page.tsx                   ← Landing page (templates + upload flow)
│   ├── ResumeBuilderClient.tsx    ← Hero, gallery, upload zone
│   └── builder/
│       ├── page.tsx               ← Editor page wrapper (Suspense)
│       └── BuilderClient.tsx      ← Full 3-col editor UI + live preview
│
api/
├── resumes/
│   ├── route.ts                   ← GET list / POST create+update
│   └── ai-improve/route.ts        ← AI text improvement endpoint
│
lib/resume/
│   └── templates.ts               ← Template definitions + DEFAULT_RESUME
│
types/
│   └── resume.ts                  ← All TypeScript types + JSON schema
│
supabase/migrations/
│   └── 003_resume_builder.sql     ← DB schema: resumes, resume_versions, templates
```

---

## Step-by-step Integration into Jobnique

### Step 1 — Copy files
```bash
# From this output, copy into your jobnique-main project:
cp -r resume-builder/app/resume-builder   jobnique-main/app/
cp -r resume-builder/app/api/resumes      jobnique-main/app/api/
cp -r resume-builder/lib/resume           jobnique-main/lib/
cp    resume-builder/types/resume.ts      jobnique-main/types/
cp    resume-builder/supabase/migrations/003_resume_builder.sql  jobnique-main/supabase/migrations/
```

### Step 2 — Run migration
```bash
# In Supabase dashboard SQL editor, or via CLI:
supabase db push
# or paste contents of 003_resume_builder.sql into the Supabase SQL editor
```

### Step 3 — Add Navbar link
In `components/Navbar.tsx`, add to `navLinks`:
```ts
{ href: "/resume-builder", label: "Resume Builder" },
```

### Step 4 — Environment variables
```env
# Already in your project:
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

# Add for AI features:
ANTHROPIC_API_KEY=sk-ant-...
```

### Step 5 — Install optional packages (for PDF export)
```bash
npm install @react-pdf/renderer
# or
npm install html2canvas jspdf
```

---

## Architecture decisions

### Template engine
Templates are pure data — `templateId` stored in resume JSON, rendered by
`ResumePreview` which reads `TEMPLATES` array and applies the accent colour.
Switching templates is instant: just update `resume.templateId`, no data loss.

### Resume JSON schema
Single `JSONB` column in Supabase (`resumes.data`). Typed as `ResumeData` in
`types/resume.ts`. Versioning handled by inserting snapshots to `resume_versions`
on every save. Rollback = replace `data` with a previous version row.

### AI integration
`/api/resumes/ai-improve` proxies to Anthropic API server-side so the key is
never exposed. Three modes: `summary`, `bullet`, `rewrite`. Extend by adding
more prompt templates.

### Live preview
`ResumePreview` renders a scaled `210mm × 297mm` white div (A4) with real CSS,
not a canvas. This means PDF export via `html2canvas` or `@react-pdf/renderer`
will be pixel-faithful.

---

## Phase 2 Bonus Features (ready to add)

| Feature | Approach |
|---------|----------|
| ATS Score checker | Parse job description, compare keywords against resume JSON, score 0-100 |
| Job matching | Vector embed resume + job postings in Supabase pgvector |
| One-click tailoring | AI rewrites bullets to match a target JD |
| Cover letter gen | Feed resume JSON + JD into Claude, stream output |
| LinkedIn import | OAuth → LinkedIn API → map fields to ResumeData |
| Public link | Set `is_public=true`, use `public_slug` for `/r/[slug]` route |
| Recruiter share | Generate signed URL with 7-day expiry |
| PDF export | `@react-pdf/renderer` or `html2canvas + jspdf` on `/api/resumes/[id]/pdf` |
