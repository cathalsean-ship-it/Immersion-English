#!/usr/bin/env python3
"""Build the Immersion English analytics report (HTML + PDF) from data.json.

Usage: python3 build_report.py data.json out.pdf
data.json shape: see the sample next to this script.
"""
import json, sys, base64, datetime as dt, pathlib, html

GREEN, ORANGE, ORANGE_T, CREAM, INK, MUTED, GRID = "#00682C", "#FF914D", "#B85500", "#FAF8F3", "#1F2A24", "#6B746E", "#E6E2D8"
HERE = pathlib.Path(__file__).resolve().parent
SITE = HERE.parent.parent / "public"


def d(s):
    return dt.date.fromisoformat(s)


def rng(a, b):
    a, b = d(a), d(b)
    return [(a + dt.timedelta(i)).isoformat() for i in range((b - a).days + 1)]


def font_face():
    css = []
    for fam, w, f in [("Montserrat", 600, "montserrat-latin-600-normal"), ("Montserrat", 700, "montserrat-latin-700-normal"),
                      ("Lato", 400, "lato-latin-400-normal"), ("Lato", 700, "lato-latin-700-normal")]:
        p = SITE / "fonts" / f"{f}.woff2"
        if p.exists():
            b = base64.b64encode(p.read_bytes()).decode()
            css.append(f"@font-face{{font-family:'{fam}';font-weight:{w};src:url(data:font/woff2;base64,{b}) format('woff2')}}")
    return "\n".join(css)


def logo():
    p = SITE / "ie-logo-nav.png"
    return f"data:image/png;base64,{base64.b64encode(p.read_bytes()).decode()}" if p.exists() else ""


