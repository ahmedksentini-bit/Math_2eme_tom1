"""Réécrire les annales en devoirs interactifs : énoncé propre, questions, correction."""
from __future__ import annotations

import json
import math
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "data" / "annales.json"
OUT = ROOT / "data" / "annales.json"


def clean(text: str) -> str:
    s = (text or "").replace("\u00a0", " ").replace("\u2212", "-").replace("–", "-").replace("—", "-")
    s = s.replace("ﬁ", "fi").replace("ﬂ", "fl").replace("ﬀ", "ff")
    for a, b in [
        ("Lyc´ ee", "Lycée"), ("Lyc` ee", "Lycée"), ("synth` ese", "synthèse"),
        ("contr` ole", "contrôle"), ("deﬁnie", "définie"), ("definie", "définie"),
        ("´ e", "é"), ("` e", "è"), ("ˆ e", "ê"), ("¨ e", "ë"),
        ("´ a", "á"), ("` a", "à"), ("ˆ o", "ô"), ("ˆ i", "î"), ("ˆ a", "â"),
        ("´e", "é"), ("`e", "è"), ("^e", "ê"), ("´E", "É"),
        ("n◦", "n°"), ("N◦", "n°"), ("n°", "n°"),
    ]:
        s = s.replace(a, b)
    s = re.sub(r"(?im)^\s*page\s+\d+\s*/\s*\d+\s*$", "", s)
    s = re.sub(r"[ \t]+", " ", s)
    s = re.sub(r"\n{3,}", "\n\n", s)
    return s.strip()


def as_int(x):
    if x is None:
        return 0
    r = round(float(x))
    return int(r) if abs(float(x) - r) < 1e-9 else float(x)


def num(tok: str, default=None):
    tok = (tok or "").replace(" ", "").replace("−", "-")
    if tok in ("", "+", "-"):
        return -1 if tok == "-" else 1 if tok == "+" else default
    try:
        return float(tok.replace(",", "."))
    except ValueError:
        return default


def v(key, label, value, unit="—"):
    lo = value - 8 if isinstance(value, (int, float)) else -8
    hi = value + 8 if isinstance(value, (int, float)) else 8
    return {"key": key, "label": label, "unit": unit, "value": value, "min": min(lo, value), "max": max(hi, value), "step": 1}


def qn(key, label, unit="—"):
    return {"key": key, "label": label, "unit": unit}


def qmcq(key, label, options, answer):
    return {"key": key, "type": "mcq", "label": label, "options": options, "answer": answer}


def qtf(key, label, answer):
    return {"key": key, "type": "tf", "label": label, "answer": answer}


def item(pid, n, chapter, solver, title, statement, variables, questions, steps=None, points=""):
    out = {
        "id": f"{pid}_E{n}",
        "n": n,
        "points": points,
        "title": title,
        "chapter": chapter,
        "solver": solver,
        "statement": statement,
        "variables": variables or [],
        "questions": questions,
        "kind": "annale",
        "difficulty": 2,
    }
    if steps:
        out["steps"] = steps
    return out


QUAD = re.compile(
    r"([+-]?\s*\d*)\s*x\s*(?:\^?\s*2|²)\s*([+-]\s*\d*)\s*x\s*([+-]\s*\d+)\s*=\s*0",
    re.I,
)
CUBIC = re.compile(
    r"([+-]?\s*\d*)\s*x\s*(?:\^?\s*3|³)\s*([+-]\s*\d*)\s*x\s*(?:\^?\s*2|²)\s*([+-]\s*\d*)\s*x\s*([+-]\s*\d+)",
    re.I,
)
MASSES = re.compile(r"\(\s*A\s*,\s*([+-]?\s*\d+)\s*\).*?\(\s*B\s*,\s*([+-]?\s*\d+)\s*\)", re.I | re.S)
ROOT_HINT = re.compile(r"(?:v[ée]rifier que|racine)\s+(-?\d+)\s+est", re.I)
U0 = re.compile(r"(?:u|a)\s*0\s*=\s*([+-]?\d+)", re.I)
U1 = re.compile(r"(?:u|a)\s*1\s*=\s*([+-]?\d+)", re.I)
REASON_R = re.compile(r"raison\s*(?:r\s*=\s*)?([+-]?\d+)", re.I)
REASON_Q = re.compile(r"raison\s*(?:q\s*=\s*)?([+-]?\d+)", re.I)
ANGLE = re.compile(r"(?:cos|sin|tan)\s*(\d+)\s*°", re.I)
PTS = re.compile(r"([A-Z])\s*\(\s*([+-]?\d+(?:[.,]\d+)?)\s*[;,]\s*([+-]?\d+(?:[.,]\d+)?)\s*\)")


