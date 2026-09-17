#!/usr/bin/env python3
"""Extract product JSON array from Apify web-fetch MCP/dataset dump files."""
import json, re, sys
from pathlib import Path

def extract(path: Path):
    text = path.read_text()
    text = re.sub(r"</?cursor_untrusted_data_1337[^>]*>", "", text)
    decoder = json.JSONDecoder()
    start = text.find("{")
    if start < 0:
        raise ValueError("no json")
    data, _ = decoder.raw_decode(text, start)
    items = data.get("items") or []
    if not items:
        # maybe direct dataset item
        if "markdown" in data:
            items = [data]
        else:
            raise ValueError("no items")
    md = items[0].get("markdown") or ""
    m = re.search(r"```\n?(\[.*\])\n?```", md, re.S)
    raw = m.group(1) if m else md.strip("` \n")
    products = json.loads(raw)
    if not isinstance(products, list):
        raise ValueError("not a list")
    return products

def main():
    if len(sys.argv) < 3:
        print("Usage: save_apify_markdown_products.py <dump.txt> <out.json>")
        sys.exit(1)
    products = extract(Path(sys.argv[1]))
    out = Path(sys.argv[2])
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(products))
    print(f"Wrote {len(products)} products -> {out}")

if __name__ == "__main__":
    main()