# ---------- SVG charts ----------
def bar_chart(dates, values, highlight=(), flagged=(), w=680, h=200, label_every=3, color=GREEN):
    pad_l, pad_b, pad_t = 28, 26, 10
    iw, ih = w - pad_l - 6, h - pad_b - pad_t
    mx = max(max(values), 1)
    step = 5 if mx > 12 else (2 if mx > 5 else 1)
    top = ((mx + step - 1) // step) * step
    bw = iw / len(values)
    out = [f'<svg viewBox="0 0 {w} {h}" width="100%" xmlns="http://www.w3.org/2000/svg" font-family="Lato" font-size="10">']
    for t in range(0, top + 1, step):
        y = pad_t + ih - ih * t / top
        out.append(f'<line x1="{pad_l}" x2="{w-6}" y1="{y:.1f}" y2="{y:.1f}" stroke="{GRID}" stroke-width="1"/>')
        out.append(f'<text x="{pad_l-6}" y="{y+3:.1f}" text-anchor="end" fill="{MUTED}">{t}</text>')
    for i, (ds, v) in enumerate(zip(dates, values)):
        x = pad_l + i * bw + bw * 0.15
        bh = ih * v / top
        c = color if ds in highlight else "#B9D4C2"
        if ds in flagged:
            c = ORANGE
        if v:
            out.append(f'<rect x="{x:.1f}" y="{pad_t+ih-bh:.1f}" width="{bw*0.7:.1f}" height="{bh:.1f}" rx="2" fill="{c}"/>')
            if v >= mx * 0.5 or ds in highlight:
                out.append(f'<text x="{x+bw*0.35:.1f}" y="{pad_t+ih-bh-3:.1f}" text-anchor="middle" fill="{INK}" font-weight="700">{int(v)}</text>')
        if i % label_every == 0 or i == len(dates) - 1:
            lab = d(ds).strftime("%-d %b")
            out.append(f'<text x="{x+bw*0.35:.1f}" y="{h-8}" text-anchor="middle" fill="{MUTED}">{lab}</text>')
    out.append("</svg>")
    return "".join(out)


def hbars(rows, w=330, color=GREEN, value_fmt=lambda v: f"{int(v)}"):
    mx = max(v for _, v in rows) or 1
    rh, lab_w = 26, 128
    tail = 70
    h = rh * len(rows) + 4
    out = [f'<svg viewBox="0 0 {w} {h}" width="100%" xmlns="http://www.w3.org/2000/svg" font-family="Lato" font-size="11">']
    for i, (name, v) in enumerate(rows):
        y = i * rh + 4
        bw = (w - lab_w - tail) * v / mx
        out.append(f'<text x="0" y="{y+13}" fill="{INK}">{html.escape(name[:24])}</text>')
        out.append(f'<rect x="{lab_w}" y="{y+2}" width="{max(bw,2):.1f}" height="15" rx="3" fill="{color if i==0 else "#7FB394"}"/>')
        out.append(f'<text x="{lab_w+bw+6:.1f}" y="{y+13}" fill="{INK}" font-weight="700">{value_fmt(v)}</text>')
    out.append("</svg>")
    return "".join(out)


def funnel(steps, w=680):
    mx = steps[0][1] or 1
    h = 46 * len(steps)
    out = [f'<svg viewBox="0 0 {w} {h}" width="100%" xmlns="http://www.w3.org/2000/svg" font-family="Lato" font-size="12">']
    for i, (name, v, note) in enumerate(steps):
        bw = max((w - 270) * v / mx, 4)
        x = (w - 260 - bw) / 2
        y = i * 46
        out.append(f'<rect x="{x:.1f}" y="{y+4}" width="{bw:.1f}" height="34" rx="5" fill="{[GREEN,"#2E8A55","#7FB394",ORANGE][i%4]}"/>')
        out.append(f'<text x="{w-250}" y="{y+19}" fill="{INK}" font-weight="700" font-family="Montserrat" font-size="13">{int(v)} {html.escape(name)}</text>')
        out.append(f'<text x="{w-250}" y="{y+34}" fill="{MUTED}">{html.escape(note)}</text>')
    out.append("</svg>")
    return "".join(out)


def search_card(D):
    sc = D.get("search_console")
    if not sc:
        return ""
    rows = "".join(f"<tr><td>{html.escape(q)}</td><td>{int(c)}</td><td>{int(i)}</td><td>{p:.0f}</td></tr>" for q, c, i, p in sc["queries"][:8])
    note = sc.get("note", "")
    return f"""<div class="card"><h2>Google search – last 30 days</h2>
<div class="sub">Search Console · {int(sc['clicks_30d'])} click{'s' if sc['clicks_30d']!=1 else ''} from {int(sc['impressions_30d'])} appearances in Google results</div>
<table class="tbl"><tr><th>What people searched</th><th>Clicks</th><th>Seen</th><th>Avg. position</th></tr>{rows}</table>
{f'<p class="foot">{note}</p>' if note else ''}</div>"""


def delta(a, b):
    if b == 0:
        return '<span class="flat">new</span>' if a else '<span class="flat">–</span>'
    p = round((a - b) / b * 100)
    cls = "up" if p > 0 else ("down" if p < 0 else "flat")
    sign = "+" if p > 0 else ""
    return f'<span class="{cls}">{sign}{p}% vs last week</span>'


def main(src, out_pdf):
    D = json.loads(pathlib.Path(src).read_text())
    daily = {r[0]: r[1:] for r in D["daily"]}
    leads = D.get("leads_daily", {})
    flagged = set(D.get("anomalies", []))
    tw, pw = rng(*D["this_week"]), rng(*D["prev_week"])

    def s(days, col, skip_flagged=True):
        return sum(daily.get(x, [0, 0, 0, 0])[col] for x in days if not (skip_flagged and x in flagged))

    def L(days, skip_flagged=True):
        return sum(leads.get(x, 0) for x in days if not (skip_flagged and x in flagged))

    all_days = rng(D["daily"][0][0], D["daily"][-1][0])
    sess_tw, sess_pw = s(tw, 0), s(pw, 0)
    eng_tw = s(tw, 3)
    lead_tw, lead_pw = L(tw), L(pw)
    eng_rate = round(eng_tw / sess_tw * 100) if sess_tw else 0
    sess30 = s(all_days, 0)
    leads30 = L(all_days)
    cv30 = sum(v for k, v in D.get("contact_views_daily", {}).items() if k not in flagged)
    det_views = next((p[2] for p in D["pages_30d"] if p[1] == "/duolingo-english-test"), 0)
    dub_views = next((p[2] for p in D["pages_30d"] if p[1] == "/dublin-summer-2027"), 0)

    kpis = [
        ("Website visits", sess_tw, delta(sess_tw, sess_pw), "sessions this week"),
        ("Engaged visits", f"{eng_rate}%", "", "stayed 10s+, viewed 2+ pages or acted"),
        ("Enquiry signals", lead_tw, delta(lead_tw, lead_pw), "contact form / lead events"),
        ("Instagram followers", D["instagram"]["followers"], "", f'{D["instagram"]["posts"]} post so far'),
    ]
    kpi_html = "".join(f'<div class="kpi"><div class="kl">{k}</div><div class="kv">{v}</div><div class="kd">{dl}</div><div class="kn">{n}</div></div>' for k, v, dl, n in kpis)

    sess_chart = bar_chart(all_days, [daily.get(x, [0]*4)[0] for x in all_days], highlight=set(tw), flagged=flagged)
    lead_chart = bar_chart(all_days, [leads.get(x, 0) for x in all_days], highlight=set(tw), flagged=flagged, h=150, color=ORANGE_T)
    src_week = hbars(D["sources_week"])
    src_30 = hbars(D["sources_30d"])
    pages = hbars([(n, v) for n, _, v in D["pages_30d"][:8]], w=680, value_fmt=lambda v: f"{int(v)} views")
    fun = funnel([
        ("website visits", sess30, "last 30 days, excluding the 2 Nov spike"),
        ("contact page views", cv30, "people who opened the contact page"),
        ("enquiry signals", leads30, "form sent / lead event fired"),
    ])

    wins, watch, todo = D.get("wins"), D.get("watch"), D.get("todo")
    wins = wins or [
        f"Google search is waking up: <b>6 visits this week</b> vs 1 the week before – the blog and DET page are starting to be found.",
        "Facebook is the strongest social source over 30 days (28 visits) and those visitors engage well (24 of 28 engaged).",
        "The private schools fair flyer QR brought <b>13 visits</b> – print is working for the Dublin programme.",
    ]
    watch = watch or [
        "<b>2 Nov spike (orange bar):</b> 21 visits and 20 lead events in one burst with no scrolling or engagement – almost certainly a bot or a test, so it's left out of the comparisons. Check the inbox for that day.",
        "Enquiry numbers are low overall (7 real signals in 30 days) and the cookie banner means GA only counts visitors who accept – the real number is higher. Match against the inbox / lead sheet.",
        "The Duolingo English Test page had only 18 views – expected, since the launch posts go out this week and next.",
        "Instagram is brand new (0 followers, 1 post) and no paid ads have run yet, so there is nothing to compare there yet.",
    ]
    todo = todo or [
        "Finish connecting <b>Google Search Console</b> in Windsor so we can see which Google searches bring people in.",
        "Mark <b>generate_lead</b> as a key event in GA4 so enquiries show up as conversions.",
        "Keep a simple lead sheet (date, name, source, programme) – GA can't see WhatsApp, phone or email enquiries.",
        "Use the <b>immersion-english.com/det</b> short link in every DET post so we can measure that campaign separately.",
    ]
    li = lambda xs: "".join(f"<li>{x}</li>" for x in xs)

    today = dt.date.today().strftime("%-d %B %Y")
    page = f"""<!doctype html><html><head><meta charset="utf-8"><style>
{font_face()}
@page {{ size: A4; margin: 14mm 14mm 14mm 14mm; }}
* {{ box-sizing: border-box; }}
body {{ font-family: Lato, sans-serif; color: {INK}; font-size: 11.5px; line-height: 1.45; margin: 0; }}
h1,h2,h3 {{ font-family: Montserrat, sans-serif; margin: 0; }}
.head {{ display:flex; justify-content:space-between; align-items:center; border-bottom:3px solid {GREEN}; padding-bottom:10px; margin-bottom:14px; }}
.head img {{ height: 34px; }}
.head .t h1 {{ font-size: 20px; color: {GREEN}; }}
.head .t p {{ margin: 2px 0 0; color: {MUTED}; }}
.kpis {{ display:grid; grid-template-columns: repeat(4,1fr); gap:10px; margin-bottom:14px; }}
.kpi {{ background:{CREAM}; border-radius:10px; padding:10px 12px; border-left:4px solid {GREEN}; }}
.kl {{ font-family:Montserrat; font-weight:600; font-size:10.5px; color:{MUTED}; text-transform:uppercase; letter-spacing:.04em; }}
.kv {{ font-family:Montserrat; font-weight:700; font-size:26px; color:{GREEN}; line-height:1.15; }}
.kd {{ font-size:10.5px; min-height:14px; }} .kn {{ font-size:10px; color:{MUTED}; }}
.up {{ color:{GREEN}; font-weight:700; }} .down {{ color:#B3261E; font-weight:700; }} .flat {{ color:{MUTED}; }}
.card {{ border:1px solid {GRID}; border-radius:10px; padding:12px 14px; margin-bottom:12px; break-inside: avoid; }}
.card h2 {{ font-size:13.5px; margin-bottom:2px; }} .card .sub {{ color:{MUTED}; font-size:10.5px; margin-bottom:8px; }}
.two {{ display:grid; grid-template-columns:1fr 1fr; gap:12px; }}
.legend span {{ display:inline-block; width:9px; height:9px; border-radius:2px; margin:0 4px 0 10px; vertical-align:middle; }}
ul {{ margin:4px 0 0; padding-left:18px; }} li {{ margin-bottom:4px; }}
.box-g {{ background:#EAF4EE; border-color:#CFE5D7; }} .box-o {{ background:#FFF3EA; border-color:#FFD9BF; }}
.foot {{ color:{MUTED}; font-size:9.5px; margin-top:6px; }}
.pb {{ break-before: page; }}
.tbl {{ width:100%; border-collapse:collapse; }} .tbl th {{ text-align:left; font-family:Montserrat; font-size:10px; color:{MUTED}; border-bottom:1px solid {GRID}; padding:4px 6px; }}
.tbl td {{ padding:5px 6px; border-bottom:1px solid {GRID}; }} .tbl td:not(:first-child), .tbl th:not(:first-child) {{ text-align:right; }}
</style></head><body>
<div class="head"><div class="t"><h1>{html.escape(D["period_label"])} – marketing report</h1><p>Website, social and ads in one page · prepared {today}</p></div><img src="{logo()}"></div>

<div class="kpis">{kpi_html}</div>

<div class="card box-g"><h2>In one minute</h2><ul>{li(wins[:2] + watch[:1])}</ul></div>

<div class="card"><h2>Website visits per day – last 30 days</h2>
<div class="sub legend"><span style="background:{GREEN}"></span>this week<span style="background:#B9D4C2"></span>earlier<span style="background:{ORANGE}"></span>suspicious spike (excluded from totals)</div>
{sess_chart}</div>

<div class="two">
<div class="card"><h2>Where visitors came from – this week</h2><div class="sub">sessions by source</div>{src_week}</div>
<div class="card"><h2>Where visitors came from – 30 days</h2><div class="sub">sessions by source</div>{src_30}</div>
</div>

<div class="card"><h2>From visit to enquiry – last 30 days</h2><div class="sub">how many people move through each step</div>{fun}</div>

<div class="card"><h2>Enquiry signals per day</h2><div class="sub">GA4 generate_lead events · orange = the 2 Nov burst</div>{lead_chart}</div>

{search_card(D)}

<div class="card"><h2>Most-viewed pages – last 30 days</h2><div class="sub">page views</div>{pages}</div>

<div class="two">
<div class="card"><h2>Worth watching</h2><ul>{li(watch)}</ul></div>
<div class="card box-o"><h2>Suggested next steps</h2><ul>{li(todo)}</ul></div>
</div>

<div class="foot">Sources: Google Analytics 4, Instagram and Meta Ads via Windsor.ai. GA4 only counts visitors who accept analytics cookies, so all website numbers are minimums. "Engaged visit" = GA4's engaged session.</div>
</body></html>"""
    out_html = pathlib.Path(out_pdf).with_suffix(".html")
    out_html.write_text(page)
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path="/usr/bin/google-chrome")
        pg = b.new_page()
        pg.goto(out_html.resolve().as_uri())
        pg.wait_for_timeout(300)
        pg.pdf(path=out_pdf, format="A4", print_background=True, margin={"top": "12mm", "bottom": "12mm", "left": "12mm", "right": "12mm"})
        b.close()
    print("wrote", out_pdf)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
