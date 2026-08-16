const steps = (values, solutionSteps) => ({ values, steps: solutionSteps });
const n = (x, digits = 4) => Number(x).toLocaleString("fr-FR", { maximumSignificantDigits: digits });

function gcd(a, b) {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) [a, b] = [b, a % b];
  return a;
}

export const solvers = {
  tvaTtc(d) {
    const ttc = d.ht * (1 + d.tva / 100);
    return steps({ ttc }, [
      ["Prix T.T.C.", `TTC = HT × (1 + t/100) = ${n(d.ht)} × (1 + ${n(d.tva)}/100) = ${n(ttc)} dinars`]
    ]);
  },
  tvaHt(d) {
    const ht = d.ttc / (1 + d.tva / 100);
    return steps({ ht }, [
      ["Prix H.T.", `HT = TTC / (1 + t/100) = ${n(d.ttc)} / (1 + ${n(d.tva)}/100) = ${n(ht)} dinars`]
    ]);
  },
  successivePercent(d) {
    const factor = (1 + d.p1 / 100) * (1 + d.p2 / 100);
    const global = (factor - 1) * 100;
    return steps({ factor, global }, [
      ["Facteur composé", `(1 + p₁/100)(1 + p₂/100) = (1 + ${n(d.p1)}/100)(1 + ${n(d.p2)}/100) = ${n(factor)}`],
      ["Pourcentage global", `p = (facteur − 1) × 100 = ${n(global)} %`]
    ]);
  },
  heronArea(d) {
    const p = (d.a + d.b + d.c) / 2;
    const area = Math.sqrt(Math.max(p * (p - d.a) * (p - d.b) * (p - d.c), 0));
    return steps({ p, area }, [
      ["Demi-périmètre", `p = (a + b + c)/2 = (${n(d.a)} + ${n(d.b)} + ${n(d.c)})/2 = ${n(p)}`],
      ["Formule de Héron", `A = √[p(p − a)(p − b)(p − c)] = ${n(area)}`]
    ]);
  },
  absEquation(d) {
    const x1 = -d.a - d.b;
    const x2 = -d.a + d.b;
    return steps({ x1, x2 }, [
      ["Définition", `|x + ${n(d.a)}| = ${n(d.b)} équivaut à x + ${n(d.a)} = ± ${n(d.b)}`],
      ["Première solution", `x₁ = −${n(d.a)} − ${n(d.b)} = ${n(x1)}`],
      ["Seconde solution", `x₂ = −${n(d.a)} + ${n(d.b)} = ${n(x2)}`]
    ]);
  },
  affineBounds(d) {
    const y1 = d.m * d.amin + d.p;
    const y2 = d.m * d.amax + d.p;
    const ymin = Math.min(y1, y2);
    const ymax = Math.max(y1, y2);
    return steps({ ymin, ymax }, [
      ["Image des bornes", `f(a) = ${n(d.m)} a + ${n(d.p)}. f(${n(d.amin)}) = ${n(y1)} et f(${n(d.amax)}) = ${n(y2)}.`],
      ["Encadrement", d.m >= 0
        ? `m ≥ 0 : l’ordre se conserve. ${n(ymin)} ≤ ${n(d.m)}a + ${n(d.p)} ≤ ${n(ymax)}.`
        : `m < 0 : l’ordre s’inverse. ${n(ymin)} ≤ ${n(d.m)}a + ${n(d.p)} ≤ ${n(ymax)}.`]
    ]);
  },
  lightTime(d) {
    const dist = d.distMkm * 1e6;
    const t = dist / d.v;
    const minutes = t / 60;
    return steps({ t, minutes }, [
      ["Distance en km", `d = ${n(d.distMkm)} × 10⁶ = ${n(dist)} km`],
      ["Temps", `t = d/v = ${n(dist)} / ${n(d.v)} = ${n(t)} s = ${n(minutes)} min`]
    ]);
  },
  scientificOrder(d) {
    const nExp = Math.floor(Math.log10(Math.abs(d.N)));
    const a = d.N / 10 ** nExp;
    const b = Math.round(a);
    const order = b * 10 ** nExp;
    return steps({ a, nExp, order }, [
      ["Déplacer la virgule", `On écrit ${n(d.N)} sous la forme a × 10^n avec 1 ≤ |a| < 10, en déplaçant la virgule.`],
      ["Écriture scientifique", `${n(d.N)} = ${n(a)} × 10^${nExp}`],
      ["Ordre de grandeur", `On arrondit a = ${n(a)} à l’unité : ${n(b)} × 10^${nExp} = ${n(order)}`]
    ]);
  },
  quadraticSolve(d) {
    const disc = d.b * d.b - 4 * d.a * d.c;
    const root = Math.sqrt(Math.max(disc, 0));
    const x1 = (-d.b - root) / (2 * d.a);
    const x2 = (-d.b + root) / (2 * d.a);
    const sum = -d.b / d.a;
    const prod = d.c / d.a;
    return steps({ disc, x1, x2, sum, prod }, [
      ["Discriminant", `Δ = b² − 4ac = ${n(d.b)}² − 4×${n(d.a)}×${n(d.c)} = ${n(disc)}`],
      ["Racines", disc > 0
        ? `x = (−b ± √Δ)/(2a) → x₁ = ${n(x1)} et x₂ = ${n(x2)}`
        : disc === 0
          ? `Δ = 0 : racine double x₀ = ${n(x1)}`
          : "Δ < 0 : pas de racine réelle."],
      ["Somme et produit", `x₁ + x₂ = −b/a = ${n(sum)} ; x₁ x₂ = c/a = ${n(prod)}`]
    ]);
  },
  resistors(d) {
    const sum = d.R;
    const prod = d.r * d.R;
    const disc = sum * sum - 4 * prod;
    const R1 = (sum + Math.sqrt(Math.max(disc, 0))) / 2;
    const R2 = (sum - Math.sqrt(Math.max(disc, 0))) / 2;
    return steps({ prod, disc, R1, R2 }, [
      ["Série et parallèle", `R₁ + R₂ = R = ${n(d.R)} Ω et 1/r = 1/R₁ + 1/R₂ donc R₁ R₂ = r R = ${n(prod)}`],
      ["Équation", `t² − ${n(sum)} t + ${n(prod)} = 0 ; Δ = ${n(disc)}`],
      ["Résistances", `R₁ = ${n(R1)} Ω et R₂ = ${n(R2)} Ω`]
    ]);
  },
  cyclists(d) {
    const closing = d.D / d.T;
    const half = d.D / 2;
    const h = d.hMin / 60;
    const Bco = h - d.T;
    const Cco = -d.T * h / 2;
    const t = (-Bco + Math.sqrt(Bco * Bco - 4 * Cco)) / 2;
    const VB = half / t;
    const VA = half / (t + h);
    return steps({ closing, t, VA, VB }, [
      ["Départ simultané", `V_A + V_B = D/T = ${n(d.D)}/${n(d.T)} = ${n(closing)} km/h`],
      ["Rencontre à mi-chemin", `Chacun parcourt ${n(half)} km. B roule ${n(t)} h, A roule ${n(t + h)} h.`],
      ["Vitesses", `V_A = ${n(VA)} km/h ; V_B = ${n(VB)} km/h`]
    ]);
  },
  squareDecrease(d) {
    const x = (d.dA + d.cut ** 2) / (2 * d.cut);
    const area = x * x;
    return steps({ x, area }, [
      ["Variation d’aire", `x² − (x − ${n(d.cut)})² = ${n(d.dA)}`],
      ["Développement", `2×${n(d.cut)} x − ${n(d.cut)}² = ${n(d.dA)}`],
      ["Côté", `x = ${n(x)} cm ; aire initiale = ${n(area)} cm²`]
    ]);
  },
  goldenRatio(d) {
    const phi = (1 + Math.sqrt(5)) / 2;
    const phi2 = phi * phi;
    const check = phi + d.shift;
    return steps({ phi, phi2, check }, [
      ["Équation", `φ² − φ − 1 = 0, φ > 0`],
      ["Racine positive", `φ = (1 + √5)/2 = ${n(phi)}`],
      ["Identité", `φ² = φ + 1 = ${n(phi2)}`]
    ]);
  },
  polyEval(d) {
    const value = d.a3 * d.x ** 3 + d.a2 * d.x ** 2 + d.a1 * d.x + d.a0;
    return steps({ value }, [
      ["Substitution", `P(${n(d.x)}) = ${n(d.a3)}(${n(d.x)})³ + ${n(d.a2)}(${n(d.x)})² + ${n(d.a1)}(${n(d.x)}) + ${n(d.a0)}`],
      ["Valeur", `P(${n(d.x)}) = ${n(value)}`]
    ]);
  },
  polyIntegerRoot(d) {
    const P = x => x ** 3 + d.a * x ** 2 + d.b * x + d.c;
    let root = NaN;
    for (let k = -20; k <= 20; k++) if (Math.abs(P(k)) < 1e-9) { root = k; break; }
    const qB = d.a + root;
    const qC = d.b + qB * root;
    return steps({ root, qB, qC }, [
      ["Racine entière", `On teste les diviseurs de ${n(d.c)}. P(${n(root)}) = 0.`],
      ["Division par x − r", `P(x) = (x − ${n(root)})(x² + ${n(qB)} x + ${n(qC)})`],
      ["Quotient", `Le trinôme associé a pour coefficients 1, ${n(qB)}, ${n(qC)}.`]
    ]);
  },
  polyKnownRoot(d) {
    const qB = d.a + d.r;
    const qC = d.b + qB * d.r;
    const PofR = d.r ** 3 + d.a * d.r ** 2 + d.b * d.r + d.c;
    return steps({ PofR, qB, qC }, [
      ["Vérification", `P(${n(d.r)}) = ${n(PofR)} (doit être nul).`],
      ["Factorisation", `P(x) = (x − ${n(d.r)})(x² + ${n(qB)} x + ${n(qC)})`]
    ]);
  },
  sumIntegers(d) {
    const s1 = d.n * (d.n + 1) / 2;
    const s2 = d.n * (d.n + 1) * (2 * d.n + 1) / 6;
    return steps({ s1, s2 }, [
      ["Somme des entiers", `S₁ = n(n + 1)/2 = ${n(d.n)}×${n(d.n + 1)}/2 = ${n(s1)}`],
      ["Somme des carrés", `S₂ = n(n + 1)(2n + 1)/6 = ${n(s2)}`]
    ]);
  },
  euclidDiv(d) {
    const q = Math.floor(d.a / d.b);
    const r = d.a - d.b * q;
    return steps({ q, r }, [
      ["Division euclidienne", `${n(d.a)} = ${n(d.b)} × q + r avec 0 ≤ r < ${n(d.b)}`],
      ["Quotient et reste", `q = ${n(q)} et r = ${n(r)} ; contrôle : ${n(d.b)}×${n(q)} + ${n(r)} = ${n(d.a)}`]
    ]);
  },
  remainderLast3(d) {
    const last = d.n % 1000;
    const r = last % d.div;
    return steps({ last, r }, [
      ["Critère", d.div === 8
        ? "Le reste modulo 8 est celui des trois derniers chiffres."
        : d.div === 25
          ? "Le reste modulo 25 est celui des deux derniers chiffres (ici on utilise les trois derniers, ce qui reste valable)."
          : `On réduit n modulo ${n(d.div)}.`],
      ["Réduction", `n ≡ ${n(last)} (mod 1000) puis ${n(last)} ≡ ${n(r)} (mod ${n(d.div)})`]
    ]);
  },
  remainderDigits(d) {
    const digits = String(Math.round(d.n)).split("").map(Number);
    const sum = digits.reduce((s, x) => s + x, 0);
    const r = sum % d.div;
    return steps({ sum, r }, [
      ["Somme des chiffres", `${digits.join(" + ")} = ${n(sum)}`],
      ["Reste", `n ≡ ${n(sum)} ≡ ${n(r)} (mod ${n(d.div)})`]
    ]);
  },
  barcodeCheck(d) {
    const s = String(Math.round(d.prefix)).padStart(12, "0");
    const digits = s.split("").map(Number);
    let odd = 0, even = 0;
    digits.forEach((v, i) => { if (i % 2 === 0) odd += v; else even += v; });
    const check = (10 - (odd + 3 * even) % 10) % 10;
    return steps({ odd, even, check }, [
      ["Positions impaires", `Somme (rangs 1, 3, …, 11) = ${n(odd)}`],
      ["Positions paires", `Somme (rangs 2, 4, …, 12) = ${n(even)} ; triple = ${n(3 * even)}`],
      ["Clé", `odd + 3×even + c ≡ 0 (mod 10) → c = ${n(check)}`]
    ]);
  },
  gcd3(d) {
    const g = gcd(gcd(d.a, d.b), d.c);
    const nBoxes = (d.a / g) * (d.b / g) * (d.c / g);
    return steps({ g, nBoxes }, [
      ["PGCD", `a = PGCD(${n(d.a)} ; ${n(d.b)} ; ${n(d.c)}) = ${n(g)} cm`],
      ["Nombre de cubes", `(L/a)×(ℓ/a)×(h/a) = ${n(nBoxes)}`]
    ]);
  },
  vectorAB(d) {
    const x = d.xB - d.xA;
    const y = d.yB - d.yA;
    const nrm = Math.hypot(x, y);
    return steps({ x, y, nrm }, [
      ["Composantes", `AB⃗ = (${n(d.xB)} − ${n(d.xA)} ; ${n(d.yB)} − ${n(d.yA)}) = (${n(x)} ; ${n(y)})`],
      ["Norme", `|AB⃗| = √(x² + y²) = ${n(nrm)}`]
    ]);
  },
  detColinear(d) {
    const det = d.x * d.yp - d.xp * d.y;
    return steps({ det }, [
      ["Déterminant", `det(u⃗, v⃗) = x y' − x' y = ${n(d.x)}×${n(d.yp)} − ${n(d.xp)}×${n(d.y)} = ${n(det)}`],
      ["Colinéarité", Math.abs(det) < 1e-9 ? "det = 0 : les vecteurs sont colinéaires." : "det ≠ 0 : les vecteurs ne sont pas colinéaires."]
    ]);
  },
  dotOrtho(d) {
    const dot = d.x * d.xp + d.y * d.yp;
    return steps({ dot }, [
      ["Produit scalaire", `u⃗ · v⃗ = xx' + yy' = ${n(d.x)}×${n(d.xp)} + ${n(d.y)}×${n(d.yp)} = ${n(dot)}`],
      ["Orthogonalité", Math.abs(dot) < 1e-9 ? "Le produit scalaire est nul : u⃗ ⊥ v⃗." : "Le produit scalaire n’est pas nul : les vecteurs ne sont pas orthogonaux."]
    ]);
  },
  parallelogramD(d) {
    const xD = d.xA + d.xC - d.xB;
    const yD = d.yA + d.yC - d.yB;
    return steps({ xD, yD }, [
      ["Relation vectorielle", `AB⃗ = DC⃗ ⇔ D = A + C − B`],
      ["Coordonnées", `D (${n(xD)} ; ${n(yD)})`]
    ]);
  },
  bary1d(d) {
    const g = (d.alpha * d.xA + d.beta * d.xB) / (d.alpha + d.beta);
    const k = d.beta / (d.alpha + d.beta);
    return steps({ g, k }, [
      ["Définition", `α GA⃗ + β GB⃗ = 0  ⇔  AG⃗ = β/(α+β) AB⃗`],
      ["Abscisse", `x_G = (α x_A + β x_B)/(α+β) = ${n(g)}`],
      ["Coefficient", `AG⃗ = ${n(k)} AB⃗`]
    ]);
  },
  bary2d(d) {
    const s = d.alpha + d.beta + d.gamma;
    const xG = (d.alpha * d.xA + d.beta * d.xB + d.gamma * d.xC) / s;
    const yG = (d.alpha * d.yA + d.beta * d.yB + d.gamma * d.yC) / s;
    return steps({ xG, yG }, [
      ["Somme des masses", `α + β + γ = ${n(s)} ≠ 0`],
      ["Coordonnées", `G = (αA + βB + γC)/s  →  (${n(xG)} ; ${n(yG)})`]
    ]);
  },
  translation(d) {
    const xM = d.x + d.vx;
    const yM = d.y + d.vy;
    return steps({ xM, yM }, [
      ["Définition", `M' = t_v⃗(M)  ⇔  MM'⃗ = v⃗`],
      ["Image", `M' (${n(xM)} ; ${n(yM)})`]
    ]);
  },
  homothety(d) {
    const xM = d.xO + d.k * (d.x - d.xO);
    const yM = d.yO + d.k * (d.y - d.yO);
    const om = Math.hypot(d.x - d.xO, d.y - d.yO);
    const mm = Math.abs(d.k - 1) * om;
    return steps({ xM, yM, mm }, [
      ["Définition", `OM'⃗ = k OM⃗ avec k = ${n(d.k)}`],
      ["Image", `M' (${n(xM)} ; ${n(yM)})`],
      ["Distance MM'", `MM' = |k − 1| · OM = ${n(mm)}`]
    ]);
  },
  homothetyScale(d) {
    const perim = Math.abs(d.k) * d.p;
    const area = d.k * d.k * d.a;
    return steps({ perim, area }, [
      ["Périmètre", `p' = |k| p = ${n(Math.abs(d.k))} × ${n(d.p)} = ${n(perim)}`],
      ["Aire", `A' = k² A = ${n(d.k)}² × ${n(d.a)} = ${n(area)}`]
    ]);
  },
  rotation90(d) {
    const dx = d.x - d.xO, dy = d.y - d.yO;
    const xM = d.xO - dy;
    const yM = d.yO + dx;
    return steps({ xM, yM }, [
      ["Quart de tour direct", `Autour de O, (x − x_O ; y − y_O) ↦ (−(y − y_O) ; x − x_O)`],
      ["Image", `M' (${n(xM)} ; ${n(yM)})`]
    ]);
  },
  rotationAngle(d) {
    const th = d.angle * Math.PI / 180;
    const dx = d.x - d.xO, dy = d.y - d.yO;
    const xM = d.xO + dx * Math.cos(th) - dy * Math.sin(th);
    const yM = d.yO + dx * Math.sin(th) + dy * Math.cos(th);
    const om = Math.hypot(dx, dy);
    const stepsText = d.angle === 180
      ? [
          ["Demi-tour", `Rotation d’angle 180° = symétrie centrale de centre O : M' = 2O − M.`],
          ["Image", `M' (${n(xM)} ; ${n(yM)})`],
          ["Contrôle", `OM' = OM = ${n(om)}`]
        ]
      : d.angle === 90
        ? [
            ["Quart de tour direct", `Autour de O, (x − x_O ; y − y_O) ↦ (−(y − y_O) ; x − x_O).`],
            ["Image", `M' (${n(xM)} ; ${n(yM)})`],
            ["Contrôle", `OM' = OM = ${n(om)}`]
          ]
        : [
            ["Définition du cours", `OM' = OM et l’angle MOM' vaut ${n(d.angle)}°.`],
            ["Image", `M' (${n(xM)} ; ${n(yM)})`],
            ["Contrôle", `OM' = OM = ${n(om)}`]
          ];
    return steps({ xM, yM, om }, stepsText);
  },
  fixed(exercise) {
    const values = {};
    for (const q of exercise.questions || []) values[q.key] = q.answer;
    const raw = exercise.steps || [["Correction", "Relire l’énoncé du manuel et la synthèse du chapitre."]];
    const list = raw.map(s => Array.isArray(s) ? s : ["Étape", String(s)]);
    return { values, steps: list };
  }
};

export function solve(exercise, data) {
  const solver = solvers[exercise.solver];
  if (!solver) throw new Error(`Solveur inconnu : ${exercise.solver}`);
  if (exercise.solver === "fixed") return solvers.fixed(exercise);
  return solver(data);
}

export function isClose(value, target, relativeTolerance = 0.025, absoluteTolerance = 1e-8) {
  return Number.isFinite(value) && Math.abs(value - target) <= Math.max(absoluteTolerance, Math.abs(target) * relativeTolerance);
}
