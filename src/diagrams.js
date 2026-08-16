const esc = value => String(value ?? "").replace(/[&<>'"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[c]));
const num = (value, digits = 3) => Number.isFinite(+value) ? Number(value).toLocaleString("fr-FR", { maximumSignificantDigits: digits }) : "—";

function svg(label, body, height = 250) {
  return `<svg viewBox="0 0 560 ${height}" role="img" aria-label="${esc(label)}"><defs>
    <marker id="ar" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0l8 4-8 4z" fill="#0f172a"/></marker>
    <marker id="arb" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0l8 4-8 4z" fill="#6d28d9"/></marker>
    <marker id="arr" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0l8 4-8 4z" fill="#b91c1c"/></marker>
    <style>text{font-family:Inter,system-ui,sans-serif;font-size:12.5px;font-weight:700;fill:#0f172a}</style>
  </defs>${body}</svg>`;
}

const t = (x, y, text, extra = "") => `<text x="${x}" y="${y}" ${extra}>${text}</text>`;
const line = (x1, y1, x2, y2, color = "#0f172a", width = 1.6, extra = "") =>
  `<path d="M${x1} ${y1}L${x2} ${y2}" fill="none" stroke="${color}" stroke-width="${width}" ${extra}/>`;

function axes(x0 = 70, y0 = 200, x1 = 520, y1 = 40) {
  return `${line(x0, y0, x1, y0, "#334155", 1.4, 'marker-end="url(#ar)"')}${line(x0, y0, x0, y1, "#334155", 1.4, 'marker-end="url(#ar)"')}${t(x1 - 8, y0 + 16, "x")}${t(x0 - 14, y1 + 8, "y")}`;
}

function mapX(x, xmin, xmax, x0 = 70, w = 450) { return x0 + (x - xmin) / (xmax - xmin) * w; }
function mapY(y, ymin, ymax, y0 = 200, h = 160) { return y0 - (y - ymin) / (ymax - ymin) * h; }

function plotCurve(fn, opts = {}) {
  const xmin = opts.xmin ?? -6, xmax = opts.xmax ?? 6;
  const ymin = opts.ymin ?? -6, ymax = opts.ymax ?? 6;
  const x0 = opts.x0 ?? 70, y0 = opts.y0 ?? 200, w = opts.w ?? 450, h = opts.h ?? 160;
  const color = opts.color ?? "#6d28d9";
  const parts = [];
  let pen = false;
  for (let i = 0; i <= 140; i++) {
    const x = xmin + (xmax - xmin) * i / 140;
    const y = fn(x);
    if (!Number.isFinite(y) || y < ymin - 8 || y > ymax + 8) { pen = false; continue; }
    const sx = mapX(x, xmin, xmax, x0, w);
    const sy = mapY(y, ymin, ymax, y0, h);
    if (sy < 18 || sy > y0 + 12) { pen = false; continue; }
    parts.push(pen ? `L${sx.toFixed(1)} ${sy.toFixed(1)}` : `M${sx.toFixed(1)} ${sy.toFixed(1)}`);
    pen = true;
  }
  return `<path d="${parts.join(" ")}" fill="none" stroke="${color}" stroke-width="2.3"/>`;
}

function plotSeq(values, opts = {}) {
  const ymax = Math.max(4, ...values.map(Math.abs), 1);
  const n = Math.max(values.length - 1, 1);
  return values.map((u, i) => {
    const sx = mapX(i, 0, n, 80, 420);
    const sy = mapY(u, -ymax, ymax, 200, 150);
    return `<circle cx="${sx}" cy="${sy}" r="5" fill="#6d28d9"/>${t(sx - 6, sy - 10, `u${i === 0 ? "₁" : i + 1}`)}`;
  }).join("");
}

const figures = {
  tvaTtc(d) {
    return {
      caption: "Le prix T.T.C. s’obtient en multipliant le H.T. par 1 + t/100.",
      svg: svg("TVA", `<rect x="60" y="70" width="180" height="90" rx="12" fill="#ede9fe" stroke="#6d28d9" stroke-width="2"/>${t(90, 110, `HT = ${num(d.ht)} D`)}<rect x="320" y="70" width="180" height="90" rx="12" fill="#ddd6fe" stroke="#5b21b6" stroke-width="2"/>${t(348, 110, `TVA ${num(d.tva)} %`)}${line(250, 115, 310, 115, "#6d28d9", 2.2, 'marker-end="url(#arb)"')}${t(160, 210, "TTC = HT × (1 + t/100)")}`)
    };
  },
  tvaHt(d) {
    return {
      caption: "On revient au H.T. en divisant le T.T.C. par 1 + t/100.",
      svg: svg("HT", `<rect x="60" y="70" width="180" height="90" rx="12" fill="#ddd6fe" stroke="#5b21b6" stroke-width="2"/>${t(95, 110, `TTC = ${num(d.ttc)} D`)}${line(250, 115, 310, 115, "#6d28d9", 2.2, 'marker-end="url(#arb)"')}<rect x="320" y="70" width="180" height="90" rx="12" fill="#ede9fe" stroke="#6d28d9" stroke-width="2"/>${t(350, 110, `÷ 1,${String(100 + d.tva).slice(1)}`)}${t(160, 210, "HT < TTC")}`)
    };
  },
  successivePercent(d) {
    return {
      caption: "Les coefficients se multiplient : on n’additionne pas les pourcentages.",
      svg: svg("Pourcentages successifs", `<rect x="40" y="80" width="120" height="70" rx="10" fill="#f5f3ff" stroke="#5b21b6" stroke-width="2"/>${t(70, 120, "prix")}${line(170, 115, 210, 115, "#6d28d9", 2, 'marker-end="url(#arb)"')}${t(175, 100, `+${num(d.p1)} %`)}<rect x="220" y="80" width="120" height="70" rx="10" fill="#ede9fe" stroke="#6d28d9" stroke-width="2"/>${line(350, 115, 390, 115, "#6d28d9", 2, 'marker-end="url(#arb)"')}${t(355, 100, `+${num(d.p2)} %`)}<rect x="400" y="80" width="120" height="70" rx="10" fill="#ddd6fe" stroke="#5b21b6" stroke-width="2"/>${t(430, 120, "final")}${t(140, 210, "(1+p₁/100)(1+p₂/100) ≠ 1+(p₁+p₂)/100")}`)
    };
  },
  heronArea(d) {
    return {
      caption: "Aire à partir des trois côtés : p puis √[p(p−a)(p−b)(p−c)].",
      svg: svg("Triangle", `<path d="M80 200 L300 50 L500 200 Z" fill="#ede9fe" stroke="#5b21b6" stroke-width="2.5"/>${t(250, 40, `c = ${num(d.c)}`)}${t(70, 130, `a = ${num(d.a)}`)}${t(420, 130, `b = ${num(d.b)}`)}${t(200, 230, "formule de Héron")}`)
    };
  },
  absEquation(d) {
    const x1 = -d.a - d.b, x2 = -d.a + d.b, mid = -d.a;
    return {
      caption: "|x + a| = b : deux points sur la droite, à distance b de −a.",
      svg: svg("Valeur absolue", `${line(40, 140, 520, 140, "#334155", 1.6, 'marker-end="url(#ar)"')}<circle cx="160" cy="140" r="7" fill="#b91c1c"/><circle cx="400" cy="140" r="7" fill="#b91c1c"/><circle cx="280" cy="140" r="6" fill="#5b21b6"/>${t(148, 175, `x₁ = ${num(x1)}`)}${t(255, 120, `−a = ${num(mid)}`)}${t(378, 175, `x₂ = ${num(x2)}`)}${t(200, 220, `|x + ${num(d.a)}| = ${num(d.b)}`)}`)
    };
  },
  affineBounds(d) {
    const f = x => d.m * x + d.p;
    return {
      caption: "L’image d’un segment par une fonction affine est un segment. Si m < 0, l’ordre s’inverse.",
      svg: svg("Encadrement", `${axes()}${plotCurve(f, { xmin: -6, xmax: 6, ymin: -12, ymax: 12 })}${t(300, 40, `f(a) = ${num(d.m)}a + ${num(d.p)}`)}`)
    };
  },
  lightTime(d) {
    return {
      caption: "Un rayon parcourt d à la vitesse c. t = d/v.",
      svg: svg("Terre-Soleil", `<circle cx="90" cy="120" r="28" fill="#fbbf24" stroke="#b45309" stroke-width="2"/>${t(78, 125, "☉")}<circle cx="430" cy="120" r="16" fill="#38bdf8" stroke="#0369a1" stroke-width="2"/>${t(422, 125, "⊕")}${line(130, 120, 405, 120, "#7c3aed", 2.2, 'marker-end="url(#arb)"')}${t(200, 100, `${num(d.distMkm)} × 10⁶ km`)}${t(180, 210, `v = ${num(d.v)} km/s`)}`)
    };
  },
  scientificOrder(d) {
    return {
      caption: "On déplace la virgule de N jusqu’à 1 ≤ |a| < 10. L’ordre de grandeur arrondit a à l’unité.",
      svg: svg("Écriture scientifique", `${t(80, 90, `N = ${num(d.N, 6)}`)}${t(80, 140, "↓")}${t(80, 190, "a × 10ⁿ")}${t(280, 140, "ordre : b × 10ⁿ")}`)
    };
  },
  quadraticSolve(d) {
    const f = x => d.a * x * x + d.b * x + d.c;
    return {
      caption: "Parabole y = ax² + bx + c. Les racines sont les abscisses des points d’intersection avec l’axe des x.",
      svg: svg("Trinôme", `${axes()}${plotCurve(f, { xmin: -6, xmax: 6, ymin: -10, ymax: 10 })}${t(200, 40, `Δ = b² − 4ac`)}${t(70, 230, `a = ${num(d.a)}  b = ${num(d.b)}  c = ${num(d.c)}`)}`)
    };
  },
  resistors(d) {
    return {
      caption: "Série : R = R₁ + R₂. Parallèle : 1/r = 1/R₁ + 1/R₂.",
      svg: svg("Résistors", `${line(60, 80, 200, 80, "#334155", 3)}${line(80, 80, 80, 140, "#334155", 3)}${line(180, 80, 180, 140, "#334155", 3)}${line(80, 140, 180, 140, "#334155", 3)}${t(100, 70, `R = ${num(d.R)} Ω`)}${line(300, 70, 300, 160, "#334155", 3)}${line(420, 70, 420, 160, "#334155", 3)}${line(300, 70, 420, 70, "#334155", 3)}${line(300, 160, 420, 160, "#334155", 3)}${t(330, 120, `r = ${num(d.r)} Ω`)}${t(80, 210, "série")}${t(330, 210, "parallèle")}`)
    };
  },
  cyclists(d) {
    return {
      caption: "Deux mobiles l’un vers l’autre. La vitesse de rapprochement est V_A + V_B.",
      svg: svg("Cyclistes", `${line(40, 140, 520, 140, "#334155", 1.6)}<circle cx="80" cy="140" r="10" fill="#5b21b6"/><circle cx="480" cy="140" r="10" fill="#b91c1c"/>${line(100, 140, 250, 140, "#6d28d9", 2.2, 'marker-end="url(#arb)"')}${line(460, 140, 310, 140, "#b91c1c", 2.2, 'marker-end="url(#arr)"')}${t(70, 120, "A")}${t(470, 120, "B")}${t(200, 190, `D = ${num(d.D)} km · ensemble en ${num(d.T)} h`)}${t(180, 220, `A part ${num(d.hMin)} min plus tôt`)}`)
    };
  },
  squareDecrease(d) {
    return {
      caption: "On diminue le côté de h : l’aire perdue est x² − (x − h)².",
      svg: svg("Carré", `<rect x="80" y="40" width="160" height="160" fill="#ede9fe" stroke="#5b21b6" stroke-width="2"/><rect x="80" y="70" width="130" height="130" fill="#ddd6fe" stroke="#7c3aed" stroke-width="2"/>${t(260, 90, `x`)}${t(260, 160, `x − ${num(d.cut)}`)}${t(80, 230, `perte d’aire = ${num(d.dA)} cm²`)}`)
    };
  },
  goldenRatio(d) {
    return {
      caption: "Rectangle d’or : L/ℓ = φ = (1 + √5)/2.",
      svg: svg("Nombre d’or", `<rect x="70" y="50" width="260" height="160" fill="#ede9fe" stroke="#5b21b6" stroke-width="2"/><rect x="330" y="50" width="100" height="160" fill="#ddd6fe" stroke="#7c3aed" stroke-width="2"/>${t(170, 140, "ℓ")}${t(360, 140, "L−ℓ")}${t(180, 230, `φ² = φ + ${num(d.shift)}`)}`)
    };
  },
  polyEval(d) {
    return {
      caption: "Courbe y = P(x). P(x₀) est l’ordonnée du point d’abscisse x₀.",
      svg: svg("Polynôme", `${axes()}${line(90, 180, 180, 90, "#7c3aed", 2.2)}${line(180, 90, 320, 160, "#7c3aed", 2.2)}${line(320, 160, 470, 60, "#7c3aed", 2.2)}<circle cx="250" cy="130" r="6" fill="#b91c1c"/>${t(260, 120, `x = ${num(d.x)}`)}`)
    };
  },
  polyIntegerRoot(d) {
    return {
      caption: "Une racine entière divise le terme constant. On factorise ensuite par x − r.",
      svg: svg("Racine entière", `${axes()}${line(100, 70, 220, 200, "#7c3aed", 2.2)}${line(220, 200, 400, 80, "#7c3aed", 2.2)}<circle cx="220" cy="200" r="6" fill="#b91c1c"/>${t(200, 230, "P(r) = 0")}${t(300, 50, `P(x) = x³ + ${num(d.a)}x² + ${num(d.b)}x + ${num(d.c)}`)}`)
    };
  },
  polyKnownRoot(d) {
    return {
      caption: "Si P(α) = 0, alors (x − α) divise P. Le quotient est de degré n − 1.",
      svg: svg("Factorisation", `${t(60, 80, `P(x) = x³ + ${num(d.a)}x² + ${num(d.b)}x + ${num(d.c)}`)}${t(60, 130, `α = ${num(d.r)} est une racine`)}${t(60, 180, "P(x) = (x − α) Q(x)")}`)
    };
  },
  sumIntegers(d) {
    return {
      caption: "S₁ et S₂ s’obtiennent en sommant P(k) − P(k − 1) pour k de 1 à n.",
      svg: svg("Sommes", `${t(80, 80, `1 + 2 + … + ${num(d.n)} = n(n+1)/2`)}${t(80, 130, `1² + 2² + … + n² = n(n+1)(2n+1)/6`)}${t(80, 190, "chapitre 3 · polynômes")}`)
    };
  },
  euclidDiv(d) {
    return {
      caption: "a = bq + r avec 0 ≤ r < b. Le couple (q, r) est unique.",
      svg: svg("Division euclidienne", `${t(80, 90, `${num(d.a)} = ${num(d.b)} × q + r`)}${t(80, 140, "0 ≤ r < b")}${t(80, 200, "dividende = diviseur × quotient + reste")}`)
    };
  },
  remainderLast3(d) {
    return {
      caption: "On ne garde que les derniers chiffres : 1000 est multiple de 8.",
      svg: svg("Derniers chiffres", `${t(80, 100, `n = ${num(d.n, 8)}`)}${t(80, 150, `on lit les derniers chiffres, puis on divise par ${num(d.div)}`)}`)
    };
  },
  remainderDigits(d) {
    return {
      caption: "n et la somme de ses chiffres ont le même reste modulo 9 (et modulo 3).",
      svg: svg("Somme des chiffres", `${t(80, 100, `n = ${num(d.n, 8)}`)}${t(80, 160, `n ≡ somme des chiffres (mod ${num(d.div)})`)}`)
    };
  },
  barcodeCheck(d) {
    return {
      caption: "EAN-13 : rangs impairs + 3 × rangs pairs + clé ≡ 0 (mod 10).",
      svg: svg("Code-barres", `${Array.from({ length: 18 }, (_, i) => `<rect x="${80 + i * 12}" y="50" width="${4 + (i % 3 === 0 ? 4 : 0)}" height="120" fill="#0f172a"/>`).join("")}${t(80, 200, String(Math.round(d.prefix)))}${t(80, 230, "12 chiffres + clé")}`)
    };
  },
  gcd3(d) {
    return {
      caption: "Le plus grand cube qui pave le pavé a pour arête le PGCD des trois dimensions.",
      svg: svg("Caisse", `<path d="M120 80h220l80 40v110H200l-80-40z" fill="#ede9fe" stroke="#5b21b6" stroke-width="2"/>${t(200, 70, `${num(d.a)}`)}${t(40, 160, `${num(d.b)}`)}${t(360, 220, `${num(d.c)}`)}`)
    };
  },
  vectorAB(d) {
    return {
      caption: "AB⃗ = (x_B − x_A ; y_B − y_A). La norme est la distance AB.",
      svg: svg("Vecteur AB", `${axes()}${line(160, 170, 380, 80, "#6d28d9", 2.6, 'marker-end="url(#arb)"')}${t(150, 188, `A(${num(d.xA)} ; ${num(d.yA)})`)}${t(390, 75, `B(${num(d.xB)} ; ${num(d.yB)})`)}`)
    };
  },
  detColinear(d) {
    return {
      caption: "u⃗ et v⃗ sont colinéaires  ⇔  xy' − x'y = 0.",
      svg: svg("Colinéarité", `${axes(80, 200, 500, 40)}${line(80, 200, 300, 80, "#6d28d9", 2.4, 'marker-end="url(#arb)"')}${line(80, 200, 240, 140, "#b91c1c", 2.4, 'marker-end="url(#arr)"')}${t(310, 75, `u⃗ (${num(d.x)} ; ${num(d.y)})`)}${t(250, 155, `v⃗ (${num(d.xp)} ; ${num(d.yp)})`)}`)
    };
  },
  dotOrtho(d) {
    return {
      caption: "Dans un repère orthonormé, u⃗ ⊥ v⃗  ⇔  xx' + yy' = 0.",
      svg: svg("Orthogonalité", `${axes(80, 200, 500, 40)}${line(80, 200, 280, 80, "#6d28d9", 2.4, 'marker-end="url(#arb)"')}${line(80, 200, 260, 200, "#b91c1c", 2.4, 'marker-end="url(#arr)"')}${t(290, 75, `u⃗ (${num(d.x)} ; ${num(d.y)})`)}${t(270, 190, `v⃗ (${num(d.xp)} ; ${num(d.yp)})`)}`)
    };
  },
  parallelogramD(d) {
    return {
      caption: "ABCD parallélogramme  ⇔  D = A + C − B.",
      svg: svg("Parallélogramme", `<path d="M120 180 L300 180 L420 70 L240 70 Z" fill="#ede9fe" stroke="#5b21b6" stroke-width="2.2"/>${t(100, 200, "A")}${t(310, 200, "B")}${t(430, 65, "C")}${t(220, 60, "D")}${t(160, 230, `A(${num(d.xA)} ; ${num(d.yA)})  B(${num(d.xB)} ; ${num(d.yB)})  C(${num(d.xC)} ; ${num(d.yC)})`)}`)
    };
  },
  bary1d(d) {
    return {
      caption: "G est sur (AB). AG⃗ = β/(α+β) AB⃗. Même signe des masses  ⇔  G ∈ [AB].",
      svg: svg("Barycentre de deux points", `${line(60, 140, 500, 140, "#334155", 1.6)}<circle cx="120" cy="140" r="8" fill="#5b21b6"/><circle cx="440" cy="140" r="8" fill="#7c3aed"/><circle cx="280" cy="140" r="8" fill="#b91c1c"/>${t(108, 175, "A")}${t(270, 120, "G")}${t(430, 175, "B")}${t(150, 220, `masses α = ${num(d.alpha)}  et  β = ${num(d.beta)}`)}`)
    };
  },
  bary2d(d) {
    return {
      caption: "G = (αA + βB + γC)/(α+β+γ). L’isobarycentre est le centre de gravité.",
      svg: svg("Barycentre de trois points", `<path d="M90 200 L280 50 L470 200 Z" fill="#ede9fe" stroke="#5b21b6" stroke-width="2"/><circle cx="280" cy="150" r="7" fill="#b91c1c"/>${t(80, 220, "A")}${t(275, 40, "B")}${t(475, 220, "C")}${t(290, 155, "G")}${t(140, 240, `α = ${num(d.alpha)}  β = ${num(d.beta)}  γ = ${num(d.gamma)}`)}`)
    };
  },
  translation(d) {
    return {
      caption: "MM'⃗ = v⃗ constant. Alors M'N'⃗ = MN⃗.",
      svg: svg("Translation", `${axes()}${line(140, 170, 320, 90, "#6d28d9", 2.4, 'marker-end="url(#arb)"')}${t(130, 188, "M")}${t(330, 85, "M'")}${t(200, 230, `v⃗ = (${num(d.vx)} ; ${num(d.vy)})`)}`)
    };
  },
  homothety(d) {
    return {
      caption: "OM'⃗ = k OM⃗. Les droites (MN) et (M'N') sont parallèles et M'N' = |k| MN.",
      svg: svg("Homothétie", `${axes()}<circle cx="180" cy="160" r="6" fill="#5b21b6"/>${t(160, 150, "O")}${line(180, 160, 280, 100, "#6d28d9", 2, 'marker-end="url(#arb)"')}${line(180, 160, 380, 70, "#b91c1c", 2, 'marker-end="url(#arr)"')}${t(285, 95, "M")}${t(390, 65, "M'")}${t(220, 230, `k = ${num(d.k)}`)}`)
    };
  },
  homothetyScale(d) {
    return {
      caption: "Longueurs × |k|, aires × k².",
      svg: svg("Rapports", `<path d="M80 200 L180 80 L260 200 Z" fill="#ede9fe" stroke="#5b21b6" stroke-width="2"/><path d="M300 200 L460 40 L540 200 Z" fill="#ddd6fe" stroke="#7c3aed" stroke-width="2"/>${t(120, 230, "p, A")}${t(400, 230, `|k|p , k²A`)}${t(240, 40, `k = ${num(d.k)}`)}`)
    };
  },
  rotation90(d) {
    return {
      caption: "Quart de tour direct autour de O : l’image d’une droite est une perpendiculaire.",
      svg: svg("Quart de tour", `${axes()}<circle cx="240" cy="150" r="6" fill="#5b21b6"/>${t(220, 140, "O")}${line(240, 150, 360, 150, "#6d28d9", 2.4, 'marker-end="url(#arb)"')}${line(240, 150, 240, 50, "#b91c1c", 2.4, 'marker-end="url(#arr)"')}${t(370, 155, "M")}${t(250, 45, "M'")}`)
    };
  },
  rotationAngle(d) {
    return {
      caption: "Rotation de centre O : OM' = OM et l’angle MOM' vaut α.",
      svg: svg("Rotation", `${axes()}<circle cx="240" cy="160" r="6" fill="#5b21b6"/>${t(220, 150, "O")}${line(240, 160, 380, 160, "#6d28d9", 2.2, 'marker-end="url(#arb)"')}${line(240, 160, 330, 70, "#b91c1c", 2.2, 'marker-end="url(#arr)"')}${t(390, 165, "M")}${t(340, 65, "M'")}${t(300, 230, `α = ${num(d.angle)}°`)}`)
    };
  },
  arithSeq(d) {
    const vals = Array.from({ length: Math.min(8, Math.max(3, d.n)) }, (_, i) => d.u1 + i * d.r);
    return {
      caption: "Suite arithmétique : points régulièrement espacés. uₙ = u₁ + (n−1)r.",
      svg: svg("Suite arithmétique", `${axes()}${plotSeq(vals)}${t(70, 230, `r = ${num(d.r)}`)}`)
    };
  },
  geoSeq(d) {
    const vals = Array.from({ length: Math.min(7, Math.max(3, d.n)) }, (_, i) => d.u1 * d.q ** i);
    return {
      caption: "Suite géométrique : chaque terme est multiplié par q. uₙ = u₁ q^{n−1}.",
      svg: svg("Suite géométrique", `${axes()}${plotSeq(vals)}${t(70, 230, `q = ${num(d.q)}`)}`)
    };
  },
  affineFn(d) {
    const f = x => d.a * x + d.b;
    const y = f(d.x);
    return {
      caption: "La courbe d’une fonction affine est une droite. On lit f(x₀) sur la courbe.",
      svg: svg("Fonction affine", `${axes()}${plotCurve(f)}${t(300, 50, `f(x)=${num(d.a)}x+${num(d.b)}`)}${t(70, 230, `f(${num(d.x)}) = ${num(y)}`)}`)
    };
  },
  quadFn(d) {
    const f = x => d.a * x * x + d.b * x + d.c;
    return {
      caption: "Parabole y = ax² + bx + c. a > 0 : tournée vers le haut.",
      svg: svg("Trinôme", `${axes()}${plotCurve(f, { ymin: -12, ymax: 12 })}${t(70, 230, `f(${num(d.x)})`)}`)
    };
  },
  trigExact(d) {
    const rad = (d.angle || 0) * Math.PI / 180;
    const cx = 260, cy = 130, r = 90;
    const mx = cx + r * Math.cos(rad), my = cy - r * Math.sin(rad);
    return {
      caption: "Cercle trigonométrique : M(cos α ; sin α).",
      svg: svg("Cercle trigo", `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#f5f3ff" stroke="#5b21b6" stroke-width="2"/>${line(cx - 120, cy, cx + 130, cy)}${line(cx, cy + 110, cx, cy - 110)}${line(cx, cy, mx, my, "#b91c1c", 2.2, 'marker-end="url(#arr)"')}<circle cx="${mx}" cy="${my}" r="6" fill="#b91c1c"/>${t(mx + 8, my - 6, "M")}${t(200, 240, `α = ${num(d.angle)}°`)}`)
    };
  },
  distance2d(d) {
    return {
      caption: "AB et le milieu I se lisent dans le repère orthonormé.",
      svg: svg("Distance", `${axes()}<circle cx="160" cy="150" r="6" fill="#5b21b6"/><circle cx="400" cy="80" r="6" fill="#b91c1c"/>${line(160, 150, 400, 80, "#6d28d9", 2.2)}${t(140, 140, "A")}${t(410, 75, "B")}${t(70, 230, `A(${num(d.xA)};${num(d.yA)})  B(${num(d.xB)};${num(d.yB)})`)}`)
    };
  },
  lineSlope(d) {
    const m = (d.xB === d.xA) ? 0 : (d.yB - d.yA) / (d.xB - d.xA);
    const p = d.yA - m * d.xA;
    const f = x => m * x + p;
    return {
      caption: "La droite (AB) a pour équation y = mx + p. Les parallèles ont la même pente.",
      svg: svg("Droite", `${axes()}${plotCurve(f)}${t(70, 230, `m = ${num(m)}`)}`)
    };
  },
  espaceCube() {
    return {
      caption: "Pavé de référence : arêtes = droites, faces = plans. On lit les positions dans l’espace.",
      svg: svg("Espace", `<path d="M120 90 L300 90 L300 210 L120 210 Z" fill="#f5f3ff" stroke="#5b21b6" stroke-width="2"/>
        <path d="M120 90 L190 40 L370 40 L300 90 Z" fill="#ede9fe" stroke="#5b21b6" stroke-width="2"/>
        <path d="M300 90 L370 40 L370 160 L300 210 Z" fill="#ddd6fe" stroke="#5b21b6" stroke-width="2"/>
        ${t(200, 160, "face")}${t(230, 70, "dessus")}${t(325, 140, "côté")}${t(70, 240, "droites = arêtes · plans = faces")}`)
    };
  },
  statsMean(d) {
    const mean = d.sum / d.n;
    const x1 = mapX(d.xmin, d.xmin - 2, d.xmax + 2, 80, 400);
    const x2 = mapX(d.xmax, d.xmin - 2, d.xmax + 2, 80, 400);
    const xm = mapX(mean, d.xmin - 2, d.xmax + 2, 80, 400);
    return {
      caption: "Sur la droite, min, moyenne et max. L’étendue est max − min.",
      svg: svg("Série statistique", `${line(60, 140, 520, 140, "#334155", 1.6, 'marker-end="url(#ar)"')}<circle cx="${x1}" cy="140" r="7" fill="#b91c1c"/><circle cx="${xm}" cy="140" r="7" fill="#5b21b6"/><circle cx="${x2}" cy="140" r="7" fill="#b91c1c"/>${t(x1 - 10, 175, "min")}${t(xm - 8, 120, "x̄")}${t(x2 - 10, 175, "max")}${t(70, 220, `n = ${num(d.n)}`)}`)
    };
  },
  fixed(_d, exercise) {
    const ch = exercise?.chapter || "";
    if (ch === "suites-arith") return figures.arithSeq({ u1: 2, r: 3, n: 6 });
    if (ch === "suites-geo") return figures.geoSeq({ u1: 2, q: 2, n: 5 });
    if (ch === "fonctions" || ch === "ref") return figures.quadFn({ a: 1, b: -2, c: -3, x: 1 });
    if (ch === "trigo") return figures.trigExact({ angle: 45 });
    if (ch === "analytique") return figures.lineSlope({ xA: 0, yA: 1, xB: 4, yB: 3 });
    if (ch === "espace-droites" || ch === "parallelisme" || ch === "orthogonalite") return figures.espaceCube();
    if (ch === "stats") return figures.statsMean({ n: 8, sum: 96, xmin: 7, xmax: 18 });
    if (["reels", "degres", "polynomes"].includes(ch)) return figures.quadraticSolve({ a: 1, b: -3, c: -4 });
    if (ch === "arithmetique") return figures.euclidDiv({ a: 47, b: 8 });
    if (["vecteurs", "barycentre", "translations", "homotheties", "rotations"].includes(ch)) return figures.vectorAB({ xA: 0, yA: 0, xB: 3, yB: 2 });
    return {
      caption: "Schéma de l’activité. Calculer les questions, puis vérifier la correction.",
      svg: svg("Activité du manuel", `${axes()}${plotCurve(x => 0.15 * x * x - 2, { xmin: -6, xmax: 6, ymin: -6, ymax: 6 })}${t(70, 230, "Courbe de travail")}`)
    };
  }
};

export function drawFigure(type, data, exercise) {
  const figure = figures[type];
  if (!figure) {
    return {
      caption: "Repérer les données et écrire la relation du cours avant de calculer.",
      svg: svg("Schéma", `${axes()}${plotCurve(x => 0.2 * x, { xmin: -6, xmax: 6, ymin: -6, ymax: 6 })}${t(40, 230, "Repère de travail")}`)
    };
  }
  return figure(data, exercise);
}
