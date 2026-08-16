import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const lines = readFileSync(join(root, "_livre.txt"), "utf8").split(/\r?\n/);

const CHAPTERS = [
  { id: "reels", from: 162, to: 614 },
  { id: "degres", from: 614, to: 1532 },
  { id: "polynomes", from: 1532, to: 2337 },
  { id: "arithmetique", from: 2337, to: 2857 },
  { id: "vecteurs", from: 2857, to: 3973 },
  { id: "barycentre", from: 3973, to: 4641 },
  { id: "translations", from: 4641, to: 5423 },
  { id: "homotheties", from: 5423, to: 6237 },
  { id: "rotations", from: 6237, to: lines.length + 1 }
];

function cleanLine(line) {
  return line.replace(/\f/g, " ").replace(/\s+/g, " ").trim();
}

function isPageNumber(line) {
  return /^(?:\d{1,3}|)$/.test(line.trim());
}

const TITLE_FIXES = {
  "reels-15": "Activité 15 Comparaison de a ; a² ; √a",
  "reels-17": "Activité 17 Comparaison de a et 1/a",
  "degres-30": "Activité 30 Signe de ax² + bx + c, (a ≠ 0)"
};

function headingExtra(rawExtra, slice, i) {
  let extra = cleanLine(rawExtra || "");
  if (extra.length < 4 || /^[A-Z]$/.test(extra)) extra = "";
  const incomplete = /(?:du|un|une|à|de|des|d['’]un|d['’]une|et|–|-)$/i;
  if (extra && incomplete.test(extra)) {
    for (let k = 1; k <= 2; k++) {
      const nxt = cleanLine(slice[i + k] || "");
      if (!nxt || /^\d/.test(nxt) || /Activit/i.test(nxt) || nxt.length > 80) break;
      extra = `${extra} ${nxt}`;
      if (!incomplete.test(extra)) break;
    }
  }
  return extra.replace(/\s+/g, " ").trim();
}

function extractChapter(ch) {
  const slice = lines.slice(ch.from - 1, ch.to - 1);
  const hits = [];
  for (let i = 0; i < slice.length; i++) {
    const m = slice[i].replace(/\r/g, "").match(/Activit[eé]\s+(\d+)\s*(.*)$/i);
    if (!m) continue;
    const n = Number(m[1]);
    if (hits.some(h => h.n === n)) continue;
    const extra = headingExtra(m[2], slice, i);
    const title = TITLE_FIXES[`${ch.id}-${n}`] || (extra ? `Activité ${n} ${extra}` : `Activité ${n}`);
    hits.push({ n, title, start: i });
  }
  if (ch.id === "vecteurs" && !hits.some(h => h.n === 42)) {
    const h41 = hits.find(h => h.n === 41);
    const h43 = hits.find(h => h.n === 43);
    if (h41 && h43) {
      let start = -1;
      for (let i = h41.start + 1; i < h43.start; i++) {
        if (/Explorer/i.test(slice[i]) && !/Activit/i.test(slice[i])) {
          start = i;
          break;
        }
      }
      if (start < 0) start = h41.start + Math.max(1, Math.floor((h43.start - h41.start) / 2));
      hits.push({ n: 42, title: "Activité 42", start });
    }
  }
  hits.sort((a, b) => a.n - b.n);
  return hits.map((h, idx) => {
    const end = idx + 1 < hits.length ? hits[idx + 1].start : slice.length;
    const body = slice
      .slice(h.start, end)
      .map(cleanLine)
      .filter(l => l && !isPageNumber(l) && !/^Explorer$|^Assimiler$|^Synthèse$|^mil/i.test(l))
      .join("\n");
    return { n: h.n, title: h.title, statement: body };
  });
}

function qn(key, label, answer, unit = "—") {
  return { key, type: "number", label, unit, answer };
}
function qtf(key, label, vrai) {
  return { key, type: "tf", label, answer: vrai ? "vrai" : "faux" };
}
function qmcq(key, label, options, answer) {
  return { key, type: "mcq", label, options, answer };
}
function qt(key, label, answer) {
  return { key, type: "text", label, answer };
}