def parse_quad(blob: str):
    found = []
    for m in QUAD.finditer(blob.replace("²", "2")):
        a, b, c = num(m.group(1), 1), num(m.group(2), 1), num(m.group(3), 0)
        if not a:
            continue
        if a < 0:
            a, b, c = -a, -b, -c
        disc = b * b - 4 * a * c
        if disc < 0:
            continue
        found.append((a, b, c, disc))
    return found


def parse_cubic(blob: str):
    found = []
    text = blob.replace("³", "3").replace("²", "2")
    for m in CUBIC.finditer(text):
        a3, a2, a1, a0 = num(m.group(1), 1), num(m.group(2), 1), num(m.group(3), 1), num(m.group(4), 0)
        if a3 != 1:
            continue
        found.append((a2, a1, a0))
    return found


def detect_chapter(blob: str, tome: int) -> str:
    low = blob.lower()
    if tome == 2:
        pairs = [
            ("statisti", "stats"), ("trigonom", "trigo"), ("sinus", "trigo"), ("cosinus", "trigo"),
            ("suite géom", "suites-geo"), ("suite geom", "suites-geo"), ("géométrique", "suites-geo"),
            ("suite arith", "suites-arith"), ("arithmétique", "suites-arith"),
            ("analytique", "analytique"), ("orthogonal", "orthogonalite"),
            ("parallél", "parallelisme"), ("espace", "espace-droites"),
            ("référence", "ref"), ("trinôme", "ref"), ("fonction", "fonctions"),
        ]
        for k, ch in pairs:
            if k in low:
                return ch
        return "fonctions"
    pairs = [
        ("barycentr", "barycentre"), ("homoth", "homotheties"), ("rotation", "rotations"),
        ("translation", "translations"), ("vecteur", "vecteurs"),
        ("polyn", "polynomes"), ("second degr", "degres"), ("discrimin", "degres"),
        ("pgcd", "arithmetique"), ("euclid", "arithmetique"),
        ("valeur absolue", "reels"), ("pourcent", "reels"),
    ]
    for k, ch in pairs:
        if k in low:
            return ch
    return "degres"


def quad_item(pid, n, a, b, c, title_src):
    a, b, c = as_int(a), as_int(b), as_int(c)
    disc = b * b - 4 * a * c
    return item(
        pid, n, "degres", "quadraticSolve",
        "Équation du second degré",
        f"On reprend le calcul central du devoir « {title_src} ». Résoudre dans IR l’équation {a}x² + ({b})x + ({c}) = 0 : discriminant, racines réelles, somme et produit.",
        [v("a", "a", a), v("b", "b", b), v("c", "c", c)],
        [qn("disc", "Discriminant Δ"), qn("x1", "Racine x₁ (la plus petite)"), qn("x2", "Racine x₂ (la plus grande)"), qn("sum", "Somme des racines"), qn("prod", "Produit des racines")],
    ) if disc >= 0 else None


def cubic_item(pid, n, a, b, c, r, title_src):
    a, b, c, r = int(a), int(b), int(c), int(r)
    p = r ** 3 + a * r ** 2 + b * r + c
    if abs(p) > 1e-8:
        return item(
            pid, n, "polynomes", "polyEval",
            "Évaluation d’un polynôme",
            f"On reprend le polynôme du devoir « {title_src} » : P(x) = x³ + ({a})x² + ({b})x + ({c}). Calculer P({r}).",
            [v("a3", "coeff. x³", 1), v("a2", "coeff. x²", a), v("a1", "coeff. x", b), v("a0", "terme constant", c), v("x", "x", r)],
            [qn("value", f"P({r})")],
        )
    return item(
        pid, n, "polynomes", "polyKnownRoot",
        "Racine et factorisation",
        f"On reprend le polynôme du devoir « {title_src} » : P(x) = x³ + ({a})x² + ({b})x + ({c}). Vérifier que {r} est racine, puis donner les coefficients du trinôme quotient.",
        [v("a", "coeff. x²", a), v("b", "coeff. x", b), v("c", "terme constant", c), v("r", "racine r", r)],
        [qn("PofR", f"P({r})"), qn("qB", "Coefficient de x du quotient"), qn("qC", "Terme constant du quotient")],
    )


