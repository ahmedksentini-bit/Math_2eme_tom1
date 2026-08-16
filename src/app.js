import { solve, isClose } from "./solvers.js";
import { drawFigure } from "./diagrams.js";
import { courseRecap } from "./recaps.js";

const app = document.querySelector("#app");
const state = { catalog: null, exercise: null, mode: "learn", data: {}, attempts: {}, timer: null, seconds: 0, installPrompt: null };
const modes = { learn: "Apprentissage", train: "Entraînement", exam: "Examen" };
const pedagogy = {
  tvaTtc: { hypotheses: "Le taux de TVA t s’applique au prix hors taxes.", why: ["Le coefficient 1 + t/100 transforme le H.T. en T.T.C."], check: "Le T.T.C. doit être supérieur au H.T." },
  tvaHt: { hypotheses: "Le prix affiché est T.T.C. ; on cherche le H.T. au même taux.", why: ["On inverse la relation TTC = HT × (1 + t/100)."], check: "HT < TTC. Pour 17 %, on divise par 1,17." },
  successivePercent: { hypotheses: "Deux variations successives, appliquées l’une après l’autre au prix courant.", why: ["Chaque variation a son coefficient.", "Le pourcentage global se lit sur le produit des coefficients, pas sur la somme des taux."], check: "+10 % puis +20 % donnent +32 %." },
  heronArea: { hypotheses: "Triangle de côtés a, b, c vérifiant l’inégalité triangulaire.", why: ["Le demi-périmètre p rassemble les trois côtés.", "Héron exprime l’aire sans hauteur."], check: "Si le triangle est rectangle, A = ab/2 doit coincider avec Héron." },
  absEquation: { hypotheses: "b ≥ 0. |X| = b signifie X = b ou X = −b.", why: ["On isole l’expression à l’intérieur de la valeur absolue.", "Premier cas : signe plus.", "Second cas : signe moins."], check: "Les deux solutions sont symétriques par rapport à −a." },
  affineBounds: { hypotheses: "a parcourt un segment. f est affine, donc monotone.", why: ["On évalue f aux deux bornes.", "Si m < 0, le plus grand a donne la plus petite image."], check: "L’encadrement doit aller du plus petit au plus grand." },
  lightTime: { hypotheses: "Vitesse constante. Unités : km et km/s.", why: ["On convertit les millions de km en km.", "t = d/v, puis on passe en minutes si besoin."], check: "Terre–Soleil : un peu plus de 8 minutes." },
  scientificOrder: { hypotheses: "N ≠ 0. On cherche 1 ≤ |a| < 10.", why: ["L’exposant est la partie entière de log₁₀ |N|.", "L’ordre de grandeur arrondit a à l’unité."], check: "a doit être entre 1 et 10." },
  quadraticSolve: { hypotheses: "a ≠ 0. On cherche les racines réelles de ax² + bx + c = 0.", why: ["Δ = b² − 4ac décide du nombre de racines.", "Les racines s’écrivent (−b ± √Δ)/(2a).", "Somme et produit se lisent sans calculer √Δ."], check: "x₁ + x₂ = −b/a et x₁ x₂ = c/a." },
  resistors: { hypotheses: "Deux résistances, association série (R) et parallèle (r).", why: ["La somme est R, le produit est r R.", "R₁ et R₂ sont les racines du trinôme t² − R t + r R."], check: "r < min(R₁, R₂) < max(R₁, R₂) < R." },
  cyclists: { hypotheses: "Mouvements rectilignes uniformes, l’un vers l’autre.", why: ["Départ simultané : la somme des vitesses vaut D/T.", "À mi-chemin, chacun a parcouru D/2, avec des durées différentes.", "On en déduit V_A et V_B."], check: "V_A + V_B doit retrouver D/T." },
  squareDecrease: { hypotheses: "Carré de côté x. On diminue chaque côté de h.", why: ["La perte d’aire est x² − (x − h)².", "On développe : 2hx − h².", "On isole x."], check: "x > h, sinon le carré réduit n’existe pas." },
  goldenRatio: { hypotheses: "φ > 0 et φ² = φ + 1.", why: ["On résout φ² − φ − 1 = 0.", "On garde la racine positive (1 + √5)/2.", "On vérifie φ² = φ + 1."], check: "φ ≈ 1,618 et φ² ≈ 2,618." },
  polyEval: { hypotheses: "P est un polynôme de degré 3. On substitue x.", why: ["On calcule chaque puissance, puis on combine les coefficients."], check: "P(1) doit égaler la somme des coefficients." },
  polyIntegerRoot: { hypotheses: "On cherche une racine entière, qui divise le terme constant.", why: ["On teste les diviseurs de a₀ jusqu’à P(r) = 0.", "Horner donne le quotient de degré 2.", "On lit les coefficients du trinôme."], check: "Le produit (−r) × coefficient constant du quotient doit égaler a₀." },
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
  homothetyScale: { hypotheses: "L’homothétie multiplie les longueurs par |k| et les aires par k².", why: ["Le périmètre est une somme de longueurs.", "L’aire est homogène de degré 2."], check: "k = 1/2  ⇔  aire divisée par 4, périmètre par 2." },
  rotation90: { hypotheses: "Repère orthonormé direct. Quart de tour de centre O.", why: ["Le vecteur OM⃗ tourne de +90°.", " (x, y) ↦ (−y, x) dans le repère d’origine O."], check: "OM' = OM et OM⃗ · OM'⃗ = 0." },
  rotationAngle: { hypotheses: "Rotation directe de centre O et d’angle α (en degrés).", why: ["La distance au centre est conservée.", "La matrice de rotation s’applique au vecteur OM⃗.", "On reconstitue M'."], check: "OM' = OM. Pour 180°, M' = 2O − M." }
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
  rotationAngle: ["OM' = OM", "angle MOM' = α"]
};

