#!/usr/bin/env python3
"""Save id-asc products from an Apify get-dataset-items dump. Requires orderby=id in URL."""
from __future__ import annotations
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "data" / "import" / "raw"

def save(dump_path: Path, expected_page: int | None = None) -> Path:
    text = dump_path.read_text()
    text = re.sub(r"</?cursor_untrusted_data[^>]*>", "", text)
    decoder = json.JSONDecoder()
    data = None
    for i, ch in enumerate(text):
        if ch in "{[":
            try:
                data, _ = decoder.raw_decode(text, i)
                break
            except Exception:
                continue
    if data is None:
        raise SystemExit(f"parse failed: {dump_path}")
    items = data if isinstance(data, list) else data.get("items") or [data]
    item = items[0]
    url = item.get("url") or ""
    if "orderby=id" not in url:
        raise SystemExit(f"refuse non-id orderby URL: {url}")
    m = re.search(r"[?&]page=(\d+)", url)
    page = int(m.group(1)) if m else expected_page
    if page is None:
        raise SystemExit("no page")
    if expected_page is not None and page != expected_page:
        raise SystemExit(f"page mismatch {page} != {expected_page}")
    raw = item.get("raw")
    if isinstance(raw, str):
        products = json.loads(raw)
    elif isinstance(raw, list):
        products = raw
    else:
        raise SystemExit("no raw products")
    if not isinstance(products, list) or not products:
        raise SystemExit("empty products")
    ids = [p["id"] for p in products]
    if any(ids[i] > ids[i + 1] for i in range(len(ids) - 1)):
        raise SystemExit(f"not ascending ids: {ids[0]}..{ids[-1]}")
    out = OUT_DIR / f"page-id-asc-{page}.json"
    out.write_text(json.dumps(products))
    print(f"Wrote {len(products)} -> {out} ({ids[0]}-{ids[-1]})")
    return out

if __name__ == "__main__":
    save(Path(sys.argv[1]), int(sys.argv[2]) if len(sys.argv) > 2 else None)