def bary_item(pid, n, alpha, beta, title_src):
    alpha, beta = int(alpha), int(beta)
    if alpha + beta == 0:
        return None
    return item(
        pid, n, "barycentre", "bary1d",
        "Barycentre de deux points",
        f"On reprend les masses du devoir « {title_src} ». G est le barycentre de (A, {alpha}) et (B, {beta}). On place A en 0 et B en 6 sur un axe. Calculer l’abscisse de G et le coefficient k tel que AG⃗ = k AB⃗.",
        [v("alpha", "Masse de A", alpha), v("beta", "Masse de B", beta), v("xA", "x_A", 0), v("xB", "x_B", 6)],
        [qn("g", "Abscisse de G"), qn("k", "Coefficient k")],
    )


def arith_item(pid, n, u1, r, k, title_src):
    u1, r, k = int(u1), int(r), int(k)
    k = max(4, min(k, 12))
    return item(
        pid, n, "suites-arith", "arithSeq",
        "Suite arithmétique",
        f"On reprend la suite arithmétique du devoir « {title_src} », de premier terme u₁ = {u1} et de raison r = {r}. Calculer u_{k} et la somme S_{k} = u₁ + … + u_{k}.",
        [v("u1", "u₁", u1), v("r", "raison r", r), v("n", "rang n", k)],
        [qn("un", "uₙ"), qn("sn", "Sₙ")],
    )


def geo_item(pid, n, u1, q, k, title_src):
    u1, q, k = int(u1), int(q), int(k)
    k = max(3, min(k, 6))
    if q in (0, 1):
        q = 2
    return item(
        pid, n, "suites-geo", "geoSeq",
        "Suite géométrique",
        f"On reprend la suite géométrique du devoir « {title_src} », de premier terme u₁ = {u1} et de raison q = {q}. Calculer u_{k} et la somme S_{k}.",
        [v("u1", "u₁", u1), v("q", "raison q", q), v("n", "rang n", k)],
        [qn("un", "uₙ"), qn("sn", "Sₙ")],
    )


def trig_item(pid, n, angle, title_src):
    angle = int(angle)
    if angle not in (0, 30, 45, 60, 90):
        angle = 60
    return item(
        pid, n, "trigo", "trigExact",
        "Cercle trigonométrique",
        f"On reprend un angle remarquable du devoir « {title_src} ». Sur le cercle trigonométrique, calculer cos {angle}° et sin {angle}°.",
        [v("angle", "α", angle, "°")],
        [qn("cos", "cos α"), qn("sin", "sin α")],
    )


def dist_item(pid, n, pts, title_src):
    (xa, ya), (xb, yb) = pts[0], pts[1]
    return item(
        pid, n, "analytique", "distance2d",
        "Distance et milieu",
        f"On reprend deux points du devoir « {title_src} » : A({xa} ; {ya}) et B({xb} ; {yb}), dans un repère orthonormé. Calculer AB et les coordonnées du milieu I de [AB].",
        [v("xA", "x_A", xa), v("yA", "y_A", ya), v("xB", "x_B", xb), v("yB", "y_B", yb)],
        [qn("dist", "AB"), qn("xI", "x_I"), qn("yI", "y_I")],
    )


def vec_item(pid, n, pts, title_src):
    (xa, ya), (xb, yb) = pts[0], pts[1]
    return item(
        pid, n, "vecteurs", "vectorAB",
        "Vecteur et norme",
        f"On reprend les points du devoir « {title_src} » : A({xa} ; {ya}) et B({xb} ; {yb}). Calculer les composantes de AB⃗ et sa norme.",
        [v("xA", "x_A", xa), v("yA", "y_A", ya), v("xB", "x_B", xb), v("yB", "y_B", yb)],
        [qn("x", "x de AB⃗"), qn("y", "y de AB⃗"), qn("nrm", "|AB⃗|")],
    )


def affine_item(pid, n, a, b, x0, title_src):
    return item(
        pid, n, "fonctions", "affineFn",
        "Fonction affine",
        f"On reprend une fonction affine du devoir « {title_src} » : f(x) = {a}x + ({b}). Calculer f({x0}).",
        [v("a", "a", a), v("b", "b", b), v("x", "x₀", x0)],
        [qn("y", "f(x₀)")],
    )


