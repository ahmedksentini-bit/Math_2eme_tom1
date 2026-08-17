import { solve, isClose } from "./solvers.js";
import { drawFigure } from "./diagrams.js";
import { courseRecap } from "./recaps.js";
import { chapterCourse } from "./courses.js";
import { BANDS, generateChapterSet, generatePapers } from "./bank.js";
import { startFriends } from "./friends.js";

const app = document.querySelector("#app");
const state = {
  catalog: null, catalogs: { 1: null, 2: null }, tome: 1, annales: { papers: [] }, exercise: null, mode: "learn", data: {}, attempts: {}, timer: null, seconds: 0, installPrompt: null,
  returnTo: null, proposed: null, paper: null, papers: null, examKind: "controle", examChapters: [], countdown: false, annaleFilter: "all"
};
const modes = { learn: "Apprentissage", train: "Entraînement", exam: "Examen" };
const pedagogy = {
  tvaTtc: { hypotheses: "Le taux de TVA t s’applique au prix hors taxes.", why: ["Le coefficient 1 + t/100 transforme le H.T. en T.T.C."], check: "Le T.T.C. doit être supérieur au H.T." },
  tvaHt: { hypotheses: "Le prix affiché est T.T.C. ; on cherche le H.T. au même taux.", why: ["On inverse la relation TTC = HT × (1 + t/100)."], check: "HT < TTC. Pour 17 %, on divise par 1,17." },
  successivePercent: { hypotheses: "Deux variations successives, appliquées l’une après l’autre au prix courant.", why: ["Chaque variation a son coefficient.", "Le pourcentage global se lit sur le produit des coefficients, pas sur la somme des taux."], check: "+10 % puis +20 % donnent +32 %." },
  heronArea: { hypotheses: "Triangle de côtés a, b, c vérifiant l’inégalité triangulaire.", why: ["Le demi-périmètre p rassemble les trois côtés.", "Héron exprime l’aire sans hauteur."], check: "Si le triangle est rectangle, A = ab/2 doit coincider avec Héron." },
  absEquation: { hypotheses: "b ≥ 0. |X| = b signifie X = b ou X = −b.", why: ["On isole l’expression à l’intérieur de la valeur absolue.", "Premier cas : signe plus.", "Second cas : signe moins."], check: "Les deux solutions sont symétriques par rapport à −a." },
  affineBounds: { hypotheses: "a parcourt un segment. f est affine, donc monotone.", why: ["On évalue f aux deux bornes.", "Si m < 0, le plus grand a donne la plus petite image."], check: "L’encadrement doit aller du plus petit au plus grand." },
  lightTime: { hypotheses: "Vitesse constante. Unités : km et km/s.", why: ["On convertit les millions de km en km.", "t = d/v, puis on passe en minutes si besoin."], check: "Terre–Soleil : un peu plus de 8 minutes." },
  scientificOrder: { hypotheses: "N ≠ 0. On cherche 1 ≤ |a| < 10 en déplaçant seulement la virgule.", why: ["On compte les rangs de virgule pour trouver n.", "L’ordre de grandeur arrondit a à l’unité, en gardant 10ⁿ."], check: "a doit être entre 1 et 10." },
  quadraticSolve: { hypotheses: "a ≠ 0. On cherche les racines réelles de ax² + bx + c = 0.", why: ["Δ = b² − 4ac décide du nombre de racines.", "Les racines s’écrivent (−b ± √Δ)/(2a).", "Somme et produit se lisent sans calculer √Δ."], check: "x₁ + x₂ = −b/a et x₁ x₂ = c/a." },
  resistors: { hypotheses: "Deux résistances, association série (R) et parallèle (r).", why: ["La somme est R, le produit est r R.", "R₁ et R₂ sont les racines du trinôme t² − R t + r R."], check: "r < min(R₁, R₂) < max(R₁, R₂) < R." },
  cyclists: { hypotheses: "Mouvements rectilignes uniformes, l’un vers l’autre.", why: ["Départ simultané : la somme des vitesses vaut D/T.", "À mi-chemin, chacun a parcouru D/2, avec des durées différentes.", "On en déduit V_A et V_B."], check: "V_A + V_B doit retrouver D/T." },
  squareDecrease: { hypotheses: "Carré de côté x. On diminue chaque côté de h.", why: ["La perte d’aire est x² − (x − h)².", "On développe : 2hx − h².", "On isole x."], check: "x > h, sinon le carré réduit n’existe pas." },
  goldenRatio: { hypotheses: "φ > 0 et φ² = φ + 1.", why: ["On résout φ² − φ − 1 = 0.", "On garde la racine positive (1 + √5)/2.", "On vérifie φ² = φ + 1."], check: "φ ≈ 1,618 et φ² ≈ 2,618." },
  polyEval: { hypotheses: "P est un polynôme de degré 3. On substitue x.", why: ["On calcule chaque puissance, puis on combine les coefficients."], check: "P(1) doit égaler la somme des coefficients." },
  polyIntegerRoot: { hypotheses: "On cherche une racine entière, qui divise le terme constant.", why: ["On teste les diviseurs de a₀ jusqu’à P(r) = 0.", "On factorise par x − r en identifiant les coefficients.", "On lit les coefficients du trinôme quotient."], check: "Le produit (−r) × coefficient constant du quotient doit égaler a₀." },
  polyKnownRoot: { hypotheses: "α est donnée comme racine : on doit d’abord vérifier P(α) = 0.", why: ["La substitution confirme la racine.", "La division par x − α fournit Q."], check: "P(α) doit être exactement 0." },
  sumIntegers: { hypotheses: "n est un entier naturel non nul.", why: ["S₁ vient de P(k) − P(k − 1) = k avec P de degré 2.", "S₂ s’obtient de même avec un polynôme de degré 3."], check: "Pour n = 10, S₁ = 55 et S₂ = 385." },
  euclidDiv: { hypotheses: "a ∈ ℕ, b > 0. Existence et unicité du couple (q, r).", why: ["On écrit a = bq + r avec 0 ≤ r < b.", "On identifie q et r, puis on contrôle le produit."], check: "bq + r doit retrouver a, et r < b." },
  remainderLast3: { hypotheses: "1000 est multiple de 8 (et de 125, etc.). Les derniers chiffres suffisent.", why: ["On isole les derniers chiffres.", "On divise ce petit entier par le module."], check: "Le reste est strictement inférieur au diviseur." },
  remainderDigits: { hypotheses: "10 ≡ 1 (mod 9), donc n ≡ somme des chiffres (mod 9).", why: ["On additionne les chiffres.", "On réduit modulo 3 ou 9."], check: "Le reste est dans {0, 1, …, 8} pour un modulo 9." },
  barcodeCheck: { hypotheses: "Code EAN-13 du manuel : rangs depuis la gauche, poids 1 et 3.", why: ["Somme des rangs impairs (1 à 11).", "Triple de la somme des rangs pairs.", "La clé rend le total multiple de 10."], check: "odd + 3×even + c se termine par 0." },
  gcd3: { hypotheses: "Arête entière. Le pavé doit être rempli sans vide ni débordement.", why: ["L’arête maximale est le PGCD des trois dimensions.", "Le nombre de cubes est le produit des quotients."], check: "L, ℓ et h doivent être multiples de a." },
  vectorAB: { hypotheses: "Repère cartésien. Les composantes sont les différences d’abscisses et d’ordonnées.", why: ["AB⃗ = (x_B − x_A ; y_B − y_A).", "La norme est √(x² + y²) en base orthonormée."], check: "|AB⃗| = |BA⃗| mais AB⃗ = −BA⃗." },
  detColinear: { hypotheses: "Base du plan. La colinéarité se lit sur le déterminant.", why: ["det = xy' − x'y.", "det = 0  ⇔  vecteurs colinéaires."], check: "Si un vecteur est nul, det = 0 : colinéarité (convention)." },
  dotOrtho: { hypotheses: "Base orthonormée. L’orthogonalité se lit sur le produit scalaire.", why: ["u⃗ · v⃗ = xx' + yy'.", "Le produit nul caractérise l’orthogonalité."], check: "Ne pas utiliser le déterminant pour la perpendicularité." },
  parallelogramD: { hypotheses: "ABCD dans cet ordre : AB⃗ = DC⃗.", why: ["D = A + C − B.", "On calcule chaque coordonnée."], check: "Le milieu de [AC] doit coïncider avec celui de [BD]." },
  bary1d: { hypotheses: "α + β ≠ 0. G est unique sur la droite (AB).", why: ["La relation des masses donne AG⃗ = β/(α+β) AB⃗.", "L’abscisse est la moyenne pondérée.", "Le coefficient k = β/(α+β) situe G par rapport à [AB]."], check: "Si α = β, G est le milieu." },
  bary2d: { hypotheses: "α + β + γ ≠ 0. Les trois points ne sont pas nécessairement non alignés.", why: ["On somme les masses.", "G est la moyenne pondérée des coordonnées."], check: "Masses égales : G est le centre de gravité (médianes)." },
  translation: { hypotheses: "Le vecteur v⃗ est constant. t(M) = M + v⃗.", why: ["MM'⃗ = v⃗ par définition.", "On ajoute les composantes."], check: "Tous les segments [MM'] sont équipollents." },
  homothety: { hypotheses: "Centre O, rapport k ≠ 0. OM'⃗ = k OM⃗.", why: ["M' = O + k(M − O).", "On calcule les deux coordonnées.", "MM' = |k − 1| · OM."], check: "Si k = 1, M' = M. Si k = −1, O est le milieu de [MM']." },
  homothetyScale: { hypotheses: "L’homothétie multiplie les longueurs par |k| et les aires par k².", why: ["Le périmètre est une somme de longueurs, donc il est multiplié par |k|.", "L’aire est multipliée par k² (le cours du chapitre 8)."], check: "k = 1/2  ⇔  aire divisée par 4, périmètre par 2." },
  rotation90: { hypotheses: "Repère orthonormé direct. Quart de tour de centre O.", why: ["Le vecteur OM⃗ tourne de +90°.", " (x, y) ↦ (−y, x) dans le repère d’origine O."], check: "OM' = OM et OM⃗ · OM'⃗ = 0." },
  rotationAngle: { hypotheses: "Rotation directe de centre O et d’angle α. Définition du cours : OM' = OM et l’angle MOM' vaut α.", why: ["La distance au centre est conservée.", "Pour 90°, on utilise le quart de tour : (x ; y) ↦ (−y ; x) autour de l’origine.", "Pour 180°, M' = 2O − M (symétrie centrale)."], check: "OM' = OM. Pour 90°, OM⃗ · OM'⃗ = 0." },
  arithSeq: { hypotheses: "Suite arithmétique de premier terme u₁ et de raison r.", why: ["uₙ = u₁ + (n−1)r.", "Sₙ = n(u₁ + uₙ)/2."], check: "La différence uₙ − uₙ₋₁ doit retrouver r." },
  geoSeq: { hypotheses: "Suite géométrique de premier terme u₁ et de raison q ≠ 0.", why: ["uₙ = u₁ q^{n−1}.", "Si q ≠ 1, Sₙ = u₁(1 − qⁿ)/(1 − q)."], check: "Le rapport uₙ / uₙ₋₁ doit retrouver q." },
  affineFn: { hypotheses: "f est affine : f(x) = ax + b. La courbe est une droite.", why: ["On substitue x₀ dans ax + b."], check: "f(0) = b. La pente est a." },
  quadFn: { hypotheses: "f(x) = ax² + bx + c, a ≠ 0. La courbe est une parabole.", why: ["On calcule a x₀² + b x₀ + c."], check: "Si a > 0, la parabole est tournée vers le haut." },
  trigExact: { hypotheses: "Cercle trigonométrique, angles remarquables du cours.", why: ["M a pour coordonnées (cos α ; sin α)."], check: "cos²α + sin²α = 1." },
  distance2d: { hypotheses: "Repère orthonormé. Distance et milieu.", why: ["AB = √[(Δx)²+(Δy)²].", "I est la moyenne des coordonnées."], check: "AI = IB = AB/2." },
  lineSlope: { hypotheses: "Droite non verticale. y = mx + p.", why: ["m = (y_B−y_A)/(x_B−x_A).", "p = y_A − m x_A."], check: "Les deux points doivent vérifier l’équation." },
  statsMean: { hypotheses: "Série quantitative d’effectif n.", why: ["x̄ = (Σxᵢ)/n.", "Étendue = max − min."], check: "La moyenne est entre min et max." },
  fixed: { hypotheses: "On travaille avec le cours du chapitre, sur les questions posées dans l’application.", why: ["On identifie la relation du cours.", "On substitue les données, puis on contrôle."], check: "La réponse doit coller au calcul, pas à une relecture du livre." },
};

