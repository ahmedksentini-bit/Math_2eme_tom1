export const chapterCourses = {
  reels: {
    title: "Calcul dans IR — cours détaillé",
    lead: "On travaille dans IR : ensembles de nombres, identités remarquables, comparaison, radicaux, valeur absolue, encadrements, pourcentages et ordres de grandeur. Chaque calcul s’écrit d’abord en lettres, puis on substitue.",
    sections: [
      { title: "Ensembles de nombres", text: "ℕ ⊂ ℤ ⊂ 𝔻 ⊂ ℚ ⊂ ℝ. ℕ : entiers naturels (0, 1, 2, …). ℤ : relatifs. 𝔻 : décimaux. ℚ : rationnels p/q, q ≠ 0. ℝ : tous les réels, y compris les irrationnels (√2, π, φ). Un irrationnel n’est ni fraction ni décimal périodique. L’appartenance se lit sur la droite graduée et sur le tableau d’inclusions du manuel." },
      { title: "Pourcentages et TVA", text: "Une hausse de t % multiplie par 1 + t/100 ; une baisse par 1 − t/100. TTC = HT × (1 + t/100) et HT = TTC / (1 + t/100). Deux variations se composent en multipliant les coefficients, jamais en additionnant les taux : +10 % puis +20 % donnent ×1,1 × 1,2 = ×1,32, soit +32 %. +10 % puis −10 % donnent ×0,99, soit −1 %, pas un retour au prix initial." },
      { title: "Identités remarquables", text: "(a+b)² = a² + 2ab + b², (a−b)² = a² − 2ab + b², (a+b)(a−b) = a² − b². Cubes : (a±b)³ = a³ ± 3a²b + 3ab² ± b³. Factoriser, c’est lire ces identités à l’envers. On s’en sert pour développer, réduire, et simplifier des écritures sous radical ou des dénominateurs." },
      { title: "Comparaison et encadrements", text: "Si 0 < a < 1, alors a² < a < √a. Si a ≥ 1, l’ordre s’inverse : √a ≤ a ≤ a². Une fonction affine x ↦ mx + p conserve l’ordre si m ≥ 0, l’inverse si m < 0. Sur un segment [m, M], le min et le max de f sont atteints aux extrémités : on calcule f(m) et f(M), puis on range." },
      { title: "Radicaux", text: "√(ab) = √a √b (a, b ≥ 0). √(a²) = |a|. On rationalise un dénominateur en multipliant par le conjugué : 1/(√a − √b) × (√a + √b)/(√a + √b). On ne sort un facteur d’une racine que s’il est un carré parfait." },
      { title: "Formule de Héron", text: "Pour un triangle de côtés a, b, c, le demi-périmètre est p = (a+b+c)/2 et l’aire A = √[p(p−a)(p−b)(p−c)]. Les côtés doivent vérifier l’inégalité triangulaire, sinon A n’est pas réelle. Contrôle : un 3-4-5 a pour aire 6 ; un 18-24-30 (×6) a pour aire 216." },
      { title: "Valeur absolue", text: "|x| est la distance de x à 0. |x − ω| = r (r ≥ 0) décrit les deux points ω ± r. |A| = |B| ⇔ A = B ou A = −B. |A| < r ⇔ −r < A < r. |A| ≥ r ⇔ A ≤ −r ou A ≥ r. Pour |x + a| = b, on isole : x = −a ± b, à condition que b ≥ 0." },
      { title: "Ordre de grandeur et écriture scientifique", text: "Tout réel non nul s’écrit a × 10ⁿ avec 1 ≤ |a| < 10. On obtient a en déplaçant la virgule. L’ordre de grandeur arrondit a à l’unité, en gardant la même puissance de 10. Un calcul d’ordre de grandeur précède le calcul exact. Temps = distance / vitesse, après mise en unités cohérentes (millions de km → km, puis s → min)." },
      { title: "Méthode type", text: "1) Relire la grandeur demandée. 2) Écrire la relation littérale. 3) Convertir les unités. 4) Substituter. 5) Contrôler l’ordre de grandeur et l’unité. On n’arrondit qu’à la fin." },
      { title: "Erreurs fréquentes", text: "Ajouter 17 D au lieu de multiplier par 1,17. Additionner +10 % et +20 %. Oublier le cas « moins » d’une valeur absolue. Évaluer une affine décroissante à la mauvaise borne. Prendre √(a+b) = √a + √b." }
    ]
  },
  degres: {
    title: "Premier et second degré — cours détaillé",
    lead: "Résoudre, c’est trouver tous les réels qui rendent une égalité vraie. Le premier degré s’isole ; le second se lit sur le discriminant, la somme et le produit.",
    sections: [
      { title: "Équations du premier degré", text: "ax + b = 0 (a ≠ 0) a pour unique solution x = −b/a. On isole x en transposant, puis en divisant. Une inéquation ax + b > 0 se résout de même, en inversant le sens si on divise par un négatif. On représente la solution sur la droite." },
      { title: "Produit nul et quotients", text: "AB = 0 ⇔ A = 0 ou B = 0. On factorise avant de conclure. Un quotient A/B = 0 ⇔ A = 0 et B ≠ 0. Un quotient A/B > 0 se lit sur un tableau de signes. On exclut toujours les zéros du dénominateur." },
      { title: "Trinôme et discriminant", text: "Pour ax² + bx + c = 0, a ≠ 0 : Δ = b² − 4ac. Δ < 0 : pas de racine réelle, f est du signe de a. Δ = 0 : racine double x₀ = −b/(2a), f = a(x − x₀)². Δ > 0 : deux racines x = (−b ± √Δ)/(2a), f = a(x − x₁)(x − x₂). Si b = 2b', on peut utiliser Δ' = b'² − ac, avec x = (−b' ± √Δ')/a." },
      { title: "Somme et produit", text: "x₁ + x₂ = −b/a, x₁ x₂ = c/a. Ces relations se calculent sans √Δ et servent de contrôle. Si a + b + c = 0, alors 1 est racine et l’autre est c/a. Si a − b + c = 0, −1 est racine et l’autre est −c/a." },
      { title: "Signe du trinôme", text: "f est du signe de a à l’extérieur des racines, du signe de −a entre les racines. On dresse un tableau de signes après factorisation. Une inéquation du second degré se lit sur ce tableau." },
      { title: "Problèmes : résistances", text: "Deux résistances en série : R = R₁ + R₂. En parallèle : 1/r = 1/R₁ + 1/R₂, soit r = R₁ R₂ / R. D’où R₁ et R₂ sont racines de t² − R t + r R = 0. Contrôle : r < min(R₁, R₂) < max(R₁, R₂) < R." },
      { title: "Problèmes : mouvements et aires", text: "Deux cyclistes l’un vers l’autre : (V_A + V_B) T = D. Un quart d’heure = 0,25 h, pas 15 km. Carré diminué : x² − (x − h)² = 2hx − h². On isole x, avec x > h." },
      { title: "Nombre d’or", text: "φ > 0 et φ² = φ + 1 ⇔ φ² − φ − 1 = 0. Racine positive φ = (1 + √5)/2 ≈ 1,618. Identités : φ² = φ + 1, 1/φ = φ − 1. La racine négative est 1 − φ = −1/φ." },
      { title: "Méthode type", text: "Traduire l’énoncé par une équation. Mettre sous forme ax² + bx + c = 0. Calculer Δ. Discuter les racines (positives, dans un intervalle). Contrôler par somme et produit, puis par l’énoncé." },
      { title: "Erreurs fréquentes", text: "Oublier a ≠ 0. Prendre −b ± Δ au lieu de −b ± √Δ. Diviser par 2a trop tôt. Additionner les vitesses sans convertir les minutes en heures. Oublier −h² dans la perte d’aire." }
    ]
  },
  polynomes: {
    title: "Polynômes — cours détaillé",
    lead: "Un polynôme est déterminé par ses coefficients. Le degré commande le nombre maximal de racines, les opérations, et la stratégie de factorisation.",
    sections: [
      { title: "Vocabulaire", text: "P(x) = aₙ xⁿ + … + a₁ x + a₀, aₙ ≠ 0. n = deg P. aₙ coefficient dominant, a₀ terme constant. Deux polynômes sont égaux s’ils ont même degré et mêmes coefficients. Le polynôme nul a tous ses coefficients nuls ; on ne lui attribue pas de degré dans le secondaire, ou on pose deg 0 = −∞." },
      { title: "Opérations", text: "Somme, produit, multiplication par un scalaire restent des polynômes. deg(f + g) ≤ max(deg f, deg g), avec égalité si les degrés diffèrent. deg(fg) = deg f + deg g si f et g sont non nuls." },
      { title: "Évaluation d’un polynôme", text: "P(1) = somme des coefficients. P(0) = terme constant. P(−1) = somme alternée. On substitue, ou on groupe les puissances : P = ((aₙ x + aₙ₋₁) x + … ) x + a₀. Le même groupement sert à la division par x − r, par identification des coefficients." },
      { title: "Racines et factorisation", text: "α est racine ⇔ P(α) = 0 ⇔ (x − α) divise P. Un polynôme de degré n a au plus n racines. Si P a plus de racines que son degré, P est identiquement nul. Racine entière : elle divise a₀. On teste les diviseurs de a₀, puis on identifie les coefficients du quotient." },
      { title: "Exemple type", text: "x³ + 6x² + 12x − 56. Les diviseurs de 56 : ±1, ±2, ±4, … P(2) = 8 + 24 + 24 − 56 = 0, donc 2 est racine. Identification : quotient x² + 8x + 28, discriminant 64 − 112 < 0 : une seule racine réelle." },
      { title: "Fonctions rationnelles", text: "On factorise numérateur et dénominateur, on simplifie les facteurs communs, on précise l’ensemble de définition (zéros du dénominateur exclus). Une simplification change éventuellement la fonction (trou)." },
      { title: "Sommes d’entiers", text: "S₁ = 1 + … + n = n(n+1)/2. S₂ = 1² + … + n² = n(n+1)(2n+1)/6. Ces formules s’obtiennent en sommant P(k) − P(k − 1) pour k de 1 à n, comme dans le manuel. Attention : (S₁)² n’est pas S₂. Pour n = 10 : S₁ = 55, S₂ = 385." },
      { title: "Méthode type", text: "Évaluer en un point simple. Chercher une racine évidente. Factoriser par identification des coefficients. Étudier le quotient (trinôme : Δ). Conclure sur les racines et le signe." },
      { title: "Erreurs fréquentes", text: "Oublier les racines négatives parmi les diviseurs de a₀. Confondre P(1) et le coefficient dominant. Dire que S₂ = (S₁)². Simplifier une rationnelle sans exclure les zéros du dénominateur." }
    ]
  },
  arithmetique: {
    title: "Arithmétique — cours détaillé",
    lead: "La division euclidienne est unique. Les critères de divisibilité évitent de diviser de grands entiers. Le PGCD se calcule par Euclide.",
    sections: [
      { title: "Division euclidienne", text: "Pour a ∈ ℕ et b > 0, il existe un unique couple (q, r) d’entiers avec a = bq + r et 0 ≤ r < b. r = 0 ⇔ b divise a. Contrôle obligatoire : bq + r = a et r < b. Si le reste vaut b, augmenter q de 1." },
      { title: "Critères 2 et 5", text: "On lit le chiffre des unités. Pair ⇔ divisible par 2. 0 ou 5 ⇔ divisible par 5. 0 ⇔ divisible par 2 et par 5, donc par 10." },
      { title: "Critères 4 et 25", text: "100 est multiple de 4 et de 25. On lit les deux derniers chiffres. 76 divisible par 4 car 76 = 4 × 19. 75 divisible par 25." },
      { title: "Critères 3 et 9", text: "10 ≡ 1 (mod 9), donc 10^k ≡ 1 et n ≡ somme des chiffres (mod 9) et (mod 3). On peut itérer la somme. Cela donne le reste, pas le quotient. 1963 : 1+9+6+3 = 19, 1+9 = 10, 1+0 = 1, donc reste 1 modulo 9." },
      { title: "Critère 8", text: "1000 = 8 × 125, donc pour n ≥ 100 on lit les trois derniers chiffres. 127 645 264 se termine par 264 = 8 × 33, donc 8 divise n." },
      { title: "Critère 11", text: "Depuis la droite : S₁ somme des rangs impairs, S₂ des rangs pairs, d = S₁ − S₂. n ≡ d (mod 11). Si d < 0, on ajoute un multiple de 11 pour se ramener à {0, …, 10}." },
      { title: "PGCD et pavé", text: "Euclide : PGCD(a, b) = PGCD(b, a mod b), jusqu’au reste 0. Pour paver un pavé L × ℓ × h par des cubes d’arête maximale, a = PGCD(L, ℓ, h) et le nombre de cubes est (L/a)(ℓ/a)(h/a). Exemple : 120, 200, 180 → PGCD = 20, et 6 × 10 × 9 = 540 cubes." },
      { title: "Code-barres EAN-13", text: "Rangs depuis la gauche, poids 1 et 3 en alternance. Somme des rangs impairs (1 à 11) + triple de la somme des rangs pairs + clé ≡ 0 (mod 10). Le manuel CNP porte 619220260141 : la clé vaut 4." },
      { title: "Méthode type", text: "Identifier le module. Choisir le critère (derniers chiffres, somme, Euclide). Réduire, puis conclure avec un contrôle : reconstitution a = bq + r." },
      { title: "Erreurs fréquentes", text: "Confondre reste et quotient. Appliquer le critère de 8 aux deux derniers chiffres. Prendre la somme des chiffres pour un modulo 8. Oublier que le PGCD de trois nombres s’obtient en deux étapes." }
    ]
  },
  vecteurs: {
    title: "Calcul vectoriel — cours détaillé",
    lead: "Un vecteur a une direction, un sens et une norme. L’addition et la multiplication par un réel se lisent en composantes ; colinéarité et orthogonalité ont chacune leur test.",
    sections: [
      { title: "Opérations", text: "u⃗ + v⃗ = v⃗ + u⃗, associativité, u⃗ + 0⃗ = u⃗. L’opposé −u⃗ vérifie u⃗ + (−u⃗) = 0⃗. α(βu⃗) = (αβ)u⃗, distributivités. αu⃗ = 0⃗ ⇔ α = 0 ou u⃗ = 0⃗. Relation de Chasles : AB⃗ + BC⃗ = AC⃗. BA⃗ = −AB⃗." },
      { title: "Composantes", text: "Dans une base (i⃗, j⃗), u⃗ = x i⃗ + y j⃗. L’addition et la multiplication se font coordonnée par coordonnée. AB⃗ = (x_B − x_A ; y_B − y_A). Changer d’origine change les coordonnées des points, pas le vecteur AB⃗." },
      { title: "Colinéarité", text: "u⃗ et v⃗ sont colinéaires ⇔ det(u⃗, v⃗) = xy' − x'y = 0 ⇔ il existe k tel que v⃗ = k u⃗ (si u⃗ ≠ 0). Deux droites (AB) et (CD) sont parallèles ⇔ AB⃗ et CD⃗ sont colinéaires. Le vecteur nul est colinéaire à tout vecteur." },
      { title: "Orthogonalité", text: "Dans une base orthonormée seulement : u⃗ ⊥ v⃗ ⇔ u⃗ · v⃗ = xx' + yy' = 0. Le vecteur nul est orthogonal à tout vecteur. Droites perpendiculaires ⇔ vecteurs directeurs orthogonaux. Ne pas utiliser le déterminant pour un angle droit." },
      { title: "Norme et distance", text: "|αu⃗| = |α| |u⃗|. |u⃗| = 0 ⇔ u⃗ = 0⃗. En base orthonormée, |u⃗| = √(x² + y²) et AB = √[(x_B − x_A)² + (y_B − y_A)²]. Pythagore vectoriel : |u⃗ + v⃗|² = |u⃗|² + |v⃗|² ⇔ u⃗ ⊥ v⃗." },
      { title: "Parallélogramme", text: "ABCD parallélogramme (dans cet ordre) ⇔ AB⃗ = DC⃗ ⇔ AD⃗ = BC⃗ ⇔ D = A + C − B. Contrôle : le milieu de [AC] coïncide avec celui de [BD]. La formule change si l’ordre des sommets change." },
      { title: "Méthode type", text: "Placer les points, écrire les composantes, choisir le bon test (det pour //, produit scalaire pour ⊥), conclure par une phrase : « les vecteurs sont colinéaires, donc les droites sont parallèles »." },
      { title: "Erreurs fréquentes", text: "Confondre det et produit scalaire. Oublier que l’orthogonalité exige un repère orthonormé. Écrire D = A + B − C au lieu de A + C − B. Prendre |AB⃗| = |BA⃗| pour en déduire AB⃗ = BA⃗." }
    ]
  },
  barycentre: {
    title: "Barycentre — cours détaillé",
    lead: "Le barycentre généralise le milieu : c’est un équilibre de masses affectées à des points. Il vit sur la droite ou dans le plan selon le nombre de points.",
    sections: [
      { title: "Deux points", text: "G = bar{(A, α), (B, β)} existe ⇔ α + β ≠ 0, et α GA⃗ + β GB⃗ = 0, soit AG⃗ = β/(α+β) AB⃗. G ∈ (AB). G ∈ [AB] ssi α et β sont de même signe. α = β : milieu. Formule d’abscisse : x_G = (α x_A + β x_B)/(α + β). Le coefficient k = β/(α+β) mesure AG en unités AB." },
      { title: "Homogénéité", text: "Multiplier toutes les masses par k ≠ 0 ne change pas G. On peut donc simplifier les masses (prendre 1 et 2 au lieu de 3 et 6)." },
      { title: "Signes contraires", text: "Si β < 0 et |β| > α > 0, G est hors de [AB], du côté de A ou de B selon les valeurs. Exemple du manuel : masses 3 et −4 sur A(0) et B(10) donnent G d’abscisse 40, donc G ∉ [AB]." },
      { title: "Trois points", text: "G = bar{(A,α),(B,β),(C,γ)} ⇔ α+β+γ ≠ 0 et α GA⃗ + β GB⃗ + γ GC⃗ = 0. Pour tout M : α MA⃗ + β MB⃗ + γ MC⃗ = (α+β+γ) MG⃗. En coordonnées, G est la moyenne pondérée des coordonnées." },
      { title: "Isobarycentre", text: "Masses égales : centre de gravité du triangle, intersection des médianes, G = (A + B + C)/3. C’est aussi le barycentre des milieux des côtés." },
      { title: "Barycentre partiel", text: "Si G = bar{(A,α),(B,β),(C,γ)} et β+γ ≠ 0, alors G = bar{(A,α),(G', β+γ)} où G' = bar{(B,β),(C,γ)}. Donc G ∈ (AG'). Si β = γ, G' est le milieu de [BC] : G est sur la médiane." },
      { title: "Construction", text: "On place d’abord G' (deux masses sur une droite), puis G sur (AG') en partageant le segment selon α et β+γ, avec la même règle des signes." },
      { title: "Méthode type", text: "Vérifier que la somme des masses n’est pas nulle. Écrire la moyenne pondérée. Interpréter la position (intérieur, extérieur, médiane). Contrôler avec un cas simple (masses égales)." },
      { title: "Erreurs fréquentes", text: "Diviser par α − β au lieu de α + β. Oublier que masses de signes opposés sortent du segment. Confondre isobarycentre et orthocentre. Affecter les masses aux mauvais points." }
    ]
  },
  translations: {
    title: "Translations — cours détaillé",
    lead: "Une translation glisse tout le plan d’un même vecteur. C’est une isométrie directe, sans point fixe si v⃗ ≠ 0⃗.",
    sections: [
      { title: "Définition", text: "t_v⃗(M) = M' ⇔ MM'⃗ = v⃗. En coordonnées : x' = x + v_x, y' = y + v_y. Si v⃗ = 0⃗, t est l’identité, seuls cas avec des points fixes." },
      { title: "Caractérisation", text: "t est une translation ⇔ pour tous M, N, M'N'⃗ = MN⃗. Équivaut à MM'⃗ constant. Conséquence : tous les segments [MM'] sont équipollents." },
      { title: "Images des figures", text: "Droite ↦ droite parallèle. Segment ↦ segment isométrique et parallèle. Demi-droite ↦ demi-droite. Cercle ↦ cercle de même rayon (le centre est translaté). Un polygone et son image sont superposables par glissement." },
      { title: "Conservations", text: "Alignement, milieu, barycentre, parallélisme, orthogonalité, contact, distances, angles orientés. Ce n’est ni une homothétie (sauf identité) ni une rotation." },
      { title: "Composition", text: "L’image de M par t_u⃗ puis par t_v⃗ est l’image de M par la translation de vecteur u⃗ + v⃗. Composer deux translations, c’est additionner les vecteurs." },
      { title: "Usage", text: "Trajet minimal, pont entre deux berges parallèles, construction d’un cercle coupant une droite selon une longueur donnée : on translate pour se ramener à un cas plus simple, on construit, on revient." },
      { title: "Méthode type", text: "Lire le vecteur. Ajouter les composantes. Vérifier sur un second point que M'N'⃗ = MN⃗. Conclure sur le parallélisme des supports." },
      { title: "Erreurs fréquentes", text: "Ajouter v⃗ à un vecteur au lieu d’un point. Croire qu’il y a un centre. Composer en multipliant les vecteurs. Confondre translation et homothétie de rapport 1 (seule l’identité est les deux)." }
    ]
  },
  homotheties: {
    title: "Homothéties — cours détaillé",
    lead: "Une homothétie agrandit ou réduit à partir d’un centre, en conservant les angles et le parallélisme. Les longueurs suivent |k|, les aires k².",
    sections: [
      { title: "Définition", text: "h(O, k), k ≠ 0 : OM'⃗ = k OM⃗, soit M' = O + k(M − O). k = 1 : identité. k = −1 : symétrie centrale. k < 0 : l’image est de l’autre côté de O (inversion du sens puis agrandissement |k|). Le centre O est le seul point invariant si k ≠ 1." },
      { title: "Caractérisation", text: "M'N'⃗ = k MN⃗. Donc (MN) // (M'N') et M'N' = |k| MN. Distance au centre : MM' = |k − 1| · OM. Les droites passant par O sont globalement stables." },
      { title: "Images", text: "Droite ↦ droite parallèle (égale à elle-même si elle passe par O). Cercle de centre I et rayon R ↦ cercle de centre I' = h(I) et rayon |k| R. Polygone : chaque côté × |k|." },
      { title: "Périmètre et aire", text: "p' = |k| p et A' = k² A. Piège classique : aire divisée par 4 ⇔ |k| = 1/2, pas k = 1/4. Périmètre au tiers ⇔ |k| = 1/3. Un volume (hors programme) serait en |k|³." },
      { title: "Conservations", text: "Alignement, milieu, barycentre, angles, parallélisme, orthogonalité, contact. Les distances ne sont conservées que si |k| = 1 (isométrie : identité ou symétrie centrale)." },
      { title: "Méthode type", text: "Placer O. Écrire OM'⃗ = k OM⃗ en composantes. Calculer éventuellement MM'. Pour une aire, élever k au carré, pas |k|." },
      { title: "Erreurs fréquentes", text: "Prendre k = 1/4 pour une aire au quart. Oublier la valeur absolue sur les longueurs quand k < 0. Appliquer k au point et non au vecteur OM⃗. Confondre centre d’homothétie et origine du repère quand O n’est pas (0;0)." }
    ]
  },
  rotations: {
    title: "Rotations — cours détaillé",
    lead: "Une rotation tourne le plan autour d’un centre, en conservant les distances. Directe (sens trigonométrique) ou indirecte selon le signe de l’angle.",
    sections: [
      { title: "Définition", text: "r(O) = O. Si r(M) = M' et M ≠ O : OM' = OM et l’angle MOM' vaut α. Étant donnés O, A, B avec OA = OB, il existe une unique rotation de centre O envoyant A sur B (angle orienté AOB)." },
      { title: "Quart de tour direct", text: "Dans un repère orthonormé direct, autour de l’origine : (x ; y) ↦ (−y ; x). Autour d’un centre O quelconque : on retranche O, on tourne, on rajoute O. L’image d’une droite est une perpendiculaire. Un carré ABCD se construit en prenant D = r_A(B) pour un quart de tour." },
      { title: "Cas particuliers du cours", text: "90° : quart de tour direct. Dans un repère orthonormé direct, autour de l’origine, (x ; y) ↦ (−y ; x). Autour d’un centre O : on forme OM⃗, on applique le quart de tour au vecteur, on rajoute O. 180° : demi-tour = symétrie centrale, M' = 2O − M. 0° : identité." },
      { title: "Demi-tour", text: "Rotation de 180° = symétrie centrale de centre O : M' = 2O − M. Deux quarts de tour = un demi-tour. Quatre quarts de tour = identité." },
      { title: "Conservations", text: "Alignement, milieu, barycentre, parallélisme, angles, orthogonalité, distances, contact. Un polygone et son image sont isométriques (même périmètre, même aire). Ce n’est pas une homothétie (sauf cas triviaux)." },
      { title: "Images", text: "Segment ↦ segment isométrique. Droite ↦ droite (non parallèle en général : l’angle des supports est α). Cercle de centre I ↦ cercle de même rayon et de centre r(I)." },
      { title: "Méthode type", text: "Identifier le centre et l’angle. Si O n’est pas l’origine, se ramener au vecteur OM⃗. Appliquer le quart de tour ou le demi-tour du cours. Contrôler OM' = OM et, pour 90°, OM⃗ · OM'⃗ = 0." },
      { title: "Erreurs fréquentes", text: "Tourner autour de l’origine alors que le centre est ailleurs. Confondre direct et horaire : (−y ; x) n’est pas (y ; −x). Oublier que 180° est M' = 2O − M. Utiliser un repère non orthonormé pour le quart de tour." }
    ]
  },
  "suites-arith": {
    title: "Suites arithmétiques — cours détaillé",
    lead: "Une suite est arithmétique lorsque l’on passe d’un terme au suivant en ajoutant toujours le même réel r, appelé raison. Les points (n ; uₙ) sont alignés.",
    sections: [
      { title: "Définition", text: "(uₙ) est arithmétique de raison r si, pour tout n, u_{n+1} = uₙ + r. r peut être positive (suite croissante) ou négative (décroissante)." },
      { title: "Terme général", text: "uₙ = u₁ + (n−1)r. On compte le nombre de pas depuis u₁, pas depuis 0. On peut aussi écrire uₙ = u_p + (n−p)r." },
      { title: "Somme", text: "Sₙ = u₁ + u₂ + … + uₙ = n(u₁ + uₙ)/2 = n(2u₁ + (n−1)r)/2. On moyenne les extrêmes, on multiplie par le nombre de termes." },
      { title: "Représentation", text: "Dans un repère, on place les points (1 ; u₁), (2 ; u₂), … Ils sont alignés, de pente r. Ce n’est pas une courbe continue : une suite est discrète." },
      { title: "Méthode type", text: "Identifier u₁ et r. Écrire uₙ, puis Sₙ si on demande une somme. Contrôler uₙ − uₙ₋₁ = r." },
      { title: "Erreurs fréquentes", text: "Écrire uₙ = u₁ + n r (un cran de trop). Sommer n termes avec n+1. Confondre suite arithmétique et fonction affine continue." }
    ]
  },
  "suites-geo": {
    title: "Suites géométriques — cours détaillé",
    lead: "Une suite est géométrique lorsque l’on multiplie toujours par le même réel q ≠ 0. Les points s’éloignent de 0 si |q| > 1.",
    sections: [
      { title: "Définition", text: "u_{n+1} = q uₙ. q est la raison. Si q > 1 et u₁ > 0, la suite est croissante. Si 0 < q < 1, elle tend vers 0." },
      { title: "Terme général", text: "uₙ = u₁ q^{n−1}. Exposant n−1 : le premier terme n’est pas encore multiplié." },
      { title: "Somme", text: "Si q ≠ 1, Sₙ = u₁ (1 − qⁿ)/(1 − q). Si q = 1, Sₙ = n u₁. On ne divise jamais par 0." },
      { title: "Représentation", text: "Les points (n ; uₙ) ne sont pas alignés (sauf cas triviaux). Pour q = 2, on voit une croissance « en escalier exponentiel »." },
      { title: "Méthode type", text: "Lire u₁ et q. Écrire uₙ. Pour une somme, choisir la formule selon q = 1 ou non." },
      { title: "Erreurs fréquentes", text: "Utiliser 1 − qⁿ avec q = 1. Confondre n et n−1. Additionner au lieu de multiplier par q." }
    ]
  },
  fonctions: {
    title: "Généralités sur les fonctions — cours détaillé",
    lead: "Une fonction associe à chaque x de l’ensemble de définition au plus une image f(x). La courbe C_f est l’ensemble des points (x ; f(x)).",
    sections: [
      { title: "Vocabulaire", text: "Image de x : f(x). Antécédents de y : les x tels que f(x) = y. Ensemble de définition D_f : les x pour lesquels f(x) existe." },
      { title: "Courbe", text: "Dans un repère, on place les points (x ; f(x)). Une verticale coupe la courbe en au plus un point (c’est une fonction)." },
      { title: "Variations", text: "f est croissante sur I si x₁ < x₂ ⇒ f(x₁) ≤ f(x₂). Décroissante : le sens s’inverse. Tableau de variations, extremums." },
      { title: "Équations et inéquations", text: "f(x) = k se lit comme les abscisses des points d’ordonnée k. f(x) > k : au-dessus de la droite y = k." },
      { title: "Méthode type", text: "Déterminer D_f. Calculer quelques images. Tracer ou exploiter la courbe. Lire antécédents graphiquement, puis justifier par le calcul." },
      { title: "Erreurs fréquentes", text: "Confondre image et antécédent. Tracer une courbe qui n’est pas un graphe de fonction (deux y pour un x). Lire un extremum hors de l’intervalle." }
    ]
  },
  ref: {
    title: "Fonctions de référence — cours détaillé",
    lead: "On connaît le graphe de quelques fonctions : affine, trinôme, inverse, racine, valeur absolue. Les autres s’en déduisent par translations.",
    sections: [
      { title: "Affine", text: "x ↦ ax + b : droite de pente a. a > 0 croissante." },
      { title: "Trinôme", text: "x ↦ ax² + bx + c : parabole, sommet d’abscisse −b/(2a). Signe de a : concavité." },
      { title: "Inverse et racine", text: "x ↦ 1/x (x ≠ 0) : hyperbole. x ↦ √x (x ≥ 0) : demi-parabole « couchée »." },
      { title: "Valeur absolue", text: "x ↦ |x| : V, minimum 0 en 0. |x − ω| translate le V." },
      { title: "Méthode type", text: "Reconnaître le modèle. Placer le sommet ou l’asymptote. Tracer quelques points, puis la courbe." },
      { title: "Erreurs fréquentes", text: "Tracer √x pour x < 0. Oublier que 1/x n’est pas définie en 0. Confondre a et le sommet." }
    ]
  },
  trigo: {
    title: "Trigonométrie — cours détaillé",
    lead: "Le cercle trigonométrique de centre O et de rayon 1 permet de définir cos α et sin α comme coordonnées d’un point M.",
    sections: [
      { title: "Cercle", text: "Repère orthonormé. M a pour coordonnées (cos α ; sin α). α se lit sur l’arc, en degrés dans ce tome (et parfois en radians plus tard)." },
      { title: "Angles remarquables", text: "0° : (1 ; 0). 30° : (√3/2 ; 1/2). 45° : (√2/2 ; √2/2). 60° : (1/2 ; √3/2). 90° : (0 ; 1)." },
      { title: "Relation", text: "cos²α + sin²α = 1. C’est Pythagore sur le cercle unité." },
      { title: "Mesure des grandeurs", text: "Dans un triangle rectangle, cos = adjacent/hypoténuse, sin = opposé/hypoténuse. On s’en sert pour calculer des longueurs." },
      { title: "Méthode type", text: "Placer M. Lire ou retrouver cos et sin. Contrôler par cos²+sin² = 1." },
      { title: "Erreurs fréquentes", text: "Inverser cos et sin. Utiliser la calculatrice en radians alors que l’énoncé est en degrés. Oublier le cercle de rayon 1." }
    ]
  },
  analytique: {
    title: "Géométrie analytique — cours détaillé",
    lead: "Le repère orthonormé traduit distances, milieux et droites en coordonnées.",
    sections: [
      { title: "Distance", text: "AB = √[(x_B−x_A)² + (y_B−y_A)²] en repère orthonormé." },
      { title: "Milieu", text: "I milieu de [AB] : x_I = (x_A+x_B)/2, y_I = (y_A+y_B)/2." },
      { title: "Pente", text: "m = (y_B−y_A)/(x_B−x_A) si x_A ≠ x_B. y = mx + p." },
      { title: "Parallélisme", text: "Deux droites non verticales sont parallèles ⇔ mêmes pentes." },
      { title: "Méthode type", text: "Placer les points. Calculer AB, I, m. Écrire l’équation, vérifier sur un point." },
      { title: "Erreurs fréquentes", text: "Oublier le carré sous la racine. Inverser Δx et Δy. Appliquer la distance dans un repère non orthonormé." }
    ]
  },
  "espace-droites": {
    title: "Droites et plans de l’espace — cours détaillé",
    lead: "Dans l’espace, deux droites peuvent être sécantes, parallèles ou non coplanaires. Un plan est déterminé par trois points non alignés.",
    sections: [
      { title: "Positions de deux droites", text: "Sécantes (un point commun), parallèles (même direction, pas de point commun), non coplanaires (ni parallèles ni sécantes)." },
      { title: "Droite et plan", text: "La droite est incluse dans le plan, sécante au plan, ou parallèle au plan." },
      { title: "Deux plans", text: "Confondus, sécants (droite commune) ou parallèles." },
      { title: "Représentation", text: "On dessine un pavé ou un cube pour voir les arêtes (droites) et les faces (plans)." },
      { title: "Méthode type", text: "Nommer les objets. Se ramener à un cube de référence. Conclure sur l’intersection." },
      { title: "Erreurs fréquentes", text: "Croire que deux droites non parallèles se coupent toujours (faux dans l’espace). Confondre face et arête." }
    ]
  },
  parallelisme: {
    title: "Parallélisme dans l’espace — cours détaillé",
    lead: "Le parallélisme se transmet : si une droite est parallèle à un plan, certaines droites du plan le sont aussi.",
    sections: [
      { title: "Droites parallèles", text: "Même direction. Par un point hors d’une droite, une unique parallèle." },
      { title: "Droite parallèle à un plan", text: "La droite ne rencontre pas le plan. Elle est parallèle à une droite du plan." },
      { title: "Plans parallèles", text: "Aucun point commun. Les droites d’intersection avec un troisième plan sécant sont parallèles." },
      { title: "Théorèmes du cours", text: "Si deux plans sont parallèles, toute droite de l’un parallèle à l’autre l’est au second. On utilise le pavé comme modèle." },
      { title: "Méthode type", text: "Identifier les directions. Chercher une droite ou un plan intermédiaire. Conclure par un théorème nommé." },
      { title: "Erreurs fréquentes", text: "Utiliser un théorème du plan dans l’espace sans précaution. Oublier le cas des droites non coplanaires." }
    ]
  },
  orthogonalite: {
    title: "Orthogonalité dans l’espace — cours détaillé",
    lead: "Deux droites de l’espace sont orthogonales si leurs directions le sont, même si elles ne se coupent pas. Un plan et une droite sont perpendiculaires si la droite est orthogonale à deux droites sécantes du plan.",
    sections: [
      { title: "Droites orthogonales", text: "u⃗ · v⃗ = 0 pour des vecteurs directeurs. Elles peuvent être non coplanaires." },
      { title: "Droite perpendiculaire à un plan", text: "Orthogonale à deux droites sécantes du plan. Elle est alors orthogonale à toute droite du plan." },
      { title: "Plans perpendiculaires", text: "Une droite de l’un est perpendiculaire à l’autre." },
      { title: "Lien avec le produit scalaire", text: "En base orthonormée, xx' + yy' + zz' = 0. Dans le plan, on retrouve xx' + yy' = 0." },
      { title: "Méthode type", text: "Choisir des vecteurs directeurs. Calculer un produit scalaire. Interpréter géométriquement." },
      { title: "Erreurs fréquentes", text: "Exiger que les droites se coupent pour parler d’orthogonalité. Confondre orthogonal et perpendiculaire à un plan." }
    ]
  },
  stats: {
    title: "Statistiques — cours détaillé",
    lead: "On résume une série par des indicateurs de position (moyenne) et de dispersion (étendue). Un graphique (bâtons, histogramme) visualise la série.",
    sections: [
      { title: "Effectifs", text: "n = effectif total. nᵢ = effectif de la valeur ou de la classe. Fréquence fᵢ = nᵢ/n." },
      { title: "Moyenne", text: "x̄ = (Σ nᵢ xᵢ)/n = (Σ xᵢ)/n pour une série brute. C’est le barycentre des valeurs." },
      { title: "Étendue", text: "max − min. Indicateur simple de dispersion." },
      { title: "Graphiques", text: "Diagramme en bâtons pour une variable discrète. Histogramme pour des classes. On place min, x̄, max sur une droite." },
      { title: "Méthode type", text: "Organiser le tableau. Calculer n, Σ, x̄, étendue. Contrôler x̄ ∈ [min ; max]." },
      { title: "Erreurs fréquentes", text: "Diviser par le nombre de classes au lieu de n. Confondre moyenne et médiane (hors programme détaillé ici). Oublier les effectifs dans une moyenne pondérée." }
    ]
  }
};

export function chapterCourse(id) {
  return chapterCourses[id] || { title: "Cours", lead: "", sections: [] };
}
