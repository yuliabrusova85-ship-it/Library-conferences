#!/usr/bin/env node
import { writeFileSync } from 'fs';

const SITES = [
  // AI in Libraries — Direct Fit
  { name: 'GAIL Schedule (SHSU)',              url: 'https://shsulibraryguides.org/genailibraries/schedule' },
  { name: 'ai4Libraries',                      url: 'https://www.ai4libraries.org/' },
  { name: 'Library 2.0 Perspectives on AI',   url: 'https://www.library20.com/miniconferences/perspectives-on-ai' },
  { name: 'Library 2.0 AI Leadership',         url: 'https://www.library20.com/ai-leadership-2026' },
  { name: 'Library 2.0 Conferences',           url: 'https://www.library20.com/page/conferences' },
  { name: 'SAIL — Libraries and AI',           url: 'https://cdlc.org/libraries-and-ai/SAIL' },
  { name: 'Fantastic Futures 2026',            url: 'https://ai4lam.org/fantastic-futures/fantastic-futures-2026-trust-in-the-loop/' },
  { name: 'AI & Academic Libraries',           url: 'https://www.eventbrite.com/e/ai-and-academic-libraries-an-online-conference-tickets-1123272140209' },

  // Major Library Conferences
  { name: 'ACRL 2027 CFP',                    url: 'https://acrl.ala.org/acrlinsider/acrl-2027-call-for-proposals/' },
  { name: 'ALA Annual 2026 ACRL Programs',    url: 'https://acrl.ala.org/acrlinsider/call-for-acrl-education-program-proposals-for-2026-ala-annual-conference/' },
  { name: 'Internet Librarian Speakers',       url: 'https://speakers.infotoday.com/il-speakers/' },
  { name: 'Internet Librarian Connect 2026',  url: 'https://internet-librarian.infotoday.com/2026' },
  { name: 'Iowa Library Association',          url: 'https://www.iowalibraryassociation.org/' },
  { name: 'Missouri Library Association',      url: 'https://www.molib.org/Annual-Conference-2026' },
  { name: 'DLF Forum 2026',                   url: 'https://www.diglib.org/dlf-events/' },
  { name: 'ALIA National 2026',               url: 'https://alianational.alia.org.au/program/' },

  // Broader Library & Higher Ed
  { name: 'ASIS&T Annual Meeting 2026',       url: 'https://www.asist.org/am26/' },
  { name: 'ISS-SLC 2026',                     url: 'https://sla.org/' },
  { name: 'EDUCAUSE Annual Conference',        url: 'https://events.educause.edu/annual-conference' },
  { name: 'League for Innovation',             url: 'https://www.league.org/inn2026' },
  { name: 'LOEX Annual Conference',            url: 'https://loexconference.org/' },
  { name: 'ER&L Fest 2027',                   url: 'https://electroniclibrarian.org/conference-info/' },
  { name: 'Computers in Libraries',            url: 'https://computersinlibraries.infotoday.com/' },
  { name: 'Charleston Conference CFP',         url: 'https://www.charleston-hub.com/the-charleston-conference/call-for-papers/' },
  { name: 'CARL 2026 Schedule',               url: 'https://carl-acrl.wildapricot.org/carl-2026-schedule' },
  { name: 'Brick & Click Libraries',           url: 'https://www.nwmissouri.edu/library/brickandclick/index.htm' },

  // Online / Webinar Venues
  { name: 'Library Journal AI Conference',    url: 'https://course.libraryjournal.com/products/ai-and-academic-libraries-conference' },
  { name: 'Magna AI in Education',            url: 'https://www.magnapubs.com/ai-in-education-conference/call-for-proposals/' },
  { name: 'IU Indianapolis — Academic Libs',  url: 'https://blogs.iu.edu/dlis/2026/01/28/sustaining-the-future-of-academic-libraries-an-online-conference/' },
  { name: 'Amigos: AI-Enhanced Library',      url: 'https://www.amigos.org/services/online-conference/practical-paths-to-the-ai-enhanced-library' },
  { name: 'Lehigh AI Summit',                 url: 'https://lts.lehigh.edu/news/how-lehigh-putting-ai-work-insights-2nd-annual-ai-summit' },
];

const M = 'January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Oct|Nov|Dec';
const ORD = '(?:st|nd|rd|th)?';
const DATE_RES = [
  new RegExp(`\\b((?:${M})\\.?\\s+\\d{1,2}${ORD}(?:\\s*[–\\-]\\s*\\d{1,2}${ORD})?\\s*,?\\s*20\\d{2})\\b`, 'gi'),
  new RegExp(`\\b(\\d{1,2}${ORD}\\s+(?:${M})\\.?\\s*,?\\s*20\\d{2})\\b`, 'gi'),
];

const NOISE_RE = /last updated|posted by|login to|copyright|\(c\)|print page|url:/i;

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#\d+;/g, ' ')
    .replace(/\s{2,}/g, ' ').trim();
}

function bestSnippet(text, matchIndex, matchLen) {
  const start = Math.max(0, matchIndex - 120);
  const end = Math.min(text.length, matchIndex + matchLen + 120);
  const chunk = text.slice(start, end);
  const sentences = chunk.split(/(?<=[.!?])\s+/);
  for (const s of sentences) {
    if (s.match(/20\d{2}/)) return s.trim().slice(0, 120);
  }
  return chunk.trim().slice(0, 120);
}

function extractDates(text) {
  const seen = new Set();
  const results = [];
  for (const re of DATE_RES) {
    let m;
    while ((m = re.exec(text)) !== null) {
      const key = m[1].toLowerCase().replace(/\s+/g, ' ');
      if (seen.has(key)) continue;
      seen.add(key);
      const snippet = bestSnippet(text, m.index, m[1].length);
      if (NOISE_RE.test(snippet)) continue;
      results.push({ d: m[1].trim(), s: snippet });
    }
  }
  return results.filter(r => r.d.includes('2026') || r.d.includes('2027'));
}

async function fetchSite(site) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 15000);
  try {
    const res = await fetch(site.url, {
      signal: ctrl.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ConferenceTracker/1.0)' }
    });
    clearTimeout(t);
    if (!res.ok) return { n: site.name, u: site.url, e: `HTTP ${res.status}` };
    const text = stripHtml(await res.text());
    const dates = extractDates(text);
    if (!dates.length) return { n: site.name, u: site.url };
    return { n: site.name, u: site.url, dates };
  } catch (e) {
    clearTimeout(t);
    return { n: site.name, u: site.url, e: e.name === 'AbortError' ? 'Timeout' : e.message };
  }
}

async function main() {
  console.log(`Scanning ${SITES.length} sites...`);
  const results = await Promise.all(SITES.map(fetchSite));
  const withDates = results.filter(r => r.dates?.length);
  const errors    = results.filter(r => r.e);
  const empty     = results.filter(r => !r.dates?.length && !r.e).map(r => r.n);
  console.log(`Done — ${withDates.length} with dates, ${errors.length} errors`);
  const output = {
    at: new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC',
    dates: withDates,
    errors: errors.map(r => ({ n: r.n, e: r.e })),
    empty
  };
  writeFileSync('raw-data.json', JSON.stringify(output));
  console.log('Saved: raw-data.json');
}

main().catch(console.error);