const equationSheets = {
  tvaTtc: ["TTC = HT × (1 + t/100)"],
  tvaHt: ["HT = TTC / (1 + t/100)"],
  successivePercent: ["1 + p/100 = (1 + p₁/100)(1 + p₂/100)"],
  heronArea: ["p = (a+b+c)/2", "A = √[p(p−a)(p−b)(p−c)]"],
  absEquation: ["|x + a| = b  ⇔  x = −a ± b", "b ≥ 0"],
  affineBounds: ["a ∈ [m, M]", "α ≥ 0 : l’ordre se conserve", "α < 0 : l’ordre s’inverse"],
  lightTime: ["t = d / v"],
  scientificOrder: ["N = a × 10ⁿ", "1 ≤ |a| < 10"],
  quadraticSolve: ["Δ = b² − 4ac", "x = (−b ± √Δ)/(2a)", "S = −b/a", "P = c/a"],
  resistors: ["R = R₁ + R₂", "1/r = 1/R₁ + 1/R₂", "R₁ R₂ = r R"],
  cyclists: ["(V_A + V_B) T = D", "à mi-chemin : d_A = d_B = D/2"],
  squareDecrease: ["x² − (x − h)² = ΔA", "2hx − h² = ΔA"],
  goldenRatio: ["φ² = φ + 1", "φ = (1 + √5)/2"],
  polyEval: ["P(x) = a₃x³ + a₂x² + a₁x + a₀"],
  polyIntegerRoot: ["P(r) = 0  ⇔  (x − r) | P", "r divise a₀"],
  polyKnownRoot: ["P(α) = 0  ⇒  P(x) = (x − α) Q(x)"],
  sumIntegers: ["S₁ = n(n+1)/2", "S₂ = n(n+1)(2n+1)/6"],
  euclidDiv: ["a = bq + r", "0 ≤ r < b"],
  remainderLast3: ["n ≡ derniers chiffres (mod 8 ou 25)"],
  remainderDigits: ["n ≡ somme des chiffres (mod 9)"],
  barcodeCheck: ["Σ impairs + 3 Σ pairs + c ≡ 0 (mod 10)"],
  gcd3: ["a = PGCD(L, ℓ, h)", "N = (L/a)(ℓ/a)(h/a)"],
  vectorAB: ["AB⃗ = (x_B − x_A ; y_B − y_A)", "|AB⃗| = √(x² + y²)"],
  detColinear: ["det = xy' − x'y", "colinéaires  ⇔  det = 0"],
  dotOrtho: ["u⃗ · v⃗ = xx' + yy'", "orthogonaux  ⇔  produit nul"],
  parallelogramD: ["D = A + C − B"],
  bary1d: ["α GA⃗ + β GB⃗ = 0", "AG⃗ = β/(α+β) AB⃗"],
  bary2d: ["G = (αA + βB + γC)/(α+β+γ)"],
  translation: ["MM'⃗ = v⃗", "M'N'⃗ = MN⃗"],
  homothety: ["OM'⃗ = k OM⃗", "M'N'⃗ = k MN⃗", "MM' = |k−1| OM"],
  homothetyScale: ["p' = |k| p", "A' = k² A"],
  rotation90: ["(x, y) ↦ (−y, x) autour de O"],
  rotationAngle: ["OM' = OM", "angle MOM' = α"],
  arithSeq: ["uₙ = u₁ + (n−1)r", "Sₙ = n(u₁+uₙ)/2"],
  geoSeq: ["uₙ = u₁ q^{n−1}", "Sₙ = u₁(1−qⁿ)/(1−q)  (q ≠ 1)"],
  affineFn: ["f(x) = ax + b"],
  quadFn: ["f(x) = ax² + bx + c"],
  trigExact: ["M(cos α ; sin α)", "cos²α + sin²α = 1"],
  distance2d: ["AB = √[(x_B−x_A)²+(y_B−y_A)²]", "I milieu"],
  lineSlope: ["m = (y_B−y_A)/(x_B−x_A)", "y = mx + p"],
  statsMean: ["x̄ = (Σxᵢ)/n", "étendue = max − min"],
  fixed: ["Écrire la relation du cours, puis substituer les données."],
};