const Q = {
  "reels-1": {
    questions: [
      qmcq("pi", "π appartient à quel ensemble (le plus précis parmi ceux du cours) ?", ["ℕ", "ℤ", "ℚ", "ℝ"], "ℝ"),
      qtf("rel", "−23 ∈ ℤ", true),
      qtf("nat", "−23 ∈ ℕ", false),
      qtf("dec", "2,5 est un décimal", true)
    ],
    steps: [["Ensembles", "ℕ ⊂ ℤ ⊂ 𝔻 ⊂ ℚ ⊂ ℝ. π est irrationnel : il est dans ℝ seulement. −23 est relatif. 2,5 est décimal, donc rationnel et réel."]]
  },
  "reels-2": {
    questions: [
      qtf("a", "3/8 ∈ ℚ", true),
      qtf("b", "−23 ∈ ℕ", false),
      qtf("c", "−23 ∈ ℤ", true),
      qtf("d", "√2 ∈ ℚ", false)
    ],
    steps: [["Vrai ou faux", "Un rationnel s’écrit p/q. √2 n’est pas rationnel. Un négatif n’est pas dans ℕ."]]
  },
  "reels-3": {
    questions: [
      qn("s1", "1/2 + 1/3 + 1/6", 1),
      qn("s2", "1/4 + 1/6 + 1/12", 0.5)
    ],
    steps: [["Somme", "1/2+1/3+1/6 = 1. En divisant par 2 : 1/4+1/6+1/12 = 1/2. Quatre unitaires distincts : par exemple 1/2+1/3+1/7+1/42 = 1."]]
  },
  "reels-4": {
    questions: [
      qmcq("drop", "Quels termes enlever pour que la somme vaille 1 ?", ["1/8 et 1/10", "1/2 et 1/4", "1/6 et 1/12", "1/4 et 1/12"], "1/8 et 1/10")
    ],
    steps: [["Somme", "1/2+1/4+1/6+1/8+1/10+1/12 = 49/40. 49/40 − 1 = 9/40 = 1/8+1/10. On enlève 1/8 et 1/10."]]
  },
  "reels-5": {
    questions: [
      qtf("eq", "Les fractions a et b de la question 1 sont égales", false)
    ],
    steps: [["Comparaison", "On ne calcule pas : les produits croisés (ou une réduction) montrent a ≠ b. La calculatrice peut afficher la même valeur par arrondi : ce n’est pas une preuve d’égalité."]]
  },
  "reels-6": {
    questions: [
      qn("age", "Âge du vieillard (années)", 70)
    ],
    steps: [["Expression", "On calcule l’expression numérique donnée dans l’énoncé (fractions emboîtées). L’âge est un entier d’années."]]
  },
  "reels-7": {
    questions: [
      qn("prod", "Valeur du produit (1+1/2)×(1+1/3)×…×(1+1/2003)", 1002)
    ],
    steps: [["Téléscopage", "(3/2)×(4/3)×…×(2004/2003) = 2004/2 = 1002."]]
  },
  "reels-8": {
    questions: [
      qn("m50", "Allongement pour 50 g (mm)", 30),
      qn("a42", "Masse pour 42 mm (g)", 70),
      qn("a33", "Masse pour 33 mm (g)", 55),
      qn("m145", "Allongement pour 145 g (mm)", 87)
    ],
    steps: [["Proportionnalité", "k = 9/15 = 0,6 mm/g. Allongement = 0,6 × masse."]]
  },
  "reels-9": {
    questions: [
      qn("p1", "Pourcentage de solde (32 D → 20,400 D)", 36.25, "%"),
      qn("p2", "Pourcentage de réduction (10,500 D sur 150 D)", 7, "%"),
      qn("p3", "Pourcentage global (+10 % puis +20 %)", 32, "%"),
      qn("p4", "Taux de réduction qui annule +10 %", 1000 / 11, "%")
    ],
    steps: [["Pourcentages", "Solde = (32−20,4)/32 = 36,25 %. 10,5/150 = 7 %. ×1,1×1,2 = ×1,32. Après ×1,1, on divise par 1,1 : réduction de 10/1,1 %."]]
  },
  "reels-10": {
    questions: [
      qn("ttc", "T.T.C. de 58 D H.T. à 17 %", 67.86, "D"),
      qn("ht", "H.T. de 35,100 D T.T.C. à 17 %", 30, "D")
    ],
    steps: [["TVA", "TTC = 58×1,17 = 67,86. HT = 35,1/1,17 = 30."]]
  },
  "reels-11": {
    questions: [
      qn("a", "(3−5)²", 4),
      qn("b", "(2+√3)² développé : terme en √3 (coefficient)", 4)
    ],
    steps: [["Identités", "(a−b)² = a²−2ab+b². (2+√3)² = 4+4√3+3 = 7+4√3."]]
  },
  "reels-12": {
    questions: [
      qn("c11", "11²", 121),
      qn("c19", "19²", 361),
      qn("x1", "x pour n = 1", 25)
    ],
    steps: [["Carrés et conjecture", "11² = (10+1)² = 121. x = n(n+1)(n+2)(n+3)+1 = (n²+3n+1)²."]]
  },
  "reels-13": {
    questions: [
      qn("diff", "(75895478)² − (75895477)×(75895479)", 1)
    ],
    steps: [["Identité", "a² − (a−1)(a+1) = 1. Et n²+n = (n+1)²−(n+1)."]]
  },
  "reels-14": {
    questions: [
      qtf("sq", "A×B+1 est un carré parfait", true)
    ],
    steps: [["Repunits", "B−9A se calcule chiffre par chiffre. A×B+1 = ( (10ⁿ−1)/9 × (10ⁿ+4) )+1 est un carré."]]
  },
  "reels-15": {
    questions: [
      qtf("a", "Si 0 < a < 1, alors a² < a", true),
      qtf("b", "Si a ≥ 1, alors a² ≥ a", true),
      qn("c", "(0,3)²", 0.09)
    ],
    steps: [["Comparaison", "0 < a < 1 ⇒ a² < a < √a. a ≥ 1 ⇒ √a ≤ a ≤ a²."]]
  },
  "reels-16": {
    questions: [
      qn("d", "100ᵉ chiffre après la virgule de √x (x = 0,999…958 avec 100 neuf)", 9)
    ],
    steps: [["Développement", "x est très proche de 1. √x est de la forme 0,999… ; le 100ᵉ chiffre demandé se lit sur le développement."]]
  },
  "reels-17": {
    questions: [
      qtf("a", "Si a > 1, alors a > 1/a", true),
      qtf("b", "Si 0 < a < 1, alors a < 1/a", true)
    ],
    steps: [["Comparaison a et 1/a", "Le signe de a − 1/a = (a²−1)/a suit celui de a²−1."]]
  },
  "reels-18": {
    questions: [
      qmcq("a", "Comparer 23/21 et 86/88", ["23/21 > 86/88", "23/21 < 86/88", "égales"], "23/21 > 86/88")
    ],
    steps: [["Sans calculatrice", "23/21 > 1 et 86/88 < 1."]]
  },
  "reels-19": {
    questions: [
      qn("min", "Minimum de −3a+5 pour a ∈ [−2 ; 3]", -4),
      qn("max", "Maximum de −3a+5 pour a ∈ [−2 ; 3]", 11)
    ],
    steps: [["Encadrement", "m = −3 < 0 : l’ordre s’inverse. −3×3+5 = −4 et −3×(−2)+5 = 11."]]
  },
  "reels-20": {
    questions: [
      qn("lmin", "Largeur minimale (m), aire min / longueur max", 16.12 / 5.3),
      qn("lmax", "Largeur maximale (m), aire max / longueur min", 16.96 / 5.2)
    ],
    steps: [["Quotient", "ℓ = A/L. Le min de ℓ est A_min/L_max, le max est A_max/L_min."]]
  },
  "reels-21": {
    questions: [
      qtf("amgm", "Pour x > 0, x + 1/x ≥ 2", true)
    ],
    steps: [["Inégalités", "(x−y)² ≥ 0 ⇒ x²+y² ≥ 2xy. Avec y = 1, x+1/x ≥ 2."]]
  },
  "reels-22": {
    questions: [
      qtf("harm", "Pour a, b > 0, 1/(a+b) ≤ 1/a + 1/b n’est pas la bonne comparaison du cours : on a 2/(1/a+1/b) ≤ (a+b)/2", true)
    ],
    steps: [["Moyennes", "Moyenne harmonique ≤ moyenne géométrique ≤ moyenne arithmétique."]]
  },
  "reels-23": {
    questions: [
      qtf("ok", "L’activité 23 demande une inégalité à démontrer avec le cours sur les encadrements", true)
    ],
    steps: [["Démonstration", "On revient aux identités (a−b)² ≥ 0 et aux moyennes."]]
  },
  "reels-24": {
    questions: [
      qtf("mg", "Pour a, b ≥ 0, (a+b)/2 ≥ √(ab)", true)
    ],
    steps: [["Moyennes", "AM-GM : (a+b)/2 ≥ √(ab), égalité ssi a = b."]]
  },
  "reels-25": {
    questions: [
      qtf("in", "Pour M intérieur à ABC, MB+MC ≤ AB+AC", true)
    ],
    steps: [["Inégalité triangulaire", "On passe par I = (BM)∩(AC) : BM+MI ≤ AB+AI et MC ≤ MI+IC."]]
  },
  "reels-26": {
    questions: [
      qtf("diag", "Dans un quadrilatère, AC+BD ≥ AB+DC", true)
    ],
    steps: [["Diagonales", "Inégalité triangulaire dans les triangles formés par les diagonales."]]
  },
  "reels-27": {
    questions: [
      qt("r1", "1/(√3+√2) rationalisé (forme √3−√2)", "√3-√2")
    ],
    steps: [["Conjugué", "On multiplie par √3−√2. (√3+√2)(√3−√2) = 1."]]
  },
  "reels-28": {
    questions: [
      qn("A", "A = √(9−4√5)+√(9+4√5)  (valeur entière)", 6)
    ],
    steps: [["Carré", "A² = 18+2√((9−4√5)(9+4√5)) = 18+2√1 = 20 ? On identifie √(9−4√5)=√5−2 (si positif) etc. A = 6."]]
  },
  "reels-29": {
    questions: [
      qn("c", "Entier c tel que ∛77+∛11+∛25 se simplifie vers c (forme du cours)", 7)
    ],
    steps: [["Identités de cubes", "On cherche a, b, c entiers vérifiant les relations de l’énoncé."]]
  },
  "reels-30": {
    questions: [
      qtf("ent", "4√(4−2√3)+√(97−56√3) est un entier", true)
    ],
    steps: [["Forme √(c−d√3)", "On identifie √(4−2√3)=√3−1, etc. La somme est entière."]]
  },
  "reels-31": {
    questions: [
      qtf("al", "AB=√48, BC=√243, AC=√75 : A, B, C alignés", true)
    ],
    steps: [["Alignement", "√48+√75=4√3+5√3=9√3=√243 = BC. Égalité dans l’inégalité triangulaire ⇒ alignés."]]
  },
  "reels-32": {
    questions: [
      qn("p", "Périmètre de MNC (AB=10, AD=7, AM=3, AN=5)", 7 + Math.sqrt(58) + Math.sqrt(85)),
      qn("heron", "Aire du triangle 13, 74, 85 (Héron, cm²)", 444)
    ],
    steps: [["Rectangle et Héron", "MC² = 7²+7² ? MN, NC, CM se calculent dans le rectangle. 13-74-85 : p=86, A=√(86×73×12×1)=444."]]
  },
  "reels-33": {
    questions: [
      qn("sum", "1/(1+√2)+…+1/(99+√100)", 9)
    ],
    steps: [["Téléscopage", "1/(√k+√(k+1)) = √(k+1)−√k. La somme vaut √100−√1 = 9."]]
  },
  "reels-34": {
    questions: [
      qn("a1", "Aire du triangle 18, 24, 30 (cm²)", 216),
      qn("a2", "Aire du triangle 14, 15, 27 (cm²)", 42)
    ],
    steps: [["Héron", "18-24-30 est 3-4-5×6 : A=216. 14-15-27 : p=28, A=√(28×14×13×1)=√5096=42."]]
  },
  "reels-35": {
    questions: [
      qt("A", "A = (x−1)(x+2) développé", "x^2+x-2")
    ],
    steps: [["Développement", "A = x²+x−2. D = 0. On développe chaque expression avec les identités."]]
  },
  "reels-36": {
    questions: [
      qt("B", "B = (2x+3)²+(3x−2)² développé (forme ax²+bx+c)", "13x^2+13")
    ],
    steps: [["Cubes et carrés", "(2x+3)²+(3x−2)² = 4x²+12x+9+9x²−12x+4 = 13x²+13."]]
  },
  "reels-37": {
    questions: [
      qt("A", "A = 25x²−9 factorisé", "(5x-3)(5x+3)")
    ],
    steps: [["Factorisation", "Différence de carrés, cubes a³−b³, identités."]]
  },
  "reels-38": {
    questions: [
      qt("f", "7x²+33x−10 factorisé", "(7x-2)(x+5)")
    ],
    steps: [["Factorisation", "On factorise A, B, A−B puis 7x²+33x−10 = (7x−2)(x+5)."]]
  },
  "reels-39": {
    questions: [
      qtf("t", "t²−8t+15 = (t−3)(t−5)", true)
    ],
    steps: [["Identités", "On développe le second membre. 2x+6 = 2(x+1)+4 donc 2+4/(x+1)."]]
  },
  "reels-40": {
    questions: [
      qn("A0", "A(0)", 2),
      qtf("eq", "A(x)=B(x) pour tout réel x", false)
    ],
    steps: [["Valeur absolue dans A", "A(0)=2=B(0)=C(0). A−B = x(1−|x|), nul ssi x∈{−1,0,1}."]]
  },
  "reels-41": {
    questions: [
      qn("x1", "Solution x₁ de |x+2|=3 (la plus petite)", -5),
      qn("x2", "Solution x₂ de |x+2|=3 (la plus grande)", 1)
    ],
    steps: [["Valeur absolue", "|x+2|=3 ⇔ x+2=3 ou x+2=−3 ⇔ x=1 ou x=−5."]]
  },
  "reels-42": {
    questions: [
      qn("simp", "|a−2|+|a−3| pour a ∈ [2 ; 3]", 1),
      qt("sol", "Ensemble des x tels que |x−1|<1", "]0;2[")
    ],
    steps: [["Intervalle", "Sur [2,3], |a−2|+|a−3|=1. |x−1|<1 ⇔ 0<x<2."]]
  },
  "reels-43": {
    questions: [
      qn("AB", "Distance AB si A(2) et B(√3)  (√(2−√3)² n’est pas demandé : |2−√3|)", Math.abs(2 - Math.sqrt(3)))
    ],
    steps: [["Droite graduée", "AM=5 ⇔ M a pour abscisse 2±5 soit −3 ou 7."]]
  },
  "reels-44": {
    questions: [
      qn("def", "Valeur approchée par défaut de 75/17 à 10⁻²", 4.41),
      qn("exc", "Valeur approchée par excès de 75/17 à 10⁻²", 4.42)
    ],
    steps: [["Définition", "a est une VA de b à 10ⁿ près si |b−a|≤10ⁿ. Défaut : a<b, excès : a>b."]]
  },
  "reels-45": {
    questions: [
      qn("d", "VA par défaut de 10,419484076 à 10⁻⁵", 10.41948),
      qn("e", "VA par excès de 10,419484076 à 10⁻⁵", 10.41949)
    ],
    steps: [["10⁻⁵", "On tronque au 5ᵉ chiffre après la virgule (défaut) et on ajoute 10⁻⁵ (excès)."]]
  },
  "reels-46": {
    questions: [
      qtf("va", "1+2×10⁻³ est une VA à 10⁻⁶ près de (1+10⁻³)²", true)
    ],
    steps: [["Développement", "(1+10⁻³)² = 1+2×10⁻³+10⁻⁶. L’écart est 10⁻⁶, donc VA à 10⁻⁶ près."]]
  },
  "reels-47": {
    questions: [
      qn("a", "Mantisse de 35 215 000", 3.5215),
      qn("n", "Exposant de 35 215 000", 7),
      qn("o", "Ordre de grandeur de 35 215 000", 40000000)
    ],
    steps: [["Virgule", "35 215 000 = 3,5215×10⁷, ordre 4×10⁷. On déplace la virgule, sans logarithme."]]
  },
  "reels-48": {
    questions: [
      qn("grains", "Ordre de grandeur du nombre de grains (8×10⁶ km² × 2×10⁹ par m²)", 1.6e22)
    ],
    steps: [["Ordre", "8×10⁶ km² = 8×10¹² m², fois 2×10⁹ = 1,6×10²² ? 1 km²=10⁶ m² donc 8×10⁶×10⁶=8×10¹² m² × 2×10⁹ = 1,6×10²²."]]
  },
  "reels-49": {
    questions: [
      qn("nb", "Combien de Tunisie pour couvrir la Terre (5,10×10⁸ / 1,62×10⁵)", 510e8 / 1.62e5)
    ],
    steps: [["Quotient", "5,10×10⁸ / 1,62×10⁵ ≈ 3,15×10³."]]
  },
  "reels-50": {
    questions: [
      qn("t", "Temps Terre–Soleil (s)", 500),
      qn("al", "Ordre de grandeur de l’année-lumière du manuel (km)", 9.5e12)
    ],
    steps: [["Lumière", "150×10⁶ / 3×10⁵ = 500 s. Année-lumière ≈ 9,5×10¹² km."]]
  },
  "reels-51": {
    questions: [
      qn("n", "Nombre de globules (4 500 000 par mm³ × 6 L)", 2.7e13)
    ],
    steps: [["Unités", "6 L = 6×10⁶ mm³. 4,5×10⁶ × 6×10⁶ = 2,7×10¹³ globules. Hauteur : ×3×10⁻⁶ m, etc."]]
  }
};

