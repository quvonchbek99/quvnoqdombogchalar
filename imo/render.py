"""IMO kunlik post rasmlari (Instagram carousel, 1080x1350).

Ishlatish:  python3 imo/render.py imo/posts/2026-1.json
Natija:     imo/img/2026-1/1.jpg, 2.jpg, ...
JSON:  {"id": "2026-1", "badge": "IMO 2026 · 1-masala", "slides": [
          {"kicker": "MASALA", "title": "...", "body": "<p>HTML</p>"}, ...]}
"""
import json, sys, pathlib
from playwright.sync_api import sync_playwright

CSS = """
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1350px}
body{font-family:'Inter',sans-serif;background:#0f1b2d;color:#eef2f7;
 display:flex;flex-direction:column;padding:72px 80px 56px;position:relative;overflow:hidden}
body:before{content:"";position:absolute;right:-180px;top:-180px;width:520px;height:520px;
 border-radius:50%;background:radial-gradient(circle,#f2b84b33,transparent 70%)}
.top{display:flex;justify-content:space-between;align-items:center;margin-bottom:44px}
.badge{background:#f2b84b;color:#0f1b2d;font-weight:800;font-size:30px;padding:12px 26px;border-radius:40px}
.num{font-size:28px;color:#8fa3bf;font-weight:600}
.kicker{font-size:30px;letter-spacing:6px;color:#f2b84b;font-weight:700;margin-bottom:18px}
h1{font-size:58px;line-height:1.15;font-weight:800;margin-bottom:34px}
.body{font-size:var(--fs,37px);line-height:1.45;color:#dbe3ee;flex:1}
.body p{margin-bottom:22px}.body ul{margin:0 0 22px 34px}.body li{margin-bottom:12px}
.body b{color:#fff}.m{font-family:'DejaVu Serif',serif;font-style:italic;color:#ffd98a;white-space:nowrap}
.box{background:#1a2b44;border-left:8px solid #f2b84b;border-radius:14px;padding:24px 30px;margin:10px 0 24px}
.foot{display:flex;justify-content:space-between;align-items:center;font-size:28px;color:#8fa3bf;
 border-top:2px solid #26395a;padding-top:26px}
.foot b{color:#f2b84b}
"""

def page(post, i, n, s):
    fs = s.get("fs", 37)
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head>
<body><div class="top"><span class="badge">{post['badge']}</span><span class="num">{i}/{n}</span></div>
<div class="kicker">{s.get('kicker','')}</div><h1>{s.get('title','')}</h1>
<div class="body" style="--fs:{fs}px">{s['body']}</div>
<div class="foot"><span><b>@kuvonch_academy</b> · kuvonch.uz</span><span>{'Davomi →' if i < n else 'Saqlab qo’ying 🔖'}</span></div>
</body></html>"""

def main(path):
    post = json.loads(pathlib.Path(path).read_text(encoding="utf-8"))
    out = pathlib.Path(__file__).parent / "img" / post["id"]
    out.mkdir(parents=True, exist_ok=True)
    n = len(post["slides"])
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={"width": 1080, "height": 1350})
        for i, s in enumerate(post["slides"], 1):
            pg.set_content(page(post, i, n, s))
            over = pg.evaluate("document.body.scrollHeight > 1350")
            if over:
                print(f"OGOHLANTIRISH: {i}-slayd sig'madi, 'fs' ni kichraytiring")
            pg.screenshot(path=str(out / f"{i}.jpg"), type="jpeg", quality=90)
        b.close()
    print(out)

if __name__ == "__main__":
    main(sys.argv[1])
