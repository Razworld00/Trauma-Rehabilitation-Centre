# PhD-Level Codex Prompt (South African Business Website)

Copy and paste this prompt into Codex/Cursor/Claude when you want to regenerate or upgrade this project to a higher production standard.

```text
You are a PhD-level full-stack software architect, senior UI/UX engineer, and South African digital transformation specialist with 18+ years of experience building award-winning, WCAG-AA compliant websites for NPOs, educational institutions, and community-impact organizations.

Build or upgrade a complete production-ready full-stack website for:

TRAUMA AND REHABILITATION CENTRE
NPO Registration: 257-320
Location: Kosmos Street, Parkside, 5201, East London, Eastern Cape, South Africa

PRIMARY REQUIREMENTS
1) Use this tech stack exactly:
   - HTML5
   - Tailwind CSS v4 via CDN
   - Alpine.js v3 for interactivity
   - AOS for scroll animations
   - Font Awesome 6 icons
   - Vanilla JavaScript for logic
   - Node.js backend API for forms and data persistence

2) Respect brand direction:
   - Primary: #003087 (deep navy)
   - Accent: #00A651 (vibrant green)
   - Highlight: #FFCC00 (gold)
   - Professional South African look and feel (not generic)
   - Use the official logo prominently (white dove with olive branch moving toward the lit “April 2024” candle + blue “Health” icon)

3) Content governance:
   - Include the exact Mission, Vision, Values, Goals, Objectives, Services, and course names from the company profile document.
   - Preserve wording fidelity for official institutional statements.
   - Ensure every key sentence from the supplied profile is represented somewhere on the site.

4) Mandatory sections/pages:
   - Home (hero, value proposition, CTA)
   - About (full mission, vision, values, goals, objectives)
   - Services (detailed cards)
   - Courses (7 programs minimum, searchable, expandable curriculum panels)
   - Admissions (validated application form connected to backend)
   - Blog (6 South Africa-relevant article cards)
   - Gallery (12+ responsive images)
   - Contact (map embed + functional enquiry form)
   - Footer (MUST include Ranet Solutions disclaimer standard text)

5) Advanced frontend features:
   - Responsive navigation with animated mobile drawer
   - Smooth in-page section navigation
   - Parallax hero treatment
   - Floating “Enrol Now” CTA
   - Animated stats counters
   - Testimonials carousel
   - Dark mode toggle (optional but recommended)
   - Accessibility-first semantics (ARIA labels, keyboard focus states, alt text)

6) Backend requirements:
   - POST /api/contact
   - POST /api/admissions
   - GET /api/health
   - GET /api/submissions (for admin/testing)
   - Validate user input server-side
   - Persist submissions to local JSON file or lightweight DB
   - Return clear JSON success/error responses

7) Project structure requirements:
   - Standard README.md with setup, run, API docs, and deployment guide
   - MIT LICENSE
   - assets/ folder with subfolders: logos, images, media
   - prompts/ folder containing this reusable prompt
   - .gitignore configured for runtime data and sensitive files

8) Footer compliance (strict):
   Include Ranet Solutions standard disclaimer and business identity language in every generated production variant:
   - “Developed by Ranet Solutions”
   - “All rights reserved”
   - “NPO 257-320”
   - Disclaimer that content is informational and Ranet Solutions is not liable for decisions made from the site.

9) Quality bar:
   - 2026-level visual polish
   - Mobile-first performance and responsiveness
   - Clean, maintainable code
   - Zero placeholder TODO comments in final output
   - No broken links or dead interactions

DELIVERABLE FORMAT
- Provide complete multi-file output with file-by-file code blocks.
- Include final tree structure.
- Include run instructions and deployment commands.
- Include a “Production hardening checklist” section at the end.
```
