"""Harvest 2ème Sciences exam PDFs via WordPress media API and extract énoncés."""
from __future__ import annotations

import json
import re
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "scripts" / "_annales_raw"
RAW.mkdir(parents=True, exist_ok=True)
OUT = ROOT / "data" / "annales.json"
UA = "Math2emeTome1-annales/1.0 (educational harvest)"
WP = "http://mathematiques.kooli.me/wp-json/wp/v2/media"

SEARCHES = ["2eme Sciences", "2ème Sciences", "2eme-Sciences", "pilote 2eme", "Sfax 2eme"]


def iri_to_uri(url: str) -> str:
    parts = urllib.parse.urlsplit(url)
    path = urllib.parse.quote(urllib.parse.unquote(parts.path), safe="/%._-")
    query = urllib.parse.quote(urllib.parse.unquote(parts.query), safe="=&%")
    return urllib.parse.urlunsplit((parts.scheme, parts.netloc, path, query, parts.fragment))


def fetch(url: str, timeout: int = 45) -> tuple[bytes | None, dict]:
    req = urllib.request.Request(iri_to_uri(url), headers={"User-Agent": UA, "Accept": "*/*"})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            headers = {k.lower(): v for k, v in resp.headers.items()}
            return resp.read(), headers
    except Exception as exc:  # noqa: BLE001
        print("FAIL", url[:90], type(exc).__name__)
        return None, {}


def is_2eme_sciences(name: str) -> bool:
    low = urllib.parse.unquote(name).lower()
    if not re.search(r"2[\s._-]*[eè]me|2sc|2-sc", low):
        return False
    if re.search(r"3[\s._-]*[eè]me|4[\s._-]*[eè]me|1[eè]re|baccala", low) and not re.search(r"2[\s._-]*[eè]me", low):
        return False
    if re.search(r"corrig|correction|corrige", low):
        return False
    if "technique" in low and "science" not in low:
        return False
    return True