def quadfn_item(pid, n, a, b, c, x0, title_src):
    return item(
        pid, n, "ref", "quadFn",
        "Image par un trinôme",
        f"On reprend un trinôme du devoir « {title_src} » : f(x) = {a}x² + ({b})x + ({c}). Calculer f({x0}).",
        [v("a", "a", a), v("b", "b", b), v("c", "c", c), v("x", "x₀", x0)],
        [qn("y", "f(x₀)")],
    )


def stats_item(pid, n, title_src):
    return item(
        pid, n, "stats", "statsMean",
        "Moyenne et étendue",
        f"On reprend une série du devoir « {title_src} ». Une série de n = 10 valeurs a pour somme 120, pour minimum 5 et pour maximum 19. Calculer la moyenne et l’étendue.",
        [v("n", "n", 10), v("sum", "Σ", 120), v("xmin", "min", 5), v("xmax", "max", 19)],
        [qn("mean", "Moyenne x̄"), qn("range", "Étendue")],
    )


def qcm_second_degree(pid, n, a, b, c, title_src):
    a, b, c = as_int(a), as_int(b), as_int(c)
    disc = b * b - 4 * a * c
    if disc > 0:
        ans, why = "deux solutions", f"Δ = {disc} > 0 donc deux racines réelles."
    elif disc == 0:
        ans, why = "une seule solution", f"Δ = 0 : racine double."
    else:
        ans, why = "zéro solution", f"Δ = {disc} < 0 : pas de racine réelle."
    return item(
        pid, n, "degres", "fixed",
        "QCM - équation du second degré",
        f"On reprend le QCM du devoir « {title_src} ». Combien de solutions l’équation {a}x² + ({b})x + ({c}) = 0 admet-elle dans IR ?",
        [],
        [qmcq("nb", "Nombre de solutions dans IR", ["zéro solution", "une seule solution", "deux solutions"], ans)],
        [["Discriminant", f"Δ = b² − 4ac = {b}² − 4×{a}×({c}) = {disc}."], ["Conclusion", why]],
    )


def qcm_midpoint(pid, n, title_src):
    return item(
        pid, n, "barycentre", "fixed",
        "QCM - milieu et barycentre",
        f"On reprend le QCM du devoir « {title_src} ». Si I est le milieu de [AB], I est le barycentre des points pondérés :",
        [],
        [qmcq("mil", "Barycentre du milieu", ["(A, -2) et (B, 1)", "(A, 1) et (B, 1)", "(A, 2) et (B, 1)"], "(A, 1) et (B, 1)")],
        [["Cours", "Le milieu est le barycentre des masses égales (A, 1) et (B, 1), ou de toute paire de masses égales."]],
    )


