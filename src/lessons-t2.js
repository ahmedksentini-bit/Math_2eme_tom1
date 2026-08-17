const u = (n, title, spec) => ({ n, title, ...spec });

export const lessonsT2 = {
  "suites-arith": {
    title: "Suites arithmétiques",
    intro: "Une suite, c’est une liste de nombres numérotés : u₁, u₂, u₃, … Ici, on passe de l’un à l’autre en ajoutant toujours le même nombre, la raison r.",
    map: ["Reconnaître une suite arithmétique", "Le terme général uₙ", "La somme des n premiers termes"],
    closing: "Identifier u₁ et r. Écrire uₙ = u₁ + (n−1)r. Si on demande une somme, moyenne des extrêmes × nombre de termes.",
    units: [
      u("01", "Ajouter toujours la même chose", {
        why: "Reconnaître le modèle avant de sortir une formule.",
        idea: "u_{n+1} = uₙ + r. r peut être positive (on grimpe) ou négative (on descend). Les points (n ; uₙ) sont alignés, de pente r. Ce n’est pas une droite continue : entre n = 2 et n = 3, il n’y a pas de terme.",
        method: ["Calculer u₂ − u₁, u₃ − u₂, …", "Si la différence est constante, la suite est arithmétique et cette différence est r.", "Lire u₁ dans l’énoncé (parfois u₀ : alors on adapte)."],
        example: {
          title: "2, 5, 8, 11, …",
          given: "Différence constante ?",
          steps: [
            { label: "Écarts", text: "5−2 = 3, 8−5 = 3, 11−8 = 3." },
            { label: "Conclusion", text: "Arithmétique de raison r = 3, u₁ = 2." }
          ],
          result: "uₙ = 2 + (n−1)×3."
        },
        check: { q: "2, 4, 8, 16 est-elle arithmétique ?", a: "Non : on multiplie par 2. C’est géométrique." },
        keep: ["Différence constante ⇔ arithmétique.", "Une suite est discrète : des points, pas un trait continu."],
        trap: "Confondre avec une suite géométrique (on multiplie, on n’ajoute pas)."
      }),
      u("02", "uₙ = u₁ + (n−1)r", {
        why: "Trouver un terme éloigné sans tout écrire.",
        idea: "Pour aller de u₁ à uₙ, on fait (n−1) pas, pas n pas. Le premier terme est déjà là. On peut aussi partir d’un autre rang : uₙ = u_p + (n−p)r.",
        method: ["Compter les pas depuis le terme connu.", "uₙ = u₁ + (n−1)r.", "Contrôler : uₙ − uₙ₋₁ doit valoir r."],
        example: {
          title: "u₁ = 5, r = −2, u₁₀",
          given: "9 pas de −2.",
          steps: [
            { label: "Formule", text: "u₁₀ = 5 + 9×(−2) = 5 − 18 = −13." },
            { label: "Contrôle", text: "u₂ = 3, u₃ = 1 : on descend bien de 2." }
          ],
          result: "u₁₀ = −13."
        },
        check: { q: "Pourquoi pas uₙ = u₁ + n r ?", a: "Ce serait un cran de trop : u₁ deviendrait u₁ + r, ce qui est u₂." },
        keep: ["Nombre de pas = n − 1 depuis u₁.", "r négative : suite décroissante."],
        trap: "Écrire uₙ = u₁ + n r."
      }),
      u("03", "Somme Sₙ = n(u₁ + uₙ)/2", {
        why: "Additionner sans additionner un à un.",
        idea: "Gauss : on moyenne le premier et le dernier, on multiplie par le nombre de termes. Autre écriture : Sₙ = n(2u₁ + (n−1)r)/2, utile quand on n’a pas encore uₙ.",
        method: ["Trouver uₙ si besoin.", "Sₙ = n(u₁ + uₙ)/2.", "Vérifier sur un petit n à la main."],
        example: {
          title: "1 + 2 + … + 10",
          given: "u₁ = 1, u₁₀ = 10, n = 10.",
          steps: [
            { label: "Moyenne", text: "(1+10)/2 = 5,5." },
            { label: "Produit", text: "10 × 5,5 = 55." }
          ],
          result: "S₁₀ = 55. (C’est aussi n(n+1)/2.)"
        },
        check: { q: "Somme-t-on n termes ou n+1 termes de u₁ à uₙ ?", a: "n termes. De 1 à n, il y a n nombres." },
        keep: ["Sₙ = n(premier + dernier)/2.", "Compter les termes avant de multiplier."],
        trap: "Utiliser n+1 termes, ou oublier de diviser par 2."
      })
    ]
  },
  "suites-geo": {
    title: "Suites géométriques",
    intro: "Ici, on multiplie toujours par le même nombre q, la raison. Les écarts ne sont plus constants : ça accélère (ou ça s’écrase vers 0).",
    map: ["Reconnaître q", "Terme général", "Somme (attention si q = 1)"],
    closing: "Lire u₁ et q. uₙ = u₁ q^{n−1}. Pour une somme, si q ≠ 1 : u₁(1−qⁿ)/(1−q) ; si q = 1 : n u₁.",
    units: [
      u("01", "Multiplier toujours par q", {
        why: "Ne pas traiter une géométrique comme une arithmétique.",
        idea: "u_{n+1} = q uₙ. Le rapport u_{n+1}/uₙ est constant (si uₙ ≠ 0). Si |q| > 1, les termes s’éloignent de 0. Si 0 < |q| < 1, ils se rapprochent de 0.",
        method: ["Calculer les rapports successifs.", "Si le rapport est constant, q est ce rapport.", "Lire u₁."],
        example: {
          title: "3, 6, 12, 24",
          given: "Rapports.",
          steps: [
            { label: "Rapports", text: "6/3 = 2, 12/6 = 2, 24/12 = 2." },
            { label: "Conclusion", text: "Géométrique, q = 2, u₁ = 3." }
          ],
          result: "uₙ = 3 × 2^{n−1}."
        },
        check: { q: "3, 6, 9, 12 est-elle géométrique ?", a: "Non : on ajoute 3. C’est arithmétique." },
        keep: ["Rapport constant ⇔ géométrique.", "|q| > 1 : ça « explose » ; |q| < 1 : ça tend vers 0."],
        trap: "Additionner r au lieu de multiplier par q."
      }),
      u("02", "uₙ = u₁ q^{n−1}", {
        why: "Le premier terme n’est pas encore multiplié.",
        idea: "Même logique que l’arithmétique : (n−1) multiplications pour arriver au rang n. Exposant n−1, pas n.",
        method: ["uₙ = u₁ q^{n−1}.", "Pour un rang p : uₙ = u_p q^{n−p}.", "Si q < 0, les signes alternent."],
        example: {
          title: "u₁ = 5, q = 2, u₆",
          given: "5 multiplications par 2 ? Non : 5 pas, exposant 5.",
          steps: [
            { label: "Exposant", text: "n−1 = 5." },
            { label: "Calcul", text: "u₆ = 5 × 2⁵ = 5 × 32 = 160." }
          ],
          result: "u₆ = 160."
        },
        check: { q: "uₙ = u₁ qⁿ : vrai ou faux ?", a: "Faux. Exposant n−1. Avec n, u₁ deviendrait u₁ q, c’est-à-dire u₂." },
        keep: ["Exposant = nombre de pas = n − 1.", "q négatif : alternance de signes."],
        trap: "Écrire qⁿ au lieu de q^{n−1}."
      }),
      u("03", "La somme, et le cas q = 1", {
        why: "La formule change si on ne multiplie par rien.",
        idea: "Si q ≠ 1, Sₙ = u₁ (1 − qⁿ)/(1 − q). Si q = 1, chaque terme vaut u₁, donc Sₙ = n u₁. On ne divise jamais par 0.",
        method: ["Regarder si q = 1.", "Sinon appliquer u₁(1−qⁿ)/(1−q).", "Contrôler sur n = 2 à la main."],
        example: {
          title: "u₁ = 1, q = 2, S₅ = 1+2+4+8+16",
          given: "q ≠ 1.",
          steps: [
            { label: "Formule", text: "S₅ = (1 − 2⁵)/(1 − 2) = (1 − 32)/(−1) = 31." },
            { label: "Main", text: "1+2+4+8+16 = 31." }
          ],
          result: "S₅ = 31."
        },
        check: { q: "Que faire si q = 1 ?", a: "Sₙ = n u₁. La formule avec 1−q au dénominateur est interdite." },
        keep: ["q ≠ 1 : Sₙ = u₁(1−qⁿ)/(1−q).", "q = 1 : Sₙ = n u₁."],
        trap: "Diviser par 1−q alors que q = 1."
      })
    ]
  },
  fonctions: {
    title: "Généralités sur les fonctions",
    intro: "Une fonction, c’est une machine : tu entres x, il sort au plus une image f(x). La courbe est le nuage des points (x ; f(x)).",
    map: ["Image et antécédents", "Ensemble de définition", "Variations et lecture graphique"],
    closing: "Déterminer D_f, calculer quelques images, lire la courbe : une verticale coupe le graphe en au plus un point.",
    units: [
      u("01", "Image et antécédent", {
        why: "Ne plus confondre les deux mots, source n°1 d’erreurs.",
        idea: "L’image de 3, c’est f(3) : on part de x = 3, on descend (ou on calcule) pour lire y. Un antécédent de 5, c’est un x tel que f(x) = 5 : on part de y = 5, on cherche les x. Une valeur peut avoir 0, 1 ou plusieurs antécédents. Une valeur a une seule image.",
        method: ["« Image de a » : calculer f(a).", "« Antécédents de b » : résoudre f(x) = b.", "Graphiquement : verticale pour l’image, horizontale pour les antécédents."],
        example: {
          title: "f(x) = x², image de −2, antécédents de 4",
          given: "Parabole.",
          steps: [
            { label: "Image", text: "f(−2) = 4. Une seule image." },
            { label: "Antécédents", text: "x² = 4 ⇔ x = −2 ou x = 2. Deux antécédents." }
          ],
          result: "Image de −2 : 4. Antécédents de 4 : −2 et 2."
        },
        check: { q: "f(x) = 3 a deux solutions. Combien d’images pour chaque x ?", a: "Toujours une (si x ∈ D_f). Ce sont les antécédents de 3 qui sont deux." },
        keep: ["x ↦ y : une flèche vers le haut = image.", "y ↦ x : une flèche vers la gauche = antécédents."],
        trap: "Dire « l’antécédent de 3 vaut 5 » alors qu’on a calculé f(3) = 5 (c’est l’image)."
      }),
      u("02", "Ensemble de définition", {
        why: "Avant de calculer, savoir où f a le droit d’exister.",
        idea: "D_f, ce sont les x pour lesquels la formule a un sens. On interdit : racine d’un négatif, division par zéro. Parfois un intervalle est imposé par l’énoncé (contrainte physique).",
        method: ["Repérer √, / , | |, etc.", "Écrire les conditions (ce qu’il y a sous la racine ≥ 0, dénominateur ≠ 0).", "Faire l’intersection : c’est D_f."],
        example: {
          title: "f(x) = 1/(x − 2)",
          given: "Un dénominateur.",
          steps: [
            { label: "Interdit", text: "x − 2 ≠ 0, donc x ≠ 2." },
            { label: "D_f", text: "ℝ \\ {2}." }
          ],
          result: "Asymptote verticale en x = 2."
        },
        check: { q: "D_f de √(x − 1) ?", a: "x − 1 ≥ 0, donc [1 ; +∞[." },
        keep: ["Racine : intérieur ≥ 0.", "Quotient : dénominateur ≠ 0."],
        trap: "Tracer √x pour x < 0, ou 1/x en 0."
      }),
      u("03", "Lire une courbe", {
        why: "Le graphe dit les variations, les extremums, les équations f(x) = k.",
        idea: "f est croissante sur I si, quand x augmente, f(x) n’augmente pas moins (elle monte ou stagne). Une verticale coupe C_f en au plus un point — sinon ce n’est pas une fonction. f(x) = k : abscisses des points d’ordonnée k. f(x) > k : morceaux de courbe au-dessus de la droite y = k.",
        method: ["Vérifier que c’est un graphe de fonction.", "Lire le tableau de variations (montées, descentes, sommets).", "Pour f(x) = k, tracer y = k et lire les x."],
        example: {
          title: "Parabole tournée vers le haut, sommet (1 ; −2)",
          given: "Minimum −2 en x = 1.",
          steps: [
            { label: "f(x) = 0", text: "Deux antécédents si la parabole recoupe l’axe, de part et d’autre de 1." },
            { label: "f(x) = −3", text: "Aucun : −3 est sous le minimum." }
          ],
          result: "Un extremum se lit sur l’intervalle demandé, pas « en dehors »."
        },
        check: { q: "Un cercle est-il le graphe d’une fonction ?", a: "Non : une verticale le coupe deux fois." },
        keep: ["Une verticale : au plus un point.", "Extremum : regarder l’intervalle de l’énoncé."],
        trap: "Lire un maximum global alors que l’intervalle s’arrête avant le sommet."
      })
    ]
  },
  ref: {
    title: "Fonctions de référence",
    intro: "Quelques graphes à connaître par cœur. Les autres se déduisent par translation (on glisse le modèle).",
    map: ["Affine et trinôme", "Inverse et racine", "Valeur absolue"],
    closing: "Reconnaître le modèle, placer le sommet ou l’asymptote, tracer quelques points, puis la courbe.",
    units: [
      u("01", "Droite et parabole", {
        why: "Les deux graphes les plus fréquents.",
        idea: "x ↦ ax + b : droite de pente a. a > 0 : ça monte. x ↦ ax² + bx + c : parabole. Le sommet a pour abscisse −b/(2a). a > 0 : sourire (concavité vers le haut). a < 0 : grimace.",
        method: ["Affine : deux points suffisent, ou un point et la pente.", "Trinôme : placer le sommet, un point (souvent les racines si Δ ≥ 0), tracer symétriquement."],
        example: {
          title: "f(x) = x² − 4x + 3",
          given: "a = 1 > 0.",
          steps: [
            { label: "Sommet", text: "x = 4/2 = 2, f(2) = −1." },
            { label: "Racines", text: "Δ = 16−12 = 4, racines 1 et 3." }
          ],
          result: "Parabole vers le haut, sommet (2 ; −1), coupe l’axe en 1 et 3."
        },
        check: { q: "Le sommet est-il toujours un minimum ?", a: "Seulement si a > 0. Si a < 0, c’est un maximum." },
        keep: ["Pente a pour l’affine.", "Sommet en x = −b/(2a) pour le trinôme."],
        trap: "Confondre a avec l’ordonnée du sommet."
      }),
      u("02", "1/x et √x", {
        why: "Deux graphes avec un « interdit ».",
        idea: "1/x n’existe pas en 0 : deux branches, une asymptote verticale x = 0 et une horizontale y = 0. √x n’existe que pour x ≥ 0 : on part de l’origine, ça monte en s’aplatissant. Ce n’est pas une parabole verticale.",
        method: ["Inverse : deux points de chaque côté de 0, ne jamais relier à travers 0.", "Racine : domaine [0 ; +∞[, f(0)=0, f(1)=1, f(4)=2."],
        example: {
          title: "Points de √x",
          given: "x = 0, 1, 4, 9.",
          steps: [
            { label: "Images", text: "0, 1, 2, 3." },
            { label: "Forme", text: "Demi-parabole « couchée », pas une droite." }
          ],
          result: "Courbe de √x au-dessus de [0 ; +∞[."
        },
        check: { q: "√x pour x = −4 ?", a: "N’existe pas dans ℝ." },
        keep: ["1/x : jamais en 0.", "√x : jamais à gauche de 0."],
        trap: "Tracer une hyperbole d’un seul tenant, ou √x sur ℝ tout entier."
      }),
      u("03", "Le V de la valeur absolue", {
        why: "|x − ω| glisse le V.",
        idea: "|x| : deux demi-droites, minimum 0 en 0. |x − ω| translate le V : le « pli » est en x = ω. |x| + h le monte de h.",
        method: ["Trouver où l’intérieur s’annule : c’est le sommet du V.", "À droite, la formule sans barres ; à gauche, on inverse le signe.", "Tracer."],
        example: {
          title: "g(x) = |x − 2|",
          given: "Pli en 2.",
          steps: [
            { label: "x ≥ 2", text: "g(x) = x − 2 (pente 1)." },
            { label: "x < 2", text: "g(x) = 2 − x (pente −1)." }
          ],
          result: "V de sommet (2 ; 0)."
        },
        check: { q: "Le minimum de |x| + 3 ?", a: "3, atteint en x = 0." },
        keep: ["Le pli est là où l’intérieur vaut 0.", "Pentes +1 et −1 pour |x − ω|."],
        trap: "Tracer une parabole au lieu du V."
      })
    ]
  },
  trigo: {
    title: "Trigonométrie",
    intro: "On place un point M sur le cercle de rayon 1. Ses coordonnées sont (cos α ; sin α). Le reste, c’est Pythagore.",
    map: ["Le cercle trigonométrique", "Angles remarquables", "Dans un triangle rectangle"],
    closing: "Placer M, lire cos (abscisse) et sin (ordonnée), contrôler cos²α + sin²α = 1. Calculatrice en degrés si l’énoncé est en degrés.",
    units: [
      u("01", "Cosinus = abscisse, sinus = ordonnée", {
        why: "Arrêter d’apprendre des définitions séparées : c’est un point sur un cercle.",
        idea: "Cercle de centre O, rayon 1, repère orthonormé. On part de A(1 ; 0) et on tourne d’un angle α (sens direct). M a pour coordonnées (cos α ; sin α). Cosinus : « combien on a avancé à l’horizontale ». Sinus : « combien on a monté ».",
        method: ["Dessiner le cercle unité.", "Repérer α depuis l’axe des x.", "Lire x = cos α, y = sin α.", "Contrôle : x² + y² = 1."],
        example: {
          title: "α = 90°",
          given: "Quart de tour.",
          steps: [
            { label: "Point", text: "M est en (0 ; 1)." },
            { label: "Lecture", text: "cos 90° = 0, sin 90° = 1." }
          ],
          result: "Au « nord » du cercle."
        },
        check: { q: "cos α peut-il valoir 2 ?", a: "Non : sur le cercle unité, −1 ≤ cos α ≤ 1, idem pour sin." },
        keep: ["Rayon 1 obligatoire pour cette définition.", "cos² + sin² = 1, toujours."],
        trap: "Inverser cos et sin, ou oublier que le rayon est 1."
      }),
      u("02", "Les angles à connaître", {
        why: "0°, 30°, 45°, 60°, 90° reviennent dans tous les devoirs.",
        idea: "On retient les couples (cos ; sin) : 0° → (1 ; 0), 30° → (√3/2 ; 1/2), 45° → (√2/2 ; √2/2), 60° → (1/2 ; √3/2), 90° → (0 ; 1). Astuce : le sinus « monte » (0, 1/2, √2/2, √3/2, 1), le cosinus descend en miroir.",
        method: ["Écrire la ligne des sinus croissants.", "Le cosinus est la même ligne à l’envers.", "Vérifier sur 45° : les deux égaux."],
        example: {
          title: "Contrôle Pythagore à 30°",
          given: "(√3/2)² + (1/2)².",
          steps: [
            { label: "Calcul", text: "3/4 + 1/4 = 1." }
          ],
          result: "La table est cohérente."
        },
        check: { q: "cos 60° = ?", a: "1/2 (et sin 60° = √3/2). On inverse souvent les deux." },
        keep: ["Sinus de 30° = 1/2, cosinus de 60° = 1/2.", "45° : √2/2 et √2/2."],
        trap: "Échanger 30° et 60°."
      }),
      u("03", "Triangle rectangle", {
        why: "Calculer un côté quand on a un angle aigu.",
        idea: "Dans un triangle rectangle : cos = adjacent / hypoténuse, sin = opposé / hypoténuse. L’hypoténuse est le côté en face de l’angle droit, le plus long. On ne divise jamais un côté par un autre au hasard : on nomme d’abord opposé et adjacent.",
        method: ["Repérer l’angle droit et l’angle α utilisé.", "Nommer opposé, adjacent, hypoténuse.", "Écrire cos ou sin, puis isoler la longueur cherchée."],
        example: {
          title: "Hypoténuse 10, angle 30°, côté opposé",
          given: "sin 30° = 1/2.",
          steps: [
            { label: "Relation", text: "opposé = 10 × sin 30° = 10 × 1/2 = 5." }
          ],
          result: "Côté opposé 5."
        },
        check: { q: "La calculatrice est en radians, l’énoncé en degrés. Que faire ?", a: "Passer en degrés (mode D ou DEG). Sinon sin 30 « radians » n’est pas 1/2." },
        keep: ["Hypoténuse : face à l’angle droit.", "cos = adj/hyp, sin = opp/hyp."],
        trap: "Prendre le mauvais côté comme hypoténuse."
      })
    ]
  },
  analytique: {
    title: "Géométrie analytique",
    intro: "Le repère orthonormé traduit la géométrie en calculs : distance, milieu, pente, équation de droite.",
    map: ["Distance et milieu", "Pente d’une droite", "Équation y = mx + p"],
    closing: "Placer les points, calculer AB et I, puis la pente, écrire y = mx + p, vérifier sur un point.",
    units: [
      u("01", "Distance et milieu", {
        why: "Les deux formules de base, en repère orthonormé.",
        idea: "Distance : Pythagore entre A et B. AB = √[(x_B−x_A)² + (y_B−y_A)²]. Milieu : moyenne des coordonnées. I((x_A+x_B)/2 ; (y_A+y_B)/2). Sans orthonormé, la distance usuelle est fausse.",
        method: ["Écrire les différences Δx et Δy.", "Sommer les carrés, puis la racine.", "Milieu : additionner, diviser par 2 (chaque coordonnée)."],
        example: {
          title: "A(1 ; 2), B(4 ; 6)",
          given: "3-4-5.",
          steps: [
            { label: "Δ", text: "Δx = 3, Δy = 4." },
            { label: "AB", text: "√(9+16) = 5." },
            { label: "I", text: "(2,5 ; 4)." }
          ],
          result: "AB = 5, I(2,5 ; 4)."
        },
        check: { q: "Oublie-t-on souvent le carré ?", a: "Oui : √(Δx + Δy) est faux. Ce sont les carrés." },
        keep: ["Carrés sous la racine.", "Milieu = moyenne, pas la différence."],
        trap: "Inverser Δx et Δy dans un quotient de pente, ou oublier les carrés."
      }),
      u("02", "La pente", {
        why: "Savoir si ça monte, et si deux droites sont parallèles.",
        idea: "m = (y_B − y_A)/(x_B − x_A) si x_A ≠ x_B. m > 0 : la droite monte (vers la droite). m = 0 : horizontale. Verticale : pas de pente (dénominateur nul). Deux droites non verticales sont parallèles ⇔ même pente.",
        method: ["Calculer m.", "Comparer les pentes pour le parallélisme.", "Pour l’orthogonalité (repère orthonormé) : m × m' = −1."],
        example: {
          title: "A(0 ; 1), B(2 ; 5)",
          given: "Pente.",
          steps: [
            { label: "m", text: "(5−1)/(2−0) = 2." },
            { label: "Lecture", text: "Quand x avance de 1, y avance de 2." }
          ],
          result: "m = 2."
        },
        check: { q: "Pentes 2 et −1/2 : que dire ?", a: "2 × (−1/2) = −1 : droites perpendiculaires (repère orthonormé)." },
        keep: ["m = Δy/Δx.", "Parallèles ⇔ pentes égales."],
        trap: "Écrire Δx/Δy (l’inverse), ou parler de pente pour une verticale."
      }),
      u("03", "Équation réduite", {
        why: "Écrire la droite, puis vérifier.",
        idea: "y = mx + p. m est la pente, p est l’ordonnée à l’origine (où la droite coupe l’axe des y). Une fois m connu, on injecte un point pour trouver p.",
        method: ["Calculer m avec deux points.", "Remplacer x et y d’un point connu : on obtient p.", "Vérifier avec le second point."],
        example: {
          title: "Passe par (0 ; 1) et (2 ; 5)",
          given: "m = 2 déjà.",
          steps: [
            { label: "p", text: "Le point (0 ; 1) dit p = 1." },
            { label: "Équation", text: "y = 2x + 1." },
            { label: "Contrôle", text: "En x = 2, y = 5. Oui." }
          ],
          result: "y = 2x + 1."
        },
        check: { q: "Une verticale a-t-elle une équation y = mx + p ?", a: "Non. Une verticale s’écrit x = constante." },
        keep: ["p = f(0) si 0 est dans le domaine de la droite.", "Toujours vérifier sur un deuxième point."],
        trap: "Trouver m et oublier p, ou écrire x = my + p."
      })
    ]
  },
  "espace-droites": {
    title: "Droites et plans de l’espace",
    intro: "Dans l’espace, deux droites peuvent ne jamais se couper sans être parallèles : elles sont non coplanaires. Un cube (pavé) est le meilleur dessin.",
    map: ["Deux droites", "Droite et plan", "Deux plans"],
    closing: "Nommer les objets, se ramener à un cube, conclure sur l’intersection (vide, un point, une droite, le plan entier).",
    units: [
      u("01", "Deux droites dans l’espace", {
        why: "Le piège : « elles ne sont pas parallèles, donc elles se coupent » — faux ici.",
        idea: "Trois cas : sécantes (un point commun, forcément coplanaires), parallèles (même direction, pas de point commun), non coplanaires (ni l’un ni l’autre : comme une arête du dessus d’un cube et une arête du dessous « de travers »).",
        method: ["Dessiner un cube.", "Identifier les directions (arêtes parallèles).", "Chercher un plan commun. S’il n’y en a pas et que les directions diffèrent : non coplanaires."],
        example: {
          title: "Cube ABCDEFGH",
          given: "AB et FG (F au-dessus de B, G au-dessus de C… selon la notation usuelle, on lit le dessin du cours).",
          steps: [
            { label: "Méthode", text: "Si les deux arêtes n’appartiennent à aucune même face et ne sont pas parallèles, elles sont non coplanaires." }
          ],
          result: "Toujours justifier avec un cube, pas avec l’intuition du plan."
        },
        check: { q: "Deux droites non parallèles se coupent-elles toujours ?", a: "Dans le plan, oui. Dans l’espace, non : elles peuvent être non coplanaires." },
        keep: ["Trois cas, pas deux.", "Non coplanaires = le cas nouveau."],
        trap: "Importer un théorème du plan (« elles se coupent ») sans précaution."
      }),
      u("02", "Une droite et un plan", {
        why: "Savoir si la droite perce le plan, le fuit, ou y est allongée.",
        idea: "Trois cas : la droite est incluse dans le plan (tous ses points y sont), elle perce le plan en un unique point, ou elle est parallèle au plan (aucun point commun).",
        method: ["Chercher des points de la droite dans le plan.", "Si deux points distincts y sont, toute la droite y est.", "Sinon, regarder la direction : parallèle à une droite du plan sans y être ⇒ parallèle au plan, ou bien sécante."],
        example: {
          title: "Une arête d’un cube et une face",
          given: "Arête d’une face : incluse. Arête « qui tombe » sur une face : un point. Arête opposée parallèle : aucun point.",
          steps: [
            { label: "Classer", text: "Les trois cas se voient sur le pavé." }
          ],
          result: "Le pavé suffit comme modèle mental."
        },
        check: { q: "Deux points du plan sur la droite : que conclure ?", a: "La droite est incluse dans le plan." },
        keep: ["Deux points ⇒ toute la droite.", "Parallèle au plan ⇔ aucun point commun."],
        trap: "Confondre arête (droite) et face (plan)."
      }),
      u("03", "Deux plans", {
        why: "L’intersection, si elle n’est pas vide, est une droite — pas un point.",
        idea: "Deux plans : confondus (les mêmes), sécants (une droite commune), ou parallèles (aucun point commun). Ils ne se coupent jamais en un seul point.",
        method: ["Chercher trois points non alignés communs (plans confondus) ou deux points (droite d’intersection).", "Sinon, comparer les « directions » via le cube (faces opposées : parallèles)."],
        example: {
          title: "Faces d’un cube",
          given: "Faces opposées //, faces adjacentes sécantes selon une arête.",
          steps: [
            { label: "Sécants", text: "Intersection = arête, donc une droite." }
          ],
          result: "Jamais un unique point."
        },
        check: { q: "Deux plans peuvent-ils se couper en un point ?", a: "Non. S’ils se coupent, c’est selon une droite." },
        keep: ["Intersection de deux plans sécants = une droite.", "Faces opposées du cube : modèle des plans parallèles."],
        trap: "Dire que deux plans se coupent en un point (confusion avec droite ∩ plan)."
      })
    ]
  },
  parallelisme: {
    title: "Parallélisme dans l’espace",
    intro: "Le parallélisme se transmet : on passe par une droite ou un plan intermédiaire, comme dans le pavé du cours.",
    map: ["Droites parallèles", "Droite parallèle à un plan", "Plans parallèles"],
    closing: "Identifier les directions, chercher un intermédiaire, conclure par un théorème nommé, sur un cube.",
    units: [
      u("01", "Même direction", {
        why: "Le parallélisme des droites, version espace.",
        idea: "Deux droites sont parallèles si elles ont la même direction. Par un point hors d’une droite, il passe une unique parallèle à cette droite. Des arêtes d’un cube « qui se correspondent » sont le modèle.",
        method: ["Repérer un vecteur directeur.", "Même direction ⇔ parallèles (ou confondues).", "Ne pas conclure au parallélisme si les droites sont seulement « qui ne se coupent pas » (non coplanaires)."],
        example: {
          title: "Arêtes opposées d’une même face",
          given: "Cube.",
          steps: [
            { label: "Direction", text: "Même direction, coplanaires, pas de point commun : parallèles." }
          ],
          result: "Modèle à réutiliser."
        },
        check: { q: "Deux droites sans point commun sont-elles parallèles ?", a: "Pas forcément : non coplanaires aussi. Il faut la même direction." },
        keep: ["Parallèles ⇔ même direction.", "Sans point commun ne suffit pas."],
        trap: "Oublier le cas non coplanaire."
      }),
      u("02", "Droite parallèle à un plan", {
        why: "Théorème utile pour les constructions.",
        idea: "Une droite est parallèle à un plan si elle ne le rencontre pas. Critère pratique : elle est parallèle à une droite du plan (et n’est pas dans le plan).",
        method: ["Trouver dans le plan une droite de même direction que d.", "Vérifier que d n’est pas incluse dans le plan.", "Conclure d // plan."],
        example: {
          title: "Arête supérieure // face du bas",
          given: "Pavé.",
          steps: [
            { label: "Droite du plan", text: "L’arête correspondante du bas a la même direction." },
            { label: "Inclusion", text: "L’arête du haut n’est pas dans la face du bas." }
          ],
          result: "Droite // plan."
        },
        check: { q: "Si d est parallèle à une droite du plan, d est-elle forcément // au plan ?", a: "Si d n’est pas dans le plan, oui. Si d est dans le plan, elle n’est pas « parallèle » au plan : elle y est incluse." },
        keep: ["Parallèle à une droite du plan + hors du plan ⇒ // au plan.", "Inclusion ≠ parallélisme."],
        trap: "Dire qu’une droite d’un plan est parallèle à ce plan."
      }),
      u("03", "Plans parallèles", {
        why: "Faces opposées, et un théorème de transmission.",
        idea: "Deux plans parallèles n’ont aucun point commun. Un troisième plan qui les coupe le fait selon deux droites parallèles. Si deux plans sont //, une droite de l’un parallèle à l’autre l’est au second.",
        method: ["Modèle : faces opposées du pavé.", "Pour prouver : exhiber deux droites sécantes de l’un, parallèles au second, ou utiliser un plan coupeur."],
        example: {
          title: "Plan coupeur",
          given: "Deux plans // coupés par un mur.",
          steps: [
            { label: "Intersections", text: "Deux droites, parallèles entre elles." }
          ],
          result: "C’est le dessin à avoir en tête."
        },
        check: { q: "Deux plans sans point commun ?", a: "Ils sont parallèles (dans l’espace usuel du programme)." },
        keep: ["Plans // ⇔ aucun point commun.", "Un plan sécant aux deux donne deux droites //."],
        trap: "Utiliser un théorème du plan (droites dans un triangle) sans le cube."
      })
    ]
  },
  orthogonalite: {
    title: "Orthogonalité dans l’espace",
    intro: "Orthogonal, ce n’est pas forcément « se couper à angle droit sous nos yeux ». Deux droites peuvent être orthogonales sans se rencontrer.",
    map: ["Droites orthogonales", "Droite perpendiculaire à un plan", "Produit scalaire"],
    closing: "Choisir des vecteurs directeurs, calculer un produit scalaire (repère orthonormé), interpréter : orthogonal ou perpendiculaire au plan.",
    units: [
      u("01", "Orthogonales sans se couper", {
        why: "Le mot « perpendiculaire » du collège ne suffit plus.",
        idea: "Deux droites sont orthogonales si leurs directions le sont (vecteurs directeurs de produit scalaire nul). Elles peuvent être non coplanaires : comme une arête verticale et une arête horizontale qui ne se touchent pas. Si de plus elles se coupent, on dit souvent perpendiculaires.",
        method: ["Prendre u⃗ et v⃗ directeurs.", "u⃗ · v⃗ = 0 ⇔ directions orthogonales.", "Dire si les droites se coupent ou non."],
        example: {
          title: "Cube : une verticale et une horizontale disjointes",
          given: "Directions i⃗ et k⃗.",
          steps: [
            { label: "Produit", text: "i⃗ · k⃗ = 0." },
            { label: "Intersection", text: "Vide, mais orthogonales quand même." }
          ],
          result: "Orthogonalité = affaire de directions."
        },
        check: { q: "Doivent-elles se couper pour être orthogonales ?", a: "Non. C’est la nouveauté de l’espace." },
        keep: ["Orthogonalité = directions.", "Se couper est un plus, pas une obligation."],
        trap: "Exiger un point commun pour parler d’angle droit."
      }),
      u("02", "Droite perpendiculaire à un plan", {
        why: "Le critère des deux droites sécantes du plan.",
        idea: "Une droite est perpendiculaire à un plan si elle est orthogonale à deux droites sécantes de ce plan. Alors elle est orthogonale à toutes les droites du plan. Image : le pied d’un mât sur le sol.",
        method: ["Choisir deux droites sécantes du plan.", "Vérifier que d est orthogonale à chacune.", "Conclure d ⊥ plan, puis d orthogonale à toute droite du plan."],
        example: {
          title: "Arête verticale d’un cube et la face du bas",
          given: "Deux arêtes du sol, sécantes, toutes deux horizontales.",
          steps: [
            { label: "Tests", text: "Verticale ⊥ chacune des deux horizontales." },
            { label: "Conclusion", text: "L’arête est perpendiculaire à la face." }
          ],
          result: "Modèle du mât."
        },
        check: { q: "Orthogonal à une seule droite du plan : suffisant ?", a: "Non. Il en faut deux, sécantes, pour coller le plan." },
        keep: ["Deux droites sécantes du plan.", "Alors : orthogonale à toutes les droites du plan."],
        trap: "Tester une seule droite du plan."
      }),
      u("03", "Produit scalaire en 3D", {
        why: "Le calcul qui tranche.",
        idea: "En base orthonormée, u⃗ · v⃗ = xx' + yy' + zz'. Nul ⇔ orthogonaux. Dans le plan, on retrouve xx' + yy' (la troisième coordonnée vaut 0). Les plans perpendiculaires : une droite de l’un est perpendiculaire à l’autre.",
        method: ["Écrire les composantes dans un repère orthonormé.", "Sommer les produits.", "Interpréter 0 ou non."],
        example: {
          title: "u⃗ (1 ; 0 ; 0), v⃗ (0 ; 1 ; 1)",
          given: "Test.",
          steps: [
            { label: "Produit", text: "1×0 + 0×1 + 0×1 = 0." },
            { label: "Conclusion", text: "Orthogonaux." }
          ],
          result: "u⃗ ⊥ v⃗."
        },
        check: { q: "La formule xx'+yy'+zz' sans repère orthonormé ?", a: "Interdite. Comme dans le plan." },
        keep: ["Trois termes si on est dans l’espace.", "0 ⇔ orthogonal."],
        trap: "Oublier la troisième composante, ou un repère quelconque."
      })
    ]
  },
  stats: {
    title: "Statistiques",
    intro: "On résume une liste de nombres par quelques indicateurs, et on la dessine. La moyenne est un barycentre des valeurs.",
    map: ["Effectifs et fréquences", "Moyenne", "Étendue et graphique"],
    closing: "Faire le tableau, calculer n et Σ, puis x̄ = Σ/n, étendue = max − min. Contrôler x̄ ∈ [min ; max].",
    units: [
      u("01", "Compter : n, nᵢ, fᵢ", {
        why: "Sans tableau clair, la moyenne est fausse.",
        idea: "n est l’effectif total (combien de données). nᵢ est le nombre de fois qu’une valeur (ou une classe) apparaît. La fréquence fᵢ = nᵢ / n est une proportion, entre 0 et 1 (ou en %). La somme des nᵢ vaut n, la somme des fᵢ vaut 1.",
        method: ["Lister les valeurs ou les classes.", "Compter nᵢ, vérifier Σ nᵢ = n.", "fᵢ = nᵢ/n."],
        example: {
          title: "Notes 8, 10, 10, 12",
          given: "n = 4.",
          steps: [
            { label: "Effectifs", text: "8 : une fois, 10 : deux fois, 12 : une fois." },
            { label: "Fréquence de 10", text: "2/4 = 0,5." }
          ],
          result: "n = 4, f(10) = 50 %."
        },
        check: { q: "Peut-on avoir Σ fᵢ = 1,2 ?", a: "Non, sauf erreur d’arrondi. La somme des fréquences vaut 1." },
        keep: ["n = total.", "fᵢ = nᵢ/n."],
        trap: "Diviser par le nombre de valeurs distinctes au lieu de n."
      }),
      u("02", "La moyenne, un barycentre", {
        why: "Ne pas oublier les effectifs.",
        idea: "x̄ = (somme de toutes les données)/n. Si les valeurs sont groupées : x̄ = (Σ nᵢ xᵢ)/n. C’est exactement le barycentre des points xᵢ affectés des masses nᵢ. Donc x̄ est toujours entre min et max.",
        method: ["Série brute : tout additionner, diviser par n.", "Série groupée : ne pas oublier de multiplier par nᵢ.", "Contrôler min ≤ x̄ ≤ max."],
        example: {
          title: "Deux 10 et un 4",
          given: "n = 3.",
          steps: [
            { label: "Sans effectifs (faux)", text: "(10+4)/2 = 7 : on a oublié qu’il y a deux 10." },
            { label: "Avec effectifs", text: "(10+10+4)/3 = 8." }
          ],
          result: "x̄ = 8."
        },
        check: { q: "La moyenne est-elle forcément une valeur de la série ?", a: "Non. (10+12)/2 = 11, 11 peut être absent de la liste." },
        keep: ["Pondérer par les effectifs.", "x̄ ∈ [min ; max]."],
        trap: "Moyenne des classes sans les nᵢ, ou confondre moyenne et médiane."
      }),
      u("03", "Étendue et graphique", {
        why: "Un indicateur simple de dispersion, et un dessin lisible.",
        idea: "Étendue = max − min : ça dit l’amplitude, pas comment les valeurs s’accumulent. Diagramme en bâtons : valeurs isolées. Histogramme : classes (aires proportionnelles aux effectifs). On peut placer min, x̄, max sur une droite pour « voir » la série.",
        method: ["Repérer min et max.", "Étendue = max − min.", "Choisir bâtons (discret) ou histogramme (classes).", "Placer x̄ : il doit tomber dans l’intervalle."],
        example: {
          title: "Série de 8 à 20, moyenne 12",
          given: "Contrôle visuel.",
          steps: [
            { label: "Étendue", text: "20 − 8 = 12." },
            { label: "Position", text: "12 est bien entre 8 et 20, plus proche du min : la série est plutôt tassée à gauche." }
          ],
          result: "Étendue 12, moyenne 12."
        },
        check: { q: "Deux séries de même étendue ont-elles la même moyenne ?", a: "Non. L’étendue ignore où se concentrent les valeurs." },
        keep: ["Étendue = max − min.", "x̄ plus proche d’un bord = série décalée."],
        trap: "Prendre max + min, ou diviser l’étendue par n."
      })
    ]
  }
};
