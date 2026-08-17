const u = (n, title, spec) => ({ n, title, ...spec });

export const lessonsT1 = {
  reels: {
    title: "Calcul dans IR",
    intro: "Ce cours reprend le chapitre depuis zéro. On n’enchaîne pas les formules : on explique d’abord l’idée, puis la recette, puis un exemple chiffré. Lis les unités dans l’ordre.",
    map: ["Les nombres que l’on utilise", "Pourcentages et TVA", "Identités remarquables", "Racines carrées", "Valeur absolue", "Encadrer une expression", "Écriture scientifique"],
    closing: "Avant tout calcul : écrire la relation en lettres, convertir les unités, substituer, contrôler l’ordre de grandeur. On n’arrondit qu’à la fin.",
    units: [
      u("01", "Les ensembles de nombres", {
        why: "Pour savoir si un résultat « a le droit d’exister » : une racine, une fraction, un entier…",
        idea: "Imagine des poupées russes. Chaque ensemble est dans le suivant. ℕ (0, 1, 2, …) est dans ℤ (on ajoute les négatifs). ℤ est dans 𝔻 (décimaux). 𝔻 est dans ℚ (fractions). ℚ est dans ℝ (tous les réels, y compris √2 et π, qui ne sont pas des fractions).",
        words: [
          ["ℕ", "Entiers naturels : 0, 1, 2, 3, …"],
          ["ℤ", "Entiers relatifs : …, −2, −1, 0, 1, 2, …"],
          ["ℚ", "Rationnels : fractions p/q avec q ≠ 0"],
          ["ℝ", "Réels : tout ce que l’on place sur la droite graduée"]
        ],
        method: ["Situer le nombre sur la droite.", "Se demander s’il s’écrit comme fraction ou comme décimal périodique.", "Conclure l’appartenance (et les inclusions)."],
        example: {
          title: "√2, −7 et 0,25",
          given: "On classe −7, 0,25 et √2.",
          steps: [
            { label: "−7", text: "C’est un entier négatif : il est dans ℤ, donc aussi dans ℚ et ℝ, mais pas dans ℕ." },
            { label: "0,25", text: "0,25 = 1/4 : décimal et rationnel. Il est dans 𝔻, ℚ et ℝ." },
            { label: "√2", text: "On ne peut pas l’écrire p/q. Irrationnel : seulement dans ℝ." }
          ],
          result: "ℕ ⊂ ℤ ⊂ 𝔻 ⊂ ℚ ⊂ ℝ. √2 ∈ ℝ \\ ℚ."
        },
        check: { q: "π est-il rationnel ?", a: "Non. π est irrationnel : il est dans ℝ, pas dans ℚ." },
        keep: ["Un irrationnel n’est ni fraction ni décimal périodique.", "Si un nombre est dans ℤ, il est automatiquement dans ℝ."],
        trap: "Croire que « décimal » veut dire « fini ». 1/3 = 0,333… est décimal illimité périodique, donc rationnel."
      }),
      u("02", "Pourcentages et TVA : on multiplie", {
        why: "Prix, réductions, TVA : c’est le calcul le plus fréquent, et le plus piégé.",
        idea: "Un pourcentage n’est pas un nombre de dinars. « + t % » signifie : garder le tout (100 %) et ajouter t %. Le coefficient est 1 + t/100. « − t % » : coefficient 1 − t/100. Deux variations se composent en multipliant les coefficients, jamais en additionnant les taux.",
        words: [
          ["HT", "Prix hors taxes"],
          ["TTC", "Prix toutes taxes comprises"],
          ["Coefficient", "Le nombre par lequel on multiplie le prix"]
        ],
        method: ["Écrire le coefficient : hausse 1 + t/100, baisse 1 − t/100.", "TTC = HT × (1 + t/100). Inversement HT = TTC / (1 + t/100).", "Pour deux variations : multiplier les deux coefficients, puis lire le pourcentage global."],
        example: {
          title: "TVA 17 % puis deux hausses",
          given: "Un article à 58 D HT, TVA 17 %. Puis, ailleurs : +10 % puis +20 %.",
          steps: [
            { label: "TVA", text: "TTC = 58 × 1,17 = 67,86 D. On ne fait pas 58 + 17." },
            { label: "Deux hausses", text: "×1,10 puis ×1,20, donc ×1,32. Ce n’est pas +30 % : c’est +32 %." },
            { label: "Aller-retour", text: "+10 % puis −10 % : ×1,10 × 0,90 = ×0,99. On a perdu 1 %, on n’est pas revenu au prix de départ." }
          ],
          result: "Toujours multiplier. TTC = HT × 1,17 ; +10 % puis +20 % = +32 %."
        },
        check: { q: "Un prix TTC de 35,1 D à 17 %. Quel est le HT ?", a: "HT = 35,1 / 1,17 = 30 D. On divise, on ne retranche pas 17 %." },
        keep: ["t % n’est pas t dinars.", "Deux taux s’enchaînent par produit des coefficients."],
        trap: "Ajouter 17 D au lieu de multiplier par 1,17. Ou croire que +10 % puis −10 % s’annulent."
      }),
      u("03", "Identités remarquables", {
        why: "Développer ou factoriser sans tout distribuer à la main, et simplifier des écritures.",
        idea: "Ce sont trois égalités à connaître dans les deux sens. Développer, c’est aller vers la droite. Factoriser, c’est les lire à l’envers. Le double produit 2ab est le terme que l’on oublie le plus souvent.",
        method: [
          "(a+b)² = a² + 2ab + b²",
          "(a−b)² = a² − 2ab + b²",
          "(a+b)(a−b) = a² − b²",
          "Cubes : (a±b)³ = a³ ± 3a²b + 3ab² ± b³"
        ],
        example: {
          title: "Développer (2x + 3)²",
          given: "a = 2x, b = 3.",
          steps: [
            { label: "Carrés", text: "(2x)² = 4x² et 3² = 9." },
            { label: "Double produit", text: "2 × 2x × 3 = 12x." },
            { label: "Assemblage", text: "4x² + 12x + 9." }
          ],
          result: "(2x + 3)² = 4x² + 12x + 9. Contrôle : pour x = 1, (5)² = 25 et 4+12+9 = 25."
        },
        check: { q: "Factoriser x² − 16.", a: "x² − 4² = (x − 4)(x + 4)." },
        keep: ["Le 2ab n’est pas optionnel.", "a² − b² se factorise toujours, a² + b² non (dans ℝ)."],
        trap: "(a+b)² n’est pas a² + b². Il manque 2ab."
      }),
      u("04", "Racines carrées", {
        why: "Simplifier, rationaliser un dénominateur, calculer une aire (Héron).",
        idea: "√a est le réel positif dont le carré vaut a (a ≥ 0). On peut « sortir » un facteur d’une racine seulement s’il est un carré parfait. √(a+b) n’est pas √a + √b : la racine n’est pas une opération linéaire.",
        method: ["√(ab) = √a √b si a ≥ 0 et b ≥ 0.", "√(a²) = |a| (valeur absolue : le résultat est positif).", "Rationaliser 1/(√a − √b) en multipliant haut et bas par le conjugué √a + √b.", "Héron : p = (a+b+c)/2, A = √[p(p−a)(p−b)(p−c)]."],
        example: {
          title: "Triangle 18, 24, 30",
          given: "Côtés 18, 24, 30 (c’est 3-4-5 × 6, donc rectangle).",
          steps: [
            { label: "p", text: "p = (18+24+30)/2 = 36." },
            { label: "Héron", text: "A = √[36(36−18)(36−24)(36−30)] = √[36×18×12×6] = √46656 = 216." },
            { label: "Contrôle", text: "Triangle rectangle : A = 18×24/2 = 216. Les deux méthodes collent." }
          ],
          result: "A = 216. Si l’inégalité triangulaire échoue, A n’est pas réelle."
        },
        check: { q: "√(9+16) vaut-il 3+4 = 7 ?", a: "Non. √25 = 5. Jamais √(a+b) = √a + √b." },
        keep: ["On ne sort d’une racine que des carrés parfaits.", "Héron exige l’inégalité triangulaire."],
        trap: "Écrire √(a+b) = √a + √b, ou oublier que √(a²) = |a|."
      }),
      u("05", "Valeur absolue : une distance", {
        why: "Les équations |x + a| = b apparaissent partout (distance à un point, encadrements).",
        idea: "|x| est la distance de x à 0 sur la droite. Donc |x| est toujours ≥ 0. |x − ω| = r signifie : « les points à distance r de ω », donc deux solutions ω − r et ω + r, si r ≥ 0.",
        method: ["Si b < 0, |…| = b n’a pas de solution (une distance n’est pas négative).", "Sinon |X| = b ⇔ X = b ou X = −b.", "Pour |x + a| = b : x = −a + b ou x = −a − b.", "|A| < r ⇔ −r < A < r. |A| ≥ r ⇔ A ≤ −r ou A ≥ r."],
        example: {
          title: "|x + 3| = 5",
          given: "a = 3, b = 5 ≥ 0.",
          steps: [
            { label: "Deux cas", text: "x + 3 = 5 ou x + 3 = −5." },
            { label: "Isoler", text: "x = 2 ou x = −8." },
            { label: "Contrôle", text: "|2+3| = 5 et |−8+3| = |−5| = 5. Les deux conviennent." }
          ],
          result: "x = −8 ou x = 2. Géométriquement : points à distance 5 de −3."
        },
        check: { q: "|x − 1| = −2 a-t-il des solutions ?", a: "Non : une valeur absolue ne peut pas égaler un négatif." },
        keep: ["Toujours le cas « plus » et le cas « moins ».", "Dessiner la droite : ça évite d’oublier une solution."],
        trap: "Oublier le cas moins. C’est l’erreur n°1 du chapitre."
      }),
      u("06", "Encadrer une expression affine", {
        why: "On connaît un intervalle pour a, on veut un intervalle pour −3a + 5, par exemple.",
        idea: "Une fonction affine x ↦ mx + p est une droite. Sur un segment, le min et le max sont aux extrémités. Si la pente m est positive, l’ordre se conserve. Si m est négative, l’ordre s’inverse : le plus grand x donne le plus petit f(x).",
        method: ["Repérer le coefficient de la variable (la pente).", "Calculer f à chaque borne de l’intervalle.", "Ranger : min à gauche, max à droite.", "Si m < 0, s’attendre à ce que le max soit à la borne gauche."],
        example: {
          title: "a ∈ [−2 ; 3], f(a) = −3a + 5",
          given: "Pente −3 < 0 : l’ordre s’inverse.",
          steps: [
            { label: "Borne −2", text: "f(−2) = −3(−2) + 5 = 11." },
            { label: "Borne 3", text: "f(3) = −9 + 5 = −4." },
            { label: "Ranger", text: "f(a) ∈ [−4 ; 11]. Le maximum 11 est en a = −2, pas en 3." }
          ],
          result: "−4 ≤ −3a + 5 ≤ 11."
        },
        check: { q: "Si 0 < a < 1, compare a, a² et √a.", a: "a² < a < √a. (Exemple : 0,25 < 0,5 < √0,5 ≈ 0,71.)" },
        keep: ["Pente négative ⇔ on inverse l’ordre.", "Toujours évaluer aux deux bords, puis ranger."],
        trap: "Prendre f(3) comme maximum alors que la pente est négative."
      }),
      u("07", "Écriture scientifique et ordre de grandeur", {
        why: "Contrôler un résultat avant (et après) la calculatrice, et traiter des distances énormes.",
        idea: "On écrit N = a × 10ⁿ avec 1 ≤ |a| < 10. On déplace la virgule jusqu’à n’avoir qu’un chiffre non nul avant la virgule. L’ordre de grandeur arrondit a à l’unité, en gardant la même puissance de 10. Un calcul de temps : t = d / v, après unités cohérentes.",
        method: ["Déplacer la virgule : vers la gauche, n augmente ; vers la droite, n diminue.", "Arrondir a à l’unité pour l’ordre de grandeur.", "Pour un temps de parcours : convertir (millions de km → km), puis t = d/v, puis s → min si besoin."],
        example: {
          title: "Terre–Soleil",
          given: "150 millions de km, lumière à 300 000 km/s.",
          steps: [
            { label: "Distance", text: "150 × 10⁶ km = 1,5 × 10⁸ km." },
            { label: "Temps", text: "t = 1,5×10⁸ / 3×10⁵ = 500 s." },
            { label: "Minutes", text: "500 / 60 ≈ 8,3 min, un peu plus de 8 min." }
          ],
          result: "Environ 8 min. L’année-lumière est une distance, pas un temps."
        },
        check: { q: "0,0007845 en écriture scientifique ?", a: "7,845 × 10⁻⁴. Ordre de grandeur : 8 × 10⁻⁴ (pas 7 × 10⁻⁴)." },
        keep: ["1 ≤ |a| < 10, toujours.", "Ordre de grandeur : on arrondit a, pas l’exposant n’importe comment."],
        trap: "Oublier de convertir les millions de km, ou croire qu’une année-lumière est une durée."
      })
    ]
  },
  degres: {
    title: "Premier et second degré",
    intro: "Résoudre, c’est lister tous les réels qui rendent une égalité vraie. On commence par isoler x, puis on apprend à lire un trinôme grâce au discriminant.",
    map: ["Isoler x (premier degré)", "Produit nul et quotients", "Le discriminant", "Somme et produit", "Signe du trinôme"],
    closing: "Traduire l’énoncé par une équation, mettre sous la forme ax² + bx + c = 0, calculer Δ, discuter les racines (positives ? dans un intervalle ?), contrôler par somme et produit.",
    units: [
      u("01", "Premier degré : isoler x", {
        why: "C’est la manœuvre de base. Tout le reste s’y ramène.",
        idea: "Une balance. Ce que tu fais à gauche, tu le fais à droite. Pour ax + b = 0 (a ≠ 0), on passe b de l’autre côté, puis on divise par a. Unique solution : x = −b/a. Si on divise par un négatif dans une inéquation, on inverse le sens.",
        method: ["Regrouper les x d’un côté, les nombres de l’autre.", "Diviser par le coefficient de x.", "Si inéquation et coefficient < 0 : inverser < et >.", "Représenter la solution sur la droite."],
        example: {
          title: "3x − 7 = 8",
          given: "Isoler x.",
          steps: [
            { label: "Transposer", text: "3x = 15." },
            { label: "Diviser", text: "x = 5." },
            { label: "Contrôle", text: "3×5 − 7 = 8. Oui." }
          ],
          result: "x = 5, unique."
        },
        check: { q: "−2x + 4 > 0. Sens de l’inégalité ?", a: "−2x > −4, on divise par −2 : x < 2. Le sens s’inverse." },
        keep: ["a ≠ 0, sinon ce n’est plus du premier degré.", "Inéquation : attention au signe du coefficient."],
        trap: "Oublier d’inverser le sens en divisant par un négatif."
      }),
      u("02", "Produit nul", {
        why: "Dès qu’un produit vaut 0, on casse le problème en équations plus simples.",
        idea: "Un produit de réels est nul si et seulement si l’un des facteurs est nul. C’est le seul cas. Donc AB = 0 ⇔ A = 0 ou B = 0. Pour un quotient, A/B = 0 ⇔ A = 0 et B ≠ 0 : on n’a pas le droit d’annuler le dénominateur.",
        method: ["Factoriser (identités, mise en facteur).", "Écrire « A = 0 ou B = 0 ».", "Résoudre chaque facteur.", "Exclure les valeurs qui annulent un dénominateur."],
        example: {
          title: "(x − 2)(x + 5) = 0",
          given: "Produit déjà factorisé.",
          steps: [
            { label: "Casser", text: "x − 2 = 0 ou x + 5 = 0." },
            { label: "Solutions", text: "x = 2 ou x = −5." }
          ],
          result: "S = {−5 ; 2}."
        },
        check: { q: "(x−1)/(x−1) = 0 a-t-il une solution ?", a: "Non : le numérateur s’annule en 1, mais 1 est interdit au dénominateur. La fraction n’est pas définie." },
        keep: ["Factoriser avant de conclure.", "Quotient : toujours D_f d’abord."],
        trap: "Simplifier (x−1)/(x−1) en 1 sans dire que x ≠ 1. On crée un « trou »."
      }),
      u("03", "Le discriminant Δ", {
        why: "Il décide combien de racines a ax² + bx + c = 0, et lesquelles.",
        idea: "Une parabole peut couper l’axe des x deux fois, une fois (elle le touche) ou zéro fois. Δ = b² − 4ac est le « détecteur ». Δ > 0 : deux racines. Δ = 0 : une racine double (le sommet est sur l’axe). Δ < 0 : aucune racine réelle, la parabole est entièrement au-dessus ou en dessous de l’axe, selon le signe de a.",
        method: ["Vérifier a ≠ 0.", "Calculer Δ = b² − 4ac.", "Δ > 0 : x = (−b ± √Δ) / (2a). Ranger x₁ < x₂.", "Δ = 0 : x₀ = −b/(2a).", "Δ < 0 : S = ∅ dans ℝ.", "Si b est pair, on peut utiliser Δ' = (b/2)² − ac."],
        example: {
          title: "4x² + 3x − 1 = 0",
          given: "a = 4, b = 3, c = −1 (activité type du manuel).",
          steps: [
            { label: "Δ", text: "Δ = 9 − 4×4×(−1) = 9 + 16 = 25." },
            { label: "Racines", text: "x = (−3 ± 5) / 8. Donc x₁ = −8/8 = −1, x₂ = 2/8 = 1/4." },
            { label: "Contrôle", text: "Somme = −3/4 = −b/a. Produit = −1/4 = c/a." }
          ],
          result: "x = −1 ou x = 1/4."
        },
        check: { q: "Dans la formule, met-on −b ± Δ ou −b ± √Δ ?", a: "−b ± √Δ, puis on divise par 2a. Jamais Δ tout seul." },
        keep: ["Le 2a est au dénominateur de toute la formule.", "Pas de racine réelle ⇏ pas de courbe : la parabole existe toujours."],
        trap: "Écrire (−b ± Δ)/2a, ou diviser seulement −b par 2a et oublier √Δ."
      }),
      u("04", "Somme et produit des racines", {
        why: "Contrôler un calcul, et parfois trouver les racines sans √Δ.",
        idea: "Si x₁ et x₂ existent, x₁ + x₂ = −b/a et x₁ x₂ = c/a. Ces deux nombres se calculent avant même les racines. Bonus du cours : si a + b + c = 0, alors 1 est racine (l’autre est c/a). Si a − b + c = 0, −1 est racine.",
        method: ["Calculer −b/a et c/a.", "Après avoir trouvé x₁, x₂, vérifier somme et produit.", "Regarder a+b+c et a−b+c pour une racine évidente."],
        example: {
          title: "Racine évidente",
          given: "2x² − 3x + 1 = 0. a+b+c = 2−3+1 = 0.",
          steps: [
            { label: "Racine 1", text: "x = 1 est racine." },
            { label: "L’autre", text: "Produit c/a = 1/2, donc l’autre racine est 1/2." }
          ],
          result: "x = 1/2 ou x = 1, sans discriminant."
        },
        check: { q: "Pour 4x² + 3x − 1, que valent somme et produit ?", a: "Somme −3/4, produit −1/4." },
        keep: ["Somme = −b/a (le moins est dans la formule).", "Produit = c/a (sans moins)."],
        trap: "Écrire somme = b/a. Le signe moins disparaît trop souvent."
      }),
      u("05", "Signe du trinôme", {
        why: "Les inéquations du second degré se lisent sur un tableau, pas « au feeling ».",
        idea: "Une fois factorisé, f(x) = a(x − x₁)(x − x₂). f est du signe de a à l’extérieur des racines, du signe opposé entre les racines. Image : la parabole tourne ses « bras » vers le haut si a > 0 : positive dehors, négative entre les racines.",
        method: ["Trouver les racines (ou conclure Δ < 0 : f du signe de a partout).", "Dresser le tableau de signes.", "Lire l’inéquation : f(x) > 0, ≥ 0, etc., en soignant les égalités."],
        example: {
          title: "x² − 5x + 6 > 0",
          given: "Racines 2 et 3, a = 1 > 0.",
          steps: [
            { label: "Factoriser", text: "(x−2)(x−3)." },
            { label: "Signe", text: "Positif à l’extérieur : x < 2 ou x > 3. Négatif entre 2 et 3." },
            { label: "Inéquation stricte", text: "On n’inclut pas 2 et 3." }
          ],
          result: "S = ]−∞ ; 2[ ∪ ]3 ; +∞[."
        },
        check: { q: "Si Δ < 0 et a > 0, où f est-elle positive ?", a: "Partout. La parabole ne coupe pas l’axe et est au-dessus." },
        keep: ["Signe de a dehors, signe opposé entre les racines.", "Inéquation large : on ajoute les racines."],
        trap: "Lire « positif entre les racines » alors que a > 0. C’est l’inverse."
      })
    ]
  },
  polynomes: {
    title: "Polynômes",
    intro: "Un polynôme, c’est un « mot » fait de puissances de x. Le degré dit jusqu’où ça monte, et limite le nombre de racines.",
    map: ["Vocabulaire et degré", "Évaluer P(x)", "Racines et factorisation", "Sommes d’entiers"],
    closing: "Évaluer en un point simple, chercher une racine évidente parmi les diviseurs du terme constant, factoriser par identification, étudier le quotient.",
    units: [
      u("01", "Qu’est-ce qu’un polynôme ?", {
        why: "Pour parler le même langage que le manuel : degré, coefficient dominant, terme constant.",
        idea: "P(x) = aₙ xⁿ + … + a₁ x + a₀, avec aₙ ≠ 0. n est le degré : le plus grand exposant. aₙ est le coefficient dominant (celui qui « mène » quand |x| est grand). a₀ est la valeur P(0). Deux polynômes sont égaux seulement s’ils ont les mêmes coefficients.",
        method: ["Ranger les puissances décroissantes.", "Lire le degré et aₙ.", "P(0) = terme constant, P(1) = somme des coefficients."],
        example: {
          title: "P(x) = 4x³ − x + 2",
          given: "Il n’y a pas de x² : le coefficient est 0, ça ne baisse pas le degré.",
          steps: [
            { label: "Degré", text: "deg P = 3, aₙ = 4." },
            { label: "P(0)", text: "2." },
            { label: "P(1)", text: "4 − 1 + 2 = 5." }
          ],
          result: "Cubique, coefficient dominant 4."
        },
        check: { q: "deg(x² + 3) + deg(x) vaut-il deg de la somme ?", a: "deg(x²+3)=2, deg(x)=1, somme des degrés 3, mais (x²+3)+x est encore de degré 2. On n’ajoute pas les degrés pour une somme." },
        keep: ["deg(fg) = deg f + deg g.", "deg(f+g) ≤ max des degrés (égalité si les degrés diffèrent)."],
        trap: "Oublier un terme manquant (coefficient 0) ou confondre P(1) avec aₙ."
      }),
      u("02", "Trouver une racine entière", {
        why: "Factoriser un cubique à la main, comme dans le manuel.",
        idea: "α est racine ⇔ P(α) = 0 ⇔ (x − α) divise P. Une racine entière divise forcément le terme constant a₀. On teste ±1, ±2, ±4… parmi les diviseurs de a₀, jusqu’à tomber sur P(r) = 0. Ensuite on trouve le quotient par identification des coefficients.",
        method: ["Lister les diviseurs de a₀.", "Calculer P(r) jusqu’à obtenir 0.", "Écrire P(x) = (x − r)(x² + qx + p) (si cubique).", "Identifier : développer et égaler les coefficients.", "Étudier le trinôme restant (Δ)."],
        example: {
          title: "x³ + 6x² + 12x − 56",
          given: "Diviseurs de 56 : ±1, ±2, ±4, ±7, ±8…",
          steps: [
            { label: "Test", text: "P(2) = 8 + 24 + 24 − 56 = 0. Donc 2 est racine." },
            { label: "Quotient", text: "Identification : x² + 8x + 28." },
            { label: "Δ", text: "64 − 112 < 0 : pas d’autre racine réelle." }
          ],
          result: "Une seule racine réelle : x = 2."
        },
        check: { q: "Pourquoi tester −2 aussi ?", a: "Les diviseurs de a₀ peuvent être négatifs. Une racine peut être −1, −2, −4…" },
        keep: ["Racine entière ⇒ elle divise a₀.", "Degré n ⇒ au plus n racines."],
        trap: "Ne tester que les diviseurs positifs."
      }),
      u("03", "Sommes 1 + 2 + … + n", {
        why: "Formules du cours, à ne pas confondre entre elles.",
        idea: "S₁ = n(n+1)/2 (somme des entiers). S₂ = n(n+1)(2n+1)/6 (somme des carrés). Ce n’est pas (S₁)². On peut les retrouver en sommant une différence P(k) − P(k−1), comme dans le polycopié.",
        method: ["Identifier si on somme des entiers ou des carrés.", "Appliquer la formule, parenthèses comprises.", "Contrôler sur n = 10 : S₁ = 55, S₂ = 385."],
        example: {
          title: "n = 10",
          given: "Vérification rapide.",
          steps: [
            { label: "S₁", text: "10×11/2 = 55." },
            { label: "S₂", text: "10×11×21/6 = 385." },
            { label: "Contre-exemple", text: "55² = 3025 ≠ 385. Donc (S₁)² n’est pas S₂." }
          ],
          result: "S₁ = 55, S₂ = 385."
        },
        check: { q: "1² + 2² + 3² vaut-il (1+2+3)² ?", a: "Non. 14 ≠ 36." },
        keep: ["S₁ = n(n+1)/2.", "S₂ = n(n+1)(2n+1)/6."],
        trap: "Élever la somme au carré au lieu de sommer les carrés."
      })
    ]
  },
  arithmetique: {
    title: "Arithmétique",
    intro: "Ici, on travaille avec des entiers. La division a un quotient et un reste, et les critères évitent de tout poser à la main.",
    map: ["Division euclidienne", "Critères de divisibilité", "PGCD d’Euclide"],
    closing: "Toujours contrôler : a = bq + r avec 0 ≤ r < b. Le PGCD de trois nombres se fait en deux étapes.",
    units: [
      u("01", "Division euclidienne", {
        why: "C’est la définition de « tomber juste » : le reste est-il 0 ?",
        idea: "Partager a objets en paquets de b. q paquets complets, r objets restants, et r < b (sinon on pourrait encore faire un paquet). Unicité : un seul couple (q, r) convient.",
        method: ["Poser a = bq + r.", "Exiger 0 ≤ r < b.", "r = 0 ⇔ b divise a.", "Si r = b, augmenter q de 1 et remettre r à 0."],
        example: {
          title: "17 divisé par 5",
          given: "a = 17, b = 5.",
          steps: [
            { label: "Quotient", text: "3 paquets de 5 font 15." },
            { label: "Reste", text: "17 − 15 = 2, et 2 < 5." }
          ],
          result: "17 = 5×3 + 2."
        },
        check: { q: "Peut-on écrire 17 = 5×2 + 7 ?", a: "L’égalité est vraie mais 7 ≥ 5 : ce n’est pas la division euclidienne. On doit avoir r < 5." },
        keep: ["Le reste est strictement plus petit que le diviseur.", "Contrôle obligatoire : reconstituer a."],
        trap: "Confondre reste et quotient, ou accepter un reste ≥ b."
      }),
      u("02", "Critères de divisibilité", {
        why: "Décider si 8, 9 ou 11 divise un grand nombre sans le diviser.",
        idea: "Chaque critère lit une partie du nombre. 2 et 5 : le dernier chiffre. 4 et 25 : les deux derniers. 8 : les trois derniers. 3 et 9 : la somme des chiffres (parce que 10 ≡ 1 modulo 9). 11 : différence des sommes des rangs alternés, depuis la droite.",
        method: ["Choisir le module (2, 3, 4, 5, 8, 9, 11, 25).", "Appliquer le bon extrait (chiffres de droite, ou somme).", "Conclure le reste, pas seulement « oui/non » si on le demande."],
        example: {
          title: "1963 modulo 9",
          given: "Somme des chiffres.",
          steps: [
            { label: "Somme", text: "1+9+6+3 = 19." },
            { label: "Encore", text: "1+9 = 10, puis 1+0 = 1." },
            { label: "Reste", text: "1963 ≡ 1 (mod 9). Pas divisible par 9." }
          ],
          result: "Reste 1. La somme donne le reste, pas le quotient."
        },
        check: { q: "Le critère de 8 se lit-il sur deux chiffres ?", a: "Non : trois derniers chiffres, car 1000 = 8×125." },
        keep: ["3 et 9 : somme des chiffres.", "11 : alternance depuis la droite."],
        trap: "Appliquer le critère de 8 aux deux derniers chiffres (c’est celui de 4)."
      }),
      u("03", "PGCD par Euclide", {
        why: "Plus grand cube pour paver une caisse, simplifier, etc.",
        idea: "PGCD(a, b) = PGCD(b, reste de a par b), jusqu’au reste 0. Le dernier reste non nul est le PGCD. Pour trois nombres : PGCD(PGCD(a,b), c). Pour paver L×ℓ×h : arête a = PGCD des trois, nombre de cubes = (L/a)(ℓ/a)(h/a).",
        method: ["Euclide : remplacer le plus grand par le reste.", "S’arrêter au reste 0.", "Pour 3 nombres, deux tours.", "Interpréter dans le problème (pavé, simplification)."],
        example: {
          title: "Pavé 120 × 200 × 180",
          given: "Cubes d’arête maximale.",
          steps: [
            { label: "PGCD", text: "PGCD(120, 200) = 40, puis PGCD(40, 180) = 20." },
            { label: "Nombre", text: "6 × 10 × 9 = 540 cubes d’arête 20." }
          ],
          result: "Arête 20, 540 cubes."
        },
        check: { q: "PGCD(0, 12) ?", a: "12. Euclide s’arrête tout de suite : le reste de 0 par 12 est 0." },
        keep: ["Euclide jusqu’au reste 0.", "Trois nombres = deux PGCD successifs."],
        trap: "S’arrêter au premier reste, ou prendre le min(L,ℓ,h) comme arête sans PGCD."
      })
    ]
  },
  vecteurs: {
    title: "Calcul vectoriel",
    intro: "Un vecteur, ce n’est pas un point : c’est un déplacement (direction, sens, longueur). Les tests de parallélisme et d’angle droit ne sont pas les mêmes.",
    map: ["Opérations et composantes", "Colinéarité (déterminant)", "Orthogonalité (produit scalaire)", "Parallélogramme"],
    closing: "Écrire les composantes, choisir le bon test (det pour //, produit scalaire pour ⊥), conclure par une phrase géométrique.",
    units: [
      u("01", "Vecteur et composantes", {
        why: "Passer du dessin au calcul.",
        idea: "AB⃗ va de A vers B. Chasles : AB⃗ + BC⃗ = AC⃗. BA⃗ = −AB⃗. Dans un repère, AB⃗ = (x_B − x_A ; y_B − y_A). On ajoute et on multiplie coordonnée par coordonnée.",
        method: ["Placer les points.", "Écrire AB⃗ = (x_B − x_A ; y_B − y_A).", "Additionner / multiplier composante par composante.", "Norme (repère orthonormé) : |u⃗| = √(x² + y²)."],
        example: {
          title: "A(1 ; 2), B(4 ; 6)",
          given: "Vecteur AB⃗.",
          steps: [
            { label: "Composantes", text: "AB⃗ = (3 ; 4)." },
            { label: "Norme", text: "|AB⃗| = 5 (triangle 3-4-5)." }
          ],
          result: "AB⃗ = (3 ; 4), longueur 5."
        },
        check: { q: "|AB⃗| = |BA⃗| implique-t-il AB⃗ = BA⃗ ?", a: "Non. Même longueur, sens opposés. BA⃗ = −AB⃗." },
        keep: ["Un vecteur n’a pas d’origine : AB⃗ = DC⃗ signifie « même déplacement ».", "Chasles se lit comme un trajet."],
        trap: "Écrire AB⃗ = (x_A − x_B ; …) : l’ordre A puis B est inversé."
      }),
      u("02", "Colinéarité : le déterminant", {
        why: "Savoir si deux droites sont parallèles, ou si deux vecteurs sont proportionnels.",
        idea: "Deux vecteurs sont colinéaires s’ils sont sur la même direction : l’un est un multiple de l’autre. Test calculatoire : det = x y' − x' y = 0. Ce n’est pas le test de l’angle droit.",
        method: ["Écrire u⃗ = (x ; y), v⃗ = (x' ; y').", "Calculer xy' − x'y.", "Nul ⇔ colinéaires ⇔ droites dirigées par u⃗ et v⃗ parallèles (ou confondues).", "Le vecteur nul est colinéaire à tout vecteur."],
        example: {
          title: "u⃗ (2 ; 3), v⃗ (4 ; 6)",
          given: "v⃗ = 2 u⃗ visiblement.",
          steps: [
            { label: "det", text: "2×6 − 4×3 = 12 − 12 = 0." },
            { label: "Conclusion", text: "Colinéaires, k = 2." }
          ],
          result: "Parallèles (même direction)."
        },
        check: { q: "det = 0 signifie-t-il un angle droit ?", a: "Non. det = 0 : parallèles. Angle droit : produit scalaire nul." },
        keep: ["det = xy' − x'y.", "Colinéaires ⇔ proportionnels."],
        trap: "Utiliser le déterminant pour un angle droit."
      }),
      u("03", "Orthogonalité : le produit scalaire", {
        why: "Reconnaître un angle droit dans un repère orthonormé.",
        idea: "u⃗ ⊥ v⃗ ⇔ u⃗ · v⃗ = 0 ⇔ xx' + yy' = 0. Attention : le repère doit être orthonormé (unités égales, axes perpendiculaires). Le vecteur nul est orthogonal à tout le monde, par la formule.",
        method: ["Vérifier le repère orthonormé.", "Calculer xx' + yy'.", "Nul ⇔ orthogonaux ⇔ droites perpendiculaires."],
        example: {
          title: "u⃗ (2 ; 3), v⃗ (−3 ; 2)",
          given: "Test d’angle droit.",
          steps: [
            { label: "Produit", text: "2×(−3) + 3×2 = −6 + 6 = 0." },
            { label: "Conclusion", text: "Orthogonaux." }
          ],
          result: "u⃗ ⊥ v⃗."
        },
        check: { q: "Peut-on conclure ⊥ dans un repère quelconque ?", a: "Non. La formule xx'+yy' exige un repère orthonormé." },
        keep: ["Produit scalaire : somme des produits des composantes.", "Orthogonalité ≠ colinéarité."],
        trap: "Confondre det et produit scalaire."
      }),
      u("04", "Quatrième sommet d’un parallélogramme", {
        why: "Exercice type : on connaît A, B, C, on veut D.",
        idea: "ABCD parallélogramme (dans cet ordre) signifie AB⃗ = DC⃗, ou encore D = A + C − B. Autre contrôle : les diagonales [AC] et [BD] ont le même milieu.",
        method: ["Fixer l’ordre des sommets (crucial).", "D = A + C − B si ABCD est le parallélogramme.", "Contrôler les milieux des diagonales."],
        example: {
          title: "A(0;0), B(4;0), C(5;3)",
          given: "ABCD parallélogramme.",
          steps: [
            { label: "Formule", text: "D = (0+5−4 ; 0+3−0) = (1 ; 3)." },
            { label: "Milieux", text: "Milieu de [AC] = (2,5 ; 1,5). Milieu de [BD] = (2,5 ; 1,5)." }
          ],
          result: "D(1 ; 3)."
        },
        check: { q: "Pourquoi pas D = A + B − C ?", a: "Ça correspondrait à un autre ordre des sommets. L’ordre ABCD impose D = A + C − B." },
        keep: ["D = A + C − B pour ABCD.", "Contrôle : milieux des diagonales."],
        trap: "Changer l’ordre des lettres sans changer la formule."
      })
    ]
  },
  barycentre: {
    title: "Barycentre",
    intro: "Le barycentre, c’est un équilibre de masses. Le milieu est le cas où les deux masses sont égales.",
    map: ["Deux points", "Masses de signes opposés", "Trois points et isobarycentre", "Barycentre partiel"],
    closing: "Vérifier que la somme des masses n’est pas nulle, écrire la moyenne pondérée, interpréter la position (intérieur / extérieur).",
    units: [
      u("01", "Barycentre de deux points", {
        why: "Partager un segment « à la balance ».",
        idea: "G = bar{(A, α), (B, β)} existe si α + β ≠ 0. Relation : α GA⃗ + β GB⃗ = 0, ce qui donne AG⃗ = [β/(α+β)] AB⃗. En abscisse : x_G = (α x_A + β x_B)/(α + β). Si α = β, G est le milieu.",
        method: ["Vérifier α + β ≠ 0.", "Écrire la moyenne pondérée des coordonnées.", "Si α et β de même signe, G est sur [AB]."],
        example: {
          title: "A(0), B(10), masses 1 et 3",
          given: "Plus de masse en B : G plus près de B.",
          steps: [
            { label: "Somme", text: "1+3 = 4 ≠ 0." },
            { label: "Abscisse", text: "x_G = (1×0 + 3×10)/4 = 7,5." }
          ],
          result: "G est entre A et B, plus proche de B."
        },
        check: { q: "Masses 3 et 3 sur A et B : où est G ?", a: "Milieu de [AB]." },
        keep: ["Moyenne pondérée : masses au numérateur, somme au dénominateur.", "Masses égales ⇔ milieu."],
        trap: "Diviser par α − β au lieu de α + β."
      }),
      u("02", "Masses de signes contraires", {
        why: "G peut sortir du segment. Ce n’est pas une erreur.",
        idea: "Une masse négative, c’est comme une « antimasse » : elle pousse G de l’autre côté. Si les signes sont opposés, G n’est plus dans [AB]. Exemple du manuel : masses 3 et −4 sur A(0) et B(10) donnent x_G = 40, donc G hors de [AB].",
        method: ["Garder la même formule.", "Interpréter le signe : même signe ⇒ intérieur ; signes opposés ⇒ extérieur.", "Multiplier toutes les masses par k ≠ 0 ne change pas G (on peut simplifier)."],
        example: {
          title: "α = 3, β = −4, A(0), B(10)",
          given: "Somme 3−4 = −1 ≠ 0.",
          steps: [
            { label: "Formule", text: "x_G = (3×0 + (−4)×10)/(−1) = 40." },
            { label: "Lecture", text: "40 n’est pas entre 0 et 10." }
          ],
          result: "G ∉ [AB]."
        },
        check: { q: "Peut-on remplacer masses 6 et −8 par 3 et −4 ?", a: "Oui : on divise par 2 ≠ 0. G ne change pas." },
        keep: ["Somme des masses nulle ⇔ barycentre n’existe pas.", "Signes opposés ⇔ G hors du segment."],
        trap: "Rejeter un résultat extérieur en croyant s’être trompé."
      }),
      u("03", "Trois points et médianes", {
        why: "Centre de gravité d’un triangle, barycentre partiel.",
        idea: "G = bar{(A,α),(B,β),(C,γ)} est la moyenne pondérée des trois points. Si les masses sont égales, G = (A+B+C)/3 : isobarycentre, intersection des médianes. On peut grouper B et C : G' = bar{(B,β),(C,γ)}, puis G = bar{(A,α),(G', β+γ)}. Donc G est sur (AG').",
        method: ["Vérifier α+β+γ ≠ 0.", "Coordonnées : moyenne pondérée.", "Pour construire : barycentre partiel, puis alignement."],
        example: {
          title: "Isobarycentre",
          given: "Masses 1, 1, 1. A(0;0), B(6;0), C(0;6).",
          steps: [
            { label: "G", text: "G = (2 ; 2)." },
            { label: "Médiane", text: "Milieu de [BC] = (3 ; 3). (AG) passe par ce milieu." }
          ],
          result: "G centre de gravité."
        },
        check: { q: "Isobarycentre = orthocentre ?", a: "Non. Orthocentre : hauteurs. Isobarycentre : médianes (centre de gravité)." },
        keep: ["Masses égales ⇔ médianes.", "Barycentre partiel : on groupe deux masses."],
        trap: "Affecter les masses aux mauvais sommets, ou confondre avec l’orthocentre."
      })
    ]
  },
  translations: {
    title: "Translations",
    intro: "Tout le plan glisse du même vecteur. Rien ne tourne, rien ne grandit : on pousse.",
    map: ["Définition", "Ce qui est conservé", "Composer deux translations"],
    closing: "Ajouter les composantes du vecteur. Vérifier sur deux points que M'N'⃗ = MN⃗.",
    units: [
      u("01", "Glisser d’un vecteur", {
        why: "Construire l’image d’un point, d’une figure.",
        idea: "t_v⃗(M) = M' signifie MM'⃗ = v⃗ : chaque point se déplace exactement comme v⃗. En coordonnées : x' = x + v_x, y' = y + v_y. Si v⃗ = 0, on ne bouge pas (identité). Sinon, aucun point fixe.",
        method: ["Lire v⃗.", "Ajouter ses composantes au point.", "Pour une figure : translater chaque sommet, relier."],
        example: {
          title: "M(2 ; 1), v⃗ = (3 ; −4)",
          given: "Image M'.",
          steps: [
            { label: "Coordonnées", text: "M' = (5 ; −3)." },
            { label: "Contrôle", text: "MM'⃗ = (3 ; −4) = v⃗." }
          ],
          result: "M'(5 ; −3)."
        },
        check: { q: "Une translation a-t-elle un centre ?", a: "Non. Un centre, c’est pour une rotation ou une homothétie." },
        keep: ["MM'⃗ = v⃗, le même pour tous les points.", "Droite ↦ droite parallèle."],
        trap: "Ajouter v⃗ à un vecteur déjà formé au lieu d’un point, ou chercher un centre."
      }),
      u("02", "Conservations", {
        why: "Savoir ce qui ne change pas (distances, angles, milieux…).",
        idea: "La translation est une isométrie directe : elle conserve les distances, les angles orientés, l’alignement, le milieu, le parallélisme, l’orthogonalité. Un cercle reste un cercle de même rayon (son centre est translaté).",
        method: ["Translater le centre / les sommets.", "Garder les longueurs.", "Conclure le parallélisme des supports."],
        example: {
          title: "Cercle de centre I et rayon 5",
          given: "Translation v⃗.",
          steps: [
            { label: "Centre", text: "I' = t(I)." },
            { label: "Rayon", text: "Toujours 5." }
          ],
          result: "Cercle de centre I', même rayon."
        },
        check: { q: "L’image d’une droite est-elle parallèle à la droite ?", a: "Oui (ou la droite elle-même si v⃗ est parallèle à la droite : elle glisse sur elle-même)." },
        keep: ["Isométrie : distances conservées.", "Ce n’est ni une homothétie ni une rotation (sauf identité)."],
        trap: "Croire que les longueurs sont multipliées par un rapport k."
      }),
      u("03", "Composer deux translations", {
        why: "Deux glissements d’affilée, c’est un seul glissement.",
        idea: "Faire t_u⃗ puis t_v⃗, c’est faire la translation de vecteur u⃗ + v⃗. On additionne les vecteurs, on ne les multiplie pas.",
        method: ["Additionner les vecteurs.", "Appliquer une seule translation, celle de la somme."],
        example: {
          title: "u⃗ = (1 ; 0), v⃗ = (0 ; 2)",
          given: "Composition.",
          steps: [
            { label: "Somme", text: "u⃗ + v⃗ = (1 ; 2)." },
            { label: "Image de (0;0)", text: "(1 ; 2)." }
          ],
          result: "Translation de vecteur (1 ; 2)."
        },
        check: { q: "Compose-t-on en multipliant les vecteurs ?", a: "Non. On additionne." },
        keep: ["t_v ∘ t_u = t_{u+v}.", "L’ordre ne change pas : l’addition des vecteurs est commutative."],
        trap: "Multiplier les composantes au lieu de les ajouter."
      })
    ]
  },
  homotheties: {
    title: "Homothéties",
    intro: "On agrandit ou on réduit à partir d’un centre O. Les angles restent, les longueurs suivent |k|, les aires suivent k².",
    map: ["Définition OM'⃗ = k OM⃗", "Longueurs et aires", "k négatif"],
    closing: "Placer O, écrire OM'⃗ = k OM⃗ en composantes. Pour une aire, élever k au carré, pas |k|.",
    units: [
      u("01", "Le rapport k", {
        why: "Construire M' et comprendre le rôle du centre.",
        idea: "h(O, k) envoie M sur M' tel que OM'⃗ = k OM⃗. k = 1 : on ne fait rien. k = −1 : symétrie centrale. O est le seul point fixe si k ≠ 1. Les droites passant par O restent globalement en place.",
        method: ["Former OM⃗ = M − O.", "Multiplier par k.", "Ajouter O : M' = O + k(M − O).", "Si O est l’origine, M' = k M."],
        example: {
          title: "O(0;0), k = 2, M(3 ; 1)",
          given: "Agrandissement ×2 depuis l’origine.",
          steps: [
            { label: "Image", text: "M' = (6 ; 2)." },
            { label: "Distance", text: "OM' = 2 OM." }
          ],
          result: "M'(6 ; 2)."
        },
        check: { q: "Que se passe-t-il si O n’est pas (0;0) et qu’on fait M' = k M ?", a: "Erreur. Il faut d’abord retrancher O, multiplier, puis rajouter O." },
        keep: ["OM'⃗ = k OM⃗, pas M' = k M en général.", "M'N'⃗ = k MN⃗ : les supports sont parallèles."],
        trap: "Oublier de se ramener au centre O."
      }),
      u("02", "Périmètre × |k|, aire × k²", {
        why: "Le piège classique des devoirs.",
        idea: "Chaque longueur est multipliée par |k| (valeur absolue : une longueur est positive). Un périmètre, somme de longueurs, suit |k|. Une aire, « longueur × longueur », suit k². Aire divisée par 4 ⇔ k² = 1/4 ⇔ |k| = 1/2, pas k = 1/4.",
        method: ["p' = |k| p.", "A' = k² A.", "Si on donne A'/A, extraire la racine pour |k|."],
        example: {
          title: "Aire au quart",
          given: "A' = A/4.",
          steps: [
            { label: "Rapport d’aires", text: "k² = 1/4." },
            { label: "|k|", text: "|k| = 1/2." },
            { label: "Périmètre", text: "p' = p/2, pas p/4." }
          ],
          result: "|k| = 1/2."
        },
        check: { q: "k = −2. Que devient une aire 10 ?", a: "k² = 4, aire 40. Le signe de k n’affecte pas l’aire." },
        keep: ["Longueurs : |k|. Aires : k².", "Aire au quart ⇔ |k| = 1/2."],
        trap: "Prendre k = 1/4 pour une aire divisée par 4."
      }),
      u("03", "Rapport négatif", {
        why: "L’image passe de l’autre côté de O.",
        idea: "k < 0 = une symétrie centrale (le « moins ») puis un agrandissement |k|. M et M' sont de part et d’autre de O. Les longueurs restent multipliées par |k|, pas par k.",
        method: ["Écrire k = −|k|.", "Construire d’abord le symétrique, puis l’agrandir, ou appliquer directement OM'⃗ = k OM⃗.", "Garder |k| pour les distances."],
        example: {
          title: "O origine, k = −1/2, M(4 ; 0)",
          given: "Réduction et inversion.",
          steps: [
            { label: "M'", text: "M' = (−2 ; 0), de l’autre côté de O." },
            { label: "Longueur", text: "OM' = 2 = (1/2) OM." }
          ],
          result: "M'(−2 ; 0)."
        },
        check: { q: "Les distances sont-elles multipliées par k ou par |k| ?", a: "Par |k|. Une distance n’est pas négative." },
        keep: ["k < 0 : de l’autre côté de O.", "Parallélisme conservé quand même (M'N'⃗ = k MN⃗, k négatif = même droite, sens inverse)."],
        trap: "Multiplier une longueur par un k négatif et garder le signe."
      })
    ]
  },
  rotations: {
    title: "Rotations",
    intro: "On tourne autour d’un centre O d’un angle α. Les distances à O restent, les figures ne grandissent pas.",
    map: ["Définition", "Quart de tour (90°)", "Demi-tour (180°)"],
    closing: "Identifier O et α. Se ramener au vecteur OM⃗. Contrôler OM' = OM et, pour 90°, OM⃗ · OM'⃗ = 0.",
    units: [
      u("01", "Tourner autour de O", {
        why: "Comprendre la définition avant les formules.",
        idea: "r(O) = O. Pour M ≠ O, OM' = OM (même distance au centre) et l’angle MOM' vaut α. Rien n’est agrandi : c’est une isométrie. Direct = sens trigonométrique (contraire des aiguilles).",
        method: ["Repérer O et α.", "Garder OM.", "Reporter l’angle α pour placer M'."],
        example: {
          title: "Rotation de 0°",
          given: "Cas limite.",
          steps: [
            { label: "Angle nul", text: "M' = M pour tout M. C’est l’identité." }
          ],
          result: "Pas de mouvement."
        },
        check: { q: "Une rotation conserve-t-elle les aires ?", a: "Oui : isométrie, aire inchangée (contrairement à une homothétie)." },
        keep: ["OM' = OM.", "Ce n’est pas une homothétie."],
        trap: "Tourner autour de l’origine alors que le centre est un autre point."
      }),
      u("02", "Quart de tour direct", {
        why: "Le cas le plus demandé du chapitre 9.",
        idea: "Dans un repère orthonormé direct, autour de l’origine : (x ; y) ↦ (−y ; x). Autour d’un centre O : on retranche O, on applique (−y ; x) au vecteur, on rajoute O. L’image d’une droite est une perpendiculaire. Contrôle : OM⃗ · OM'⃗ = 0 et |OM'| = |OM|.",
        method: ["Vecteur u⃗ = M − O = (x ; y).", "u'⃗ = (−y ; x).", "M' = O + u'⃗.", "Contrôler produit scalaire nul."],
        example: {
          title: "O origine, M(2 ; 1)",
          given: "Quart de tour direct.",
          steps: [
            { label: "Formule", text: "M' = (−1 ; 2)." },
            { label: "Contrôle", text: "2×(−1) + 1×2 = 0, et les normes valent √5." }
          ],
          result: "M'(−1 ; 2). Attention : (y ; −x) serait l’autre sens (horaire)."
        },
        check: { q: "(x ; y) ↦ (y ; −x) est-il le quart de tour direct ?", a: "Non : c’est le quart de tour indirect (horaire)." },
        keep: ["Direct : (−y ; x).", "Repère orthonormé obligatoire."],
        trap: "Inverser direct et horaire, ou oublier de recentrer en O."
      }),
      u("03", "Demi-tour : M' = 2O − M", {
        why: "180° = symétrie centrale, formule simple.",
        idea: "Tourner de 180°, c’est aller « tout droit de l’autre côté de O », à égale distance. D’où M' = 2O − M. Deux quarts de tour font un demi-tour. Quatre quarts de tour ramènent à M.",
        method: ["M' = 2O − M, coordonnée par coordonnée.", "Contrôler : O est le milieu de [MM']."],
        example: {
          title: "O(1 ; 1), M(4 ; 2)",
          given: "Rotation de 180°.",
          steps: [
            { label: "Formule", text: "M' = (2 ; 2) − (4 ; 2) = (−2 ; 0)." },
            { label: "Milieu", text: "Milieu de [MM'] = (1 ; 1) = O." }
          ],
          result: "M'(−2 ; 0)."
        },
        check: { q: "Deux quarts de tour directs, ça donne quoi ?", a: "Un demi-tour, donc M' = 2O − M." },
        keep: ["180° ⇔ symétrie centrale.", "O milieu de [MM']."],
        trap: "Écrire M' = O − M au lieu de 2O − M."
      })
    ]
  }
};
