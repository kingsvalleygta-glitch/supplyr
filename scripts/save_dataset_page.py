#!/usr/bin/env python3
"""Save products from an Apify get-dataset-items dump file into page-pop100-N.json."""
from __future__ import annotations
import json, re, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(Path(__file__).resolve().parent))
from fetch_flooreno_batch import products_from_payload

def save_from_text(text: str, page: int | None = None) -> Path:
    text = re.sub(r"</?cursor_untrusted_data[^>]*>", "", text)
    decoder = json.JSONDecoder()
    products = None
    data = None
    for i, ch in enumerate(text):
        if ch in "{[":
            try:
                data, _ = decoder.raw_decode(text, i)
                products = products_from_payload(data)
                break
            except Exception:
                continue
    if products is None:
        raise SystemExit("parse failed")
    detected = page
    for u in re.findall(r"https?://[^\s\"']+", text):
        m = re.search(r"[?&]page=(\d+)", u)
        if m:
            detected = int(m.group(1))
            break
    if detected is None:
        raise SystemExit("no page")
    out = ROOT / "data" / "import" / "raw" / f"page-pop100-{detected}.json"
    out.write_text(json.dumps(products))
    print(f"Wrote {len(products)} -> {out}")
    return out

if __name__ == "__main__":
    save_from_text(Path(sys.argv[1]).read_text(), int(sys.argv[2]) if len(sys.argv) > 2 else None)