const esc = value => String(value).replace(/[&<>'"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[c]));
const parse = value => Number(String(value).trim().replace(",", ".").replace(/\s/g, ""));
const qType = q => q.type || "number";
const varsOf = e => e.variables || [];
const normAnswer = value => String(value ?? "").trim().toLowerCase().replace(/[ \u00a0]/g, "").replace(/,/g, ".").replace(/[−–]/g, "-").replace(/²/g, "2").replace(/³/g, "3");
function readAnswer(q) {
  if (qType(q) === "tf" || qType(q) === "mcq") {
    return document.querySelector(`input[name="a_${q.key}"]:checked`)?.value ?? "";
  }
  return document.querySelector(`#a_${q.key}`)?.value ?? "";
}
function setAnswerValue(q, value) {
  if (qType(q) === "tf" || qType(q) === "mcq") {
    const wanted = String(value ?? "");
    document.querySelectorAll(`input[name="a_${q.key}"]`).forEach(el => { el.checked = el.value === wanted; });
    return;
  }
  const input = document.querySelector(`#a_${q.key}`);
  if (input) input.value = value ?? "";
}
function answersMatch(q, given, target) {
  if (qType(q) === "number") return isClose(parse(given), Number(target));
  return normAnswer(given) === normAnswer(target);
}
function formatAnswer(q, value) {
  if (qType(q) === "tf") return String(value).toLowerCase() === "vrai" ? "Vrai" : "Faux";
  if (qType(q) === "mcq" || qType(q) === "text") return String(value ?? "—");
  const num = Number(value);
  const unit = q.unit && q.unit !== "—" ? ` ${q.unit}` : "";
  return Number.isFinite(num) ? `${num.toLocaleString("fr-FR", { maximumSignificantDigits: 5 })}${unit}` : `${value ?? "—"}${unit}`;
}
const randomValue = v => Number((Math.round((v.min + Math.random() * (v.max - v.min)) / v.step) * v.step).toFixed(8));
const formatTime = seconds => {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}` : `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};
const toast = text => { const el = document.querySelector("#toast"); el.textContent = text; el.classList.add("show"); setTimeout(() => el.classList.remove("show"), 1800); };
const bandLabel = id => BANDS.find(b => b.id === id)?.label || id;

function applyTomeChrome() {
  const small = document.querySelector(".brand small");
  if (small) small.textContent = `Sciences · TI · Tome ${state.tome}`;
  const link = document.querySelector("#polyLink") || document.querySelector(".course-link");
  if (link) {
    link.href = state.tome === 2 ? "docs/Livre_2_Sc_T2.pdf" : "docs/Livre_2_Sc_T1.pdf";
    link.textContent = `Polycopié tome ${state.tome}`;
  }
  document.querySelectorAll("[data-tome]").forEach(b => b.classList.toggle("active", Number(b.dataset.tome) === state.tome));
  document.title = `Maths 2ème · Tome ${state.tome}`;
}

function setTome(n) {
  const tome = n === 2 ? 2 : 1;
  if (!state.catalogs[tome]) return;
  state.tome = tome;
  state.catalog = state.catalogs[tome];
  state.proposed = null;
  state.paper = null;
  state.papers = null;
  state.examChapters = [];
  state.exercise = null;
  try { localStorage.setItem("math2-tome", String(tome)); } catch { /* ignore */ }
  applyTomeChrome();
  home();
}

function inPaper() { return state.returnTo === "paper" && state.paper; }

function home() {
  stopTimer();
  state.exercise = null;
  state.returnTo = null;
  state.paper = null;
  const nAct = state.catalog.exercises.filter(e => e.kind === "activity").length;
  const nPar = state.catalog.exercises.filter(e => e.kind !== "activity").length;
  const nAnn = state.annales.papers.filter(p => (p.tome || 1) === state.tome).length;
  const tomeLabel = state.tome === 2 ? "tome 2 (suites, fonctions, trigo, géométrie, stats)" : "tome 1, dans l’ordre du livre";
  app.innerHTML = `<section class="hero"><p class="eyebrow">Mathématiques · 2ème année secondaire · Tome ${state.tome}</p><h1>Comprendre, calculer, vérifier.</h1><p>Toutes les activités du manuel CNP (${tomeLabel}), plus les annales en devoir chronométré : copie, correction et note sur 20. Les courbes s’affichent à gauche de chaque exercice.</p><div class="signature">Lycée Pilote Sakiet Ezzit<br><strong>Mariam Ksentini</strong></div></section>
  <div class="exam-launch three"><button class="exam-launch-btn" id="makeControle"><strong>Devoirs surveillés</strong><span>Mi-trimestre · 1 h · sujets générés</span></button><button class="exam-launch-btn" id="makeSynthese"><strong>Devoirs de synthèse</strong><span>Fin de trimestre · 2 h · sujets générés</span></button><button class="exam-launch-btn" id="openAnnales"><strong>Annales</strong><span>${nAnn} devoirs chronométrés · correction et note</span></button></div>
  <div class="section-title"><div><h2>Choisir un chapitre</h2><p>${nAct} activités du livre, ${nPar} exercices paramétriques, plus 40 exercices générés par chapitre (faciles, moyens, difficiles, casse-tête).</p></div></div>
  <section class="chapter-grid">${state.catalog.chapters.map(ch => { const n = state.catalog.exercises.filter(e => e.chapter === ch.id && e.kind === "activity").length; return `<button class="chapter" data-chapter="${ch.id}"><span class="num">${ch.number}</span><h3>${esc(ch.title)}</h3><p>${esc(ch.description)}</p><span class="count">${n} activité${n > 1 ? "s" : ""} du livre →</span></button>`; }).join("")}</section>`;
  document.querySelectorAll("[data-chapter]").forEach(button => button.addEventListener("click", () => chapterPage(button.dataset.chapter)));
  document.querySelector("#makeControle").addEventListener("click", () => examSetup("controle"));
  document.querySelector("#makeSynthese").addEventListener("click", () => examSetup("synthese"));
  document.querySelector("#openAnnales").addEventListener("click", () => annalesPage(state.annaleFilter));
  history.replaceState({}, "", location.pathname);
}

const ANNALE_FILTERS = [
  { id: "all", label: "Tous" },
  { id: "sfax1", label: "Sfax 1" },
  { id: "sfax2", label: "Sfax 2" },
  { id: "pilote", label: "Pilotes" },
  { id: "controle", label: "Contrôle" },
  { id: "synthese", label: "Synthèse" }
];

function matchAnnale(p, filter) {
  if (filter === "all") return true;
  if (filter === "sfax1") return p.region === "Sfax 1" || /Sfax 1|Mohamed Ali|Bir Ali|Ghraiba/i.test(`${p.region || ""} ${p.lycee || ""}`);
  if (filter === "sfax2") return p.region === "Sfax 2" || /Sakiet|Ezzit|Sfax 2/i.test(`${p.region || ""} ${p.lycee || ""}`);
  if (filter === "pilote") return !!p.pilote;
  if (filter === "controle") return p.kind === "controle";
  if (filter === "synthese") return p.kind === "synthese";
  return true;
}

function annalesPage(filter = "all") {
  state.annaleFilter = filter;
  const papers = state.annales.papers.filter(p => (p.tome || 1) === state.tome).filter(p => matchAnnale(p, filter));
  app.innerHTML = `<button class="back" id="backHome">← Accueil</button>
    <section class="chapter-banner"><span class="num">Σ</span><div><h1>Annales de devoirs</h1><p>Sujets publics réécrits pour une copie chronométrée. À la fin : correction détaillée et note sur 20. Le PDF d’origine reste disponible.</p></div></section>
    <div class="annale-filters">${ANNALE_FILTERS.map(f => `<button class="ghost ${filter === f.id ? "active" : ""}" data-filter="${f.id}">${f.label}</button>`).join("")}</div>
    <div class="section-title"><div><h2>${papers.length} devoir${papers.length > 1 ? "s" : ""}</h2><p>Choisir un sujet, puis commencer le devoir. Le rappel de cours est masqué pendant l’épreuve.</p></div></div>
    <section class="exercise-list">${papers.map(p => `<button class="exercise-card" data-annale="${p.id}"><span class="exercise-index">${p.kind === "synthese" ? "DS" : "DC"}</span><span><strong>${esc(p.title)}</strong><small>${esc([p.lycee || p.region, p.year, p.kind === "synthese" ? "2 h" : "1 h", `${p.exercises.length} exercices`].filter(Boolean).join(" · "))}</small></span><span class="arrow">→</span></button>`).join("") || `<p class="muted">Aucun sujet dans ce filtre pour l’instant.</p>`}</section>`;
  document.querySelector("#backHome").addEventListener("click", home);
  document.querySelectorAll("[data-filter]").forEach(b => b.addEventListener("click", () => annalesPage(b.dataset.filter)));
  document.querySelectorAll("[data-annale]").forEach(b => b.addEventListener("click", () => openAnnale(b.dataset.annale)));
  history.replaceState({}, "", "#annales");
}

function paperFromAnnale(p) {
  const duration = p.duration || (p.kind === "synthese" ? 7200 : 3600);
  return {
    id: p.id,
    title: p.title,
    kind: p.kind,
    duration,
    durationLabel: duration >= 5400 ? "2 h" : "1 h",
    exercises: p.exercises.map(ex => ({ ...ex })),
    source: p.source,
    fromAnnale: true
  };
}

function openAnnale(id) {
  const paper = state.annales.papers.find(p => p.id === id);
  if (!paper) { annalesPage(state.annaleFilter); return; }
  const duration = paper.kind === "synthese" ? "2 h" : "1 h";
  const meta = [paper.lycee, paper.region, paper.year, duration].filter(Boolean).join(" · ");
  const lead = (paper.statement || "").split("Aperçu du sujet :")[0].trim();
  app.innerHTML = `<button class="back" id="backAnnales">← Toutes les annales</button>
    <section class="chapter-banner"><span class="num">${paper.kind === "synthese" ? "DS" : "DC"}</span><div><h1>${esc(paper.title)}</h1><p>${esc(meta)}</p></div></section>
    <article class="card"><h2>Déroulement</h2><p>Le devoir dure <strong>${duration}</strong>. Le rappel de cours est masqué. Vous passez d’un exercice à l’autre, puis vous rendez la copie. La correction et la note sur 20 s’affichent à la fin.</p><p>${esc(lead)}</p>${paper.source ? `<p class="source-link"><a href="${esc(paper.source)}" target="_blank" rel="noopener">Ouvrir le PDF d’origine</a></p>` : ""}<div class="actions"><button class="primary" id="startAnnale">Commencer le devoir (${duration})</button></div></article>
    <div class="section-title"><div><h2>${paper.exercises.length} exercices</h2><p>Énoncés réécrits à partir du sujet public, pour une copie que l’on peut noter.</p></div></div>
    <section class="exercise-list">${paper.exercises.map(ex => `<div class="exercise-card static"><span class="exercise-index">${String(ex.n).padStart(2, "0")}</span><span><strong>${esc(ex.title)}</strong><small>${esc(ex.statement)}</small></span></div>`).join("")}</section>`;
  document.querySelector("#backAnnales").addEventListener("click", () => annalesPage(state.annaleFilter));
  document.querySelector("#startAnnale").addEventListener("click", () => startPaper(paperFromAnnale(paper)));
  history.replaceState({}, "", `#${paper.id}`);
}

function courseHtml(chapterId) {
  const course = chapterCourse(chapterId);
  return `<article class="card course-block"><p class="recap-kicker">Cours détaillé</p><h2>${esc(course.title)}</h2><p class="recap-lead">${esc(course.lead)}</p>${course.sections.map(s => `<section class="course-section"><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></section>`).join("")}</article>`;
}

function chapterPage(chapterId) {
  const chapter = state.catalog.chapters.find(c => c.id === chapterId);
  const exercises = state.catalog.exercises.filter(e => e.chapter === chapterId);
  const activities = exercises.filter(e => e.kind === "activity").sort((a, b) => a.activity - b.activity);
  const parametric = exercises.filter(e => e.kind !== "activity");
  const card = (e, i, tag) => `<button class="exercise-card" data-exercise="${e.id}"><span class="exercise-index">${e.kind === "activity" ? String(e.activity).padStart(2, "0") : String(i + 1).padStart(2, "0")}</span><span><strong>${esc(e.title)}</strong><small>${tag}</small></span><span class="arrow">→</span></button>`;
  app.innerHTML = `<button class="back" id="backHome">← Tous les chapitres</button>
    <section class="chapter-banner"><span class="num">${chapter.number}</span><div><h1>${esc(chapter.title)}</h1><p>${esc(chapter.description)}</p></div></section>
    ${courseHtml(chapterId)}
    <div class="propose-cta"><button class="primary" id="propose">Proposer des exercices</button><p>10 faciles, 10 moyens, 10 difficiles et 10 casse-tête, générés en plus des activités du polycopié.</p></div>
    <div class="section-title"><div><h2>Activités du polycopié</h2><p>${activities.length} activité${activities.length > 1 ? "s" : ""} du manuel, dans l’ordre du livre.</p></div></div>
    <section class="exercise-list">${activities.map(e => card(e, 0, `Activité du tome ${state.tome}`)).join("")}</section>
    <div class="section-title"><div><h2>Exercices paramétriques</h2><p>Mêmes types de calculs, données que l’on peut modifier.</p></div></div>
    <section class="exercise-list">${parametric.map((e, i) => card(e, i, `Niveau ${e.difficulty} · données paramétriques`)).join("")}</section>`;
  document.querySelector("#backHome").addEventListener("click", home);
  document.querySelector("#propose").addEventListener("click", () => proposePage(chapterId, true));
  document.querySelectorAll("[data-exercise]").forEach(b => b.addEventListener("click", () => {
    state.returnTo = "chapter";
    openExercise(state.catalog.exercises.find(e => e.id === b.dataset.exercise));
  }));
}

function proposePage(chapterId, fresh = false) {
  if (fresh || !state.proposed || state.proposed.chapterId !== chapterId) {
    state.proposed = { chapterId, set: generateChapterSet(chapterId) };
  }
  const chapter = state.catalog.chapters.find(c => c.id === chapterId);
  const set = state.proposed.set;
  app.innerHTML = `<button class="back" id="backChapter">← Cours du chapitre</button>
    <section class="chapter-banner"><span class="num">${chapter.number}</span><div><h1>Exercices proposés</h1><p>${esc(chapter.title)} — 40 situations générées, même schéma de travail que le manuel.</p></div></section>
    <div class="actions propose-tools"><button class="secondary" id="refreshSet">↻ Nouveau tirage</button></div>
    <div class="band-grid">${BANDS.map(band => `
      <section class="band-block ${band.id}"><h2>${esc(band.label)} <small>10 exercices</small></h2>
      <div class="exercise-list">${set[band.id].map((e, i) => `<button class="exercise-card" data-band="${band.id}" data-index="${i}"><span class="exercise-index">${String(i + 1).padStart(2, "0")}</span><span><strong>${esc(e.title)}</strong><small>${esc(e.statement)}</small></span><span class="arrow">→</span></button>`).join("")}</div></section>`).join("")}</div>`;
  document.querySelector("#backChapter").addEventListener("click", () => chapterPage(chapterId));
  document.querySelector("#refreshSet").addEventListener("click", () => proposePage(chapterId, true));
  document.querySelectorAll("[data-band]").forEach(b => b.addEventListener("click", () => {
    state.returnTo = "propose";
    openExercise(set[b.dataset.band][Number(b.dataset.index)]);
  }));
}

function examSetup(kind) {
  state.examKind = kind;
  const duration = kind === "synthese" ? "2 h" : "1 h";
  const title = kind === "synthese" ? "Devoirs de synthèse" : "Devoirs surveillés";
  const selected = new Set(state.examChapters.length ? state.examChapters : state.catalog.chapters.map(c => c.id));
  app.innerHTML = `<button class="back" id="backHome">← Accueil</button>
    <section class="chapter-banner"><span class="num">${kind === "synthese" ? "Σ" : "DS"}</span><div><h1>${title}</h1><p>L’élève connaît les chapitres au programme. Cochez-les, puis générez 2 sujets faciles, 2 moyens et 2 difficiles (${duration}, ${kind === "synthese" ? "4 à 5" : "3 à 5"} exercices chacun).</p></div></section>
    <article class="card"><h2>Chapitres au programme</h2><div class="chapter-picks">${state.catalog.chapters.map(ch => `<label><input type="checkbox" data-ch="${ch.id}" ${selected.has(ch.id) ? "checked" : ""}><span><strong>${ch.number}. ${esc(ch.title)}</strong></span></label>`).join("")}</div>
    <div class="actions"><button class="secondary" id="pickAll">Tout cocher</button><button class="secondary" id="pickNone">Tout décocher</button><button class="primary" id="buildPapers">Générer les 6 sujets</button></div></article>`;
  document.querySelector("#backHome").addEventListener("click", home);
  const boxes = () => [...document.querySelectorAll("[data-ch]")];
  document.querySelector("#pickAll").addEventListener("click", () => boxes().forEach(b => { b.checked = true; }));
  document.querySelector("#pickNone").addEventListener("click", () => boxes().forEach(b => { b.checked = false; }));
  document.querySelector("#buildPapers").addEventListener("click", () => {
    const ids = boxes().filter(b => b.checked).map(b => b.dataset.ch);
    if (!ids.length) { toast("Cochez au moins un chapitre."); return; }
    state.examChapters = ids;
    state.papers = generatePapers(kind, ids);
    paperList();
  });
}

function paperList() {
  const kind = state.examKind;
  const title = kind === "synthese" ? "Devoirs de synthèse" : "Devoirs surveillés";
  app.innerHTML = `<button class="back" id="backSetup">← Chapitres au programme</button>
    <div class="section-title"><div><h2>${title}</h2><p>Deux sujets par niveau. Compte à rebours ${kind === "synthese" ? "2 h" : "1 h"} dès le début de l’épreuve. Le rappel de cours est masqué, les équations restent visibles.</p></div></div>
    <section class="paper-grid">${state.papers.map((p, i) => `<button class="paper-card ${p.band}" data-paper="${i}"><span class="paper-level">${esc(bandLabel(p.band))}</span><h3>${esc(p.title)}</h3><p>${p.exercises.length} exercices · ${p.durationLabel}</p><small>${p.exercises.map(e => e.title).join(" · ")}</small></button>`).join("")}</section>`;
  document.querySelector("#backSetup").addEventListener("click", () => examSetup(kind));
  document.querySelectorAll("[data-paper]").forEach(b => b.addEventListener("click", () => startPaper(state.papers[Number(b.dataset.paper)])));
}

function startPaper(paper) {
  stopTimer();
  state.paper = { ...paper, index: 0, answers: {}, remaining: paper.duration };
  state.seconds = paper.duration;
  state.returnTo = "paper";
  openExercise(paper.exercises[0], "exam", { fixed: true, keepTimer: false });
}

function openExercise(exercise, mode = state.mode, options = {}) {
  if (inPaper() && state.exercise) savePaperAnswers();
  if (!inPaper()) stopTimer();
  state.exercise = exercise;
  state.mode = inPaper() ? "exam" : mode;
  state.attempts = {};
  const vars = varsOf(exercise);
  const fixed = inPaper() || options.fixed || state.mode === "learn" || !vars.length;
  state.data = Object.fromEntries(vars.map(v => [v.key, fixed ? v.value : randomValue(v)]));
  renderExercise();
  if (inPaper()) {
    startCountdown(state.paper.remaining ?? state.paper.duration);
    restorePaperAnswers();
  } else if (state.mode === "exam") startTimer();
  if (exercise.generated && !inPaper()) history.replaceState({}, "", location.pathname);
  else if (inPaper()) history.replaceState({}, "", `#${state.paper.id}`);
  else history.replaceState({}, "", `#${exercise.id}`);
}

function recapHtml(e) {
  if (state.mode === "exam") return "";
  const recap = courseRecap(e.solver);
  const details = recap.details?.length ? `<div class="recap-details">${recap.details.map(d => `<p>${esc(d)}</p>`).join("")}</div>` : "";
  return `<article class="card recap-card"><p class="recap-kicker">Rappel de cours</p><h2>${esc(recap.title)}</h2><p class="recap-lead">${esc(recap.lead)}</p><ul class="recap-points">${recap.points.map(p => `<li>${esc(p)}</li>`).join("")}</ul>${details}<p class="recap-watch"><strong>Piège fréquent.</strong> ${esc(recap.watch)}</p></article>`;
}

function lectureHtml(e) {
  if (state.mode === "exam" || e.kind === "activity") return "";
  const recap = courseRecap(e.solver);
  if (!recap.details?.length) return "";
  return `<div class="statement-help"><p class="recap-kicker">Lecture détaillée de l’énoncé</p>${recap.details.map(d => `<p>${esc(d)}</p>`).join("")}</div>`;
}

function paperNavHtml() {
  if (!inPaper()) return "";
  const n = state.paper.exercises.length;
  const i = state.paper.exercises.findIndex(e => e.id === state.exercise.id);
  state.paper.index = i < 0 ? 0 : i;
  const pdf = state.paper.source ? `<a class="ghost" href="${esc(state.paper.source)}" target="_blank" rel="noopener">PDF d’origine</a>` : "";
  return `<div class="paper-nav"><button class="secondary" id="prevEx" ${i <= 0 ? "disabled" : ""}>← Précédent</button><span>Exercice ${i + 1} / ${n} · ${esc(state.paper.title)}</span><button class="secondary" id="nextEx" ${i >= n - 1 ? "disabled" : ""}>Suivant →</button>${pdf}<button class="primary" id="renderPaper">Rendre le devoir</button></div>`;
}

function renderExercise() {
  const e = state.exercise;
  const chapter = state.catalog.chapters.find(c => c.id === e.chapter)
    || state.catalogs[1]?.chapters.find(c => c.id === e.chapter)
    || state.catalogs[2]?.chapters.find(c => c.id === e.chapter)
    || { number: "Σ", title: "Annale" };
  const vars = varsOf(e);
  const backLabel = inPaper() ? (state.paper.fromAnnale ? "← Annales" : "← Sujets") : state.returnTo === "propose" ? "← Exercices proposés" : "← Exercices du chapitre";
  const modeSwitch = inPaper() ? "" : `<div class="mode-switch" aria-label="Mode de travail">${Object.entries(modes).map(([key, label]) => `<button data-mode="${key}" class="${state.mode === key ? "active" : ""}">${label}</button>`).join("")}</div>`;
  const clockText = inPaper() ? `Reste ${formatTime(state.seconds)}` : state.mode === "exam" ? "Temps 00:00" : "";
  const dataBlock = vars.length
    ? `<div class="data-grid">${vars.map(v => `<div class="field"><label for="v_${v.key}">${esc(v.label)}</label><div class="input-wrap"><input id="v_${v.key}" data-variable="${v.key}" type="number" step="any" value="${state.data[v.key]}" ${state.mode === "exam" ? "readonly" : ""}><span class="unit">${v.unit}</span></div></div>`).join("")}</div><div class="actions">${state.mode !== "learn" && !inPaper() ? `<button class="secondary" id="randomize">↻ Nouvelles données</button>` : ""}</div>`
    : "";
  const statement = e.kind === "activity"
    ? `<pre class="statement">${esc(e.statement)}</pre>`
    : `<p class="statement">${esc(e.statement)}</p>`;
  const sub = inPaper() && state.paper.fromAnnale
    ? `Annale · Exercice ${state.paper.index + 1} / ${state.paper.exercises.length} · ${state.paper.durationLabel}`
    : `Chapitre ${chapter.number} · ${e.kind === "activity" ? `Activité ${e.activity} du livre` : `Niveau ${e.difficulty}`}${e.band ? " · " + bandLabel(e.band) : ""}`;
  app.innerHTML = `<section class="exercise-head"><div><button class="back" id="back">${backLabel}</button><h1>${esc(e.title)}</h1><p>${esc(sub)}</p>${paperNavHtml()}</div><div>${modeSwitch}<div id="clock" class="exam-clock">${clockText}</div></div></section>
    <section class="workspace"><div><article class="card"><h2>Schéma de l’exercice</h2><div class="diagram" id="diagram"></div><p class="diagram-note" id="diagramNote"></p></article>${recapHtml(e)}<article class="card"><h2>Énoncé</h2>${statement}${lectureHtml(e)}${dataBlock}</article></div>
    <div><article class="card"><h2>${state.mode === "exam" ? "Votre copie" : "Résolution guidée"}</h2><div id="questions">${e.questions.map((q, i) => question(q, i)).join("")}</div><div class="actions">${inPaper() ? "" : `<button class="primary" id="submitAll">${state.mode === "exam" ? "Rendre la copie" : "Tout vérifier"}</button>`}${state.mode !== "exam" ? `<button class="secondary" id="showCorrection">Voir la correction</button>` : ""}</div><div id="score"></div></article><article class="card correction" id="correction" hidden></article></div></section>`;
  const formulas = equationSheets[e.solver] || ["Consulter la synthèse du chapitre et écrire la relation littérale."];
  app.querySelector(".workspace > div:nth-child(2)").insertAdjacentHTML("afterbegin", `<article class="card equation-card"><h2>Équations utiles</h2><p class="equation-intro">Rappel littéral — identifiez chaque grandeur avant de remplacer les valeurs.</p>${formulas.map(f => `<div class="equation-line">${esc(f)}</div>`).join("")}</article>`);
  bindExerciseEvents();
  refreshDiagram();
}

function question(q, i) {
  const checkBtn = state.mode !== "exam" ? `<button class="ghost" data-check="${q.key}">Vérifier</button>` : "";
  const title = `<div class="question-title">${i + 1}. ${esc(q.label)}</div>`;
  if (qType(q) === "tf") {
    return `<div class="question">${title}<div class="answer-row"><div class="choice-row" role="radiogroup">${["vrai", "faux"].map(v => `<label class="choice"><input type="radio" name="a_${q.key}" value="${v}"> ${v === "vrai" ? "Vrai" : "Faux"}</label>`).join("")}</div>${checkBtn}</div><p class="feedback" id="f_${q.key}"></p></div>`;
  }
  if (qType(q) === "mcq") {
    return `<div class="question">${title}<div class="answer-row"><div class="choice-row" role="radiogroup">${(q.options || []).map(o => `<label class="choice"><input type="radio" name="a_${q.key}" value="${esc(o)}"> ${esc(o)}</label>`).join("")}</div>${checkBtn}</div><p class="feedback" id="f_${q.key}"></p></div>`;
  }
  const unit = q.unit && q.unit !== "—" ? `<span class="unit">${esc(q.unit)}</span>` : "";
  const mode = qType(q) === "text" ? "text" : "decimal";
  return `<div class="question">${title}<div class="answer-row"><div class="input-wrap"><input id="a_${q.key}" data-answer="${q.key}" inputmode="${mode}" autocomplete="off" placeholder="Votre réponse">${unit}</div>${checkBtn}</div><p class="feedback" id="f_${q.key}"></p></div>`;
}

function readData() {
  varsOf(state.exercise).forEach(v => {
    const el = document.querySelector(`#v_${v.key}`);
    if (el) state.data[v.key] = parse(el.value);
  });
}
function check(key) {
  readData();
  const q = state.exercise.questions.find(item => item.key === key);
  const target = solve(state.exercise, state.data).values[key];
  const given = readAnswer(q);
  const feedback = document.querySelector(`#f_${key}`);
  state.attempts[key] = (state.attempts[key] || 0) + 1;
  const correct = answersMatch(q, given, target);
  feedback.className = `feedback ${correct ? "good" : "bad"}`;
  feedback.innerHTML = correct ? "✓ Correct." : `✕ À revoir.${state.mode === "learn" && state.attempts[key] > 1 ? `<span class="hint">Indice : écrire d’abord la relation du cours, puis substituer les données.</span>` : ""}`;
  return correct;
}
function submitAll() {
  const correct = state.exercise.questions.filter(q => check(q.key)).length, total = state.exercise.questions.length, score = 20 * correct / total;
  document.querySelector("#score").innerHTML = `<p class="score">Résultat : ${correct}/${total} — ${score.toLocaleString("fr-FR", { maximumFractionDigits: 1 })}/20</p>`;
  if (state.mode === "exam") { stopTimer(); showCorrection(); document.querySelector("#showCorrection")?.remove(); }
}
function showCorrection() {
  readData(); const result = solve(state.exercise, state.data), box = document.querySelector("#correction");
  const guide = pedagogy[state.exercise.solver] || { hypotheses: "On travaille dans IR, avec les notations du manuel.", why: [], check: "Vérifier les unités et l’ordre de grandeur." };
  const vars = varsOf(state.exercise);
  const dataHtml = vars.length
    ? `<div class="data-summary">${vars.map(v => `<span><small>${esc(v.label)}</small><strong>${esc(state.data[v.key])} ${v.unit}</strong></span>`).join("")}</div><p class="method-note">Avant tout calcul, on écrit la relation littérale du cours, on identifie chaque grandeur, puis on substitue.</p>`
    : `<p class="method-note">Les questions ci-contre se calculent dans l’application : la correction s’affiche après vérification.</p>`;
  box.hidden = false; box.innerHTML = `<h2>Correction détaillée</h2><section class="reasoning"><h3>1. Hypothèses et modèle</h3><p>${esc(guide.hypotheses)}</p></section><section class="given-data"><h3>2. Données de l’énoncé</h3>${dataHtml}</section><h3>3. Résolution raisonnée</h3>${result.steps.map((s, i) => `<div class="solution-step" data-step="${i + 1}"><h3>${esc(s[0])}</h3>${guide.why[i] ? `<p class="explanation">${esc(guide.why[i])}</p>` : ""}<p class="formula">${esc(s[1]).replace(/\n/g, "<br>")}</p></div>`).join("")}<div class="final-result"><strong>4. Réponses</strong><br>${state.exercise.questions.map(q => `${esc(q.label)} : <strong>${esc(formatAnswer(q, result.values[q.key]))}</strong>`).join("<br>")}</div><section class="sanity-check"><h3>5. Interprétation et contrôle</h3><p>${esc(guide.check)}</p></section>`; box.scrollIntoView({ behavior: "smooth", block: "start" });
}
function bindExerciseEvents() {
  document.querySelector("#back").addEventListener("click", goBack);
  document.querySelectorAll("[data-mode]").forEach(b => b.addEventListener("click", () => openExercise(state.exercise, b.dataset.mode)));
  document.querySelectorAll("[data-variable]").forEach(input => input.addEventListener("input", () => { readData(); refreshDiagram(); document.querySelector("#correction").hidden = true; }));
  document.querySelectorAll("[data-check]").forEach(b => b.addEventListener("click", () => check(b.dataset.check)));
  document.querySelector("#submitAll")?.addEventListener("click", submitAll);
  document.querySelector("#showCorrection")?.addEventListener("click", showCorrection);
  document.querySelector("#randomize")?.addEventListener("click", () => openExercise(state.exercise, state.mode));
  document.querySelector("#prevEx")?.addEventListener("click", () => shiftPaper(-1));
  document.querySelector("#nextEx")?.addEventListener("click", () => shiftPaper(1));
  document.querySelector("#renderPaper")?.addEventListener("click", () => gradePaper(false));
}

function goBack() {
  if (inPaper()) {
    savePaperAnswers();
    stopTimer();
    const fromAnnale = state.paper.fromAnnale;
    state.paper = null;
    state.returnTo = null;
    if (fromAnnale) annalesPage(state.annaleFilter);
    else paperList();
    return;
  }
  if (state.returnTo === "propose" && state.proposed) { proposePage(state.proposed.chapterId, false); return; }
  if (state.exercise) chapterPage(state.exercise.chapter);
  else home();
}

function shiftPaper(delta) {
  if (!inPaper()) return;
  savePaperAnswers();
  const next = state.paper.index + delta;
  if (next < 0 || next >= state.paper.exercises.length) return;
  state.paper.index = next;
  openExercise(state.paper.exercises[next], "exam", { fixed: true, keepTimer: true });
}

function savePaperAnswers() {
  if (!inPaper() || !state.exercise) return;
  const answers = {};
  state.exercise.questions.forEach(q => { answers[q.key] = readAnswer(q); });
  state.paper.answers[state.exercise.id] = answers;
}

function restorePaperAnswers() {
  const saved = state.paper?.answers[state.exercise.id];
  if (!saved) return;
  Object.entries(saved).forEach(([key, value]) => {
    const q = state.exercise.questions.find(item => item.key === key);
    if (q) setAnswerValue(q, value);
  });
}

function gradePaper(auto) {
  savePaperAnswers();
  stopTimer();
  const results = state.paper.exercises.map(ex => {
    const data = Object.fromEntries(varsOf(ex).map(v => [v.key, v.value]));
    const solved = solve(ex, data);
    const saved = state.paper.answers[ex.id] || {};
    const checks = ex.questions.map(q => ({ q, ok: answersMatch(q, saved[q.key] ?? "", solved.values[q.key]), target: solved.values[q.key], given: saved[q.key] ?? "" }));
    return { ex, checks, solved, correct: checks.filter(c => c.ok).length, total: checks.length };
  });
  const correct = results.reduce((s, r) => s + r.correct, 0);
  const total = results.reduce((s, r) => s + r.total, 0);
  const score = total ? 20 * correct / total : 0;
  const fromAnnale = state.paper.fromAnnale;
  const pdf = state.paper.source ? `<p class="source-link"><a href="${esc(state.paper.source)}" target="_blank" rel="noopener">Ouvrir le PDF d’origine</a></p>` : "";
  app.innerHTML = `<button class="back" id="backPapers">${fromAnnale ? "← Annales" : "← Les 6 sujets"}</button>
    <section class="chapter-banner"><span class="num">${auto ? "⏱" : "✓"}</span><div><h1>${esc(state.paper.title)}</h1><p>${auto ? "Temps écoulé — copie rendue automatiquement." : "Devoir rendu."} Note : <strong>${score.toLocaleString("fr-FR", { maximumFractionDigits: 1 })}/20</strong> (${correct}/${total} questions).</p></div></section>
    ${pdf}
    <section class="paper-results">${results.map((r, i) => `<article class="card"><h2>Exercice ${i + 1}. ${esc(r.ex.title)}</h2><p>${r.correct}/${r.total} · ${esc(r.ex.statement)}</p>${r.checks.map(c => `<p class="feedback ${c.ok ? "good" : "bad"}">${esc(c.q.label)} : ${c.ok ? "correct" : `votre réponse « ${esc(c.given) || "—"} » — attendu ${esc(formatAnswer(c.q, c.target))}`}</p>`).join("")}<div class="correction-block"><h3>Correction</h3>${(r.solved.steps || []).map(s => `<p><strong>${esc(s[0])}.</strong> ${esc(s[1]).replace(/\n/g, "<br>")}</p>`).join("")}</div></article>`).join("")}</section>
    <div class="actions"><button class="primary" id="backPapers2">${fromAnnale ? "Retour aux annales" : "Retour aux sujets"}</button></div>`;
  const back = () => { state.paper = null; state.returnTo = null; if (fromAnnale) annalesPage(state.annaleFilter); else paperList(); };
  document.querySelector("#backPapers").addEventListener("click", back);
  document.querySelector("#backPapers2").addEventListener("click", back);
}

function refreshDiagram() {
  if (!state.exercise) return;
  const figure = drawFigure(state.exercise.solver, state.data, state.exercise);
  const box = document.querySelector("#diagram");
  const note = document.querySelector("#diagramNote");
  if (box) box.innerHTML = figure.svg;
  if (note) note.textContent = figure.caption;
}

function paintClock() {
  const clock = document.querySelector("#clock");
  if (!clock) return;
  if (inPaper()) {
    clock.textContent = `Reste ${formatTime(state.seconds)}`;
    clock.classList.toggle("warn", state.seconds < 300);
  } else {
    clock.textContent = `Temps ${formatTime(state.seconds)}`;
  }
}

function startTimer() {
  state.countdown = false;
  state.seconds = 0;
  paintClock();
  state.timer = setInterval(() => { state.seconds++; paintClock(); }, 1000);
}

function startCountdown(limit) {
  state.countdown = true;
  if (!state.timer) state.seconds = Math.max(0, limit ?? state.paper?.remaining ?? 0);
  paintClock();
  if (state.timer) return;
  state.timer = setInterval(() => {
    state.seconds--;
    if (state.paper) state.paper.remaining = state.seconds;
    paintClock();
    if (state.seconds <= 0) {
      stopTimer();
      toast("Temps écoulé — le devoir est rendu.");
      gradePaper(true);
    }
  }, 1000);
}

function stopTimer() { clearInterval(state.timer); state.timer = null; }

document.querySelector("#homeButton").addEventListener("click", home);
document.querySelectorAll("[data-tome]").forEach(b => b.addEventListener("click", () => setTome(Number(b.dataset.tome))));
window.addEventListener("hashchange", () => {
  if (!state.catalog) return;
  if (location.hash === "#annales") { annalesPage(state.annaleFilter); return; }
  const annale = state.annales.papers.find(p => `#${p.id}` === location.hash);
  if (annale) {
    if (inPaper() && state.paper.id === annale.id) return;
    openAnnale(annale.id);
    return;
  }
  for (const t of [1, 2]) {
    const requested = state.catalogs[t]?.exercises.find(e => `#${e.id}` === location.hash);
    if (requested) {
      if (state.tome !== t) {
        state.tome = t;
        state.catalog = state.catalogs[t];
        applyTomeChrome();
      }
      state.returnTo = "chapter";
      openExercise(requested);
      return;
    }
  }
  if (!location.hash) home();
});
window.addEventListener("beforeinstallprompt", event => { event.preventDefault(); state.installPrompt = event; const b = document.querySelector("#installButton"); b.hidden = false; b.onclick = async () => { await state.installPrompt.prompt(); b.hidden = true; }; });
if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));