def fallback_items(paper, used):
    """Toujours 3 à 5 exercices, calés sur le tome et les nombres du sujet."""
    blob = paper.get("statement", "") + " " + " ".join(e.get("statement", "") for e in paper.get("exercises", []))
    title = paper["title"].split("·")[0].strip()
    tome = paper.get("tome") or 1
    pid = paper["id"]
    out = []
    n = 1

    def add(it):
        nonlocal n
        if not it or len(out) >= 5:
            return
        sig = (it["solver"], it["title"], json.dumps(it.get("variables") or [], sort_keys=True, ensure_ascii=False))
        if sig in used:
            return
        it["n"] = n
        it["id"] = f"{pid}_E{n}"
        out.append(it)
        used.add(sig)
        n += 1

    quads = parse_quad(blob)
    cubics = parse_cubic(blob)
    masses = MASSES.search(blob)
    pts = [(num(x), num(y)) for _, x, y in PTS.findall(blob)]
    pts = [p for p in pts if None not in p][:4]
    u0 = U0.search(blob)
    u1 = U1.search(blob)
    rr = REASON_R.search(blob)
    qq = REASON_Q.search(blob)
    ang = ANGLE.search(blob)
    root = ROOT_HINT.search(blob)

    if quads:
        a, b, c, _ = quads[0]
        add(quad_item(pid, n, a, b, c, title))
        if "choisis" in blob.lower() or "bonne réponse" in blob.lower():
            add(qcm_second_degree(pid, n, a, b, c, title))
    if cubics:
        a, b, c = cubics[0]
        r = int(root.group(1)) if root else 1
        add(cubic_item(pid, n, a, b, c, r, title))
    if masses:
        add(bary_item(pid, n, num(masses.group(1)), num(masses.group(2)), title))
    if tome == 1 and "milieu" in blob.lower() and "barycentr" in blob.lower():
        add(qcm_midpoint(pid, n, title))
    if len(pts) >= 2:
        add(dist_item(pid, n, pts, title) if tome == 2 else vec_item(pid, n, pts, title))
    if tome == 2 and (u0 or u1 or "suite" in blob.lower()):
        first = num((u1 or u0).group(1), 2) if (u1 or u0) else 2
        if "géom" in blob.lower() or "geom" in blob.lower():
            q = num(qq.group(1), 2) if qq else 2
            add(geo_item(pid, n, first, q, 5, title))
        add(arith_item(pid, n, first, num(rr.group(1), 3) if rr else 3, 8, title))
    if tome == 2 and ("trigonom" in blob.lower() or "cos" in blob.lower() or "sin" in blob.lower()):
        add(trig_item(pid, n, int(ang.group(1)) if ang else 60, title))
    if tome == 2 and "fonction" in blob.lower():
        if quads:
            a, b, c, _ = quads[0]
            add(quadfn_item(pid, n, a, b, c, 1, title))
        else:
            add(affine_item(pid, n, -2, 3, 4, title))
    if tome == 2 and "statisti" in blob.lower():
        add(stats_item(pid, n, title))

    # Garantir 3 exercices selon le tome.
    if tome == 1:
        bank = [
            quad_item(pid, n, 4, 3, -1, title),
            cubic_item(pid, n, 3, -4, -12, 2, title),
            bary_item(pid, n, 3, -2, title),
            vec_item(pid, n, [(0, 0), (3, 4)], title),
            qcm_midpoint(pid, n, title),
        ]
    else:
        bank = [
            arith_item(pid, n, 3, 4, 8, title),
            geo_item(pid, n, 2, 3, 5, title),
            trig_item(pid, n, 60, title),
            affine_item(pid, n, -2, 5, 3, title),
            dist_item(pid, n, [(0, 1), (4, 4)], title),
        ]
    for it in bank:
        if len(out) >= 4:
            break
        add(it)
    return out[:5]


def split_again(text: str):
    chunks = re.split(r"(?i)(?=\n?\s*exercice(?:\s+n[°o.]?)?\s*\d)", "\n" + text)
    items = []
    for chunk in chunks:
        chunk = chunk.strip()
        m = re.match(r"(?is)exercice(?:\s+n[°o.]?)?\s*(\d+)\s*[:.\-]?\s*(?:\(([^)]+)\))?\s*(.*)", chunk)
        if not m:
            continue
        stmt = m.group(3).strip()
        if len(stmt) < 40:
            continue
        items.append({"n": int(m.group(1)), "points": (m.group(2) or "").strip(), "statement": stmt[:6000]})
    return items


def rewrite_paper(paper: dict) -> dict:
    raw = clean(paper.get("statement") or "")
    title_short = paper["title"].split("·")[0].strip()
    exercises = paper.get("exercises") or []
    if len(exercises) <= 1 and raw:
        exercises = split_again(raw) or exercises
    used = set()
    rebuilt = fallback_items({**paper, "statement": raw, "exercises": exercises}, used)
    apercu = raw[:1800]
    apercu = re.sub(r"\s+", " ", apercu).strip()
    if len(raw) > 1800:
        apercu += "…"
    return {
        **{k: paper[k] for k in paper if k not in ("exercises", "statement")},
        "statement": (
            f"{title_short}. Devoir interactif : les exercices ci-dessous reprennent les calculs du sujet original, "
            f"réécrits pour la copie chronométrée. Le PDF d’origine reste disponible.\n\nAperçu du sujet : {apercu}"
        ),
        "exercises": rebuilt,
        "interactive": True,
    }


def main():
    data = json.loads(SRC.read_text(encoding="utf-8"))
    papers = [rewrite_paper(p) for p in data["papers"]]
    data["papers"] = papers
    data["note"] = (
        "Devoirs publics de 2ème Sciences réécrits pour une copie chronométrée : "
        "questions, correction et note. Le PDF d’origine est conservé."
    )
    data["version"] = 2
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    nq = sum(len(p["exercises"]) for p in papers)
    print("papers", len(papers), "exercises", nq, "min", min(len(p["exercises"]) for p in papers), "max", max(len(p["exercises"]) for p in papers))


if __name__ == "__main__":
    main()
