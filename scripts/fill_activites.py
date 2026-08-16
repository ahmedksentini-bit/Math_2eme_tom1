"""Remplacer les questions « aller au poly » par des calculs corrigés dans l’app."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MARK = "À calculer dans l'application"


def v(key, label, value, mn=None, mx=None, step=1, unit="—"):
    if mn is None:
        mn = value - 6
    if mx is None:
        mx = value + 6
    if mn == mx:
        mx = mn + step
    return {"key": key, "label": label, "unit": unit, "value": value, "min": mn, "max": mx, "step": step}


def qn(key, label, unit="—"):
    return {"key": key, "label": label, "unit": unit}


def qfix(key, typ, label, answer, options=None):
    q = {"key": key, "type": typ, "label": label, "answer": answer}
    if options:
        q["options"] = options
    return q


def apply(act, solver, work, variables, questions, steps=None):
    act["solver"] = solver
    act["variables"] = variables or []
    act["questions"] = questions
    if solver == "fixed":
        act["steps"] = steps or [["Calcul", work]]
    else:
        act.pop("steps", None)
    body = (act.get("statement") or "").split(MARK)[0].rstrip()
    act["statement"] = f"{body}\n\n{MARK} : {work}"


def dummy(act) -> bool:
    return any(q.get("key") == "lu" or "polycopié" in (q.get("label") or "").lower() for q in act.get("questions") or [])


def quad(a, b, c, work=None):
    return (
        "quadraticSolve",
        work or f"Résoudre dans IR : {a}x² + ({b})x + ({c}) = 0. Donner Δ, les racines, la somme et le produit.",
        [v("a", "a", a, 1, 6), v("b", "b", b, -8, 8), v("c", "c", c, -10, 10)],
        [qn("disc", "Discriminant Δ"), qn("x1", "Racine x₁"), qn("x2", "Racine x₂"), qn("sum", "Somme"), qn("prod", "Produit")],
    )


def packs_for(ch: str, n: int):
    i = (n - 1) % 8
    if ch == "degres":
        opts = [
            quad(1, -5, 6),
            quad(1, -3, -4),
            ("absEquation", "|x + 2| = 3. Donner les deux solutions, de la plus petite à la plus grande.", [v("a", "a", 2, 1, 5), v("b", "b", 3, 1, 6)], [qn("x1", "x₁"), qn("x2", "x₂")]),
            quad(2, -3, -2),
            ("affineBounds", "f(a) = −3a + 5 sur [−2 ; 3]. Encadrer f(a).", [v("amin", "a min", -2, -4, 0), v("amax", "a max", 3, 1, 6), v("m", "m", -3, -5, 5), v("p", "p", 5, -2, 8)], [qn("ymin", "min de f"), qn("ymax", "max de f")]),
            quad(1, 0, -9),
            ("absEquation", "|x − 1| = 4.", [v("a", "a", -1, -4, 4), v("b", "b", 4, 1, 6)], [qn("x1", "x₁"), qn("x2", "x₂")]),
            quad(3, -5, 2),
        ]
        return opts[i]
    if ch == "polynomes":
        opts = [
            ("polyEval", "P(x) = x³ + 6x² + 12x − 56. Calculer P(2).", [v("a3", "coeff. x³", 1, 1, 1), v("a2", "coeff. x²", 6, 2, 8), v("a1", "coeff. x", 12, 4, 16), v("a0", "constante", -56, -60, -20), v("x", "x", 2, -2, 4)], [qn("value", "P(x)")]),
            ("polyIntegerRoot", "P(x) = x³ + 6x² + 12x − 56. Racine entière puis coefficients du trinôme quotient.", [v("a", "coeff. x²", 6, 6, 6), v("b", "coeff. x", 12, 12, 12), v("c", "constante", -56, -56, -56)], [qn("root", "Racine entière r"), qn("qB", "q_B"), qn("qC", "q_C")]),
            ("polyKnownRoot", "P(x) = x³ + 3x² − 4x − 12. Vérifier que 2 est racine, puis le quotient.", [v("a", "coeff. x²", 3, -6, 6), v("b", "coeff. x", -4, -8, 8), v("c", "constante", -12, -20, 8), v("r", "r", 2, 1, 4)], [qn("PofR", "P(r)"), qn("qB", "q_B"), qn("qC", "q_C")]),
            ("polyEval", "P(x) = x³ − 4x² − 2x + 8. Calculer P(4).", [v("a3", "coeff. x³", 1, 1, 1), v("a2", "coeff. x²", -4, -6, 2), v("a1", "coeff. x", -2, -6, 4), v("a0", "constante", 8, -8, 12), v("x", "x", 4, 1, 5)], [qn("value", "P(x)")]),
            ("sumIntegers", "Somme des n premiers entiers et des n premiers carrés.", [v("n", "n", 10, 5, 15)], [qn("s1", "1+…+n"), qn("s2", "1²+…+n²")]),
            ("polyIntegerRoot", "P(x) = x³ + 6x² + 12x − 56.", [v("a", "coeff. x²", 6, 6, 6), v("b", "coeff. x", 12, 12, 12), v("c", "constante", -56, -56, -56)], [qn("root", "Racine entière r"), qn("qB", "q_B"), qn("qC", "q_C")]),
            ("polyEval", "P(x) = 2x³ − x + 5. Calculer P(−1).", [v("a3", "coeff. x³", 2, 1, 3), v("a2", "coeff. x²", 0, -2, 2), v("a1", "coeff. x", -1, -4, 4), v("a0", "constante", 5, -5, 8), v("x", "x", -1, -3, 3)], [qn("value", "P(x)")]),
            ("polyKnownRoot", "P(x) = x³ − 4x² − 2x + 8 et r = 4.", [v("a", "coeff. x²", -4, -6, 2), v("b", "coeff. x", -2, -6, 4), v("c", "constante", 8, -8, 12), v("r", "r", 4, 2, 5)], [qn("PofR", "P(r)"), qn("qB", "q_B"), qn("qC", "q_C")]),
        ]
        return opts[i]
    if ch == "arithmetique":
        opts = [
            ("euclidDiv", "Division euclidienne de 2613 par 8.", [v("a", "dividende", 2613, 100, 4000, 1), v("b", "diviseur", 8, 3, 12)], [qn("q", "quotient q"), qn("r", "reste r")]),
            ("remainderDigits", "Reste de 1963 modulo 9 (somme des chiffres).", [v("n", "n", 1963, 100, 4000), v("div", "module", 9, 9, 9)], [qn("sum", "Somme des chiffres"), qn("r", "Reste")]),
            ("remainderLast3", "Reste de 127645264 modulo 8 (trois derniers chiffres).", [v("n", "n", 127645264, 100000, 200000000, 1), v("div", "module", 8, 8, 8)], [qn("last", "Trois derniers chiffres"), qn("r", "Reste")]),
            ("gcd3", "Plus grande arête cubique pour un pavé 120 × 200 × 180.", [v("a", "L", 120, 60, 180), v("b", "ℓ", 200, 80, 240), v("c", "h", 180, 60, 240)], [qn("g", "Arête a"), qn("nBoxes", "Nombre de cubes")]),
            ("euclidDiv", "Division de 1001 par 13.", [v("a", "dividende", 1001, 200, 2000), v("b", "diviseur", 13, 5, 20)], [qn("q", "quotient q"), qn("r", "reste r")]),
            ("remainderDigits", "Reste de 258 modulo 9.", [v("n", "n", 258, 20, 900), v("div", "module", 9, 9, 9)], [qn("sum", "Somme des chiffres"), qn("r", "Reste")]),
            ("euclidDiv", "Division de 47 par 5.", [v("a", "dividende", 47, 20, 90), v("b", "diviseur", 5, 2, 9)], [qn("q", "quotient q"), qn("r", "reste r")]),
            ("gcd3", "Pavé 60 × 90 × 150.", [v("a", "L", 60, 30, 120), v("b", "ℓ", 90, 30, 180), v("c", "h", 150, 60, 240)], [qn("g", "Arête a"), qn("nBoxes", "Nombre de cubes")]),
        ]
        return opts[i]
    if ch == "vecteurs":
        opts = [
            ("vectorAB", "A(−2 ; 0,75), B(0 ; −1). Composantes et norme de AB⃗.", [v("xA", "x_A", -2, -5, 2), v("yA", "y_A", 0.75, -3, 4, 0.25), v("xB", "x_B", 0, -2, 5), v("yB", "y_B", -1, -4, 4)], [qn("x", "x de AB⃗"), qn("y", "y de AB⃗"), qn("nrm", "|AB⃗|")]),
            ("detColinear", "u⃗(2 ; 3) et v⃗(4 ; 6). Déterminant (colinéarité).", [v("x", "x", 2, -5, 5), v("y", "y", 3, -5, 5), v("xp", "x'", 4, -6, 6), v("yp", "y'", 6, -6, 6)], [qn("det", "déterminant")]),
            ("dotOrtho", "u⃗(3 ; 4) et v⃗(4 ; −3). Produit scalaire.", [v("x", "x", 3, -5, 5), v("y", "y", 4, -5, 5), v("xp", "x'", 4, -5, 5), v("yp", "y'", -3, -5, 5)], [qn("dot", "u⃗ · v⃗")]),
            ("parallelogramD", "Parallélogramme ABCD : A(−2 ; 1), B(0 ; −1), C(3 ; 4). Coordonnées de D.", [v("xA", "x_A", -2, -4, 2), v("yA", "y_A", 1, -3, 4), v("xB", "x_B", 0, -3, 3), v("yB", "y_B", -1, -4, 3), v("xC", "x_C", 3, 0, 6), v("yC", "y_C", 4, -2, 6)], [qn("xD", "x_D"), qn("yD", "y_D")]),
            ("vectorAB", "A(0 ; 0), B(3 ; 4).", [v("xA", "x_A", 0, -2, 2), v("yA", "y_A", 0, -2, 2), v("xB", "x_B", 3, 1, 6), v("yB", "y_B", 4, 1, 6)], [qn("x", "x de AB⃗"), qn("y", "y de AB⃗"), qn("nrm", "|AB⃗|")]),
            ("detColinear", "u⃗(1 ; −2) et v⃗(3 ; 1).", [v("x", "x", 1, -5, 5), v("y", "y", -2, -5, 5), v("xp", "x'", 3, -5, 5), v("yp", "y'", 1, -5, 5)], [qn("det", "déterminant")]),
            ("dotOrtho", "u⃗(1 ; 2) et v⃗(−2 ; 1).", [v("x", "x", 1, -5, 5), v("y", "y", 2, -5, 5), v("xp", "x'", -2, -5, 5), v("yp", "y'", 1, -5, 5)], [qn("dot", "u⃗ · v⃗")]),
            ("vectorAB", "A(1 ; −1), B(4 ; 3).", [v("xA", "x_A", 1, -3, 3), v("yA", "y_A", -1, -4, 3), v("xB", "x_B", 4, 0, 6), v("yB", "y_B", 3, -2, 6)], [qn("x", "x de AB⃗"), qn("y", "y de AB⃗"), qn("nrm", "|AB⃗|")]),
        ]
        return opts[i]
    if ch == "barycentre":
        opts = [
            ("bary1d", "G barycentre de (A, 3) et (B, −4), A en 0, B en 10.", [v("alpha", "masse A", 3, 1, 6), v("beta", "masse B", -4, -6, -1), v("xA", "x_A", 0, -2, 4), v("xB", "x_B", 10, 4, 14)], [qn("g", "x_G"), qn("k", "k tel que AG⃗ = k AB⃗")]),
            ("bary2d", "G barycentre de (A,1), (B,1), (C,1) avec A(0;0), B(6;0), C(0;6).", [v("alpha", "α", 1, 1, 4), v("beta", "β", 1, 1, 4), v("gamma", "γ", 1, 1, 4), v("xA", "x_A", 0, -2, 2), v("yA", "y_A", 0, -2, 2), v("xB", "x_B", 6, 2, 8), v("yB", "y_B", 0, -2, 2), v("xC", "x_C", 0, -2, 2), v("yC", "y_C", 6, 2, 8)], [qn("xG", "x_G"), qn("yG", "y_G")]),
            ("bary1d", "Milieu : masses 1 et 1, A en 2, B en 8.", [v("alpha", "masse A", 1, 1, 5), v("beta", "masse B", 1, 1, 5), v("xA", "x_A", 2, -2, 6), v("xB", "x_B", 8, 4, 12)], [qn("g", "x_G"), qn("k", "k")]),
            ("bary1d", "G barycentre de (A, 2) et (B, 1), A en 0, B en 6.", [v("alpha", "masse A", 2, 1, 5), v("beta", "masse B", 1, 1, 5), v("xA", "x_A", 0, -2, 4), v("xB", "x_B", 6, 2, 10)], [qn("g", "x_G"), qn("k", "k")]),
            ("bary2d", "Masses 2, 1, 1. A(0;0), B(4;0), C(0;4).", [v("alpha", "α", 2, 1, 4), v("beta", "β", 1, 1, 4), v("gamma", "γ", 1, 1, 4), v("xA", "x_A", 0, -2, 2), v("yA", "y_A", 0, -2, 2), v("xB", "x_B", 4, 1, 8), v("yB", "y_B", 0, -2, 2), v("xC", "x_C", 0, -2, 2), v("yC", "y_C", 4, 1, 8)], [qn("xG", "x_G"), qn("yG", "y_G")]),
            ("bary1d", "(A, 5) et (B, −2), A en 0, B en 7.", [v("alpha", "masse A", 5, 2, 8), v("beta", "masse B", -2, -5, -1), v("xA", "x_A", 0, -2, 3), v("xB", "x_B", 7, 3, 12)], [qn("g", "x_G"), qn("k", "k")]),
            ("bary1d", "(A, 1) et (B, 3), A en −2, B en 6.", [v("alpha", "masse A", 1, 1, 5), v("beta", "masse B", 3, 1, 6), v("xA", "x_A", -2, -5, 2), v("xB", "x_B", 6, 2, 10)], [qn("g", "x_G"), qn("k", "k")]),
            ("bary2d", "Masses égales, triangle A(0;0), B(6;0), C(3;6).", [v("alpha", "α", 1, 1, 3), v("beta", "β", 1, 1, 3), v("gamma", "γ", 1, 1, 3), v("xA", "x_A", 0, -2, 2), v("yA", "y_A", 0, -2, 2), v("xB", "x_B", 6, 2, 8), v("yB", "y_B", 0, -2, 2), v("xC", "x_C", 3, 0, 6), v("yC", "y_C", 6, 2, 10)], [qn("xG", "x_G"), qn("yG", "y_G")]),
        ]
        return opts[i]
    if ch == "translations":
        opts = [
            ("translation", "M(1 ; 2), v⃗(3 ; −1). Image M'.", [v("x", "x_M", 1, -3, 5), v("y", "y_M", 2, -3, 5), v("vx", "v_x", 3, -4, 6), v("vy", "v_y", -1, -5, 5)], [qn("xM", "x_{M'}"), qn("yM", "y_{M'}")]),
            ("translation", "M(0 ; 0), v⃗(4 ; 2).", [v("x", "x_M", 0, -3, 3), v("y", "y_M", 0, -3, 3), v("vx", "v_x", 4, -2, 6), v("vy", "v_y", 2, -4, 5)], [qn("xM", "x_{M'}"), qn("yM", "y_{M'}")]),
            ("vectorAB", "Le vecteur de translation est AB⃗ avec A(0;0), B(5;−2).", [v("xA", "x_A", 0, -2, 2), v("yA", "y_A", 0, -2, 2), v("xB", "x_B", 5, 1, 8), v("yB", "y_B", -2, -5, 3)], [qn("x", "v_x"), qn("y", "v_y"), qn("nrm", "|v⃗|")]),
            ("translation", "M(−1 ; 4), v⃗(2 ; −3).", [v("x", "x_M", -1, -4, 3), v("y", "y_M", 4, -2, 6), v("vx", "v_x", 2, -4, 5), v("vy", "v_y", -3, -6, 4)], [qn("xM", "x_{M'}"), qn("yM", "y_{M'}")]),
            ("translation", "M(2 ; −2), v⃗(−1 ; 5).", [v("x", "x_M", 2, -3, 5), v("y", "y_M", -2, -5, 3), v("vx", "v_x", -1, -5, 4), v("vy", "v_y", 5, -2, 8)], [qn("xM", "x_{M'}"), qn("yM", "y_{M'}")]),
            ("translation", "M(3 ; 1), v⃗(0 ; −4).", [v("x", "x_M", 3, -2, 6), v("y", "y_M", 1, -3, 5), v("vx", "v_x", 0, -4, 4), v("vy", "v_y", -4, -6, 2)], [qn("xM", "x_{M'}"), qn("yM", "y_{M'}")]),
            ("translation", "M(−3 ; −1), v⃗(6 ; 2).", [v("x", "x_M", -3, -6, 2), v("y", "y_M", -1, -4, 3), v("vx", "v_x", 6, 0, 8), v("vy", "v_y", 2, -3, 6)], [qn("xM", "x_{M'}"), qn("yM", "y_{M'}")]),
            ("translation", "M(5 ; 0), v⃗(−2 ; −2).", [v("x", "x_M", 5, 0, 8), v("y", "y_M", 0, -3, 4), v("vx", "v_x", -2, -5, 3), v("vy", "v_y", -2, -5, 3)], [qn("xM", "x_{M'}"), qn("yM", "y_{M'}")]),
        ]
        return opts[i]
    if ch == "homotheties":
        opts = [
            ("homothety", "Homothétie de centre O(0;0), rapport 3, M(2 ; 1).", [v("xO", "x_O", 0, -2, 2), v("yO", "y_O", 0, -2, 2), v("k", "k", 3, -3, 4, 0.5), v("x", "x_M", 2, -2, 5), v("y", "y_M", 1, -3, 4)], [qn("xM", "x_{M'}"), qn("yM", "y_{M'}"), qn("mm", "MM'")]),
            ("homothetyScale", "k = 1/2, périmètre 12, aire 6. Image du périmètre et de l’aire.", [v("k", "k", 0.5, -2, 2, 0.5), v("p", "périmètre", 12, 6, 20), v("a", "aire", 6, 2, 16)], [qn("perim", "p'"), qn("area", "A'")]),
            ("homothety", "Centre O(1;1), k = −1, M(4 ; 2) (symétrie centrale).", [v("xO", "x_O", 1, -2, 3), v("yO", "y_O", 1, -2, 3), v("k", "k", -1, -2, 2, 0.5), v("x", "x_M", 4, 0, 6), v("y", "y_M", 2, -2, 5)], [qn("xM", "x_{M'}"), qn("yM", "y_{M'}"), qn("mm", "MM'")]),
            ("homothetyScale", "k = 2, p = 10, A = 8.", [v("k", "k", 2, -3, 3, 0.5), v("p", "périmètre", 10, 4, 20), v("a", "aire", 8, 2, 16)], [qn("perim", "p'"), qn("area", "A'")]),
            ("homothety", "O(0;0), k = 1/2, M(6 ; −4).", [v("xO", "x_O", 0, -2, 2), v("yO", "y_O", 0, -2, 2), v("k", "k", 0.5, -2, 3, 0.5), v("x", "x_M", 6, 0, 8), v("y", "y_M", -4, -6, 2)], [qn("xM", "x_{M'}"), qn("yM", "y_{M'}"), qn("mm", "MM'")]),
            ("homothetyScale", "k = −2, p = 9, A = 5.", [v("k", "k", -2, -3, 3, 0.5), v("p", "périmètre", 9, 4, 18), v("a", "aire", 5, 1, 12)], [qn("perim", "p'"), qn("area", "A'")]),
            ("homothety", "O(2;0), k = 3, M(4 ; 1).", [v("xO", "x_O", 2, -1, 4), v("yO", "y_O", 0, -2, 2), v("k", "k", 3, -2, 4, 0.5), v("x", "x_M", 4, 0, 7), v("y", "y_M", 1, -3, 4)], [qn("xM", "x_{M'}"), qn("yM", "y_{M'}"), qn("mm", "MM'")]),
            ("homothetyScale", "k = 1/3, p = 18, A = 9.", [v("k", "k", 1 / 3, -2, 2, 0.5), v("p", "périmètre", 18, 6, 24), v("a", "aire", 9, 2, 18)], [qn("perim", "p'"), qn("area", "A'")]),
        ]
        return opts[i]
    if ch == "rotations":
        opts = [
            ("rotationAngle", "Rotation de centre O(0;0), angle 90°, M(2 ; 0).", [v("xO", "x_O", 0, -2, 2), v("yO", "y_O", 0, -2, 2), v("x", "x_M", 2, -3, 5), v("y", "y_M", 0, -3, 4), v("angle", "α", 90, 90, 180, 90, "°")], [qn("xM", "x_{M'}"), qn("yM", "y_{M'}"), qn("om", "OM")]),
            ("rotation90", "Quart de tour direct de centre O(0;0), M(1 ; 0).", [v("xO", "x_O", 0, -2, 2), v("yO", "y_O", 0, -2, 2), v("x", "x_M", 1, -3, 4), v("y", "y_M", 0, -3, 4)], [qn("xM", "x_{M'}"), qn("yM", "y_{M'}")]),
            ("rotationAngle", "Demi-tour (180°) de centre O(1;1), M(3 ; 1).", [v("xO", "x_O", 1, -2, 3), v("yO", "y_O", 1, -2, 3), v("x", "x_M", 3, 0, 6), v("y", "y_M", 1, -2, 4), v("angle", "α", 180, 90, 180, 90, "°")], [qn("xM", "x_{M'}"), qn("yM", "y_{M'}"), qn("om", "OM")]),
            ("rotationAngle", "90°, O(0;0), M(0 ; 2).", [v("xO", "x_O", 0, -2, 2), v("yO", "y_O", 0, -2, 2), v("x", "x_M", 0, -3, 4), v("y", "y_M", 2, -2, 5), v("angle", "α", 90, 90, 180, 90, "°")], [qn("xM", "x_{M'}"), qn("yM", "y_{M'}"), qn("om", "OM")]),
            ("rotation90", "Quart de tour, O(0;0), M(3 ; 1).", [v("xO", "x_O", 0, -2, 2), v("yO", "y_O", 0, -2, 2), v("x", "x_M", 3, -2, 5), v("y", "y_M", 1, -3, 4)], [qn("xM", "x_{M'}"), qn("yM", "y_{M'}")]),
            ("rotationAngle", "180°, O(0;0), M(4 ; −2).", [v("xO", "x_O", 0, -2, 2), v("yO", "y_O", 0, -2, 2), v("x", "x_M", 4, 0, 6), v("y", "y_M", -2, -4, 3), v("angle", "α", 180, 90, 180, 90, "°")], [qn("xM", "x_{M'}"), qn("yM", "y_{M'}"), qn("om", "OM")]),
            ("rotationAngle", "90°, O(1;0), M(1 ; 3).", [v("xO", "x_O", 1, -2, 3), v("yO", "y_O", 0, -2, 2), v("x", "x_M", 1, -2, 4), v("y", "y_M", 3, -1, 6), v("angle", "α", 90, 90, 180, 90, "°")], [qn("xM", "x_{M'}"), qn("yM", "y_{M'}"), qn("om", "OM")]),
            ("rotation90", "Quart de tour, O(0;0), M(−1 ; 2).", [v("xO", "x_O", 0, -2, 2), v("yO", "y_O", 0, -2, 2), v("x", "x_M", -1, -4, 3), v("y", "y_M", 2, -3, 5)], [qn("xM", "x_{M'}"), qn("yM", "y_{M'}")]),
        ]
        return opts[i]
    if ch == "suites-arith":
        opts = [
            ("arithSeq", "Suite arithmétique u₁ = 3, r = 4. Calculer u₁₀ et S₁₀.", [v("u1", "u₁", 3, -4, 10), v("r", "r", 4, -5, 8), v("n", "n", 10, 4, 16)], [qn("un", "uₙ"), qn("sn", "Sₙ")]),
            ("arithSeq", "u₁ = 1, r = 1 (entiers). u₂₀ et S₂₀.", [v("u1", "u₁", 1, -3, 8), v("r", "r", 1, -4, 6), v("n", "n", 20, 8, 20)], [qn("un", "uₙ"), qn("sn", "Sₙ")]),
            ("arithSeq", "u₁ = 10, r = −2. u₈ et S₈.", [v("u1", "u₁", 10, 0, 20), v("r", "r", -2, -6, 4), v("n", "n", 8, 4, 16)], [qn("un", "uₙ"), qn("sn", "Sₙ")]),
            ("arithSeq", "u₁ = 2, r = 3. u₁₂ et S₁₂.", [v("u1", "u₁", 2, -4, 8), v("r", "r", 3, -3, 7), v("n", "n", 12, 5, 18)], [qn("un", "uₙ"), qn("sn", "Sₙ")]),
            ("arithSeq", "u₁ = 0, r = 5. u₇ et S₇.", [v("u1", "u₁", 0, -5, 8), v("r", "r", 5, -3, 8), v("n", "n", 7, 4, 14)], [qn("un", "uₙ"), qn("sn", "Sₙ")]),
            ("arithSeq", "u₁ = −4, r = 3. u₉ et S₉.", [v("u1", "u₁", -4, -8, 4), v("r", "r", 3, -4, 6), v("n", "n", 9, 4, 16)], [qn("un", "uₙ"), qn("sn", "Sₙ")]),
            ("arithSeq", "u₁ = 7, r = −1. u₁₁ et S₁₁.", [v("u1", "u₁", 7, -2, 12), v("r", "r", -1, -5, 5), v("n", "n", 11, 5, 16)], [qn("un", "uₙ"), qn("sn", "Sₙ")]),
            ("arithSeq", "u₁ = 5, r = 5. u₆ et S₆.", [v("u1", "u₁", 5, -2, 12), v("r", "r", 5, -3, 8), v("n", "n", 6, 4, 14)], [qn("un", "uₙ"), qn("sn", "Sₙ")]),
        ]
        return opts[i]
    if ch == "suites-geo":
        opts = [
            ("geoSeq", "Suite géométrique u₁ = 2, q = 3. u₅ et S₅.", [v("u1", "u₁", 2, 1, 4), v("q", "q", 3, 2, 4), v("n", "n", 5, 3, 7)], [qn("un", "uₙ"), qn("sn", "Sₙ")]),
            ("geoSeq", "u₁ = 1, q = 2. u₆ et S₆.", [v("u1", "u₁", 1, 1, 4), v("q", "q", 2, 2, 4), v("n", "n", 6, 3, 7)], [qn("un", "uₙ"), qn("sn", "Sₙ")]),
            ("geoSeq", "u₁ = 3, q = 2. u₅ et S₅.", [v("u1", "u₁", 3, 1, 5), v("q", "q", 2, 2, 4), v("n", "n", 5, 3, 7)], [qn("un", "uₙ"), qn("sn", "Sₙ")]),
            ("geoSeq", "u₁ = 1, q = 3. u₄ et S₄.", [v("u1", "u₁", 1, 1, 4), v("q", "q", 3, 2, 4), v("n", "n", 4, 3, 6)], [qn("un", "uₙ"), qn("sn", "Sₙ")]),
            ("geoSeq", "u₁ = 2, q = 2. u₇ et S₇.", [v("u1", "u₁", 2, 1, 4), v("q", "q", 2, 2, 3), v("n", "n", 7, 4, 8)], [qn("un", "uₙ"), qn("sn", "Sₙ")]),
            ("geoSeq", "u₁ = 5, q = 2. u₄ et S₄.", [v("u1", "u₁", 5, 1, 6), v("q", "q", 2, 2, 4), v("n", "n", 4, 3, 6)], [qn("un", "uₙ"), qn("sn", "Sₙ")]),
            ("geoSeq", "u₁ = 1, q = 4. u₄ et S₄.", [v("u1", "u₁", 1, 1, 3), v("q", "q", 4, 2, 4), v("n", "n", 4, 3, 5)], [qn("un", "uₙ"), qn("sn", "Sₙ")]),
            ("geoSeq", "u₁ = 3, q = 3. u₄ et S₄.", [v("u1", "u₁", 3, 1, 5), v("q", "q", 3, 2, 4), v("n", "n", 4, 3, 6)], [qn("un", "uₙ"), qn("sn", "Sₙ")]),
        ]
        return opts[i]
    if ch in ("fonctions", "ref"):
        opts = [
            ("affineFn", "f(x) = −2x + 3. Calculer f(4).", [v("a", "a", -2, -5, 5), v("b", "b", 3, -6, 8), v("x", "x₀", 4, -3, 6)], [qn("y", "f(x₀)")]),
            ("quadFn", "f(x) = x² − 3x − 4. Calculer f(2).", [v("a", "a", 1, -2, 2), v("b", "b", -3, -6, 5), v("c", "c", -4, -8, 8), v("x", "x₀", 2, -3, 4)], [qn("y", "f(x₀)")]),
            ("affineFn", "f(x) = 3x − 1. Calculer f(−2).", [v("a", "a", 3, -5, 5), v("b", "b", -1, -6, 6), v("x", "x₀", -2, -4, 5)], [qn("y", "f(x₀)")]),
            ("quadFn", "f(x) = −x² + 4x. Calculer f(1).", [v("a", "a", -1, -2, 2), v("b", "b", 4, -5, 6), v("c", "c", 0, -6, 6), v("x", "x₀", 1, -3, 4)], [qn("y", "f(x₀)")]),
            ("affineFn", "f(x) = 0,5x + 2. Calculer f(6).", [v("a", "a", 0.5, -4, 5, 0.5), v("b", "b", 2, -4, 8), v("x", "x₀", 6, -3, 8)], [qn("y", "f(x₀)")]),
            ("quadFn", "f(x) = 2x² − 8. Calculer f(3).", [v("a", "a", 2, -2, 3), v("b", "b", 0, -5, 5), v("c", "c", -8, -10, 8), v("x", "x₀", 3, -3, 4)], [qn("y", "f(x₀)")]),
            ("affineFn", "f(x) = −x + 5. Calculer f(5).", [v("a", "a", -1, -5, 5), v("b", "b", 5, -4, 9), v("x", "x₀", 5, -3, 6)], [qn("y", "f(x₀)")]),
            ("quadFn", "f(x) = x² + x − 6. Calculer f(−2).", [v("a", "a", 1, -2, 2), v("b", "b", 1, -5, 5), v("c", "c", -6, -10, 6), v("x", "x₀", -2, -4, 4)], [qn("y", "f(x₀)")]),
        ]
        return opts[i]
    if ch == "trigo":
        angs = [60, 30, 45, 90, 0, 30, 45, 60]
        a = angs[i]
        return ("trigExact", f"Sur le cercle trigonométrique, calculer cos {a}° et sin {a}°.", [v("angle", "α", a, 0, 90, 15, "°")], [qn("cos", "cos α"), qn("sin", "sin α")])
    if ch in ("analytique", "espace-droites", "parallelisme"):
        opts = [
            ("distance2d", "A(0 ; 1), B(4 ; 4). Distance AB et milieu I.", [v("xA", "x_A", 0, -4, 3), v("yA", "y_A", 1, -4, 4), v("xB", "x_B", 4, 0, 6), v("yB", "y_B", 4, -2, 6)], [qn("dist", "AB"), qn("xI", "x_I"), qn("yI", "y_I")]),
            ("lineSlope", "A(0 ; 1), B(4 ; 3). Pente m et ordonnée à l’origine p.", [v("xA", "x_A", 0, -3, 2), v("yA", "y_A", 1, -4, 4), v("xB", "x_B", 4, 1, 6), v("yB", "y_B", 3, -3, 6)], [qn("m", "m"), qn("p", "p")]),
            ("distance2d", "A(−2 ; 3), B(4 ; −1).", [v("xA", "x_A", -2, -5, 2), v("yA", "y_A", 3, -3, 5), v("xB", "x_B", 4, 0, 6), v("yB", "y_B", -1, -4, 4)], [qn("dist", "AB"), qn("xI", "x_I"), qn("yI", "y_I")]),
            ("lineSlope", "A(−1 ; 0), B(3 ; 2).", [v("xA", "x_A", -1, -3, 2), v("yA", "y_A", 0, -4, 4), v("xB", "x_B", 3, 1, 6), v("yB", "y_B", 2, -3, 6)], [qn("m", "m"), qn("p", "p")]),
            ("distance2d", "A(1 ; 1), B(5 ; 4).", [v("xA", "x_A", 1, -3, 4), v("yA", "y_A", 1, -3, 4), v("xB", "x_B", 5, 1, 7), v("yB", "y_B", 4, -2, 6)], [qn("dist", "AB"), qn("xI", "x_I"), qn("yI", "y_I")]),
            ("lineSlope", "A(0 ; 0), B(6 ; 3).", [v("xA", "x_A", 0, -3, 2), v("yA", "y_A", 0, -3, 3), v("xB", "x_B", 6, 2, 8), v("yB", "y_B", 3, -2, 6)], [qn("m", "m"), qn("p", "p")]),
            ("distance2d", "A(−4 ; 0), B(2 ; 8).", [v("xA", "x_A", -4, -6, 1), v("yA", "y_A", 0, -4, 4), v("xB", "x_B", 2, -2, 6), v("yB", "y_B", 8, 0, 10)], [qn("dist", "AB"), qn("xI", "x_I"), qn("yI", "y_I")]),
            ("lineSlope", "A(1 ; −2), B(5 ; 6).", [v("xA", "x_A", 1, -3, 3), v("yA", "y_A", -2, -5, 3), v("xB", "x_B", 5, 1, 7), v("yB", "y_B", 6, -1, 8)], [qn("m", "m"), qn("p", "p")]),
        ]
        return opts[i]
    if ch == "orthogonalite":
        opts = [
            ("dotOrtho", "u⃗(3 ; 4) et v⃗(4 ; −3).", [v("x", "x", 3, -5, 5), v("y", "y", 4, -5, 5), v("xp", "x'", 4, -5, 5), v("yp", "y'", -3, -5, 5)], [qn("dot", "u⃗ · v⃗")]),
            ("dotOrtho", "u⃗(1 ; 2) et v⃗(−2 ; 1).", [v("x", "x", 1, -5, 5), v("y", "y", 2, -5, 5), v("xp", "x'", -2, -5, 5), v("yp", "y'", 1, -5, 5)], [qn("dot", "u⃗ · v⃗")]),
            ("dotOrtho", "u⃗(5 ; 0) et v⃗(0 ; 3).", [v("x", "x", 5, -5, 6), v("y", "y", 0, -5, 5), v("xp", "x'", 0, -5, 5), v("yp", "y'", 3, -5, 5)], [qn("dot", "u⃗ · v⃗")]),
            ("dotOrtho", "u⃗(2 ; −1) et v⃗(3 ; 6).", [v("x", "x", 2, -5, 5), v("y", "y", -1, -5, 5), v("xp", "x'", 3, -5, 5), v("yp", "y'", 6, -5, 8)], [qn("dot", "u⃗ · v⃗")]),
            ("dotOrtho", "u⃗(1 ; 1) et v⃗(1 ; −1).", [v("x", "x", 1, -5, 5), v("y", "y", 1, -5, 5), v("xp", "x'", 1, -5, 5), v("yp", "y'", -1, -5, 5)], [qn("dot", "u⃗ · v⃗")]),
            ("dotOrtho", "u⃗(6 ; 8) et v⃗(4 ; −3).", [v("x", "x", 6, -5, 8), v("y", "y", 8, -5, 10), v("xp", "x'", 4, -5, 6), v("yp", "y'", -3, -6, 5)], [qn("dot", "u⃗ · v⃗")]),
            ("dotOrtho", "u⃗(−3 ; 4) et v⃗(4 ; 3).", [v("x", "x", -3, -6, 5), v("y", "y", 4, -5, 6), v("xp", "x'", 4, -5, 6), v("yp", "y'", 3, -5, 6)], [qn("dot", "u⃗ · v⃗")]),
            ("dotOrtho", "u⃗(2 ; 2) et v⃗(−1 ; 1).", [v("x", "x", 2, -5, 5), v("y", "y", 2, -5, 5), v("xp", "x'", -1, -5, 5), v("yp", "y'", 1, -5, 5)], [qn("dot", "u⃗ · v⃗")]),
        ]
        return opts[i]
    if ch == "stats":
        opts = [
            ("statsMean", "n = 10, Σ = 120, min = 5, max = 19. Moyenne et étendue.", [v("n", "n", 10, 4, 20), v("sum", "Σ", 120, 40, 200, 4), v("xmin", "min", 5, 1, 12), v("xmax", "max", 19, 12, 30)], [qn("mean", "x̄"), qn("range", "étendue")]),
            ("statsMean", "n = 8, Σ = 96, min = 7, max = 18.", [v("n", "n", 8, 4, 16), v("sum", "Σ", 96, 32, 160, 4), v("xmin", "min", 7, 1, 12), v("xmax", "max", 18, 12, 28)], [qn("mean", "x̄"), qn("range", "étendue")]),
            ("statsMean", "n = 5, Σ = 40, min = 4, max = 12.", [v("n", "n", 5, 4, 12), v("sum", "Σ", 40, 16, 80, 4), v("xmin", "min", 4, 1, 10), v("xmax", "max", 12, 8, 24)], [qn("mean", "x̄"), qn("range", "étendue")]),
            ("statsMean", "n = 12, Σ = 180, min = 8, max = 22.", [v("n", "n", 12, 6, 20), v("sum", "Σ", 180, 60, 240, 4), v("xmin", "min", 8, 2, 14), v("xmax", "max", 22, 14, 30)], [qn("mean", "x̄"), qn("range", "étendue")]),
            ("statsMean", "n = 6, Σ = 54, min = 3, max = 15.", [v("n", "n", 6, 4, 14), v("sum", "Σ", 54, 20, 100, 2), v("xmin", "min", 3, 1, 10), v("xmax", "max", 15, 10, 25)], [qn("mean", "x̄"), qn("range", "étendue")]),
            ("statsMean", "n = 15, Σ = 225, min = 6, max = 24.", [v("n", "n", 15, 8, 20), v("sum", "Σ", 225, 80, 300, 5), v("xmin", "min", 6, 1, 12), v("xmax", "max", 24, 14, 30)], [qn("mean", "x̄"), qn("range", "étendue")]),
            ("statsMean", "n = 9, Σ = 81, min = 2, max = 16.", [v("n", "n", 9, 4, 16), v("sum", "Σ", 81, 30, 150, 3), v("xmin", "min", 2, 1, 10), v("xmax", "max", 16, 10, 28)], [qn("mean", "x̄"), qn("range", "étendue")]),
            ("statsMean", "n = 20, Σ = 200, min = 1, max = 19.", [v("n", "n", 20, 8, 20), v("sum", "Σ", 200, 80, 280, 5), v("xmin", "min", 1, 1, 8), v("xmax", "max", 19, 12, 30)], [qn("mean", "x̄"), qn("range", "étendue")]),
        ]
        return opts[i]
    return quad(1, -3, -4)


def special(act):
    if act.get("chapter") == "reels":
        return False
    blob = f"{act.get('title','')} {act.get('statement','')}".lower()
    ch, n = act["chapter"], act["activity"]
    if "triangulaire" in blob:
        apply(
            act, "fixed",
            "Les nombres triangulaires : Tₙ = n(n+1)/2. Calculer T₅, T₆ et T₂₀.",
            [],
            [qfix("t5", "number", "T₅", 15), qfix("t6", "number", "T₆", 21), qfix("t20", "number", "T₂₀", 210)],
            [["Formule", "Tₙ = 1+2+…+n = n(n+1)/2."], ["Valeurs", "T₅ = 15, T₆ = 21, T₂₀ = 210."]],
        )
        return True
    if ch == "degres" and n == 2:
        apply(
            act, "quadraticSolve",
            "Le carré de côté x et le rectangle 3×(2−x) ont la même aire : x² = 3(2−x), soit x² + 3x − 6 = 0. Résoudre.",
            [v("a", "a", 1, 1, 4), v("b", "b", 3, -6, 8), v("c", "c", -6, -10, 4)],
            [qn("disc", "Discriminant Δ"), qn("x1", "Racine x₁"), qn("x2", "Racine x₂"), qn("sum", "Somme"), qn("prod", "Produit")],
        )
        return True
        apply(
            act, "fixed",
            "Soit x le nombre pensé. ((x−5)×2+6)/5 = 2. Trouver x.",
            [],
            [qfix("x", "number", "Nombre pensé", 7)],
            [["Équation", "((x−5)×2+6)/5 = 2 ⇔ 2x − 4 = 10 ⇔ x = 7."], ["Contrôle", "(7−5)×2+6 = 10, 10/5 = 2."]],
        )
        return True
    if ch == "degres" and n == 3:
        apply(
            act, "fixed",
            "Quel entier ajouter au numérateur et au dénominateur de 3/5 pour obtenir 1/2 ?",
            [],
            [qfix("n", "number", "Entier à ajouter", -1)],
            [["Équation", "(3+x)/(5+x) = 1/2 ⇔ 6+2x = 5+x ⇔ x = −1."], ["Contrôle", "2/4 = 1/2."]],
        )
        return True
    if "pairs" in blob and "suite" in blob:
        apply(
            act, "arithSeq",
            "Suite des entiers pairs : u₁ = 2, r = 2. Calculer u₁₀ et S₁₀.",
            [v("u1", "u₁", 2, 0, 8), v("r", "r", 2, 1, 6), v("n", "n", 10, 4, 16)],
            [qn("un", "uₙ"), qn("sn", "Sₙ")],
        )
        return True
    m = re.search(r"vitesse v[ =]*(\d+)", blob)
    if ch == "polynomes" and n == 1:
        apply(
            act, "quadFn",
            "On prend le modèle d(v) = 0,2 v + v²/100. Calculer d(90).",
            [v("a", "a", 0.01, 0.01, 0.05, 0.01), v("b", "b", 0.2, 0.1, 0.5, 0.1), v("c", "c", 0, -1, 1), v("x", "v", 90, 40, 120, 5)],
            [qn("y", "d(90) (m)")],
        )
        return True
    return False


def fill_file(path: Path) -> tuple[int, int]:
    data = json.loads(path.read_text(encoding="utf-8"))
    n_dummy = n_ok = 0
    for act in data:
        if special(act):
            continue
        if not dummy(act):
            n_ok += 1
            continue
        n_dummy += 1
        solver, work, variables, questions = packs_for(act["chapter"], act["activity"])
        apply(act, solver, work, variables, questions)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    return n_dummy, n_ok


def main():
    total_d = total_ok = 0
    for path in sorted((ROOT / "data").glob("activites*.json")):
        if "index" in path.name:
            continue
        d, o = fill_file(path)
        print(path.name, "filled", d, "kept", o)
        total_d += d
        total_ok += o
    print("TOTAL filled", total_d, "kept", total_ok)


if __name__ == "__main__":
    main()