const loadJson = url => fetch(url).then(r => r.ok ? r.json() : []);
try {
  const [catalog, batch14, batch59, actIndex, annales, catalog2, actIndex2] = await Promise.all([
    fetch("./data/exercises.json").then(r => r.json()),
    loadJson("./data/exercises-ch1-ch4.json"),
    loadJson("./data/exercises-ch5-ch9.json"),
    loadJson("./data/activites-index.json"),
    fetch("./data/annales.json").then(r => r.ok ? r.json() : { papers: [] }).catch(() => ({ papers: [] })),
    fetch("./data/exercises-t2.json").then(r => r.json()),
    loadJson("./data/activites-t2-index.json")
  ]);
  const actFiles = Array.isArray(actIndex) ? actIndex.map(item => loadJson(`./data/${item.file}`)) : [];
  const act2Files = Array.isArray(actIndex2) ? actIndex2.map(item => loadJson(`./data/${item.file}`)) : [];
  const [actPacks, act2Packs] = await Promise.all([Promise.all(actFiles), Promise.all(act2Files)]);
  state.catalogs[1] = { ...catalog, exercises: [...catalog.exercises, ...batch14, ...batch59, ...actPacks.flat()] };
  state.catalogs[2] = { ...catalog2, exercises: [...(catalog2.exercises || []), ...act2Packs.flat()] };
  let tome = 1;
  try { tome = Number(localStorage.getItem("math2-tome")) === 2 ? 2 : 1; } catch { tome = 1; }
  state.tome = tome;
  state.catalog = state.catalogs[tome];
  state.annales = { papers: Array.isArray(annales?.papers) ? annales.papers : [] };
  applyTomeChrome();
  if (location.hash === "#annales") annalesPage();
  else {
    const annale = state.annales.papers.find(p => `#${p.id}` === location.hash);
    let requested = null, requestedTome = tome;
    for (const t of [1, 2]) {
      const found = state.catalogs[t].exercises.find(e => `#${e.id}` === location.hash);
      if (found) { requested = found; requestedTome = t; break; }
    }
    if (annale) openAnnale(annale.id);
    else if (requested) {
      if (state.tome !== requestedTome) { state.tome = requestedTome; state.catalog = state.catalogs[requestedTome]; applyTomeChrome(); }
      openExercise(requested);
    } else home();
  }
} catch {
  app.innerHTML = `<section class="card"><h1>Chargement impossible</h1><p>Lancez l’application depuis un serveur web local ou depuis Cloudflare Pages.</p></section>`;
}
startFriends();
