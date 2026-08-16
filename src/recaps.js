const recaps = {
  tvaTtc: {
    title: "Prix H.T. et T.T.C.",
    lead: "Une taxe de t % s’applique au prix hors taxes. Le coefficient multiplicateur est 1 + t/100.",
    points: [
      "TTC = HT × (1 + t/100).",
      "Inversement, HT = TTC / (1 + t/100).",
      "Ne pas ajouter t dinars : t est un pourcentage."
    ],
    watch: "Une TVA de 17 % n’est pas une addition de 17 dinars. On multiplie par 1,17."
  },
  tvaHt: {
    title: "Retour au prix hors taxes",
    lead: "Connaissant le prix T.T.C., on divise par le coefficient 1 + t/100 pour retrouver le H.T.",
    points: [
      "HT = TTC / (1 + t/100).",
      "Le taux t est celui de la TVA, pas un rabais.",
      "Contrôler l’ordre de grandeur : HT < TTC."
    ],
    watch: "On ne soustrait pas t % du TTC. On divise par 1,17 si t = 17."
  },
  successivePercent: {
    title: "Pourcentages successifs",
    lead: "Deux variations successives se composent en multipliant les coefficients, jamais en additionnant les pourcentages.",
    points: [
      "Coefficient d’une hausse de p % : 1 + p/100.",
      "Coefficient d’une baisse de p % : 1 − p/100.",
      "Le pourcentage global vérifie 1 + p/100 = (1 + p₁/100)(1 + p₂/100)."
    ],
    watch: "+10 % puis +20 % font +32 %, pas +30 %."
  },
  heronArea: {
    title: "Formule de Héron",
    lead: "L’aire d’un triangle se calcule avec les trois côtés a, b, c et le demi-périmètre p.",
    points: [
      "p = (a + b + c)/2.",
      "A = √[p(p − a)(p − b)(p − c)].",
      "Les côtés doivent vérifier l’inégalité triangulaire, sinon A n’est pas réelle."
    ],
    watch: "Un triangle 18, 24, 30 est rectangle (3-4-5 × 6) : A = 18×24/2 = 216, ce qui contrôle Héron."
  },
  absEquation: {
    title: "Équation avec valeur absolue",
    lead: "|X| = b (b ≥ 0) signifie X = b ou X = −b. On se ramène à une expression du type x + a.",
    points: [
      "|x + a| = b  ⇔  x = −a − b ou x = −a + b.",
      "Si b < 0, l’équation n’a pas de solution.",
      "Géométriquement, |x − ω| = r décrit les points à distance r de ω."
    ],
    watch: "Oublier le cas « moins » est l’erreur la plus fréquente."
  },
  affineBounds: {
    title: "Encadrement d’une expression affine",
    lead: "Si a ∈ [m, M], l’image par x ↦ αx + β est un intervalle dont les bornes sont les images de m et M.",
    points: [
      "Si α ≥ 0, l’ordre se conserve.",
      "Si α < 0, l’ordre s’inverse.",
      "On évalue f aux deux extrémités, puis on prend min et max."
    ],
    watch: "Pour −3a + 5 avec a ∈ [−2, 3], le maximum est en a = −2, pas en a = 3."
  },
  lightTime: {
    title: "Ordre de grandeur et vitesse",
    lead: "Le temps de parcours est la distance divisée par la vitesse, après mise en unités cohérentes.",
    points: [
      "1 million de km = 10⁶ km.",
      "t = d/v, puis conversion s → min si besoin.",
      "L’année-lumière est la distance parcourue en une année, pas un temps."
    ],
    watch: "150 millions de km à 300 000 km/s donnent 500 s, soit un peu plus de 8 min."
  },
  scientificOrder: {
    title: "Écriture scientifique",
    lead: "Tout réel non nul s’écrit a × 10ⁿ avec 1 ≤ |a| < 10. L’ordre de grandeur arrondit a à l’unité.",
    points: [
      "n = E(log₁₀ |N|), puis a = N / 10ⁿ.",
      "Ordre de grandeur : b × 10ⁿ, b arrondi de a à l’unité.",
      "C’est un outil d’estimation, pas un arrondi de calculatrice."
    ],
    watch: "0,0007845 = 7,845 × 10⁻⁴, d’ordre 8 × 10⁻⁴, pas 7 × 10⁻⁴."
  },
  quadraticSolve: {
    title: "Équation du second degré",
    lead: "Pour ax² + bx + c = 0 (a ≠ 0), le discriminant Δ = b² − 4ac décide du nombre de racines réelles.",
    points: [
      "Δ > 0 : deux racines (−b ± √Δ)/(2a).",
      "Δ = 0 : racine double −b/(2a).",
      "Somme = −b/a, produit = c/a, même si on ne calcule pas les racines."
    ],
    watch: "Si a + b + c = 0, alors 1 est racine et l’autre est c/a."
  },
  resistors: {
    title: "Résistances série et parallèle",
    lead: "En série, R = R₁ + R₂. En parallèle, 1/r = 1/R₁ + 1/R₂, donc R₁ R₂ = r R.",
    points: [
      "R₁ et R₂ sont les racines de t² − R t + r R = 0.",
      "On reconnaît somme et produit.",
      "Les deux résistances sont interchangeables."
    ],
    watch: "r n’est pas R₁ + R₂. Le parallèle est toujours plus petit que chaque résistance."
  },
  cyclists: {
    title: "Mouvements rectilignes uniformes",
    lead: "Quand deux mobiles se rapprochent, la vitesse de rapprochement est la somme des vitesses. Un départ décalé se traduit par une avance en distance.",
    points: [
      "Départ simultané : (V_A + V_B) T = D.",
      "Rencontre à mi-chemin : chacun parcourt D/2, avec des durées différentes.",
      "On obtient un système, souvent ramené à une équation du second degré en t."
    ],
    watch: "Les 33 minutes doivent être converties en heures (0,55 h) avant de les ajouter à t."
  },
  squareDecrease: {
    title: "Aire d’un carré",
    lead: "Diminuer le côté de h change l’aire de x² − (x − h)² = 2 h x − h².",
    points: [
      "On écrit la variation d’aire demandée.",
      "On développe puis on isole x.",
      "Contrôler que x > h."
    ],
    watch: "Ce n’est pas « on enlève 3 cm² par centimètre de côté » : le terme −h² compte."
  },
  goldenRatio: {
    title: "Nombre d’or",
    lead: "φ = (1 + √5)/2 est la racine positive de φ² = φ + 1. Il apparaît dans le rectangle d’or et de nombreuses constructions.",
    points: [
      "φ² − φ − 1 = 0.",
      "φ = (1 + √5)/2 ≈ 1,618.",
      "φ² = φ + 1 et 1/φ = φ − 1."
    ],
    watch: "La racine négative (1 − √5)/2 n’est pas le nombre d’or."
  },
  polyEval: {
    title: "Valeur d’un polynôme",
    lead: "Évaluer P(x₀), c’est substituer puis calculer. C’est aussi le premier test pour savoir si x₀ est une racine.",
    points: [
      "P(α) = 0  ⇔  α est racine  ⇔  (x − α) divise P.",
      "On peut utiliser le schéma de Horner pour limiter les erreurs.",
      "Un polynôme de degré n a au plus n racines."
    ],
    watch: "P(1) = somme des coefficients. P(−1) = somme alternée."
  },
  polyIntegerRoot: {
    title: "Racine entière et factorisation",
    lead: "Une racine entière divise le terme constant. Une fois trouvée, on factorise par x − r.",
    points: [
      "Tester les diviseurs de a₀.",
      "La division selon les puissances décroissantes (ou Horner) donne le quotient.",
      "On poursuit sur le quotient si le degré le permet."
    ],
    watch: "Trouver une racine ne termine pas le problème : il reste à factoriser complètement."
  },
  polyKnownRoot: {
    title: "Factoriser connaissant une racine",
    lead: "Si P(α) = 0, alors P(x) = (x − α) Q(x) avec deg Q = deg P − 1.",
    points: [
      "Vérifier d’abord P(α) = 0.",
      "Identifier Q par Horner ou par identification des coefficients.",
      "Le quotient peut encore se factoriser."
    ],
    watch: "Le coefficient dominant de Q est le même que celui de P."
  },
  sumIntegers: {
    title: "Sommes S₁ et S₂",
    lead: "Les sommes 1 + … + n et 1² + … + n² s’obtiennent en sommant une relation P(k) − P(k − 1) = k ou k².",
    points: [
      "S₁ = n(n + 1)/2.",
      "S₂ = n(n + 1)(2n + 1)/6.",
      "Ces formules sont des polynômes en n, de degrés 2 et 3."
    ],
    watch: "S₂ n’est pas (S₁)². Ne pas confondre avec [n(n + 1)/2]², qui est la somme des cubes."
  },
  euclidDiv: {
    title: "Division euclidienne",
    lead: "Pour a ∈ ℕ et b > 0, il existe un unique couple (q, r) tel que a = b q + r et 0 ≤ r < b.",
    points: [
      "q est le quotient, r le reste.",
      "r = 0  ⇔  b divise a.",
      "Toujours contrôler a = bq + r et r < b."
    ],
    watch: "Le reste n’est jamais égal au diviseur. Si le calcul donne r = b, on a oublié une unité de quotient."
  },
  remainderLast3: {
    title: "Critères de divisibilité 8 et 25",
    lead: "Le reste modulo 8 (resp. 25) se lit sur les derniers chiffres, parce que 1000 est multiple de 8 et de 8… et 100 de 4 et 25.",
    points: [
      "Modulo 8 : trois derniers chiffres.",
      "Modulo 25 (et 4) : deux derniers chiffres.",
      "On réduit d’abord, puis on divise le petit entier obtenu."
    ],
    watch: "127645264 : on ne divise pas tout le nombre, seulement 264."
  },
  remainderDigits: {
    title: "Critères de divisibilité 3 et 9",
    lead: "Un entier a le même reste modulo 9 (et modulo 3) que la somme de ses chiffres.",
    points: [
      "n ≡ somme des chiffres (mod 9).",
      "n est divisible par 9  ⇔  cette somme l’est.",
      "On peut itérer si la somme a encore plusieurs chiffres."
    ],
    watch: "Le critère de 9 ne dit pas le quotient, seulement le reste."
  },
  barcodeCheck: {
    title: "Clé d’un code-barres EAN-13",
    lead: "Les 12 premiers chiffres codent le produit. Le 13ᵉ est une clé : somme des rangs impairs + triple des rangs pairs + clé ≡ 0 (mod 10).",
    points: [
      "On numérote de gauche à droite, rang 1 = premier chiffre.",
      "Sept rangs impairs, six rangs pairs avant la clé.",
      "La clé est le chiffre qui rend le total multiple de 10."
    ],
    watch: "Les rangs se comptent depuis la gauche, pas depuis la droite (contrairement au critère de 11 du cours)."
  },
  gcd3: {
    title: "PGCD et pavage par des cubes",
    lead: "Pour remplir un pavé L × ℓ × h par des cubes d’arête entière maximale, l’arête est le PGCD des trois dimensions.",
    points: [
      "PGCD(a, b, c) = PGCD(PGCD(a, b), c).",
      "Euclide : PGCD(a, b) = PGCD(b, a mod b).",
      "Le nombre de cubes est (L/a)(ℓ/a)(h/a)."
    ],
    watch: "Le plus grand cube n’est pas le min(L, ℓ, h) : 120, 200, 180 donnent 20, pas 120."
  },
  vectorAB: {
    title: "Composantes et norme",
    lead: "Dans un repère, AB⃗ a pour composantes (x_B − x_A ; y_B − y_A). La norme est la distance AB.",
    points: [
      "AB⃗ = (x_B − x_A) i⃗ + (y_B − y_A) j⃗.",
      "Dans une base orthonormée, |AB⃗| = √(x² + y²).",
      "BA⃗ = − AB⃗."
    ],
    watch: "L’ordre des points compte : AB⃗ ≠ BA⃗."
  },
  detColinear: {
    title: "Colinéarité et déterminant",
    lead: "Deux vecteurs du plan sont colinéaires si et seulement si leur déterminant est nul.",
    points: [
      "det(u⃗, v⃗) = x y' − x' y.",
      "det = 0  ⇔  u⃗ et v⃗ colinéaires  ⇔  droites (AB) et (CD) parallèles.",
      "Le déterminant est aussi l’aire algébrique du parallélogramme."
    ],
    watch: "x/x' = y/y' exige de traiter à part le cas d’une composante nulle. Le déterminant évite cette trappe."
  },
  dotOrtho: {
    title: "Orthogonalité",
    lead: "Dans une base orthonormée, u⃗ ⊥ v⃗ si et seulement si xx' + yy' = 0.",
    points: [
      "Le vecteur nul est orthogonal à tout vecteur.",
      "Deux droites sont perpendiculaires  ⇔  leurs vecteurs directeurs sont orthogonaux.",
      "Ne pas confondre déterminant (parallélisme) et produit scalaire (perpendicularité)."
    ],
    watch: "La formule xx' + yy' suppose un repère orthonormé."
  },
  parallelogramD: {
    title: "Parallélogramme",
    lead: "ABCD est un parallélogramme  ⇔  AB⃗ = DC⃗  ⇔  AD⃗ = BC⃗  ⇔  D = A + C − B.",
    points: [
      "Le centre O vérifie OA⃗ + OC⃗ = OB⃗ + OD⃗ = 0 dans un repère d’origine O milieu.",
      "AB⃗ + AD⃗ = AC⃗ (règle du parallélogramme).",
      "On peut aussi écrire D = B + C − A selon le sommet opposé choisi."
    ],
    watch: "Vérifier quel sommet est opposé à A : ici D est opposé à B si on prend ABCD dans cet ordre… ABCD signifie D = A+C−B."
  },
  bary1d: {
    title: "Barycentre de deux points",
    lead: "G = bar{(A, α), (B, β)} lorsque α + β ≠ 0 et α GA⃗ + β GB⃗ = 0, soit AG⃗ = β/(α+β) AB⃗.",
    points: [
      "G ∈ (AB). G ∈ [AB] si α et β sont de même signe.",
      "α = β = 1 : G est le milieu.",
      "On peut multiplier les masses par k ≠ 0 sans changer G."
    ],
    watch: "Si α + β = 0, il n’y a pas de barycentre (les masses se compensent)."
  },
  bary2d: {
    title: "Barycentre de trois points",
    lead: "G = bar{(A, α), (B, β), (C, γ)} lorsque α GA⃗ + β GB⃗ + γ GC⃗ = 0. L’isobarycentre est le centre de gravité du triangle.",
    points: [
      "Pour tout M : α MA⃗ + β MB⃗ + γ MC⃗ = (α+β+γ) MG⃗.",
      "Barycentre partiel : G = bar{(A, α), (G', β+γ)} si G' = bar{(B, β), (C, γ)}.",
      "G ∈ (AA') où A' = bar{(B, β), (C, γ)}."
    ],
    watch: "Le centre de gravité a des masses égales (1, 1, 1), pas (1, 1, 2)."
  },
  translation: {
    title: "Translation",
    lead: "t est une translation  ⇔  M'N'⃗ = MN⃗ pour tous M, N. Autrement dit MM'⃗ est un vecteur constant v⃗.",
    points: [
      "L’image d’une droite est une droite parallèle.",
      "Les distances, milieux, barycentres, angles et contacts sont conservés.",
      "Un polygone et son image sont superposables."
    ],
    watch: "Une translation n’a pas de point invariant, sauf si v⃗ = 0 (identité)."
  },
  homothety: {
    title: "Homothétie",
    lead: "h(O, k) envoie M sur M' défini par OM'⃗ = k OM⃗. Alors M'N'⃗ = k MN⃗ : les droites (MN) et (M'N') sont parallèles.",
    points: [
      "k = 1 : identité. k = −1 : symétrie centrale.",
      "MM' = |k − 1| · OM.",
      "Le centre O est le seul point invariant si k ≠ 1."
    ],
    watch: "Le rapport k est algébrique : k < 0 inverse les sens."
  },
  homothetyScale: {
    title: "Effet d’une homothétie sur les grandeurs",
    lead: "Les longueurs sont multipliées par |k|, les aires par k². Le périmètre suit les longueurs.",
    points: [
      "p' = |k| p.",
      "A' = k² A.",
      "Un cercle de rayon R a pour image un cercle de rayon |k| R."
    ],
    watch: "Aire au quart  ⇔  |k| = 1/2, pas k = 1/4. Périmètre au tiers  ⇔  |k| = 1/3."
  },
  rotation90: {
    title: "Quart de tour",
    lead: "Le quart de tour direct de centre O envoie (x − x_O ; y − y_O) sur (−(y − y_O) ; x − x_O) dans un repère orthonormé direct.",
    points: [
      "OM' = OM et l’angle MOM' vaut 90°.",
      "L’image d’une droite est une droite perpendiculaire.",
      "Un carré ABCD se construit en prenant D = r_A(B)."
    ],
    watch: "Direct et indirect (horaire / antihoraire) ne donnent pas le même point."
  },
  rotationAngle: {
    title: "Rotation",
    lead: "Une rotation de centre O et d’angle α conserve les distances : OM' = OM, et l’angle MOM' vaut α.",
    points: [
      "Elle conserve alignement, milieu, barycentre, angles et contacts.",
      "L’image d’un cercle de centre I est le cercle de même rayon et de centre I' = r(I).",
      "Un demi-tour est la rotation d’angle 180°, identique à la symétrie centrale."
    ],
    watch: "Le centre O est le seul point invariant (si α n’est pas un multiple de 360°)."
  }
};

const fallback = {
  title: "Rappel de cours",
  lead: "Relire la synthèse du chapitre avant de calculer.",
  points: ["Écrire la relation littérale.", "Remplacer ensuite les valeurs."],
  watch: "Un résultat sans unité, ou hors de l’ordre de grandeur attendu, signale souvent une formule mal choisie."
};

export function courseRecap(solver) {
  return recaps[solver] || fallback;
}
