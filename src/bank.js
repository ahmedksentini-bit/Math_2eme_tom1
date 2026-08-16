const BANDS = [
  { id: "easy", label: "Faciles", difficulty: 1 },
  { id: "medium", label: "Moyens", difficulty: 2 },
  { id: "hard", label: "Difficiles", difficulty: 3 },
  { id: "puzzle", label: "Casse-tête", difficulty: 4 }
];

export { BANDS };

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a += 0x6D2B79F5;
    let t = a;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function snap(value, step) {
  const s = step || 1;
  return Number((Math.round(value / s) * s).toFixed(8));
}

function between(rng, min, max, step = 1) {
  return snap(min + rng() * (max - min), step);
}

function pick(rng, arr) {
  return arr[Math.floor(rng() * arr.length) % arr.length];
}

function shuffle(rng, list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const ST = {
  tvaTtc: "Un article est vendu au prix hors taxes indiqué ci-dessous. On lui applique un taux de T.V.A. t. D’après le cours du chapitre 1, le prix toutes taxes comprises s’obtient en multipliant le prix hors taxes par le coefficient 1 + t/100 (on ne rajoute pas t dinars). Écrire d’abord la relation littérale, puis calculer le prix T.T.C.",
  tvaHt: "Un article est vendu au prix T.T.C. indiqué, au taux de T.V.A. donné. On cherche le prix hors taxes. D’après le cours, HT = TTC / (1 + t/100) : on divise par le coefficient, on ne retranche pas t %. Écrire la relation, puis calculer le H.T.",
  successivePercent: "Un prix subit deux variations successives, de p₁ % puis de p₂ % (une hausse est positive, une baisse est négative). On demande le coefficient composé, puis le pourcentage global. On multiplie les coefficients 1 + p/100, on n’additionne jamais les taux.",
  heronArea: "On considère un triangle dont les trois côtés a, b et c sont donnés. On demande le demi-périmètre p = (a+b+c)/2, puis l’aire A par la formule de Héron du chapitre 1 : A = √[p(p−a)(p−b)(p−c)]. Les côtés doivent vérifier l’inégalité triangulaire.",
  absEquation: "On cherche les réels x tels que |x + a| = b. Si b < 0, il n’y a pas de solution. Sinon, d’après le cours, |X| = b signifie X = b ou X = −b. Ici X = x + a : donner les deux solutions, sans oublier le cas « moins ».",
  affineBounds: "Un réel a parcourt l’intervalle [a_min ; a_max]. On demande un encadrement de l’expression affine m a + p. Si m ≥ 0, l’ordre se conserve ; si m < 0, l’ordre s’inverse. On calcule les images des deux bornes, puis on range du plus petit au plus grand.",
  lightTime: "La distance Terre–Soleil est donnée en millions de km, la vitesse de la lumière en km/s (activité 50 du chapitre 1). Convertir la distance en km, puis calculer le temps de parcours t = d/v en secondes et en minutes. Seulement une division après mise en unités cohérentes.",
  scientificOrder: "On donne un réel N. Écrire N sous la forme a × 10ⁿ avec 1 ≤ |a| < 10, puis donner son ordre de grandeur (activité 47). Méthode du cours : on déplace la virgule jusqu’à obtenir a entre 1 et 10 ; l’ordre de grandeur arrondit a à l’unité en gardant la même puissance de 10.",
  quadraticSolve: "Résoudre dans IR l’équation ax² + bx + c = 0 (a ≠ 0). Calculer le discriminant Δ = b² − 4ac, les racines réelles s’il y en a, leur somme et leur produit. Somme = −b/a et produit = c/a se calculent même sans √Δ.",
  resistors: "Deux résistances inconnues R₁ et R₂ ont pour association série R et pour association parallèle r. D’après le cours, R₁ et R₂ sont les racines de t² − R t + r R = 0. Calculer le produit R₁ R₂, puis R₁ et R₂ (on prendra R₁ ≥ R₂).",
  cyclists: "Deux cyclistes partent de deux villes distantes de D km. S’ils partent ensemble, ils se rencontrent après T heures. Si A part quelques minutes trop tôt, la rencontre a lieu à mi-chemin. Convertir les minutes en heures, écrire (V_A + V_B) T = D, puis calculer V_A et V_B.",
  squareDecrease: "Existe-t-il un carré de côté x tel que, si l’on diminue chaque côté de h cm, l’aire diminue de ΔA cm² ? Traduire par x² − (x − h)² = ΔA, développer (sans oublier −h²), puis isoler x. Il faut x > h.",
  goldenRatio: "Le nombre d’or φ du chapitre 2 est la racine positive de φ² = φ + 1. Se ramener à l’équation du second degré φ² − φ − 1 = 0, calculer φ et φ², et vérifier l’identité φ² = φ + 1.",
  polyEval: "Soit P le polynôme de degré 3 donné par ses coefficients. Calculer P(x₀) en substituant. On peut grouper les puissances : ((a₃ x₀ + a₂) x₀ + a₁) x₀ + a₀. Si le résultat est 0, x₀ est une racine.",
  polyIntegerRoot: "Soit P(x) = x³ + a x² + b x + c. Chercher une racine entière (elle divise le terme constant), puis factoriser P(x) = (x − r)(x² + q_B x + q_C) par identification des coefficients.",
  polyKnownRoot: "Soit A(x) = x³ + a x² + b x + c. Vérifier que r est une racine en calculant A(r), puis factoriser A(x) = (x − r)(x² + q_B x + q_C) par identification des coefficients.",
  sumIntegers: "n est un entier naturel non nul. Calculer S₁ = 1 + 2 + … + n et S₂ = 1² + 2² + … + n² à l’aide des formules du chapitre 3 : S₁ = n(n+1)/2 et S₂ = n(n+1)(2n+1)/6. Attention : (S₁)² n’est pas S₂.",
  euclidDiv: "Effectuer la division euclidienne de a par b (b > 0) : trouver l’unique couple d’entiers (q, r) tel que a = b q + r et 0 ≤ r < b. Contrôler ensuite que b q + r retrouve a.",
  remainderLast3: "Déterminer le reste de la division euclidienne de n par 8, en n’utilisant que les trois derniers chiffres (car 1000 = 8 × 125). On ne divise pas tout n, seulement ce petit entier.",
  remainderDigits: "Déterminer le reste de la division euclidienne de n par 9 à l’aide de la somme de ses chiffres (critère du chapitre 4). Un entier et la somme de ses chiffres ont le même reste modulo 9.",
  barcodeCheck: "Les douze premiers chiffres d’un code-barres EAN-13 sont donnés (culture du chapitre 4). Rang depuis la gauche : somme des rangs impairs + triple des rangs pairs + clé ≡ 0 (mod 10). Déterminer la clé.",
  gcd3: "Une caisse de dimensions L, ℓ, h (en cm) doit être remplie par des cubes d’arête entière maximale, sans vide ni débordement (exercice 30 du chapitre 4). L’arête est le PGCD des trois dimensions ; le nombre de cubes est (L/a)(ℓ/a)(h/a).",
  vectorAB: "Le plan est muni d’un repère orthonormé. Les points A et B sont donnés. Déterminer les composantes de AB⃗ = (x_B − x_A ; y_B − y_A), puis sa norme |AB⃗| = √(x² + y²). Attention : BA⃗ = −AB⃗.",
  detColinear: "Dans une base du plan, deux vecteurs sont donnés par leurs composantes. Calculer det = x y' − x' y. D’après le cours, les vecteurs sont colinéaires si et seulement si ce déterminant est nul. On n’utilise pas le déterminant pour un angle droit.",
  dotOrtho: "Le plan est muni d’une base orthonormée. Deux vecteurs sont donnés. Calculer le produit scalaire x x' + y y'. Ils sont orthogonaux si et seulement si ce produit est nul. On n’utilise pas le déterminant pour la perpendicularité.",
  parallelogramD: "Le plan est muni d’un repère. Trois points A, B, C sont donnés, dans cet ordre. Déterminer D pour que ABCD soit un parallélogramme : AB⃗ = DC⃗, donc D = A + C − B. Contrôler que les milieux de [AC] et [BD] coïncident.",
  bary1d: "Sur une droite, A et B ont des abscisses données. G est le barycentre de (A, α) et (B, β), avec α + β ≠ 0. Déterminer l’abscisse de G : x_G = (α x_A + β x_B)/(α+β), et le coefficient k tel que AG⃗ = k AB⃗, avec k = β/(α+β). G est sur [AB] si α et β sont de même signe.",
  bary2d: "Dans un repère, trois points A, B, C sont pondérés par des masses α, β, γ (somme non nulle). G est leur barycentre. Déterminer les coordonnées de G, moyennes pondérées des coordonnées. Si les masses sont égales, G est l’isobarycentre (centre de gravité du triangle).",
  translation: "t est la translation de vecteur v⃗ donné. Un point M est donné. Déterminer l’image M' : par définition MM'⃗ = v⃗, donc on ajoute les composantes. Tous les points glissent du même vecteur : M'N'⃗ = MN⃗. Il n’y a pas de centre.",
  homothety: "h est l’homothétie de centre O et de rapport k. Un point M est donné. Déterminer l’image M' définie par OM'⃗ = k OM⃗, puis la distance MM' = |k − 1| · OM. Si k < 0, M' est de l’autre côté de O.",
  homothetyScale: "Une homothétie de rapport k transforme une figure de périmètre p et d’aire A. D’après le cours du chapitre 8, les longueurs sont multipliées par |k| et les aires par k². Calculer le périmètre p' et l’aire A' de l’image. Aire au quart ⇔ |k| = 1/2, pas k = 1/4.",
  rotation90: "Le plan est muni d’un repère orthonormé direct. r est le quart de tour direct de centre O. Un point M est donné. Déterminer M' : OM' = OM et l’angle MOM' vaut 90°. Autour de l’origine, (x ; y) ↦ (−y ; x). Autour d’un centre O, on applique cette règle au vecteur OM⃗.",
  rotationAngle: "r est la rotation directe de centre O et d’angle α (cas du cours : 90° ou 180°). Un point M est donné. Déterminer M' en utilisant la définition : OM' = OM et l’angle MOM' vaut α. Pour 90°, quart de tour ; pour 180°, M' = 2O − M."
};

function item(chapter, band, difficulty, solver, title, statement, variables, questions, index) {
  return {
    id: `${chapter}_${band}_${solver}_${index + 1}`,
    chapter,
    solver,
    title,
    difficulty,
    band,
    generated: true,
    statement: ST[solver] || statement,
    variables,
    questions
  };
}

function v(key, label, unit, value, min, max, step) {
  return { key, label, unit, value, min, max, step };
}

function heronSides(rng, scaleMin, scaleMax) {
  const s = between(rng, scaleMin, scaleMax, 1);
  return { a: 3 * s, b: 4 * s, c: 5 * s };
}

function quadraticNice(rng) {
  const x1 = between(rng, -6, -1, 1);
  const x2 = between(rng, 1, 6, 1);
  const a = pick(rng, [1, 2, 3, 4]);
  const b = -a * (x1 + x2);
  const c = a * x1 * x2;
  return { a, b, c, x1: Math.min(x1, x2), x2: Math.max(x1, x2) };
}

const Q = {
  ttc: [{ key: "ttc", label: "Prix T.T.C.", unit: "D" }],
  ht: [{ key: "ht", label: "Prix H.T.", unit: "D" }],
  pct: [{ key: "factor", label: "Coefficient composé", unit: "—" }, { key: "global", label: "Pourcentage global", unit: "%" }],
  heron: [{ key: "p", label: "Demi-périmètre p", unit: "cm" }, { key: "area", label: "Aire A", unit: "cm²" }],
  abs: [{ key: "x1", label: "Solution x₁", unit: "—" }, { key: "x2", label: "Solution x₂", unit: "—" }],
  bounds: [{ key: "ymin", label: "Minimum", unit: "—" }, { key: "ymax", label: "Maximum", unit: "—" }],
  light: [{ key: "t", label: "Temps t", unit: "s" }, { key: "minutes", label: "Temps en minutes", unit: "min" }],
  sci: [{ key: "a", label: "Mantisse a", unit: "—" }, { key: "nExp", label: "Exposant n", unit: "—" }, { key: "order", label: "Ordre de grandeur", unit: "—" }],
  quad: [{ key: "disc", label: "Δ", unit: "—" }, { key: "x1", label: "x₁", unit: "—" }, { key: "x2", label: "x₂", unit: "—" }, { key: "sum", label: "Somme", unit: "—" }, { key: "prod", label: "Produit", unit: "—" }],
  res: [{ key: "prod", label: "Produit R₁R₂", unit: "Ω²" }, { key: "R1", label: "R₁", unit: "Ω" }, { key: "R2", label: "R₂", unit: "Ω" }],
  cyc: [{ key: "closing", label: "V_A + V_B", unit: "km/h" }, { key: "VA", label: "V_A", unit: "km/h" }, { key: "VB", label: "V_B", unit: "km/h" }],
  sq: [{ key: "x", label: "Côté x", unit: "cm" }, { key: "area", label: "Aire", unit: "cm²" }],
  phi: [{ key: "phi", label: "φ", unit: "—" }, { key: "phi2", label: "φ²", unit: "—" }],
  peval: [{ key: "value", label: "P(x₀)", unit: "—" }],
  proot: [{ key: "root", label: "Racine r", unit: "—" }, { key: "qB", label: "q_B", unit: "—" }, { key: "qC", label: "q_C", unit: "—" }],
  pknown: [{ key: "PofR", label: "P(r)", unit: "—" }, { key: "qB", label: "q_B", unit: "—" }, { key: "qC", label: "q_C", unit: "—" }],
  sums: [{ key: "s1", label: "S₁", unit: "—" }, { key: "s2", label: "S₂", unit: "—" }],
  eu: [{ key: "q", label: "Quotient q", unit: "—" }, { key: "r", label: "Reste r", unit: "—" }],
  last3: [{ key: "last", label: "Derniers chiffres", unit: "—" }, { key: "r", label: "Reste", unit: "—" }],
  digits: [{ key: "sum", label: "Somme des chiffres", unit: "—" }, { key: "r", label: "Reste", unit: "—" }],
  ean: [{ key: "odd", label: "Σ rangs impairs", unit: "—" }, { key: "even", label: "Σ rangs pairs", unit: "—" }, { key: "check", label: "Clé", unit: "—" }],
  gcd: [{ key: "g", label: "PGCD / arête", unit: "cm" }, { key: "nBoxes", label: "Nombre de cubes", unit: "—" }],
  ab: [{ key: "x", label: "x de AB⃗", unit: "—" }, { key: "y", label: "y de AB⃗", unit: "—" }, { key: "nrm", label: "|AB⃗|", unit: "—" }],
  det: [{ key: "det", label: "Déterminant", unit: "—" }],
  dot: [{ key: "dot", label: "Produit scalaire", unit: "—" }],
  para: [{ key: "xD", label: "x_D", unit: "—" }, { key: "yD", label: "y_D", unit: "—" }],
  b1: [{ key: "g", label: "Abscisse de G", unit: "—" }, { key: "k", label: "k = β/(α+β)", unit: "—" }],
  b2: [{ key: "xG", label: "x_G", unit: "—" }, { key: "yG", label: "y_G", unit: "—" }],
  tr: [{ key: "xM", label: "x_{M'}", unit: "—" }, { key: "yM", label: "y_{M'}", unit: "—" }],
  hom: [{ key: "xM", label: "x_{M'}", unit: "—" }, { key: "yM", label: "y_{M'}", unit: "—" }, { key: "mm", label: "MM'", unit: "—" }],
  hsc: [{ key: "perim", label: "p'", unit: "—" }, { key: "area", label: "A'", unit: "—" }],
  rot: [{ key: "xM", label: "x_{M'}", unit: "—" }, { key: "yM", label: "y_{M'}", unit: "—" }],
  rota: [{ key: "xM", label: "x_{M'}", unit: "—" }, { key: "yM", label: "y_{M'}", unit: "—" }, { key: "om", label: "OM", unit: "—" }]
};

const makers = {
  reels: {
    easy: (rng, i) => {
      const k = i % 10;
      if (k === 0) {
        const ht = between(rng, 20, 80, 2), tva = pick(rng, [7, 10, 13, 17, 19]);
        return item("reels", "easy", 1, "tvaTtc", `T.T.C. n°${i + 1}`, "Calculer le prix T.T.C. à partir du H.T. et du taux de T.V.A.", [v("ht", "H.T.", "D", ht, 20, 80, 2), v("tva", "T.V.A.", "%", tva, 7, 19, 1)], Q.ttc, i);
      }
      if (k === 1) {
        const tva = 17, ht = between(rng, 20, 60, 2), ttc = Number((ht * 1.17).toFixed(2));
        return item("reels", "easy", 1, "tvaHt", `H.T. n°${i + 1}`, "Retrouver le prix hors taxes.", [v("ttc", "T.T.C.", "D", ttc, 23, 80, 0.01), v("tva", "T.V.A.", "%", tva, 17, 17, 1)], Q.ht, i);
      }
      if (k === 2) {
        const a = between(rng, 1, 5, 1), b = between(rng, 2, 8, 1);
        return item("reels", "easy", 1, "absEquation", `|x + a| = b  n°${i + 1}`, "Résoudre dans IR l’équation |x + a| = b.", [v("a", "a", "—", a, 1, 5, 1), v("b", "b", "—", b, 2, 8, 1)], Q.abs, i);
      }
      if (k === 3) {
        const p1 = pick(rng, [5, 10, 15]), p2 = pick(rng, [10, 20, 25]);
        return item("reels", "easy", 1, "successivePercent", `Hausses successives n°${i + 1}`, "Deux hausses successives. Quel est le pourcentage global ?", [v("p1", "p₁", "%", p1, 5, 20, 5), v("p2", "p₂", "%", p2, 5, 25, 5)], Q.pct, i);
      }
      if (k === 4) {
        const { a, b, c } = heronSides(rng, 2, 4);
        return item("reels", "easy", 1, "heronArea", `Héron (3-4-5) n°${i + 1}`, "Calculer l’aire d’un triangle rectangle de côtés a, b, c par Héron.", [v("a", "a", "cm", a, 6, 12, 3), v("b", "b", "cm", b, 8, 16, 4), v("c", "c", "cm", c, 10, 20, 5)], Q.heron, i);
      }
      if (k === 5) {
        const N = between(rng, 2, 9, 1) * 10 ** between(rng, 4, 6, 1);
        return item("reels", "easy", 1, "scientificOrder", `Écriture scientifique n°${i + 1}`, "Écrire N = a × 10ⁿ et donner l’ordre de grandeur.", [v("N", "N", "—", N, 10000, 9e6, 1000)], Q.sci, i);
      }
      if (k === 6) {
        const amin = -3, amax = 4, m = 2, p = 1;
        return item("reels", "easy", 1, "affineBounds", `Encadrement n°${i + 1}`, "a ∈ [a_min ; a_max]. Encadrer ma + p (m > 0 : l’ordre se conserve).", [v("amin", "a_min", "—", amin, -4, -1, 1), v("amax", "a_max", "—", amax, 2, 6, 1), v("m", "m", "—", m, 1, 3, 1), v("p", "p", "—", p, 0, 5, 1)], Q.bounds, i);
      }
      if (k === 7) {
        const dist = pick(rng, [150, 140, 160]), vel = 300000;
        return item("reels", "easy", 1, "lightTime", `Lumière n°${i + 1}`, "Temps de parcours d’un rayon à vitesse c.", [v("distMkm", "Distance", "10⁶ km", dist, 140, 160, 5), v("v", "v", "km/s", vel, 300000, 300000, 1000)], Q.light, i);
      }
      if (k === 8) {
        const ht = between(rng, 40, 100, 5), tva = 10;
        return item("reels", "easy", 1, "tvaTtc", `T.V.A. 10 % n°${i + 1}`, "T.V.A. à 10 %. Calculer le T.T.C.", [v("ht", "H.T.", "D", ht, 40, 100, 5), v("tva", "T.V.A.", "%", tva, 10, 10, 1)], Q.ttc, i);
      }
      const a = between(rng, 0, 4, 1), b = between(rng, 3, 7, 1);
      return item("reels", "easy", 1, "absEquation", `Valeur absolue n°${i + 1}`, "|x + a| = b. Donner les deux solutions.", [v("a", "a", "—", a, 0, 4, 1), v("b", "b", "—", b, 3, 7, 1)], Q.abs, i);
    },
    medium: (rng, i) => {
      const k = i % 10;
      if (k < 3) {
        const p1 = pick(rng, [10, 15, 20]), p2 = pick(rng, [-10, -20, 25]);
        return item("reels", "medium", 2, "successivePercent", `Variations composées n°${i + 1}`, "Deux variations successives (une hausse ou une baisse). Coefficient puis pourcentage global.", [v("p1", "p₁", "%", p1, 10, 20, 5), v("p2", "p₂", "%", p2, -20, 25, 5)], Q.pct, i);
      }
      if (k < 6) {
        const amin = between(rng, -4, -1, 1), amax = between(rng, 2, 5, 1), m = pick(rng, [-3, -2, -1]), p = between(rng, 2, 8, 1);
        return item("reels", "medium", 2, "affineBounds", `Ordre inversé n°${i + 1}`, "m < 0 : l’ordre s’inverse. Encadrer ma + p.", [v("amin", "a_min", "—", amin, -5, -1, 1), v("amax", "a_max", "—", amax, 2, 6, 1), v("m", "m", "—", m, -4, -1, 1), v("p", "p", "—", p, 1, 9, 1)], Q.bounds, i);
      }
      const { a, b, c } = heronSides(rng, 3, 6);
      return item("reels", "medium", 2, "heronArea", `Héron n°${i + 1}`, "Triangle de côtés a, b, c. Demi-périmètre puis aire.", [v("a", "a", "cm", a, 9, 18, 3), v("b", "b", "cm", b, 12, 24, 4), v("c", "c", "cm", c, 15, 30, 5)], Q.heron, i);
    },
    hard: (rng, i) => {
      const k = i % 10;
      if (k < 4) {
        const amin = -2, amax = 3, m = -3, p = 5;
        return item("reels", "hard", 3, "affineBounds", `Encadrement type manuel n°${i + 1}`, "Comme l’activité 19 : a ∈ [a_min ; a_max], encadrer ma + p.", [v("amin", "a_min", "—", amin, -3, -1, 1), v("amax", "a_max", "—", amax, 2, 4, 1), v("m", "m", "—", m, -4, -2, 1), v("p", "p", "—", p, 3, 8, 1)], Q.bounds, i);
      }
      if (k < 7) {
        const p1 = 10, p2 = 20;
        return item("reels", "hard", 3, "successivePercent", `+10 % puis +20 % n°${i + 1}`, "Montrer que le global n’est pas 30 %. Calculer le vrai pourcentage.", [v("p1", "p₁", "%", p1, 10, 15, 5), v("p2", "p₂", "%", p2, 15, 25, 5)], Q.pct, i);
      }
      const { a, b, c } = heronSides(rng, 5, 8);
      return item("reels", "hard", 3, "heronArea", `Grand triangle n°${i + 1}`, "Contrôler Héron avec un 3-4-5 agrandi (aire = ab/2 aussi).", [v("a", "a", "cm", a, 15, 24, 3), v("b", "b", "cm", b, 20, 32, 4), v("c", "c", "cm", c, 25, 40, 5)], Q.heron, i);
    },
    puzzle: (rng, i) => {
      const k = i % 10;
      if (k < 3) {
        const N = between(rng, 11, 89, 1) * 10 ** between(rng, 5, 7, 1) / 10;
        return item("reels", "puzzle", 4, "scientificOrder", `Ordre de grandeur n°${i + 1}`, "Mantisse non entière. Écriture scientifique puis ordre de grandeur (arrondi à l’unité).", [v("N", "N", "—", N, 1e5, 9e7, 100)], Q.sci, i);
      }
      if (k < 6) {
        const a = between(rng, 2, 7, 1), b = between(rng, 5, 12, 1);
        return item("reels", "puzzle", 4, "absEquation", `Deux points sur la droite n°${i + 1}`, "|x + a| = b : les solutions sont à distance b de −a. Les calculer.", [v("a", "a", "—", a, 2, 7, 1), v("b", "b", "—", b, 5, 12, 1)], Q.abs, i);
      }
      const p1 = 20, p2 = -10;
      return item("reels", "puzzle", 4, "successivePercent", `Hausse puis baisse n°${i + 1}`, "Une hausse suivie d’une baisse. Le prix revient-il au départ ? Calculer le global.", [v("p1", "p₁", "%", p1, 10, 30, 5), v("p2", "p₂", "%", p2, -25, -5, 5)], Q.pct, i);
    }
  },
  degres: {
    easy: (rng, i) => {
      const q = quadraticNice(rng);
      return item("degres", "easy", 1, "quadraticSolve", `Trinôme n°${i + 1}`, "Résoudre ax² + bx + c = 0. Δ, racines, somme et produit.", [v("a", "a", "—", q.a, 1, 4, 1), v("b", "b", "—", q.b, -20, 20, 1), v("c", "c", "—", q.c, -40, 40, 1)], Q.quad, i);
    },
    medium: (rng, i) => {
      const k = i % 10;
      if (k < 5) {
        const cut = between(rng, 2, 5, 1), dA = between(rng, 8, 24, 4);
        return item("degres", "medium", 2, "squareDecrease", `Carré diminué n°${i + 1}`, "On diminue le côté de h, l’aire de ΔA. Trouver le côté initial.", [v("cut", "h", "cm", cut, 2, 5, 1), v("dA", "ΔA", "cm²", dA, 8, 24, 4)], Q.sq, i);
      }
      const R = pick(rng, [2.5, 3, 4, 5]), r = pick(rng, [0.4, 0.5, 0.6, 0.8]);
      return item("degres", "medium", 2, "resistors", `Résistors n°${i + 1}`, "Série R, parallèle r. Trouver R₁ et R₂ (racines de t² − R t + rR = 0).", [v("R", "R", "Ω", R, 2, 6, 0.5), v("r", "r", "Ω", r, 0.4, 1.2, 0.2)], Q.res, i);
    },
    hard: (rng, i) => {
      if (i % 2 === 0) {
        return item("degres", "hard", 3, "cyclists", `Cyclistes n°${i + 1}`, "Deux cyclistes, départ décalé, rencontre à mi-chemin. Vitesses moyennes.", [v("D", "D", "km", 132, 132, 132, 1), v("T", "T", "h", 3, 3, 3, 0.5), v("hMin", "Avance", "min", 33, 33, 33, 1)], Q.cyc, i);
      }
      const q = quadraticNice(rng);
      return item("degres", "hard", 3, "quadraticSolve", `Somme et produit n°${i + 1}`, "Calculer Δ et les racines, puis vérifier S = −b/a et P = c/a.", [v("a", "a", "—", q.a, 1, 4, 1), v("b", "b", "—", q.b, -24, 24, 1), v("c", "c", "—", q.c, -48, 48, 1)], Q.quad, i);
    },
    puzzle: (rng, i) => {
      if (i % 3 === 0) return item("degres", "puzzle", 4, "goldenRatio", `Nombre d’or n°${i + 1}`, "φ² = φ + 1, φ > 0. Calculer φ et φ².", [v("shift", "constante", "—", 1, 1, 1, 1)], Q.phi, i);
      if (i % 3 === 1) return item("degres", "puzzle", 4, "cyclists", `Rencontre à mi-chemin n°${i + 1}`, "Problème du manuel : D = 132 km, 3 h ensemble, A part 33 min trop tôt.", [v("D", "D", "km", 132, 132, 132, 1), v("T", "T", "h", 3, 3, 3, 0.5), v("hMin", "Avance", "min", 33, 33, 33, 1)], Q.cyc, i);
      const R = 2.5, r = 0.4;
      return item("degres", "puzzle", 4, "resistors", `R = 2,5 Ω et r = 0,4 Ω n°${i + 1}`, "Données du cours. R₁ et R₂ sont 2 Ω et 0,5 Ω : le retrouver par le trinôme.", [v("R", "R", "Ω", R, 2.5, 2.5, 0.5), v("r", "r", "Ω", r, 0.4, 0.4, 0.2)], Q.res, i);
    }
  },
  polynomes: {
    easy: (rng, i) => {
      const x = between(rng, -2, 3, 1);
      return item("polynomes", "easy", 1, "polyEval", `P(x₀) n°${i + 1}`, "Évaluer P(x) = x³ + 6x² + 12x − 56 en x₀.", [v("a3", "a₃", "—", 1, 1, 1, 1), v("a2", "a₂", "—", 6, 6, 6, 1), v("a1", "a₁", "—", 12, 12, 12, 1), v("a0", "a₀", "—", -56, -56, -56, 1), v("x", "x₀", "—", x, -2, 3, 1)], Q.peval, i);
    },
    medium: (rng, i) => {
      const n = between(rng, 5, 15, 1);
      return item("polynomes", "medium", 2, "sumIntegers", `S₁ et S₂ n°${i + 1}`, "Calculer 1+…+n et 1²+…+n².", [v("n", "n", "—", n, 4, 20, 1)], Q.sums, i);
    },
    hard: (rng, i) => item("polynomes", "hard", 3, "polyIntegerRoot", `Racine entière n°${i + 1}`, "P(x) = x³ + 6x² + 12x − 56. Trouver une racine entière puis le quotient.", [v("a", "a", "—", 6, 6, 6, 1), v("b", "b", "—", 12, 12, 12, 1), v("c", "c", "—", -56, -56, -56, 1)], Q.proot, i),
    puzzle: (rng, i) => item("polynomes", "puzzle", 4, "polyKnownRoot", `Factoriser n°${i + 1}`, "A(x) = x³ − 4x² − 2x + 8. Vérifier que 4 est racine, puis factoriser.", [v("a", "a", "—", -4, -4, -4, 1), v("b", "b", "—", -2, -2, -2, 1), v("c", "c", "—", 8, 8, 8, 1), v("r", "r", "—", 4, 4, 4, 1)], Q.pknown, i)
  },
  arithmetique: {
    easy: (rng, i) => {
      const b = pick(rng, [6, 7, 8, 9, 11]), a = between(rng, 100, 900, 1);
      return item("arithmetique", "easy", 1, "euclidDiv", `Division euclidienne n°${i + 1}`, "a = bq + r, 0 ≤ r < b.", [v("a", "a", "—", a, 100, 900, 1), v("b", "b", "—", b, 5, 12, 1)], Q.eu, i);
    },
    medium: (rng, i) => {
      if (i % 2 === 0) {
        const n = between(rng, 104, 99999, 1);
        return item("arithmetique", "medium", 2, "remainderLast3", `Modulo 8 n°${i + 1}`, "Reste de n modulo 8 via les derniers chiffres.", [v("n", "n", "—", n, 104, 99999, 1), v("div", "diviseur", "—", 8, 8, 8, 1)], Q.last3, i);
      }
      const n = between(rng, 100, 9999, 1);
      return item("arithmetique", "medium", 2, "remainderDigits", `Modulo 9 n°${i + 1}`, "Reste de n modulo 9 par la somme des chiffres.", [v("n", "n", "—", n, 100, 9999, 1), v("div", "diviseur", "—", 9, 9, 9, 1)], Q.digits, i);
    },
    hard: (rng, i) => {
      const a = pick(rng, [60, 80, 100, 120]), b = pick(rng, [90, 120, 150, 180]), c = pick(rng, [60, 90, 120, 180]);
      return item("arithmetique", "hard", 3, "gcd3", `Cubes dans une caisse n°${i + 1}`, "Arête maximale = PGCD des trois dimensions, puis nombre de cubes.", [v("a", "L", "cm", a, 60, 180, 20), v("b", "ℓ", "cm", b, 90, 240, 30), v("c", "h", "cm", c, 60, 180, 30)], Q.gcd, i);
    },
    puzzle: (rng, i) => {
      if (i % 2 === 0) return item("arithmetique", "puzzle", 4, "barcodeCheck", `Code-barres n°${i + 1}`, "Les 12 premiers chiffres du manuel. Déterminer la clé EAN-13.", [v("prefix", "préfixe", "—", 619220260141, 619220260141, 619220260141, 1)], Q.ean, i);
      return item("arithmetique", "puzzle", 4, "gcd3", `Caisse 120×200×180 n°${i + 1}`, "Exercice 30 du chapitre 4. Minimum de cubes d’arête entière.", [v("a", "L", "cm", 120, 120, 120, 20), v("b", "ℓ", "cm", 200, 200, 200, 20), v("c", "h", "cm", 180, 180, 180, 20)], Q.gcd, i);
    }
  },
  vecteurs: {
    easy: (rng, i) => {
      const xA = between(rng, -3, 2, 1), yA = between(rng, -2, 3, 1), xB = between(rng, -1, 5, 1), yB = between(rng, -3, 4, 1);
      return item("vecteurs", "easy", 1, "vectorAB", `AB⃗ n°${i + 1}`, "Composantes et norme de AB⃗ dans un repère orthonormé.", [v("xA", "x_A", "—", xA, -4, 3, 1), v("yA", "y_A", "—", yA, -3, 4, 1), v("xB", "x_B", "—", xB, -2, 6, 1), v("yB", "y_B", "—", yB, -4, 5, 1)], Q.ab, i);
    },
    medium: (rng, i) => {
      if (i % 2 === 0) {
        const k = between(rng, 2, 5, 1), x = between(rng, 1, 4, 1), y = between(rng, 1, 4, 1);
        return item("vecteurs", "medium", 2, "detColinear", `Colinéarité n°${i + 1}`, "u⃗ = (x ; y), v⃗ = (kx ; ky). Calculer le déterminant (attendu : 0).", [v("x", "x", "—", x, -4, 6, 1), v("y", "y", "—", y, -4, 6, 1), v("xp", "x'", "—", k * x, -12, 20, 1), v("yp", "y'", "—", k * y, -12, 20, 1)], Q.det, i);
      }
      const x = between(rng, 2, 6, 1), y = between(rng, 2, 6, 1);
      return item("vecteurs", "medium", 2, "dotOrtho", `Orthogonalité n°${i + 1}`, "u⃗ = (x ; y), v⃗ = (y ; −x). Produit scalaire (attendu : 0).", [v("x", "x", "—", x, -5, 6, 1), v("y", "y", "—", y, -5, 6, 1), v("xp", "x'", "—", y, -6, 6, 1), v("yp", "y'", "—", -x, -6, 6, 1)], Q.dot, i);
    },
    hard: (rng, i) => {
      const xA = between(rng, -3, 1, 1), yA = between(rng, 0, 2, 0.5), xB = between(rng, -1, 2, 1), yB = between(rng, -2, 1, 1), xC = between(rng, 2, 5, 1), yC = between(rng, 2, 6, 1);
      return item("vecteurs", "hard", 3, "parallelogramD", `Parallélogramme ABCD n°${i + 1}`, "D = A + C − B. Coordonnées de D.", [v("xA", "x_A", "—", xA, -4, 1, 1), v("yA", "y_A", "—", yA, 0, 3, 0.25), v("xB", "x_B", "—", xB, -1, 3, 1), v("yB", "y_B", "—", yB, -2, 2, 1), v("xC", "x_C", "—", xC, 1, 6, 1), v("yC", "y_C", "—", yC, 2, 6, 1)], Q.para, i);
    },
    puzzle: (rng, i) => item("vecteurs", "puzzle", 4, "parallelogramD", `Sommet D du manuel n°${i + 1}`, "A(−2 ; 0,75), B(0 ; −1), C(3 ; 4). D pour ABCD parallélogramme.", [v("xA", "x_A", "—", -2, -2, -2, 1), v("yA", "y_A", "—", 0.75, 0.75, 0.75, 0.25), v("xB", "x_B", "—", 0, 0, 0, 1), v("yB", "y_B", "—", -1, -1, -1, 1), v("xC", "x_C", "—", 3, 3, 3, 1), v("yC", "y_C", "—", 4, 4, 4, 1)], Q.para, i)
  },
  barycentre: {
    easy: (rng, i) => {
      const xA = 0, xB = between(rng, 6, 12, 2), alpha = 1, beta = 1;
      return item("barycentre", "easy", 1, "bary1d", `Milieu n°${i + 1}`, "Masses égales : G est le milieu de [AB].", [v("xA", "x_A", "—", xA, 0, 2, 1), v("xB", "x_B", "—", xB, 6, 14, 1), v("alpha", "α", "—", alpha, 1, 3, 1), v("beta", "β", "—", beta, 1, 3, 1)], Q.b1, i);
    },
    medium: (rng, i) => {
      const xA = 0, xB = 10, alpha = between(rng, 2, 5, 1), beta = between(rng, 1, 4, 1);
      return item("barycentre", "medium", 2, "bary1d", `Masses de même signe n°${i + 1}`, "G ∈ [AB]. Abscisse et k = β/(α+β).", [v("xA", "x_A", "—", xA, 0, 4, 1), v("xB", "x_B", "—", xB, 8, 14, 1), v("alpha", "α", "—", alpha, 2, 5, 1), v("beta", "β", "—", beta, 1, 4, 1)], Q.b1, i);
    },
    hard: (rng, i) => {
      const xA = 0, xB = 10, alpha = 3, beta = -4;
      return item("barycentre", "hard", 3, "bary1d", `Masses de signes contraires n°${i + 1}`, "β < 0 : G est hors de [AB]. Comme l’exercice 1.a (3 et −4).", [v("xA", "x_A", "—", xA, 0, 2, 1), v("xB", "x_B", "—", xB, 8, 12, 1), v("alpha", "α", "—", alpha, 2, 5, 1), v("beta", "β", "—", beta, -6, -2, 1)], Q.b1, i);
    },
    puzzle: (rng, i) => item("barycentre", "puzzle", 4, "bary2d", `Isobarycentre n°${i + 1}`, "Centre de gravité du triangle A(0;0), B(6;0), C(0;6) : masses (1,1,1).", [v("xA", "x_A", "—", 0, 0, 2, 1), v("yA", "y_A", "—", 0, 0, 2, 1), v("xB", "x_B", "—", 6, 4, 8, 1), v("yB", "y_B", "—", 0, 0, 2, 1), v("xC", "x_C", "—", 0, 0, 2, 1), v("yC", "y_C", "—", 6, 4, 8, 1), v("alpha", "α", "—", 1, 1, 2, 1), v("beta", "β", "—", 1, 1, 2, 1), v("gamma", "γ", "—", 1, 1, 2, 1)], Q.b2, i)
  },
  translations: {
    easy: (rng, i) => {
      const x = between(rng, -2, 4, 1), y = between(rng, -2, 4, 1), vx = between(rng, 1, 5, 1), vy = between(rng, -3, 3, 1);
      return item("translations", "easy", 1, "translation", `Image de M n°${i + 1}`, "t_v⃗(M) = M + v⃗. Coordonnées de M'.", [v("x", "x_M", "—", x, -3, 4, 1), v("y", "y_M", "—", y, -3, 4, 1), v("vx", "v_x", "—", vx, -4, 5, 1), v("vy", "v_y", "—", vy, -4, 4, 1)], Q.tr, i);
    },
    medium: (rng, i) => {
      const x = between(rng, 0, 5, 1), y = between(rng, 0, 5, 1), vx = between(rng, -6, -1, 1), vy = between(rng, 2, 6, 1);
      return item("translations", "medium", 2, "translation", `Vecteur opposé n°${i + 1}`, "Translation de vecteur v⃗ (composante x négative). Image de M.", [v("x", "x_M", "—", x, -2, 6, 1), v("y", "y_M", "—", y, -2, 6, 1), v("vx", "v_x", "—", vx, -6, 6, 1), v("vy", "v_y", "—", vy, -6, 6, 1)], Q.tr, i);
    },
    hard: (rng, i) => {
      const x = between(rng, -4, 4, 1), y = between(rng, -4, 4, 1), vx = x === 0 ? 3 : -x, vy = y === 0 ? 2 : -y;
      return item("translations", "hard", 3, "translation", `Retour vers l’origine n°${i + 1}`, "Choisir v⃗ tel que M' soit plus près de O. Ici v⃗ = −OM⃗ : M' = O.", [v("x", "x_M", "—", x, -4, 4, 1), v("y", "y_M", "—", y, -4, 4, 1), v("vx", "v_x", "—", vx, -8, 8, 1), v("vy", "v_y", "—", vy, -8, 8, 1)], Q.tr, i);
    },
    puzzle: (rng, i) => item("translations", "puzzle", 4, "translation", `M'N'⃗ = MN⃗ n°${i + 1}`, "La propriété caractéristique : tous les points sont déplacés du même vecteur (3 ; −1).", [v("x", "x_M", "—", 1, 1, 4, 1), v("y", "y_M", "—", 2, 1, 4, 1), v("vx", "v_x", "—", 3, 3, 3, 1), v("vy", "v_y", "—", -1, -1, -1, 1)], Q.tr, i)
  },
  homotheties: {
    easy: (rng, i) => {
      const k = pick(rng, [2, 3, 4]), x = between(rng, 1, 4, 1), y = between(rng, 0, 3, 1);
      return item("homotheties", "easy", 1, "homothety", `h(O, k) n°${i + 1}`, "Centre O(0;0). OM'⃗ = k OM⃗.", [v("xO", "x_O", "—", 0, 0, 0, 1), v("yO", "y_O", "—", 0, 0, 0, 1), v("k", "k", "—", k, 2, 5, 1), v("x", "x_M", "—", x, 1, 5, 0.5), v("y", "y_M", "—", y, 0, 4, 0.5)], Q.hom, i);
    },
    medium: (rng, i) => {
      const k = pick(rng, [0.5, 2, 3]), p = between(rng, 9, 24, 3), a = between(rng, 4, 12, 2);
      return item("homotheties", "medium", 2, "homothetyScale", `Périmètre et aire n°${i + 1}`, "p' = |k|p et A' = k²A.", [v("k", "k", "—", k, 0.25, 3, 0.25), v("p", "p", "—", p, 6, 24, 3), v("a", "A", "—", a, 2, 12, 2)], Q.hsc, i);
    },
    hard: (rng, i) => {
      const k = -2, x = between(rng, 1, 4, 1), y = between(rng, 1, 3, 1);
      return item("homotheties", "hard", 3, "homothety", `Rapport négatif n°${i + 1}`, "k < 0 : l’image est de l’autre côté de O (symétrie puis agrandissement).", [v("xO", "x_O", "—", 0, -1, 1, 1), v("yO", "y_O", "—", 0, -1, 1, 1), v("k", "k", "—", k, -3, -1, 1), v("x", "x_M", "—", x, 1, 5, 0.5), v("y", "y_M", "—", y, 0, 4, 0.5)], Q.hom, i);
    },
    puzzle: (rng, i) => {
      if (i % 2 === 0) return item("homotheties", "puzzle", 4, "homothetyScale", `Aire au quart n°${i + 1}`, "|k| = 1/2  ⇔  aires × 1/4. Ne pas prendre k = 1/4.", [v("k", "k", "—", 0.5, 0.5, 0.5, 0.25), v("p", "p", "—", 12, 12, 18, 3), v("a", "A", "—", 6, 4, 10, 2)], Q.hsc, i);
      return item("homotheties", "puzzle", 4, "homothety", `k = 3 et MM' n°${i + 1}`, "MM' = |k − 1|·OM. Avec k = 3, MM' = 2 OM.", [v("xO", "x_O", "—", 0, 0, 0, 1), v("yO", "y_O", "—", 0, 0, 0, 1), v("k", "k", "—", 3, 3, 3, 1), v("x", "x_M", "—", 2, 1, 4, 0.5), v("y", "y_M", "—", 1, 0, 3, 0.5)], Q.hom, i);
    }
  },
  rotations: {
    easy: (rng, i) => {
      const x = between(rng, 1, 4, 1), y = between(rng, 0, 3, 1);
      return item("rotations", "easy", 1, "rotation90", `Quart de tour n°${i + 1}`, "Quart de tour direct autour de O(0;0) : (x ; y) ↦ (−y ; x).", [v("xO", "x_O", "—", 0, 0, 0, 1), v("yO", "y_O", "—", 0, 0, 0, 1), v("x", "x_M", "—", x, -3, 4, 1), v("y", "y_M", "—", y, -3, 4, 1)], Q.rot, i);
    },
    medium: (rng, i) => {
      const angle = pick(rng, [90, 180]), x = between(rng, 1, 4, 1);
      return item("rotations", "medium", 2, "rotationAngle", `Rotation ${angle}° n°${i + 1}`, "Rotation directe de centre O. Image et conservation de OM.", [v("xO", "x_O", "—", 0, 0, 0, 1), v("yO", "y_O", "—", 0, 0, 0, 1), v("x", "x_M", "—", x, 1, 4, 1), v("y", "y_M", "—", 0, 0, 3, 1), v("angle", "α", "°", angle, 90, 180, 90)], Q.rota, i);
    },
    hard: (rng, i) => {
      const xO = between(rng, 1, 3, 1), yO = between(rng, 0, 2, 1), x = xO + 2, y = yO;
      return item("rotations", "hard", 3, "rotation90", `Centre hors origine n°${i + 1}`, "Quart de tour autour de O ≠ origine. (x−x_O ; y−y_O) ↦ (−(y−y_O) ; x−x_O).", [v("xO", "x_O", "—", xO, -1, 3, 1), v("yO", "y_O", "—", yO, -1, 3, 1), v("x", "x_M", "—", x, -2, 6, 1), v("y", "y_M", "—", y, -2, 6, 1)], Q.rot, i);
    },
    puzzle: (rng, i) => item("rotations", "puzzle", 4, "rotationAngle", `Demi-tour n°${i + 1}`, "180° = symétrie centrale : M' = 2O − M. Ici O est l’origine.", [v("xO", "x_O", "—", 0, 0, 0, 1), v("yO", "y_O", "—", 0, 0, 0, 1), v("x", "x_M", "—", 2, 1, 4, 1), v("y", "y_M", "—", 1, 0, 3, 1), v("angle", "α", "°", 180, 180, 180, 90)], Q.rota, i)
  },
  "suites-arith": {
    easy: (rng, i) => item("suites-arith", "easy", 1, "arithSeq", `Suite arithmétique n°${i + 1}`, ST.arithSeq || "", [v("u1", "u₁", "—", between(rng, 1, 8, 1), -5, 12, 1), v("r", "r", "—", pick(rng, [2, 3, 4, 5]), -6, 8, 1), v("n", "n", "—", between(rng, 5, 12, 1), 4, 20, 1)], [{ key: "un", label: "uₙ", unit: "—" }, { key: "sn", label: "Sₙ", unit: "—" }], i),
    medium: (rng, i) => item("suites-arith", "medium", 2, "arithSeq", `Somme arithmétique n°${i + 1}`, "", [v("u1", "u₁", "—", between(rng, -3, 6, 1), -5, 12, 1), v("r", "r", "—", pick(rng, [-3, -2, 2, 5]), -6, 8, 1), v("n", "n", "—", between(rng, 8, 16, 1), 4, 20, 1)], [{ key: "un", label: "uₙ", unit: "—" }, { key: "sn", label: "Sₙ", unit: "—" }], i),
    hard: (rng, i) => item("suites-arith", "hard", 3, "arithSeq", `Raison négative n°${i + 1}`, "", [v("u1", "u₁", "—", between(rng, 10, 20, 1), -5, 25, 1), v("r", "r", "—", pick(rng, [-5, -4, -2]), -6, 8, 1), v("n", "n", "—", between(rng, 10, 18, 1), 4, 20, 1)], [{ key: "un", label: "uₙ", unit: "—" }, { key: "sn", label: "Sₙ", unit: "—" }], i),
    puzzle: (rng, i) => item("suites-arith", "puzzle", 4, "arithSeq", `Longue somme n°${i + 1}`, "", [v("u1", "u₁", "—", 1, -5, 12, 1), v("r", "r", "—", 1, -6, 8, 1), v("n", "n", "—", 20, 4, 20, 1)], [{ key: "un", label: "uₙ", unit: "—" }, { key: "sn", label: "Sₙ", unit: "—" }], i)
  },
  "suites-geo": {
    easy: (rng, i) => item("suites-geo", "easy", 1, "geoSeq", `Suite géométrique n°${i + 1}`, "", [v("u1", "u₁", "—", pick(rng, [1, 2, 3]), 1, 5, 1), v("q", "q", "—", pick(rng, [2, 3]), 2, 4, 1), v("n", "n", "—", between(rng, 4, 6, 1), 3, 8, 1)], [{ key: "un", label: "uₙ", unit: "—" }, { key: "sn", label: "Sₙ", unit: "—" }], i),
    medium: (rng, i) => item("suites-geo", "medium", 2, "geoSeq", `Raison 2 n°${i + 1}`, "", [v("u1", "u₁", "—", 2, 1, 5, 1), v("q", "q", "—", 2, 2, 4, 1), v("n", "n", "—", 6, 3, 8, 1)], [{ key: "un", label: "uₙ", unit: "—" }, { key: "sn", label: "Sₙ", unit: "—" }], i),
    hard: (rng, i) => item("suites-geo", "hard", 3, "geoSeq", `Raison 3 n°${i + 1}`, "", [v("u1", "u₁", "—", 1, 1, 5, 1), v("q", "q", "—", 3, 2, 4, 1), v("n", "n", "—", 5, 3, 8, 1)], [{ key: "un", label: "uₙ", unit: "—" }, { key: "sn", label: "Sₙ", unit: "—" }], i),
    puzzle: (rng, i) => item("suites-geo", "puzzle", 4, "geoSeq", `q = 4 n°${i + 1}`, "", [v("u1", "u₁", "—", 1, 1, 5, 1), v("q", "q", "—", 4, 2, 4, 1), v("n", "n", "—", 4, 3, 8, 1)], [{ key: "un", label: "uₙ", unit: "—" }, { key: "sn", label: "Sₙ", unit: "—" }], i)
  },
  fonctions: {
    easy: (rng, i) => item("fonctions", "easy", 1, "affineFn", `Affine n°${i + 1}`, "", [v("a", "a", "—", pick(rng, [-3, -2, 1, 2, 4]), -5, 5, 1), v("b", "b", "—", between(rng, -4, 6, 1), -6, 8, 1), v("x", "x₀", "—", between(rng, -2, 5, 1), -4, 6, 1)], [{ key: "y", label: "f(x₀)", unit: "—" }], i),
    medium: (rng, i) => item("fonctions", "medium", 2, "affineFn", `Pente négative n°${i + 1}`, "", [v("a", "a", "—", -2, -5, 5, 1), v("b", "b", "—", 5, -6, 8, 1), v("x", "x₀", "—", 3, -4, 6, 1)], [{ key: "y", label: "f(x₀)", unit: "—" }], i),
    hard: (rng, i) => item("fonctions", "hard", 3, "quadFn", `Trinôme n°${i + 1}`, "", [v("a", "a", "—", 1, -2, 2, 1), v("b", "b", "—", -4, -5, 5, 1), v("c", "c", "—", 3, -8, 8, 1), v("x", "x₀", "—", 2, -3, 4, 1)], [{ key: "y", label: "f(x₀)", unit: "—" }], i),
    puzzle: (rng, i) => item("fonctions", "puzzle", 4, "quadFn", `Parabole n°${i + 1}`, "", [v("a", "a", "—", -1, -2, 2, 1), v("b", "b", "—", 2, -5, 5, 1), v("c", "c", "—", 5, -8, 8, 1), v("x", "x₀", "—", -1, -3, 4, 1)], [{ key: "y", label: "f(x₀)", unit: "—" }], i)
  },
  ref: {
    easy: (rng, i) => item("ref", "easy", 1, "quadFn", `Référence n°${i + 1}`, "", [v("a", "a", "—", 1, -2, 2, 1), v("b", "b", "—", 0, -5, 5, 1), v("c", "c", "—", -4, -8, 8, 1), v("x", "x₀", "—", 3, -3, 4, 1)], [{ key: "y", label: "f(x₀)", unit: "—" }], i),
    medium: (rng, i) => item("ref", "medium", 2, "affineFn", `Droite n°${i + 1}`, "", [v("a", "a", "—", 3, -5, 5, 1), v("b", "b", "—", -1, -6, 8, 1), v("x", "x₀", "—", -2, -4, 6, 1)], [{ key: "y", label: "f(x₀)", unit: "—" }], i),
    hard: (rng, i) => item("ref", "hard", 3, "quadFn", `a = −1 n°${i + 1}`, "", [v("a", "a", "—", -1, -2, 2, 1), v("b", "b", "—", 4, -5, 5, 1), v("c", "c", "—", 0, -8, 8, 1), v("x", "x₀", "—", 1, -3, 4, 1)], [{ key: "y", label: "f(x₀)", unit: "—" }], i),
    puzzle: (rng, i) => item("ref", "puzzle", 4, "quadFn", `Sommet n°${i + 1}`, "", [v("a", "a", "—", 2, -2, 2, 1), v("b", "b", "—", -8, -5, 5, 1), v("c", "c", "—", 3, -8, 8, 1), v("x", "x₀", "—", 2, -3, 4, 1)], [{ key: "y", label: "f(x₀)", unit: "—" }], i)
  },
  trigo: {
    easy: (rng, i) => item("trigo", "easy", 1, "trigExact", `Angle remarquable n°${i + 1}`, "", [v("angle", "α", "°", pick(rng, [0, 30, 45, 60, 90]), 0, 90, 15)], [{ key: "cos", label: "cos α", unit: "—" }, { key: "sin", label: "sin α", unit: "—" }], i),
    medium: (rng, i) => item("trigo", "medium", 2, "trigExact", `60° n°${i + 1}`, "", [v("angle", "α", "°", 60, 0, 90, 15)], [{ key: "cos", label: "cos α", unit: "—" }, { key: "sin", label: "sin α", unit: "—" }], i),
    hard: (rng, i) => item("trigo", "hard", 3, "trigExact", `30° n°${i + 1}`, "", [v("angle", "α", "°", 30, 0, 90, 15)], [{ key: "cos", label: "cos α", unit: "—" }, { key: "sin", label: "sin α", unit: "—" }], i),
    puzzle: (rng, i) => item("trigo", "puzzle", 4, "trigExact", `45° n°${i + 1}`, "", [v("angle", "α", "°", 45, 0, 90, 15)], [{ key: "cos", label: "cos α", unit: "—" }, { key: "sin", label: "sin α", unit: "—" }], i)
  },
  analytique: {
    easy: (rng, i) => item("analytique", "easy", 1, "distance2d", `Distance n°${i + 1}`, "", [v("xA", "x_A", "—", between(rng, -3, 2, 1), -5, 4, 1), v("yA", "y_A", "—", between(rng, -2, 3, 1), -4, 5, 1), v("xB", "x_B", "—", between(rng, 2, 6, 1), -4, 6, 1), v("yB", "y_B", "—", between(rng, 1, 5, 1), -4, 6, 1)], [{ key: "dist", label: "AB", unit: "—" }, { key: "xI", label: "x_I", unit: "—" }, { key: "yI", label: "y_I", unit: "—" }], i),
    medium: (rng, i) => item("analytique", "medium", 2, "lineSlope", `Pente n°${i + 1}`, "", [v("xA", "x_A", "—", 0, -3, 2, 1), v("yA", "y_A", "—", 1, -4, 4, 1), v("xB", "x_B", "—", 4, 1, 6, 1), v("yB", "y_B", "—", between(rng, 2, 6, 1), -4, 6, 1)], [{ key: "m", label: "m", unit: "—" }, { key: "p", label: "p", unit: "—" }], i),
    hard: (rng, i) => item("analytique", "hard", 3, "distance2d", `Milieu n°${i + 1}`, "", [v("xA", "x_A", "—", -4, -5, 4, 1), v("yA", "y_A", "—", 5, -4, 5, 1), v("xB", "x_B", "—", 2, -4, 6, 1), v("yB", "y_B", "—", -1, -4, 6, 1)], [{ key: "dist", label: "AB", unit: "—" }, { key: "xI", label: "x_I", unit: "—" }, { key: "yI", label: "y_I", unit: "—" }], i),
    puzzle: (rng, i) => item("analytique", "puzzle", 4, "lineSlope", `Droite n°${i + 1}`, "", [v("xA", "x_A", "—", -2, -3, 2, 1), v("yA", "y_A", "—", 0, -4, 4, 1), v("xB", "x_B", "—", 6, 1, 6, 1), v("yB", "y_B", "—", 4, -4, 6, 1)], [{ key: "m", label: "m", unit: "—" }, { key: "p", label: "p", unit: "—" }], i)
  },
  "espace-droites": {
    easy: (rng, i) => item("espace-droites", "easy", 1, "lineSlope", `Direction n°${i + 1}`, "", [v("xA", "x_A", "—", 0, -3, 2, 1), v("yA", "y_A", "—", 0, -4, 4, 1), v("xB", "x_B", "—", 3, 1, 6, 1), v("yB", "y_B", "—", 3, -4, 6, 1)], [{ key: "m", label: "m", unit: "—" }, { key: "p", label: "p", unit: "—" }], i),
    medium: (rng, i) => item("espace-droites", "medium", 2, "distance2d", `Repère n°${i + 1}`, "", [v("xA", "x_A", "—", 1, -5, 4, 1), v("yA", "y_A", "—", 1, -4, 5, 1), v("xB", "x_B", "—", 4, -4, 6, 1), v("yB", "y_B", "—", 5, -4, 6, 1)], [{ key: "dist", label: "AB", unit: "—" }, { key: "xI", label: "x_I", unit: "—" }, { key: "yI", label: "y_I", unit: "—" }], i),
    hard: (rng, i) => item("espace-droites", "hard", 3, "lineSlope", `Pente n°${i + 1}`, "", [v("xA", "x_A", "—", -1, -3, 2, 1), v("yA", "y_A", "—", 2, -4, 4, 1), v("xB", "x_B", "—", 5, 1, 6, 1), v("yB", "y_B", "—", -1, -4, 6, 1)], [{ key: "m", label: "m", unit: "—" }, { key: "p", label: "p", unit: "—" }], i),
    puzzle: (rng, i) => item("espace-droites", "puzzle", 4, "distance2d", `Cube face n°${i + 1}`, "", [v("xA", "x_A", "—", 0, -5, 4, 1), v("yA", "y_A", "—", 0, -4, 5, 1), v("xB", "x_B", "—", 6, -4, 6, 1), v("yB", "y_B", "—", 8, -4, 6, 1)], [{ key: "dist", label: "AB", unit: "—" }, { key: "xI", label: "x_I", unit: "—" }, { key: "yI", label: "y_I", unit: "—" }], i)
  },
  parallelisme: {
    easy: (rng, i) => item("parallelisme", "easy", 1, "lineSlope", `Parallèles n°${i + 1}`, "", [v("xA", "x_A", "—", 0, -3, 2, 1), v("yA", "y_A", "—", 1, -4, 4, 1), v("xB", "x_B", "—", 4, 1, 6, 1), v("yB", "y_B", "—", 3, -4, 6, 1)], [{ key: "m", label: "m", unit: "—" }, { key: "p", label: "p", unit: "—" }], i),
    medium: (rng, i) => item("parallelisme", "medium", 2, "lineSlope", `Même pente n°${i + 1}`, "", [v("xA", "x_A", "—", -2, -3, 2, 1), v("yA", "y_A", "—", 0, -4, 4, 1), v("xB", "x_B", "—", 2, 1, 6, 1), v("yB", "y_B", "—", 6, -4, 6, 1)], [{ key: "m", label: "m", unit: "—" }, { key: "p", label: "p", unit: "—" }], i),
    hard: (rng, i) => item("parallelisme", "hard", 3, "lineSlope", `m = 1/2 n°${i + 1}`, "", [v("xA", "x_A", "—", 0, -3, 2, 1), v("yA", "y_A", "—", 0, -4, 4, 1), v("xB", "x_B", "—", 6, 1, 6, 1), v("yB", "y_B", "—", 3, -4, 6, 1)], [{ key: "m", label: "m", unit: "—" }, { key: "p", label: "p", unit: "—" }], i),
    puzzle: (rng, i) => item("parallelisme", "puzzle", 4, "lineSlope", `pente 2 n°${i + 1}`, "", [v("xA", "x_A", "—", 1, -3, 2, 1), v("yA", "y_A", "—", -2, -4, 4, 1), v("xB", "x_B", "—", 4, 1, 6, 1), v("yB", "y_B", "—", 4, -4, 6, 1)], [{ key: "m", label: "m", unit: "—" }, { key: "p", label: "p", unit: "—" }], i)
  },
  orthogonalite: {
    easy: (rng, i) => item("orthogonalite", "easy", 1, "dotOrtho", `Orthogonal n°${i + 1}`, "", [v("x", "x", "—", 3, -5, 5, 1), v("y", "y", "—", 4, -5, 5, 1), v("xp", "x'", "—", 4, -5, 5, 1), v("yp", "y'", "—", -3, -5, 5, 1)], [{ key: "dot", label: "produit scalaire", unit: "—" }], i),
    medium: (rng, i) => item("orthogonalite", "medium", 2, "dotOrtho", `Produit n°${i + 1}`, "", [v("x", "x", "—", 1, -5, 5, 1), v("y", "y", "—", 2, -5, 5, 1), v("xp", "x'", "—", -2, -5, 5, 1), v("yp", "y'", "—", 1, -5, 5, 1)], [{ key: "dot", label: "produit scalaire", unit: "—" }], i),
    hard: (rng, i) => item("orthogonalite", "hard", 3, "dotOrtho", `Base n°${i + 1}`, "", [v("x", "x", "—", 5, -5, 5, 1), v("y", "y", "—", 12, -5, 5, 1), v("xp", "x'", "—", 12, -5, 5, 1), v("yp", "y'", "—", -5, -5, 5, 1)], [{ key: "dot", label: "produit scalaire", unit: "—" }], i),
    puzzle: (rng, i) => item("orthogonalite", "puzzle", 4, "dotOrtho", `Contrôle n°${i + 1}`, "", [v("x", "x", "—", 2, -5, 5, 1), v("y", "y", "—", -1, -5, 5, 1), v("xp", "x'", "—", 3, -5, 5, 1), v("yp", "y'", "—", 6, -5, 5, 1)], [{ key: "dot", label: "produit scalaire", unit: "—" }], i)
  },
  stats: {
    easy: (rng, i) => item("stats", "easy", 1, "statsMean", `Moyenne n°${i + 1}`, "", [v("n", "n", "—", 10, 4, 20, 1), v("sum", "Σ", "—", 120, 20, 200, 4), v("xmin", "min", "—", 5, 1, 15, 1), v("xmax", "max", "—", 20, 10, 30, 1)], [{ key: "mean", label: "x̄", unit: "—" }, { key: "range", label: "étendue", unit: "—" }], i),
    medium: (rng, i) => item("stats", "medium", 2, "statsMean", `Série n°${i + 1}`, "", [v("n", "n", "—", 8, 4, 20, 1), v("sum", "Σ", "—", 96, 20, 200, 4), v("xmin", "min", "—", 7, 1, 15, 1), v("xmax", "max", "—", 18, 10, 30, 1)], [{ key: "mean", label: "x̄", unit: "—" }, { key: "range", label: "étendue", unit: "—" }], i),
    hard: (rng, i) => item("stats", "hard", 3, "statsMean", `Étendue n°${i + 1}`, "", [v("n", "n", "—", 15, 4, 20, 1), v("sum", "Σ", "—", 180, 20, 200, 4), v("xmin", "min", "—", 4, 1, 15, 1), v("xmax", "max", "—", 22, 10, 30, 1)], [{ key: "mean", label: "x̄", unit: "—" }, { key: "range", label: "étendue", unit: "—" }], i),
    puzzle: (rng, i) => item("stats", "puzzle", 4, "statsMean", `n grand n°${i + 1}`, "", [v("n", "n", "—", 20, 4, 20, 1), v("sum", "Σ", "—", 200, 20, 200, 4), v("xmin", "min", "—", 2, 1, 15, 1), v("xmax", "max", "—", 19, 10, 30, 1)], [{ key: "mean", label: "x̄", unit: "—" }, { key: "range", label: "étendue", unit: "—" }], i)
  }
};

export function generateBand(chapterId, band, count = 10, seed = Date.now()) {
  const rng = typeof seed === "function" ? seed : mulberry32(seed);
  const maker = makers[chapterId]?.[band];
  if (!maker) return [];
  return Array.from({ length: count }, (_, i) => maker(rng, i));
}

export function generateChapterSet(chapterId, seed = Date.now()) {
  const rng = mulberry32(seed);
  return Object.fromEntries(BANDS.map(b => [b.id, generateBand(chapterId, b.id, 10, rng)]));
}

export function generatePapers(kind, chapterIds, seed = Date.now()) {
  const rng = mulberry32(seed);
  const duration = kind === "synthese" ? 7200 : 3600;
  const minN = kind === "synthese" ? 4 : 3;
  const maxN = 5;
  const plan = [
    ["easy", "Facile A"],
    ["easy", "Facile B"],
    ["medium", "Moyen A"],
    ["medium", "Moyen B"],
    ["hard", "Difficile A"],
    ["hard", "Difficile B"]
  ];
  return plan.map(([band, label], index) => {
    const pool = shuffle(rng, chapterIds.flatMap(ch => generateBand(ch, band, 10, rng)));
    const n = minN + Math.floor(rng() * (maxN - minN + 1));
    const exercises = pool.slice(0, Math.min(n, pool.length)).map((ex, i) => ({
      ...ex,
      id: `PAPER_${kind}_${index}_${i}_${ex.id}`
    }));
    return {
      id: `${kind}-${band}-${index}`,
      kind,
      band,
      title: `Devoir ${label}`,
      duration,
      durationLabel: kind === "synthese" ? "2 h" : "1 h",
      exercises
    };
  });
}
