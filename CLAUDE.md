# ConferenceTracker

Scrapes 31 AI-in-libraries conference websites monthly for 2026/2027 dates. Outputs compact `raw-data.json`. Claude reads it, analyzes, and builds `index.html`. Vercel serves it.

## Workflow
1. GitHub Action runs (1st of month or manual) → scrapes → commits `raw-data.json`
2. Tell Claude: "analyze and build" → reads `raw-data.json`, writes `index.html`
3. `git push` → Vercel auto-deploys → live at https://conference-tracker-seven.vercel.app

## Files
- `scrape.js` — fetches 14 sites, extracts 2026 dates, filters noise, saves `raw-data.json`
- `raw-data.json` — compact scraped data (~1.5KB): real dates only, 120-char snippets, noise pre-filtered
- `index.html` — Claude-built output, human-reviewed, pushed manually. Academic bulletin aesthetic: Playfair Display + Crimson Pro + IBM Plex Mono, parchment palette, Roman numeral sections, sharp left-border cards.
- `.github/workflows/monthly.yml` — scrapes on the 1st of each month + workflow_dispatch

## Run locally
```bash
node scrape.js       # → raw-data.json
# then tell Claude to analyze and build index.html
git add index.html && git push
```

## Sites tracked (31)
### AI in Libraries — Direct Fit
1. GAIL Schedule (SHSU)
2. ai4Libraries
3. Library 2.0 Perspectives on AI
4. Library 2.0 AI Leadership
5. Library 2.0 Conferences
6. SAIL — Libraries and AI
7. Fantastic Futures 2026
8. AI & Academic Libraries (Eventbrite)

### Major Library Conferences
9. ACRL 2027 CFP
10. ALA Annual 2026 ACRL Programs
11. Internet Librarian Speakers
12. Internet Librarian Connect 2026
13. Iowa Library Association
14. Missouri Library Association
15. DLF Forum 2026
16. ALIA National 2026

### Broader Library & Higher Ed
17. ASIS&T Annual Meeting 2026
18. ISS-SLC 2026
19. EDUCAUSE Annual Conference
20. League for Innovation
21. LOEX Annual Conference
22. ER&L Fest 2027
23. Computers in Libraries
24. Charleston Conference CFP
25. CARL 2026 Schedule
26. Brick & Click Libraries

### Online / Webinar Venues
27. Library Journal AI Conference
28. Magna AI in Education
29. IU Indianapolis — Academic Libs
30. Amigos: AI-Enhanced Library
31. Lehigh AI Summit

## Scraper design
- Native `fetch`, no npm dependencies, Node 18+
- Noise filter drops LibGuide "Last Updated", post dates, article dates before saving
- JSON uses short keys (n/u/d/s) and single-line format to minimize Claude read tokens
- Empty sites stored as flat name list, not full objects

## Design system (index.html)
- Fonts: Playfair Display (headings/conf names), Crimson Pro (body), IBM Plex Mono (dates/labels)
- Palette: parchment `#F3EDE1` bg, navy `#1B2A4A`, gold `#9A6E1A`, crimson `#7C1A28`, amber `#8E4B15`
- Cards: sharp left accent border (4px, color-coded by urgency), no border-radius
- Sections: Roman numerals (I–IV) in italic gold
- Urgency: crimson border = ≤14 days, amber = ≤30 days, navy = future, dashed = noise/filtered
- Header: ornamental ✦ rule, kicker line, `◆` bottom divider, boxed meta cells
- Animation: staggered `riseIn` fadeUp per card

## Token optimization
raw-data.json is kept minimal so Claude's analysis pass is cheap:
- Short keys: `n` (name), `u` (url), `d` (date), `s` (snippet), `at` (date scraped)
- Snippets capped at 120 chars
- Noise pre-filtered in scraper (not passed to Claude)
- No-data sites as flat array of names only
