# Trauma & Rehabilitation Centre Website

Production-ready full-stack website for **Trauma & Rehabilitation Centre (NPO 257-320)**, East London, Eastern Cape.

## Overview

This project includes:

- Modern responsive frontend (single-page, multi-section experience)
- Functional backend API for admissions and contact forms
- Local JSON persistence for form submissions
- Accessibility-first structure, smooth interactions, and motion effects
- Standard Ranet Solutions disclaimer footer

## Tech Stack

- HTML5
- Tailwind CSS v4 (CDN)
- Alpine.js v3
- AOS (scroll animations)
- Font Awesome 6
- Vanilla JavaScript
- Node.js HTTP server (no framework dependency)

## Features

- Mobile-first responsive design
- Sticky navbar + animated mobile menu
- Hero section with CTA and parallax effect
- Mission, Vision, Values, Goals, Objectives content blocks
- Services and courses showcase
- Live course search filter
- Expandable course curriculum cards
- Testimonials carousel
- Animated statistics counters
- Admissions form (API connected)
- Contact form (API connected)
- Gallery + Blog sections
- Recent activities section with real TRC clinic and community photos
- Google Maps embed for Parkside location
- Dark mode toggle

## API Endpoints

- `GET /api/health`
- `POST /api/contact`
- `POST /api/admissions`
- `GET /api/submissions?type=contact|admission&limit=50`

## Project Structure

```text
trauma-rehab-centre-site/
├─ assets/
│  ├─ images/                 # Page images (hero, gallery, cards)
│  ├─ logos/                  # Official logo files
│  ├─ media/                  # Video/audio/downloadables
│  └─ README.md               # Asset usage notes
├─ data/
│  ├─ submissions.json        # Runtime submissions (gitignored)
│  └─ submissions.sample.json # Tracked sample data file
├─ prompts/
│  └─ PHD_PROMPT_CODEX.md     # Advanced prompt for future Codex builds
├─ public/
│  ├─ assets/
│  │  └─ images/
│  │     ├─ clinic/           # Real clinic photos
│  │     ├─ activities/       # Donation + member activity photos
│  │     └─ wellness/         # Plants wellness poster
│  └─ index.html              # Frontend
├─ .gitignore
├─ LICENSE
├─ package.json
├─ README.md
└─ server.js                  # Backend API + static server
```

## Local Development

1. Ensure Node.js 18+ is installed.
2. Run:

```bash
cd /home/raz/trauma-rehab-centre-site
npm start
```

3. Open:

```text
http://127.0.0.1:8097
```

## Form Submission Storage

- Submissions are saved to `data/submissions.json`.
- The file is intentionally gitignored to avoid committing private enquiry/application data.
- `data/submissions.sample.json` is provided for repository structure.

## Deployment

### Option A: Node host / VPS

1. Push repository to GitHub.
2. Clone on server.
3. Run `npm start`.
4. Reverse-proxy with Nginx/Caddy if needed.

### Option B: Split static + API

- Frontend (`public/index.html`) can be served on Netlify/Vercel/Cloudflare Pages.
- Backend (`server.js`) can run on Render/Railway/Fly.io/VM.
- Update frontend API base URL if backend is hosted separately.

## Customization Checklist

- Replace placeholder logo URLs with official logo files from `assets/logos/`.
- Add finalized approved logo files into `public/assets` and update navbar/footer logo paths.
- Update blog/gallery content with finalized institution-approved copy.
- Add proper analytics and SEO metadata for production.

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE).

## Credits

- Developed for Trauma & Rehabilitation Centre (NPO 257-320)
- Footer standard and project signature: **Ranet Solutions**
