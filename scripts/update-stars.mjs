// Updates every repo listed in index.html: star count, last update, age and website.
// Runs daily from .github/workflows/update-stars.yml. No AI involved, so no tokens are spent.
import { readFileSync, writeFileSync } from "node:fs";

const FILE = new URL("../index.html", import.meta.url);
const token = process.env.GITHUB_TOKEN;
const headers = { "Accept": "application/vnd.github+json", "User-Agent": "claude-ai-repos-star-updater" };
if (token) headers.Authorization = `Bearer ${token}`;

const fmt = n => n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k stars` : `${n} stars`;

let html = readFileSync(FILE, "utf8");

// Each entry looks like: { name: "...", url: "https://github.com/owner/repo", ... tag: "12.3k stars" }
const entry = /url: "https:\/\/github\.com\/([^"\/]+\/[^"\/]+)"([\s\S]*?)tag: "([^"]*)"/g;
const found = [...html.matchAll(entry)];
console.log(`Found ${found.length} repos`);

const stars = new Map();
const meta = {};
for (const m of found) {
  const path = m[1];
  if (stars.has(path)) continue;
  try {
    const res = await fetch(`https://api.github.com/repos/${path}`, { headers });
    if (!res.ok) { console.warn(`skip ${path}: HTTP ${res.status}`); continue; }
    const d = await res.json();
    stars.set(path, d.stargazers_count);
    const homepage = (d.homepage || "").trim();
    meta[path.toLowerCase()] = {
      u: d.pushed_at || "",
      c: d.created_at || "",
      ...(homepage && /^https?:\/\//i.test(homepage) && !/github\.com\//i.test(homepage) ? { h: homepage } : {}),
      ...(d.archived ? { a: 1 } : {}),
    };
  } catch (err) {
    console.warn(`skip ${path}: ${err.message}`);
  }
}

let changed = 0;
html = html.replace(entry, (all, path, middle, oldTag) => {
  if (!stars.has(path)) return all;
  const newTag = fmt(stars.get(path));
  if (newTag !== oldTag) changed++;
  return `url: "https://github.com/${path}"${middle}tag: "${newTag}"`;
});

// Keep earlier details for repos that failed this time
const old = (html.match(/^const META = (\{.*\});$/m) || [])[1];
let merged = meta;
try { merged = { ...JSON.parse(old || "{}"), ...meta }; } catch (e) {}
html = html.replace(/^const META = \{.*\};$/m, () => `const META = ${JSON.stringify(merged)};`);

const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kuala_Lumpur" });
html = html.replace(/<span id="starsDate">[^<]*<\/span>/, `<span id="starsDate">${today}</span>`);

writeFileSync(FILE, html);
console.log(`Updated ${changed} star counts, details for ${Object.keys(meta).length}/${found.length} repos.`);