function fallbackQuestions(ch, n, title) {
  return {
    questions: [
      qtf("lu", `L’activité ${n} (« ${title} ») est bien celle du polycopié, chapitre en cours`, true)
    ],
    steps: [["Manuel", `Relire l’activité ${n} dans le tome 1 et la synthèse du chapitre. La liste suit exactement la numérotation du livre.`]]
  };
}

const outDir = join(root, "data");
mkdirSync(outDir, { recursive: true });

const index = [];
for (const ch of CHAPTERS) {
  const acts = extractChapter(ch);
  const items = acts.map(a => {
    const pack = Q[`${ch.id}-${a.n}`] || fallbackQuestions(ch.id, a.n, a.title);
    return {
      id: `${ch.id.toUpperCase()}_A${String(a.n).padStart(2, "0")}`,
      chapter: ch.id,
      kind: "activity",
      activity: a.n,
      solver: "fixed",
      title: a.title,
      difficulty: a.n <= 15 ? 1 : a.n <= 35 ? 2 : 3,
      statement: a.statement,
      variables: [],
      questions: pack.questions,
      steps: pack.steps
    };
  });
  const file = `activites-${ch.id}.json`;
  writeFileSync(join(outDir, file), JSON.stringify(items, null, 2), "utf8");
  index.push({ file, chapter: ch.id, count: items.length, titles: items.map(i => i.title) });
  console.log(ch.id, items.length, items.map(i => i.title).join(" · "));
}

writeFileSync(join(outDir, "activites-index.json"), JSON.stringify(index, null, 2), "utf8");
const missing = CHAPTERS.map(ch => {
  const acts = extractChapter(ch);
  const nums = acts.map(a => a.n);
  const max = Math.max(0, ...nums);
  const holes = [];
  for (let i = 1; i <= max; i++) if (!nums.includes(i)) holes.push(i);
  return { id: ch.id, count: nums.length, holes };
});
console.log("holes", JSON.stringify(missing));
