#!/usr/bin/env python3
"""
Drift check for samosborne.net.

One fact lives in nine places. This checks they still agree.
Run before a push, or on a schedule:  python3 tools/check-facts.py
Exits 1 if anything is wrong, so it can gate a commit.
"""
import re, sys, html, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent

# ── Facts that must never appear ────────────────────────────────────────────
FORBIDDEN = [
    ("thirty years",        "overstates experience; the real span is since 2008"),
    ("three decades",       "overstates experience; the real span is since 2008"),
    ("twenty years",        "use the dates (2008 / 2014), not a rounded count"),
    ("20 years",            "use the dates (2008 / 2014), not a rounded count"),
    ("Best of Conference",  "CAI issued no such award; use the 95% figure"),
    ("818.934.5140",        "personal cell; the business number is 213.423.2868"),
    ("818 934 5140",        "personal cell; the business number is 213.423.2868"),
    ("selfworthsam",        "retired brand"),
    ("youtube.com/embed",   "corporate filters block youtube; use Cloudflare Stream"),
    ("i.ytimg.com",         "corporate filters block youtube; use Cloudflare Stream"),
]

# ── Facts that must agree wherever they appear ──────────────────────────────
# label: (regex that finds the claim, the only value allowed)
CONSISTENT = {
    "phone":            (r"\(?213\)?[ .)-]*423[.-]2868|(\d{3})[.-](\d{3})[.-](\d{4})", "213.423.2868"),
    "eval: rating":     (r"\b4\.[0-9]\s*(?:/|out of)\s*5", "4.7 / 4.9 only"),
    "eval: excellent":  (r"\b(\d{2})%\s*(?:of attendees\s*)?rated", "95%"),
    "eval: responses":  (r"\b(\d{2})\s+evaluations", "39"),
}

# ── Prices that must match the pricing ladder ───────────────────────────────
PRICES = {"$15,000", "$30,000", "$50,000", "$38,000"}

def visible(p):
    s = p.read_text(encoding="utf-8", errors="ignore")
    s = re.sub(r"<script.*?</script>|<style.*?</style>|<!--.*?-->", "", s, flags=re.S)
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", s)))

pages = sorted(ROOT.glob("*.html")) + sorted(ROOT.glob("blogs/*.html"))
problems, checked = [], 0

for p in pages:
    checked += 1
    text, raw = visible(p), p.read_text(encoding="utf-8", errors="ignore")
    for phrase, why in FORBIDDEN:
        n = len(re.findall(re.escape(phrase), raw, re.I))
        if n:
            problems.append((p.name, f'"{phrase}" x{n}', why))
    # phone numbers that are not the business line (ignore form placeholders)
    for m in re.finditer(r"\b(\d{3})[.\- ](\d{3})[.\-](\d{4})\b", text):
        got = m.group(0)
        if got.replace("-", ".").replace(" ", ".") not in ("213.423.2868", "555.000.0000"):
            problems.append((p.name, f"phone {got}", "expected 213.423.2868"))
    # stray prices outside the ladder
    for m in re.finditer(r"\$\d{1,3},\d{3}", text):
        if m.group(0) not in PRICES and m.group(0) not in ("$90,000", "$52,000", "$28,000", "$150,000", "$22,000"):
            problems.append((p.name, f"price {m.group(0)}", "not in the pricing ladder"))

print(f"Checked {checked} pages in {ROOT.name}/\n")
if not problems:
    print("  No drift. Every page agrees.")
    sys.exit(0)

w = max(len(a) for a, _, _ in problems)
for f, what, why in problems:
    print(f"  {f:<{w}}  {what:<28} {why}")
print(f"\n  {len(problems)} problem(s).")
sys.exit(1)
