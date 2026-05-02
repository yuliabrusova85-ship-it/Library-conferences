# ConferenceTracker

Scrapes 31 AI-in-libraries conference websites monthly for 2026/2027 dates. Outputs compact `raw-data.json`. Claude reads it, analyzes, and builds `index.html`. Vercel serves it.

- **Live:** https://conference.brusovcoach.org
- **Vercel project:** conference-tracker-seven.vercel.app (custom domain above)
- **GitHub:** https://github.com/vladimirbrusov83-hub/ConferenceTracker
- **Built for:** Yulia Brusova — talk "Just Vibe With It: Vibe Coding as a Research Acceleration Tool for Academic Libraries" (Brick & Click 2026)

## Workflow
1. GitHub Action runs (1st of month or manual) → scrapes → commits `raw-data.json`
2. Tell Claude: "analyze and build" → reads `raw-data.json`, writes `index.html`
3. `git push` → Vercel auto-deploys → live at https://conference.brusovcoach.org

## Files
- `scrape.js` — fetches 31 sites, extracts 2026/2027 dates, filters noise, saves `raw-data.json`
- `raw-data.json` — compact scraped data: real dates only, 120-char snippets, noise pre-filtered. Key `at` stores full datetime (e.g. `2026-05-01 20:46 UTC`)
- `index.html` — Claude-built output, human-reviewed, pushed manually. See Design system below.
- `.github/workflows/monthly.yml` — scrapes on the 1st of each month + workflow_dispatch

## Run locally
```bash
node scrape.js          # → raw-data.json (Node 18+, no npm install needed)
# then tell Claude: "analyze and build index.html"
git add index.html raw-data.json && git push
```

## Sites tracked (31)

### Section 01 — AI in Libraries: Direct Fit
1. GAIL Schedule (SHSU) — https://shsulibraryguides.org/genailibraries/schedule
2. ai4Libraries — https://www.ai4libraries.org/
3. Library 2.0 Perspectives on AI — https://www.library20.com/miniconferences/perspectives-on-ai
4. Library 2.0 AI Leadership — https://www.library20.com/ai-leadership-2026
5. Library 2.0 Conferences — https://www.library20.com/page/conferences
6. SAIL — Libraries and AI — https://cdlc.org/libraries-and-ai/SAIL
7. Fantastic Futures 2026 — https://ai4lam.org/fantastic-futures/fantastic-futures-2026-trust-in-the-loop/
8. AI & Academic Libraries — https://www.eventbrite.com/e/ai-and-academic-libraries-an-online-conference-tickets-1123272140209

### Section 02 — Major Library Conferences
9. ACRL 2027 CFP — https://acrl.ala.org/acrlinsider/acrl-2027-call-for-proposals/
10. ALA Annual 2026 ACRL Programs — https://acrl.ala.org/acrlinsider/call-for-acrl-education-program-proposals-for-2026-ala-annual-conference/
11. Internet Librarian Speakers — https://speakers.infotoday.com/il-speakers/
12. Internet Librarian Connect 2026 — https://internet-librarian.infotoday.com/2026
13. Iowa Library Association — https://www.iowalibraryassociation.org/
14. Missouri Library Association — https://www.molib.org/Annual-Conference-2026
15. DLF Forum 2026 — https://www.diglib.org/dlf-events/
16. ALIA National 2026 — https://alianational.alia.org.au/program/

### Section 03 — Broader Library & Higher Ed
17. ASIS&T Annual Meeting 2026 — https://www.asist.org/am26/
18. ISS-SLC 2026 — https://sla.org/
19. EDUCAUSE Annual Conference — https://events.educause.edu/annual-conference
20. League for Innovation — https://www.league.org/inn2026
21. LOEX Annual Conference — https://loexconference.org/
22. ER&L Fest 2027 — https://electroniclibrarian.org/conference-info/
23. Computers in Libraries — https://computersinlibraries.infotoday.com/
24. Charleston Conference CFP — https://www.charleston-hub.com/the-charleston-conference/call-for-papers/
25. CARL 2026 Schedule — https://carl-acrl.wildapricot.org/carl-2026-schedule
26. Brick & Click Libraries — https://www.nwmissouri.edu/library/brickandclick/index.htm

### Section 04 — Online & Webinar Venues
27. Library Journal AI Conference — https://course.libraryjournal.com/products/ai-and-academic-libraries-conference
28. Magna AI in Education — https://www.magnapubs.com/ai-in-education-conference/call-for-proposals/
29. IU Indianapolis — Academic Libs — https://blogs.iu.edu/dlis/2026/01/28/sustaining-the-future-of-academic-libraries-an-online-conference/
30. Amigos: AI-Enhanced Library — https://www.amigos.org/services/online-conference/practical-paths-to-the-ai-enhanced-library
31. Lehigh AI Summit — https://lts.lehigh.edu/news/how-lehigh-putting-ai-work-insights-2nd-annual-ai-summit

## Scraper design
- Native `fetch`, no npm dependencies, Node 18+
- Extracts 2026 and 2027 dates (updated from 2026-only)
- Noise filter drops LibGuide "Last Updated", post dates, article dates before saving
- Timestamp in `raw-data.json` includes time: `YYYY-MM-DD HH:MM UTC`
- Empty sites stored as flat name list, not full objects

## Design system (index.html)
- **Fonts:** Playfair Display (headings, conf names), Source Serif 4 (body), JetBrains Mono (labels, dates, badges)
- **Palette:** paper `#FAFBFD` bg, navy `#1A2340`, amber `#D4882A`, green `#2D7A5F`, crimson `#8B2E2E`, gray `#8A9BB5`
- **Header:** dark navy with amber accent, radial gradient, horizontal rule texture
- **Filter bar:** sticky, dark navy, filters: All | Open CFP | Watch for Next | Regional | Has Live Dates
- **Cards:** rounded (10px), grid layout, 4px colored left border by status, hover lift
- **Status colors:** green = Open CFP, crimson = deadline this week, amber = Watch for Next, gray = CFP Passed
- **Live date pills:** `◉ date` navy pill on cards where scraper found a real date
- **Sections:** Roman-numeral eyebrow labels (Section 01–04) with Playfair Display headings
- **Stats bar:** counts for deadline this week / open CFPs / live dates scraped / total venues

## Token optimization
`raw-data.json` is kept minimal so Claude's analysis pass is cheap:
- Short keys: `n` (name), `u` (url), `d` (date), `s` (snippet), `at` (datetime scraped)
- Snippets capped at 120 chars
- Noise pre-filtered in scraper (not passed to Claude)
- No-data sites as flat array of names only