const esc = value => String(value).replace(/[&<>'"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[c]));
const parse = value => Number(String(value).trim().replace(",", ".").replace(/\s/g, ""));
const randomValue = v => Number((Math.round((v.min + Math.random() * (v.max - v.min)) / v.step) * v.step).toFixed(8));
const formatTime = seconds => `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
const toast = text => { const el = document.querySelector("#toast"); el.textContent = text; el.classList.add("show"); setTimeout(() => el.classList.remove("show"), 1800); };

function home() {
  stopTimer(); state.exercise = null;
  const total = state.catalog.exercises.length;
  app.innerHTML = `<section class="hero"><p class="eyebrow">Mathématiques · 2ème année secondaire</p><h1>Comprendre, calculer, vérifier.</h1><p>Des exercices paramétriques fidèles au manuel CNP (tome 1), avec correction raisonnée et trois modes de travail.</p><div class="signature">École Nationale d’Ingénieurs de Sfax<br><strong>Dr Ahmed Ksentini</strong></div></section><div class="section-title"><div><h2>Choisir un chapitre</h2><p>${total} exercices paramétriques, alignés sur le tome 1 (Sciences et TI).</p></div></div><section class="chapter-grid">${state.catalog.chapters.map(ch => { const count = state.catalog.exercises.filter(e => e.chapter === ch.id).length; return `<button class="chapter" data-chapter="${ch.id}"><span class="num">${ch.number}</span><h3>${esc(ch.title)}</h3><p>${esc(ch.description)}</p><span class="count">${count} exercice${count > 1 ? "s" : ""} →</span></button>`; }).join("")}</section>`;
  document.querySelectorAll("[data-chapter]").forEach(button => button.addEventListener("click", () => chapterPage(button.dataset.chapter)));
  history.replaceState({}, "", location.pathname);
}

function chapterPage(chapterId) {
  const chapter = state.catalog.chapters.find(c => c.id === chapterId);
  const exercises = state.catalog.exercises.filter(e => e.chapter === chapterId);
  app.innerHTML = `<button class="back" id="backHome">← Tous les chapitres</button><section class="chapter-banner"><span class="num">${chapter.number}</span><div><h1>${esc(chapter.title)}</h1><p>${esc(chapter.description)}</p></div></section><div class="section-title"><div><h2>Exercices</h2><p>Choisissez une situation puis un mode de travail.</p></div></div><section class="exercise-list">${exercises.map((e, i) => `<button class="exercise-card" data-exercise="${e.id}"><span class="exercise-index">${String(i + 1).padStart(2, "0")}</span><span><strong>${esc(e.title)}</strong><small>Niveau ${e.difficulty} · données paramétriques</small></span><span class="arrow">→</span></button>`).join("")}</section>`;
  document.querySelector("#backHome").addEventListener("click", home);
  document.querySelectorAll("[data-exercise]").forEach(b => b.addEventListener("click", () => openExercise(state.catalog.exercises.find(e => e.id === b.dataset.exercise))));
}

function openExercise(exercise, mode = state.mode) {
  stopTimer(); state.exercise = exercise; state.mode = mode; state.attempts = {};
  state.data = Object.fromEntries(exercise.variables.map(v => [v.key, mode === "learn" ? v.value : randomValue(v)]));
  renderExercise();
  if (mode === "exam") startTimer();
  history.replaceState({}, "", `#${exercise.id}`);
}

function renderExercise() {
  const e = state.exercise, chapter = state.catalog.chapters.find(c => c.id === e.chapter);
  const recap = courseRecap(e.solver);
  const recapHtml = state.mode === "exam" ? "" : `<article class="card recap-card"><p class="recap-kicker">Rappel de cours</p><h2>${esc(recap.title)}</h2><p class="recap-lead">${esc(recap.lead)}</p><ul class="recap-points">${recap.points.map(p => `<li>${esc(p)}</li>`).join("")}</ul><p class="recap-watch"><strong>Piège fréquent.</strong> ${esc(recap.watch)}</p></article>`;
  app.innerHTML = `<section class="exercise-head"><div><button class="back" id="back">← Exercices du chapitre</button><h1>${esc(e.title)}</h1><p>Chapitre ${chapter.number} · Niveau ${e.difficulty}</p></div><div><div class="mode-switch" aria-label="Mode de travail">${Object.entries(modes).map(([key, label]) => `<button data-mode="${key}" class="${state.mode === key ? "active" : ""}">${label}</button>`).join("")}</div><div id="clock" class="exam-clock">${state.mode === "exam" ? "Temps 00:00" : ""}</div></div></section><section class="workspace"><div><article class="card"><h2>Schéma de l’exercice</h2><div class="diagram" id="diagram"></div><p class="diagram-note" id="diagramNote"></p></article>${recapHtml}<article class="card"><h2>Énoncé</h2><p class="statement">${esc(e.statement)}</p><div class="data-grid">${e.variables.map(v => `<div class="field"><label for="v_${v.key}">${esc(v.label)}</label><div class="input-wrap"><input id="v_${v.key}" data-variable="${v.key}" type="number" step="any" value="${state.data[v.key]}" ${state.mode === "exam" ? "readonly" : ""}><span class="unit">${v.unit}</span></div></div>`).join("")}</div><div class="actions">${state.mode !== "learn" ? `<button class="secondary" id="randomize">↻ Nouvelles données</button>` : ""}</div></article></div><div><article class="card"><h2>${state.mode === "exam" ? "Votre copie" : "Résolution guidée"}</h2><div id="questions">${e.questions.map((q, i) => question(q, i)).join("")}</div><div class="actions"><button class="primary" id="submitAll">${state.mode === "exam" ? "Rendre la copie" : "Tout vérifier"}</button>${state.mode !== "exam" ? `<button class="secondary" id="showCorrection">Voir la correction</button>` : ""}</div><div id="score"></div></article><article class="card correction" id="correction" hidden></article></div></section>`;
  const formulas = equationSheets[e.solver] || ["Consulter la synthèse du chapitre et écrire la relation littérale."];
  app.querySelector(".workspace > div:nth-child(2)").insertAdjacentHTML("afterbegin", `<article class="card equation-card"><h2>Équations utiles</h2><p class="equation-intro">Rappel littéral — identifiez chaque grandeur avant de remplacer les valeurs.</p>${formulas.map(f => `<div class="equation-line">${esc(f)}</div>`).join("")}</article>`);
  bindExerciseEvents();
  refreshDiagram();
}

function question(q, i) { return `<div class="question"><div class="question-title">${i + 1}. ${esc(q.label)}</div><div class="answer-row"><div class="input-wrap"><input id="a_${q.key}" data-answer="${q.key}" inputmode="decimal" autocomplete="off" placeholder="Votre réponse"><span class="unit">${q.unit}</span></div>${state.mode !== "exam" ? `<button class="ghost" data-check="${q.key}">Vérifier</button>` : ""}</div><p class="feedback" id="f_${q.key}"></p></div>`; }

function readData() { state.exercise.variables.forEach(v => state.data[v.key] = parse(document.querySelector(`#v_${v.key}`).value)); }
function check(key) {
  readData(); const target = solve(state.exercise, state.data).values[key], input = document.querySelector(`#a_${key}`), value = parse(input.value), feedback = document.querySelector(`#f_${key}`);
  state.attempts[key] = (state.attempts[key] || 0) + 1;
  const correct = isClose(value, target); feedback.className = `feedback ${correct ? "good" : "bad"}`;
  feedback.innerHTML = correct ? "✓ Correct — ordre de grandeur cohérent." : `✕ À revoir.${state.mode === "learn" && state.attempts[key] > 1 ? `<span class="hint">Indice : écrivez d’abord la relation littérale du cours, puis substituez.</span>` : ""}`;
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
  box.hidden = false; box.innerHTML = `<h2>Correction détaillée</h2><section class="reasoning"><h3>1. Hypothèses et modèle</h3><p>${esc(guide.hypotheses)}</p></section><section class="given-data"><h3>2. Données de l’énoncé</h3><div class="data-summary">${state.exercise.variables.map(v => `<span><small>${esc(v.label)}</small><strong>${esc(state.data[v.key])} ${v.unit}</strong></span>`).join("")}</div><p class="method-note">Avant tout calcul, on écrit la relation littérale du cours, on identifie chaque grandeur, puis on substitue.</p></section><h3>3. Résolution raisonnée</h3>${result.steps.map((s, i) => `<div class="solution-step" data-step="${i + 1}"><h3>${esc(s[0])}</h3>${guide.why[i] ? `<p class="explanation">${esc(guide.why[i])}</p>` : ""}<p class="formula">${esc(s[1]).replace(/\n/g, "<br>")}</p></div>`).join("")}<div class="final-result"><strong>4. Résultats numériques</strong><br>${state.exercise.questions.map(q => `${esc(q.label)} = <strong>${Number(result.values[q.key]).toLocaleString("fr-FR", { maximumSignificantDigits: 5 })} ${q.unit}</strong>`).join("<br>")}</div><section class="sanity-check"><h3>5. Interprétation et contrôle</h3><p>${esc(guide.check)}</p><p>Conserver davantage de chiffres pendant le calcul et n’arrondir qu’à la fin. La virgule décimale est acceptée à la saisie.</p></section>`; box.scrollIntoView({ behavior: "smooth", block: "start" });
}
function bindExerciseEvents() {
  document.querySelector("#back").addEventListener("click", () => chapterPage(state.exercise.chapter));
  document.querySelectorAll("[data-mode]").forEach(b => b.addEventListener("click", () => openExercise(state.exercise, b.dataset.mode)));
  document.querySelectorAll("[data-variable]").forEach(input => input.addEventListener("input", () => { readData(); refreshDiagram(); document.querySelector("#correction").hidden = true; }));
  document.querySelectorAll("[data-check]").forEach(b => b.addEventListener("click", () => check(b.dataset.check)));
  document.querySelector("#submitAll").addEventListener("click", submitAll);
  document.querySelector("#showCorrection")?.addEventListener("click", showCorrection);
  document.querySelector("#randomize")?.addEventListener("click", () => openExercise(state.exercise, state.mode));
}

function refreshDiagram() {
  if (!state.exercise) return;
  const figure = drawFigure(state.exercise.solver, state.data);
  const box = document.querySelector("#diagram");
  const note = document.querySelector("#diagramNote");
  if (box) box.innerHTML = figure.svg;
  if (note) note.textContent = figure.caption;
}

function startTimer() { state.seconds = 0; state.timer = setInterval(() => { state.seconds++; const clock = document.querySelector("#clock"); if (clock) clock.textContent = `Temps ${formatTime(state.seconds)}`; }, 1000); }
function stopTimer() { clearInterval(state.timer); state.timer = null; }

document.querySelector("#homeButton").addEventListener("click", home);
window.addEventListener("hashchange", () => {
  if (!state.catalog) return;
  const requested = state.catalog.exercises.find(e => `#${e.id}` === location.hash);
  if (requested) openExercise(requested);
  else if (!location.hash) home();
});
window.addEventListener("beforeinstallprompt", event => { event.preventDefault(); state.installPrompt = event; const b = document.querySelector("#installButton"); b.hidden = false; b.onclick = async () => { await state.installPrompt.prompt(); b.hidden = true; }; });
if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));

const loadJson = url => fetch(url).then(r => r.ok ? r.json() : []);
try {
  const [catalog, batch14, batch59] = await Promise.all([
    fetch("./data/exercises.json").then(r => r.json()),
    loadJson("./data/exercises-ch1-ch4.json"),
    loadJson("./data/exercises-ch5-ch9.json")
  ]);
  state.catalog = { ...catalog, exercises: [...catalog.exercises, ...batch14, ...batch59] };
  const requested = state.catalog.exercises.find(e => `#${e.id}` === location.hash);
  requested ? openExercise(requested) : home();
} catch {
  app.innerHTML = `<section class="card"><h1>Chargement impossible</h1><p>Lancez l’application depuis un serveur web local ou depuis Cloudflare Pages.</p></section>`;
}

void toast;
