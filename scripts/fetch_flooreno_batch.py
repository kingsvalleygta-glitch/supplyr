#!/usr/bin/env python3
"""Save products from Apify web-fetch dataset items or raw MCP dumps."""
from __future__ import annotations
import json, re, sys
from pathlib import Path

def products_from_markdown(md: str):
    if not md:
        return None
    m = re.search(r"```(?:json)?\n?(\[.*\])\n?```", md, re.S)
    raw = m.group(1) if m else md.strip("` \n")
    # sometimes markdown wraps with leading text
    start = raw.find("[")
    end = raw.rfind("]")
    if start >= 0 and end > start:
        raw = raw[start : end + 1]
    products = json.loads(raw)
    if not isinstance(products, list):
        raise ValueError("not a list")
    return products

def products_from_payload(data):
    # dataset items list
    if isinstance(data, list):
        if data and isinstance(data[0], dict) and any(k in data[0] for k in ("markdown", "text", "raw", "html")):
            item = data[0]
            for key in ("raw", "text", "markdown", "html"):
                if item.get(key):
                    val = item[key]
                    if isinstance(val, (bytes, bytearray)):
                        val = val.decode("utf-8", "replace")
                    if key == "raw" and isinstance(val, str) and val.lstrip().startswith("["):
                        return json.loads(val)
                    try:
                        return products_from_markdown(val if isinstance(val, str) else json.dumps(val))
                    except Exception:
                        continue
            raise ValueError("no usable content in dataset item")
        if data and isinstance(data[0], dict) and "id" in data[0] and "name" in data[0]:
            return data
        raise ValueError("unknown list shape")
    if isinstance(data, dict):
        if "items" in data:
            return products_from_payload(data["items"])
        for key in ("raw", "text", "markdown"):
            if data.get(key):
                return products_from_payload([{key: data[key]}])
        if "products" in data:
            return data["products"]
    raise ValueError("unsupported payload")

def main():
    if len(sys.argv) < 3:
        print("Usage: fetch_flooreno_batch.py <input.json|txt> <out.json>")
        sys.exit(1)
    inp = Path(sys.argv[1])
    out = Path(sys.argv[2])
    text = inp.read_text()
    text = re.sub(r"</?cursor_untrusted_data[^>]*>", "", text)
    # try json first
    decoder = json.JSONDecoder()
    products = None
    for i, ch in enumerate(text):
        if ch in "{[":
            try:
                data, _ = decoder.raw_decode(text, i)
                products = products_from_payload(data)
                break
            except Exception:
                continue
    if products is None:
        raise SystemExit(f"Failed to parse products from {inp}")
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(products))
    print(f"Wrote {len(products)} products -> {out}")

if __name__ == "__main__":
    main()