def extract_pdf_text(path: Path) -> str:
    reader = PdfReader(str(path))
    parts = [page.extract_text() or "" for page in reader.pages]
    text = "\n".join(parts).replace("\x00", " ")
    text = re.sub(r"[ \t]+\n", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def classify(text: str, filename: str) -> dict:
    blob = f"{filename}\n{text[:3500]}"
    low = blob.lower()
    region = ""
    if re.search(r"sfax\s*[- ]?\s*2|sakiet|ezzit|ezit", low):
        region = "Sfax 2"
    elif re.search(r"sfax\s*[- ]?\s*1|bir[\s-]?ali|ghraiba|jebniana|mohamed ali", low):
        region = "Sfax 1"
    elif "sfax" in low:
        region = "Sfax"
    lycee = ""
    for pat, label in [
        (r"sakiet", "Lycée Pilote Sakiet Ezzit"),
        (r"pilote\s+monastir", "Lycée Pilote Monastir"),
        (r"pilote\s+ariana", "Lycée Pilote Ariana"),
        (r"pilote\s+nabeul", "Lycée Pilote Nabeul"),
        (r"pilote\s+manouba", "Lycée Pilote Manouba"),
        (r"mohamed ali", "Lycée Mohamed Ali — Sfax"),
        (r"bir[\s-]?ali", "Lycée Bir Ali-2 — Sfax 1"),
        (r"ghraiba", "Lycée Ghraiba — Sfax 1"),
        (r"jebniana", "Lycée 18 Janvier Jebniana"),
        (r"ibn khaldoun", "Lycée Cité Ibn Khaldoun"),
        (r"hbib thamer|habib thamer", "Lycée Habib Thamer — Sfax"),
    ]:
        if re.search(pat, low):
            lycee = label
            break
    kind = "synthese" if re.search(r"synth[eè]se", low) else "controle"
    duration = 7200 if kind == "synthese" else 3600
    year = ""
    ym = re.search(r"(20[12]\d)\s*[/\-]\s*(20[12]\d)", blob) or re.search(r"(20[12]\d)", blob)
    if ym:
        year = re.sub(r"\s+", "", ym.group(0))
    return {
        "region": region,
        "lycee": lycee,
        "kind": kind,
        "duration": duration,
        "year": year,
        "pilote": bool(re.search(r"pilote", low)),
    }


def split_exercises(text: str) -> list[dict]:
    chunks = re.split(r"(?i)(?=\n?\s*exercice(?:\s+n[°o.]?)?\s*\d)", "\n" + text)
    items = []
    for chunk in chunks:
        chunk = chunk.strip()
        if not chunk:
            continue
        m = re.match(r"(?is)exercice(?:\s+n[°o.]?)?\s*(\d+)\s*[:.\-]?\s*(?:\(([^)]+)\))?\s*(.*)", chunk)
        if not m:
            continue
        stmt = m.group(3).strip()
        if len(stmt) < 40:
            continue
        items.append({"n": int(m.group(1)), "points": (m.group(2) or "").strip(), "statement": stmt[:9000]})
    if not items and len(text) > 180:
        items = [{"n": 1, "points": "", "statement": text[:9000]}]
    return items


def build_title(meta: dict, filename: str) -> str:
    kind = "Devoir de synthèse" if meta["kind"] == "synthese" else "Devoir de contrôle"
    bits = [kind]
    if meta.get("lycee"):
        bits.append(meta["lycee"])
    elif meta.get("region"):
        bits.append(meta["region"])
    elif meta.get("pilote"):
        bits.append("Lycée pilote")
    if meta.get("year"):
        bits.append(meta["year"])
    if len(bits) == 1:
        stem = re.sub(r"\s+", " ", Path(filename).stem.replace("_", " "))[:70]
        bits.append(stem)
    return " · ".join(bits)


def wp_media_urls() -> list[str]:
    urls: set[str] = set()
    for q in SEARCHES:
        page = 1
        while page <= 20:
            api = f"{WP}?search={urllib.parse.quote(q)}&per_page=100&page={page}&mime_type=application/pdf"
            raw, headers = fetch(api)
            if not raw:
                break
            try:
                data = json.loads(raw.decode("utf-8"))
            except json.JSONDecodeError:
                break
            if not isinstance(data, list) or not data:
                break
            for item in data:
                src = item.get("source_url") or ""
                if src.lower().endswith(".pdf") and is_2eme_sciences(src):
                    urls.add(src)
            total_pages = int(headers.get("x-wp-totalpages") or "1")
            print("API", q, "page", page, "/", total_pages, "so far", len(urls))
            if page >= total_pages:
                break
            page += 1
            time.sleep(0.1)
    return sorted(urls)


def main() -> None:
    pdfs = wp_media_urls()
    print("PDF keep", len(pdfs))
    papers = []
    seen = set()
    for i, url in enumerate(pdfs, 1):
        name = Path(urllib.parse.unquote(url)).name
        dest = RAW / re.sub(r"[^\w.\-]+", "_", name)[:160]
        if not dest.exists() or dest.stat().st_size < 800:
            data, _ = fetch(url)
            if not data or not data.startswith(b"%PDF"):
                print("NOTPDF", name)
                continue
            dest.write_bytes(data)
            time.sleep(0.05)
        try:
            text = extract_pdf_text(dest)
        except Exception as exc:  # noqa: BLE001
            print("XPDF", name, exc)
            continue
        if len(text) < 180:
            print("SHORT", name, len(text))
            continue
        key = re.sub(r"\s+", " ", text[:350]).lower()
        if key in seen:
            continue
        seen.add(key)
        meta = classify(text, name)
        exercises = split_exercises(text)
        if not exercises:
            continue
        papers.append({
            "id": f"ANN_{len(papers)+1:03d}",
            "source": url,
            "file": name,
            **meta,
            "title": build_title(meta, name),
            "statement": text[:14000],
            "exercises": exercises,
        })
        if i % 20 == 0:
            print("progress", i, "/", len(pdfs), "kept", len(papers))

    payload = {
        "version": 1,
        "note": "Énoncés publics de devoirs 2ème Sciences extraits pour l’application. La source de chaque sujet est indiquée.",
        "count": len(papers),
        "papers": papers,
    }
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print("WROTE", OUT, "papers", len(papers))
    print("sfax", sum(1 for p in papers if "Sfax" in (p["region"] or p["lycee"] or "")))
    print("pilote", sum(1 for p in papers if p["pilote"]))
    print("controle", sum(1 for p in papers if p["kind"] == "controle"))
    print("synthese", sum(1 for p in papers if p["kind"] == "synthese"))


if __name__ == "__main__":
    main()
