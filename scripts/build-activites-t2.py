"""Extract Tome 2 activities from _livre_t2.txt into data/activites-t2-*.json."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
lines = (ROOT / "_livre_t2.txt").read_text(encoding="utf-8").splitlines()

CHAPTERS = [
    {"id": "suites-arith", "from": 148, "to": 778, "title": "Suites arithmétiques"},
    {"id": "suites-geo", "from": 778, "to": 1240, "title": "Suites géométriques"},
    {"id": "fonctions", "from": 1240, "to": 1797, "title": "Généralités sur les fonctions"},
    {"id": "ref", "from": 1797, "to": 2874, "title": "Fonctions de référence"},
    {"id": "trigo", "from": 2874, "to": 4080, "title": "Trigonométrie"},
    {"id": "analytique", "from": 4080, "to": 5220, "title": "Géométrie analytique"},
    {"id": "espace-droites", "from": 5220, "to": 5468, "title": "Droites et plans de l’espace"},
    {"id": "parallelisme", "from": 5468, "to": 6286, "title": "Parallélisme dans l’espace"},
    {"id": "orthogonalite", "from": 6286, "to": 7090, "title": "Orthogonalité dans l’espace"},
    {"id": "stats", "from": 7090, "to": len(lines) + 1, "title": "Statistiques"},
]


def clean(line: str) -> str:
    return re.sub(r"\s+", " ", line.replace("\f", " ")).strip()


def heading_extra(raw: str, slice_lines: list[str], i: int) -> str:
    extra = clean(raw or "")
    if len(extra) < 4 or re.fullmatch(r"[A-Z]", extra):
        extra = ""
    incomplete = re.compile(r"(?:du|un|une|à|de|des|d['’]un|d['’]une|et|–|-)$", re.I)
    if extra and incomplete.search(extra):
        for k in range(1, 3):
            nxt = clean(slice_lines[i + k] if i + k < len(slice_lines) else "")
            if not nxt or nxt[:1].isdigit() or re.search(r"Activit", nxt, re.I) or len(nxt) > 80:
                break
            extra = f"{extra} {nxt}"
            if not incomplete.search(extra):
                break
    return re.sub(r"\s+", " ", extra).strip()


def extract(ch: dict) -> list[dict]:
    sl = lines[ch["from"] - 1 : ch["to"] - 1]
    hits = []
    seen = set()
    for i, line in enumerate(sl):
        m = re.search(r"Activit[eé]\s+(\d+)\s*(.*)$", line, re.I)
        if not m:
            continue
        n = int(m.group(1))
        if n in seen:
            continue
        seen.add(n)
        extra = heading_extra(m.group(2), sl, i)
        title = f"Activité {n} {extra}".strip() if extra else f"Activité {n}"
        hits.append({"n": n, "title": title, "start": i})
    hits.sort(key=lambda h: h["n"])
    out = []
    for idx, h in enumerate(hits):
        end = hits[idx + 1]["start"] if idx + 1 < len(hits) else len(sl)
        body = "\n".join(
            x
            for x in (clean(s) for s in sl[h["start"] : end])
            if x and not re.fullmatch(r"\d{1,3}", x) and not re.match(r"^(Explorer|Assimiler|Synthèse|mil)", x, re.I)
        )
        out.append({"n": h["n"], "title": h["title"], "statement": body})
    return out


def fallback(n: int, title: str) -> dict:
    return {
        "questions": [
            {
                "key": "lu",
                "type": "tf",
                "label": f"L’activité {n} (« {title} ») est bien celle du polycopié, tome 2",
                "answer": "vrai",
            }
        ],
        "steps": [["Manuel", f"Relire l’activité {n} dans le tome 2 et la synthèse du chapitre."]],
    }


def main() -> None:
    index = []
    out_dir = ROOT / "data"
    total = 0
    for ch in CHAPTERS:
        acts = extract(ch)
        items = []
        for a in acts:
            pack = fallback(a["n"], a["title"])
            items.append(
                {
                    "id": f"T2_{ch['id'].replace('-', '_').upper()}_A{a['n']:02d}",
                    "chapter": ch["id"],
                    "tome": 2,
                    "kind": "activity",
                    "activity": a["n"],
                    "solver": "fixed",
                    "title": a["title"],
                    "difficulty": 1 if a["n"] <= 10 else 2 if a["n"] <= 22 else 3,
                    "statement": a["statement"],
                    "variables": [],
                    "questions": pack["questions"],
                    "steps": pack["steps"],
                }
            )
        path = out_dir / f"activites-t2-{ch['id']}.json"
        path.write_text(json.dumps(items, ensure_ascii=False, indent=2), encoding="utf-8")
        index.append({"file": path.name, "chapter": ch["id"], "count": len(items), "titles": [i["title"] for i in items]})
        nums = [a["n"] for a in acts]
        holes = [k for k in range(1, (max(nums) if nums else 0) + 1) if k not in nums]
        print(ch["id"], len(items), "holes", holes)
        total += len(items)
    (out_dir / "activites-t2-index.json").write_text(json.dumps(index, ensure_ascii=False, indent=2), encoding="utf-8")
    print("TOTAL", total)


if __name__ == "__main__":
    main()
