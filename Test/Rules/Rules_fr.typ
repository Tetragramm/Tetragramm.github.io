#html.elem(
  "html",
)[
  #html.elem("head")[
    #html.elem("meta", attrs: (charset: "utf-8"))[]
    #html.elem("meta", attrs: (name: "viewport", content: "width=device-width, initial-scale=1"))[]
    #html.elem("title")[Règles du Constructeur d'Avions Flying Circus]
    #html.elem("link", attrs: (rel: "shortcut icon", type: "image/x-icon", href: "../favicon.ico"))
    #html.elem("link", attrs: (rel: "stylesheet", type: "text/css", href: "../page/style.css"))[]
  ]
  #html.elem(
    "body",
  )[
    #html.elem("h1")[Règles du Constructeur d'Avions]
    Voici les règles que vous utiliserez pour créer des avions. C'est un projet complexe et qui demande beaucoup d'implication, mais vous pouvez le faire !

    = Stats de Construction d'Avion
    #label("_Plane Building Stats")
    Voici une liste des statistiques importantes pour les avions lorsque vous les construisez.

    Stats d'Entrée

    - Masse: La masse est le poids des objets. Maintenir une masse basse est une priorité, mais les moteurs deviennent beaucoup plus gros à mesure qu'ils deviennent plus puissants, donc cela compte de moins en moins avec le temps.
    - Traînée: La traînée est la quantité de surface qui accroche le flux d'air, ralentissant l'avion. Une valeur basse est préférable.
    - Structure: Utilisée pour déterminer la robustesse globale d'un avion. La structure est utilisée comme un plafond pour la Tension Maximale et sera éventuellement liée à la stat Robustesse. Une valeur élevée est préférable.
    - Stabilité: Utilisée pour déterminer la stabilité de l'avion en vol. Elle est divisée en deux statistiques, qui seront synthétisées à la fin pour créer la stat de Stabilité finale. Moins ou plus dépend de ce que vous voulez que l'avion fasse.
      - Stabilité Latérale: Combine la stabilité en Lacet et en Roulis. Généralement plus basse, surtout sur les avions à couple élevé.
      - Stabilité en Tangage: Généralement la plus élevée des deux, cette statistique est plus facilement modifiable.
    - Contrôle: La quantité de contrôle que l'avion possède. Plus est préférable.
    - Coût: Le prix de tout. Plus coûte plus cher.
    - Sections: La taille physique de la coque de l'avion. Plus signifie un avion plus grand et plus lourd.
    - Surface Ailaire: La taille d'une aile. Une surface plus grande induit plus de traînée mais soulève aussi des avions plus lourds.
    - Envergure: La longueur d'une aile. Plus long est plus efficace pour la traînée et plus stable, mais plus fragile et réduit le Contrôle.
    - Pertes de Portance: L'efficacité des ailes. Une valeur basse est préférable.
    - Puissance: La quantité de "go" du moteur.

    Stats de Sortie

    - Vitesse Maximale: La vitesse à laquelle l'avion vole.
    - Boost: La vitesse à laquelle l'avion accélère.
    - Décrochage (Dropoff): Le point de vitesse auquel votre moteur est plus ou moins efficace.
    - Vitesse de Décrochage: La vitesse minimale à laquelle l'avion peut aller avant de tomber du ciel.
    - Maniabilité: La qualité de la maniabilité de l'avion.
    - Intégrité Structurelle: La robustesse de l'avion. En gros, ses PV. Divisée en deux stats.
    - Tension Maximale: La quantité de forces G que l'avion peut supporter.
    - Robustesse: Points de vie excédentaires.
    - Visibilité: La difficulté à voir hors de l'avion.
    - Stabilité: La capacité de l'avion à ne pas se renverser accidentellement.
    - Capacité de Carburant: La quantité de carburant que l'avion transporte.
    - Stress par Vol: La difficulté à piloter l'avion pendant un certain temps.

    Stats de Sécurité

    - Sécurité en Cas de Crash: La sécurité d'un atterrissage d'urgence.
    - Évacuation: La facilité de sortir en urgence.
    - Entretien: Le coût de l'avion par routine (jeu standard uniquement).

    == Bases #html.elem("a", attrs: (id: "_Basics"))[]
    Les avions sont construits à partir de composants. Nous allons les construire pièce par pièce dans l'ordre suivant.
    - #html.elem("a", attrs: (href: "#_Era"))[Ère]: De quand date l'avion ?
    - #html.elem("a", attrs: (href: "#_Crew"))[Équipage]: Définir qui se trouve à l'intérieur de l'avion, et les passagers.
    - #html.elem("a", attrs: (href: "#_Engines"))[Moteurs]: Définir la propulsion de l'avion et son refroidissement.
    - #html.elem("a", attrs: (href: "#_Frame_and_Covering"))[Châssis et Revêtement]: Mettre un châssis autour de tout.
    - #html.elem("a", attrs: (href: "#_Wings"))[Ailes]: Le faire voler.
    - #html.elem("a", attrs: (href: "#_Stabilizers"))[Stabilisateurs]: Maintenir l'avion stable.
    - #html.elem("a", attrs: (href: "#_Control_Surfaces"))[Surfaces de Contrôle]: Diriger l'avion.
    - #html.elem("a", attrs: (href: "#_Reinforcement"))[Renforts]: S'assurer que l'avion tient ensemble.
    - #html.elem("a", attrs: (href: "#_Weapons"))[Armes]: Ce dont l'avion est armé.
    - #html.elem("a", attrs: (href: "#_Load"))[Charge]: Carburant, Bombes et Fret.
    - #html.elem("a", attrs: (href: "#_Landing_Gear"))[Train d'Atterrissage]: Là où l'avion rencontre la terre.
    - #html.elem("a", attrs: (href: "#_Upgrades"))[Accessoires]: Améliorations pour rendre l'avion meilleur.
    - #html.elem("a", attrs: (href: "#_Propeller"))[Hélice]: Quel type d'hélice monter sur l'avion.
    - #html.elem("a", attrs: (href: "#_Optimization"))[Optimisations]: Affiner l'avion.
    - #html.elem("a", attrs: (href: "#_Final_Calculations"))[Stats Finales]: Tout assembler dans un profil que vous pouvez utiliser en jeu.
    - #html.elem("a", attrs: (href: "#_Used_Planes"))[Avions d'Occasion]: Règles pour l'achat d'avions d'occasion.
    - #html.elem("a", attrs: (href: "#_Altitude_Rules"))[Effets de l'Altitude]: Que se passe-t-il en très haute altitude ?

    Votre avion aura généralement besoin, au minimum, d'un pilote, d'un moteur et d'ailes. Sans ailes, c'est une voiture. Sans moteur, c'est un planeur. Sans pilote, c'est un missile.

    Pendant que vous construisez l'avion, rappelez-vous que les avions ne peuvent pas avoir de Traînée ou de Masse négative ; si vous parvenez à en créer un comme ça, vous aurez toujours au moins 1 MP et 1 Traînée.

    == Ère #html.elem("a", attrs: (id: "_Era"))
    Votre Ère déterminera certains facteurs concernant votre avion au départ. Flying Circus normal est généralement l'Ère Première Guerre Mondiale. Lorsque vous reproduisez un avion réel, soyez un peu strict avec les ères ; un Spitfire FR.XIV est techniquement de 1944 et un avion du Dernier Hurrah, mais le moteur est de la Seconde Guerre Mondiale et l'aérodynamique est principalement de la Tempête Imminente.

    #table(
      columns: 7,
      align: (left, left, left, left, left, left, left,),
      table.header(
        [Ère],
        [Années],
        [Pertes de Portance],
        [Charge Maximale de Bombes],
        [Bonus Cantilever],
        [Ajustement de Coût],
        [Mod Stabilité en Tangage],
      ),
      [Pionnier],
      [1903-1914],
      [30],
      [1/6 Structure],
      [+4],
      [-2þ],
      [+0],
      [Première Guerre Mondiale],
      [1915-1919],
      [25],
      [1/5 Structure],
      [0þ],
      [+0],
      [+0],
      [Années Folles],
      [1920-1929],
      [23],
      [1/4 Structure],
      [+1],
      [+5þ],
      [+0],
      [Tempête Imminente],
      [1930-1938],
      [22],
      [1/3 Structure],
      [0],
      [+10þ],
      [+2],
      [Seconde Guerre Mondiale],
      [1939-1943],
      [20],
      [1/3 Structure],
      [0],
      [+15þ],
      [+2],
      [Dernier Hurrah],
      [1944+],
      [18],
      [1/2 Structure],
      [0],
      [+20þ],
      [+2],
    )

    Les composants de l'avion sont associés à une ère, celle où ils sont devenus largement disponibles pour la première fois. Pour Himmilgard, cette ère est la Première Guerre Mondiale. Ce n'est pas une règle stricte, les avions ont souvent des caractéristiques en avance sur leur temps, et lors de la réplication d'un avion réel, utilisez simplement les caractéristiques qu'il possédait réellement. Pour les conceptions personnalisées, il est préférable pour la plupart des personnages de rester dans les limites de l'ère, avec peut-être une exception. Les Étudiants, avec leurs conceptions de pointe, peuvent avoir deux composants, ou un composant deux ères en avance. Comme toujours, discutez-en avec le MJ et le reste du groupe.

    == Équipage #html.elem("a", attrs: (id: "_Crew"))[]
    Chaque membre d'équipage, y compris le pilote, est assis à l'intérieur du châssis de l'avion.

    === Cockpits #html.elem("a", attrs: (id: "_Cockpits"))[]
    Premièrement, décidez ci-dessous comment le cockpit est construit en sélectionnant une option ci-dessous pour chaque poste d'équipage.

    Les modificateurs de Visibilité, de Stress en Vol et d'Évacuation s'appliquent à chaque poste d'équipage individuellement.

    #table(
      columns: 5,
      align: (left, left, left, left, left,),
      table.header([Type], [Description], [Effets], [Coût], [Ère]),
      [Ouvert],
      [Le pilote est entièrement exposé à l'air.],
      [+1 Masse, +3 Traînée, \+2 Évacuation, +1 Visibilité],
      [\-],
      [Pionnier],
      [Pare-brise],
      [Une pièce de verre devant le pilote.],
      [+2 Masse, \+1 Traînée. +2 Évacuation, +1 Visibilité],
      [1þ],
      [Pionnier],
      [Scellé],
      [Il n'y a pas de fenêtre ou de vue extérieure.],
      [+2 Masse, -3 Évacuation, -1 Stress en Vol. Ce membre d'équipage ne peut pas voir dehors.],
      [1þ],
      [Pionnier],
      [Verrière Étroite],
      [Un châssis avec de petites fenêtres.],
      [+3 Masse, -1 Visibilité. -1 Stress en Vol.],
      [3þ],
      [Première Guerre Mondiale],
      [Verrière Bulle],
      [Un cockpit en verre courbé.],
      [+3 Masse, -3 Traînée, -1 Stress en Vol],
      [8þ],
      [Seconde Guerre Mondiale],
    )

    À chaque cockpit, vous pouvez ajouter les améliorations suivantes.

    #table(
      columns: 4,
      align: (left, left, left, left,),
      table.header([Amélioration], [Description], [Coût], [Ère]),
      [Commandes du Co-Pilote],
      [Permet à ce siège de contrôler également l'avion. \-2 Stress en Vol pour les Pilotes.],
      [1þ],
      [Pionnier],
      [Trappe de Secours],
      [+1 Masse, +3 Évacuation],
      [2þ],
      [Pionnier],
      [Siège Éjectable],
      [+2 Masse, +5 Évacuation],
      [4þ],
      [Dernier Hurrah],
      [Connectivité],
      [Connecte ce cockpit à tout autre cockpit ayant la même amélioration. +1 Masse.],
      [\-],
      [Pionnier],
      [Masque à Oxygène],
      [Le pilote ignore les effets de la haute altitude et annule jusqu'à 2 pénalités de G. Nécessite 1 Charge Continue.],
      [2þ],
      [Première Guerre Mondiale],
      [Isolé],
      [Un panier ou une boîte permettant des montages inhabituels (comme devant une hélice) ignorant complètement le système habituel. +5 Traînée, +1 Masse, +2 Visibilité, -2 Évacuation, +1 Stress en Vol.

        Subissez le double de Blessures lorsque vous Tombez.],
      [1þ],
      [Pionnier],
    )

    Ces options de cockpit peuvent représenter différentes idées selon la zone d'équipage. La Verrière Étroite représente les panneaux de verre du cockpit du B-17 et l'Ouvert représente le trou découpé dans le mur pour le mitrailleur latéral, par exemple.

    === Sécurité #html.elem("a", attrs: (id: "_Safety"))[]
    Essayez de ne pas mourir ! Vous devez acheter ces améliorations par cockpit.

    #table(
      columns: 4,
      align: (left, left, left, left,),
      table.header([Type], [Effets], [Coût], [Ère]),
      [Rembourrage],
      [Annule 1 Blessure pour ce poste lorsque vous Tombez.],
      [1þ],
      [Pionnier],
      [Harnais],
      [Annule 1 Blessure pour ce poste lorsque vous Tombez, -1 Évacuation.],
      [1þ],
      [Pionnier],
      [Système à Libération Rapide],
      [+2 à Évacuation.],
      [1þ],
      [Tempête Imminente],
      [Arceau de Sécurité],
      [+2 Masse. Annule 1 Blessure pour ce poste lorsque vous Tombez.],
      [\-],
      [Première Guerre Mondiale],
      [Fente pour Fusée Éclairante],
      [Permet de tirer des fusées éclairantes depuis un cockpit fermé sans ouvrir le cockpit.],
      [1þ],
      [Années Folles],
      [Ventilateur Basique],
      [Nécessite le Composant Vital Électricité.],
      [\-],
      [Pionnier],
    )

    === Viseurs #html.elem("a", attrs: (id: "_Gunsights"))[]
    Ceux-ci peuvent vous aider à viser ! Par défaut, nous supposons qu'un avion a peu plus que de simples viseurs à anneaux. Ces viseurs peuvent vous aider à mieux faire. Vous ne pouvez en utiliser qu'un à la fois, cependant.

    Chaque viseur que vous installez dans votre cockpit donne -1 Visibilité, soyez donc parcimonieux !

    #table(
      columns: 4,
      align: (left, left, left, left,),
      table.header([Type], [Effets], [Coût], [Ère]),
      [Viseur Collimaté X1],
      [+1 à Ouvrir le Feu.],
      [2þ],
      [Première Guerre Mondiale],
      [Viseur Télescopique],
      [+2 à Ouvrir le Feu si vous Avez Aimé.],
      [3þ],
      [Première Guerre Mondiale],
      [Viseur Réflexe Illuminé],
      [+2 à Ouvrir le Feu. Désactivé lorsque le Composant Vital Électricité est touché.],
      [6þ],
      [Première Guerre Mondiale],
      [Viseur Gyroscopique],
      [+2 à Ouvrir le Feu, et +2 supplémentaires si vous Avez Aimé. Désactivé lorsque le Composant Vital Électricité est touché.],
      [12þ],
      [Seconde Guerre Mondiale],
    )

    === Viseurs de Bombardement #html.elem("a", attrs: (id: "_Bombsights"))[]
    Les viseurs de bombardement aident à atteindre les cibles avec les bombes !

    Un viseur de bombardement coûte 2 thaler pour un modèle de base de Qualité 4, puis +1 thaler pour chaque tranche de 3 Qualité au-delà.

    === Capacité Passagers #html.elem("a", attrs: (id: "_Passenger_Capacity"))[]
    La capacité pour 5 passagers occupe 2 sections de coque qui ne peuvent pas être utilisées pour autre chose. Les collations en vol doivent être achetées séparément. La zone passagers est traitée collectivement comme un poste d'équipage, elle peut donc être connectée aux postes d'équipage avec une amélioration de Connectivité.

    Un lit, un brancard ou des aménagements de première classe occupent 2 sièges passagers.

    Chaque Passager à bord d'un avion (une personne à bord ou dans l'avion qui n'opère aucune de ses fonctions) ajoute 1 Masse de Bombe. Comme pour les autres formes de charge, on arrondit ceci au MP le plus proche.

    L'espace passagers peut être utilisé comme espace de fret, chaque siège passager ou brancard pouvant contenir 1 Fret. Ceci représente les restrictions d'espace causées par les sièges, etc.

    == Moteurs #html.elem("a", attrs: (id: "_Engines"))[]
    Les moteurs se présentent sous deux types généraux, les moteurs propulseurs (Pusher) et les moteurs tracteurs (Tractor). Les moteurs tracteurs ont l'hélice devant l'avion qui le tire, tandis que les propulseurs l'ont derrière l'avion qui le pousse.

    === Choisir votre Moteur
    #label("_Choosing your Engine")
    Votre moteur peut être choisi dans la liste des moteurs prédéfinis appropriés au cadre, ou fabriqué dans le constructeur de moteurs autrement.

    En général, les moteurs refroidis par air sont plus légers mais moins puissants, tandis que les moteurs refroidis par liquide sont plus lourds mais plus puissants.

    === Monter votre Moteur
    #label("_Mounting your Engine")
    Les moteurs peuvent être montés de différentes manières.

    Un propulseur monté à l'arrière représente un moteur monté à l'extrémité de la carlingue de l'avion, comme les propulseurs d'un Kyushu J7W. Un propulseur monté au centre représente un moteur propulseur qui a toujours une queue, utilisant un arbre de transmission étendu ou une queue Farman pour éviter le déséquilibre.

    La visibilité sera la pire de toutes les configurations de montage de moteur. Avoir un montage propulseur ne vous aide pas à bien voir autour d'un moteur monté en pod.

    *Montages de Moteur sur Fuselage*

    Les montages de moteur sur fuselage nécessitent un Emplacement de Châssis pour chaque moteur.

    #table(
      columns: 2,
      align: (left, left,),
      table.header([Type], [Description]),
      [Tracteur],
      [Normal.

        Les armes fixes tirant vers l'avant nécessiteront des mécanismes de synchronisation/montages dans le cône. Les tourelles ne peuvent pas tirer vers l'avant. ],
      [Tracteur Monté au Centre],
      [-2 Stabilité en Tangage, +1 Visibilité.

        Les armes fixes tirant vers l'avant nécessiteront des mécanismes de synchronisation. Nécessitera un Arbre de Transmission Étendu.

        Avec l'espace libre à l'avant de l'avion, vous pouvez monter une seule arme qui tire à travers le cône.

        (Représente les montages moteur de type P-39.) ],
      [Propulseur Monté à l'Arrière],
      [-4 Stabilité en Tangage, +2 Visibilité, -2 Évacuation.

        Les armes fixes tirant vers l'arrière nécessiteront des mécanismes de synchronisation/montages dans le cône. Les tourelles ne peuvent pas tirer vers l'arrière.

        (représente les moteurs montés à l'arrière de l'avion) ],
      [Propulseur Monté au Centre],
      [-2 Stabilité en Tangage. +2 Visibilité, -2 Évacuation.

        Nécessite Arbre de Transmission Étendu, Queue Farman, Ailes en Flèche avec Gouvernes, ou Queue Poutre.

        Les armes fixes tirant vers l'arrière nécessiteront des mécanismes de synchronisation/montages dans le cône. Les tourelles ne peuvent pas tirer vers l'arrière.

        (représente les moteurs montés au centre de l'avion à la manière du DH2) ],
      [Pod],
      [+5 Traînée et -2 Visibilité. Garde le moteur à l'écart de tout.],
    )

    *Montages de Moteur sur Aile*

    #table(
      columns: 2,
      align: (left, left,),
      table.header([Type], [Description]),
      [Nacelle (Intérieure)],
      [Réduit la Tension Maximale de la moitié de la masse du moteur. +1 Pertes de Portance.],
      [Nacelle (Décalée)],
      [Ajoute une Traînée égale à la masse du Moteur.],
      [Tracteur à Conduit],
      [-1 Pertes de Portance. Réduit la Tension Maximale égale à la masse du moteur.],
    )

    Si vous le souhaitez, vous pourriez construire un avion asymétrique, avec différents types de moteurs de chaque côté d'une aile, ou un seul gros moteur sur une aile. Dans ces cas, subissez -3 Stabilité Latérale.

    === Couple Moteur et Rotatifs
    #label("_Engine Torque and Rotaries")
    Les moteurs ont un Couple, qui est soustrait directement de leur Stabilité Latérale s'ils utilisent des montages sur fuselage. Les montages sur aile et en pod minimisent l'effet du Couple sur la stabilité, ignorez-le donc dans ces cas.

    Les moteurs rotatifs sont généralement les seuls moteurs dont vous devez vous soucier à ce sujet dans les avions anciens, étant donné qu'ils sont une grosse masse de métal tournant à grande vitesse.

    Les moteurs rotatifs montés sur aile réduisent votre Tension du Couple (utilisez tous les moteurs), représentant la force exercée contre l'aile. Dans une configuration poussé-tiré, vous pouvez choisir de réduire la Structure à la place.

    Les moteurs poussés-tirés sur fuselage peuvent également choisir de réduire la Structure, auquel cas cela annule l'effet du Couple sur la stabilité, et supprime le bonus rotatif au combat aérien.

    Les moteurs contrarotatifs sont un type de moteur spécial qui divise par deux le Couple du moteur. Ils doivent être associés à une Hélice Démultipliée pour fonctionner.

    === Configuration Poussé-Tiré
    #label("_Push-Pull Configuration")
    Une configuration Poussé-Tiré permet de monter deux moteurs le long de la même ligne. Cela nécessite que le même modèle de moteur soit utilisé pour les deux.

    Dans toute configuration Poussé-Tiré, n'utilisez que la Traînée d'un seul moteur, et appliquez les modificateurs suivants.

    *Conceptions Poussé-Tiré*

    #table(
      columns: 2,
      align: (left, left,),
      table.header([Type], [Description]),
      [Tracteur + Propulseur/Arrière],
      [90% Puissance Moteur. Le -2 Stabilité en Tangage et -2 Évacuation d'avoir un Propulseur. Le capot coûte +2 pour le moteur Propulseur comme d'habitude.],
      [Nacelle/Nacelle],
      [80% Puissance Moteur. N'appliquez la pénalité de nacelle que pour un seul moteur.],
      [Pod Tandem],
      [90% Puissance Moteur. N'appliquez la Pénalité de +5 Traînée qu'une seule fois.],
    )

    == Améliorations Moteur #html.elem("a", attrs: (id: "_Engine_Upgrades"))[]
    === Arbres de Transmission Étendus
    #label("_Extended Driveshafts")
    Un arbre de transmission étendu signifie essentiellement que, bien que le moteur soit monté au milieu de l'avion, l'hélice peut toujours être à l'une ou l'autre extrémité car la tige reliant les deux est plus longue que d'habitude et traverse la longueur de l'avion.

    Les arbres de transmission étendus ajoutent +1 Masse.

    Cela peut être fait pour diverses raisons. Sur les avions tracteurs, cela peut permettre de monter une arme d'artillerie en interne, tirant à travers l'hélice sans utiliser le mécanisme de synchronisation en faisant passer le canon directement à travers le moyeu de l'hélice. Par exemple, une arme montée devant le moteur dans un espace dédié comme le canon automatique de 37 mm dans le nez du P-39 Airacobra.

    Sur un avion propulseur à moteur central, un arbre de transmission étendu élimine le besoin d'une queue Farman. Vous pouvez simplement monter une queue conventionnelle autour du moteur sans problème. De même, un tracteur monté au centre avec des canards (c'est-à-dire : la queue est devant l'avion) peut utiliser l'arbre de transmission étendu pour éviter la queue Farman.

    === Hélices Hors-bord
    #label("_Outboard Propellers")
    Les hélices hors-bord désignent l'utilisation d'un ensemble de courroies, engrenages et poulies pour décaler l'hélice (ou les hélices) sur le côté du moteur et du fuselage. Cela nécessite l'amélioration arbre de transmission étendu et entraîne un coût de +3 Traînée et -2 Fiabilité. En contrepartie, les canons montés sur fuselage n'ont plus besoin d'être synchronisés, car les hélices sont à l'écart.

    Cette amélioration peut être appliquée aux moteurs Tracteurs, Tracteurs Montés au Centre, et Poussés-Tirés. Dans le cas d'un moteur Poussé-Tiré, c'est le moteur arrière qui entraîne les hélices hors-bord, et par conséquent les canons tirant vers l'avant doivent toujours être synchronisés, mais il n'y a pas de pénalité de -2 à l'Évacuation.

    === Hélice Démultipliée
    #label("_Geared Propeller")
    Cette amélioration peut être appliquée à n'importe quel moteur. Elle coûte +1þ par itération. Disponible à l'ère Première Guerre Mondiale.

    L'ajout de cela ajoutera +50% à la Survitesse du moteur, et donnera -1 Fiabilité. Vous pouvez l'ajouter autant de fois que vous le souhaitez.

    Vous pouvez payer 1þ supplémentaire pour annuler la pénalité de Fiabilité de l'hélice démultipliée uniquement, 1 pour 1. Disponible à l'ère Années Folles.

    *Note :* Bien que techniquement vous puissiez démultiplier un moteur Rotatif (et il existe quelques exemples historiques), c'est une abomination contre l'ingénierie et vous devriez y réfléchir à deux fois, voire une douzaine de fois, avant de le faire.

    === Capot #html.elem("a", attrs: (id: "_Cowling"))[]
    Un capot peut être appliqué à n'importe quel moteur refroidi par air.

    #table(
      columns: 5,
      align: (left, left, left, left, left,),
      table.header([Type], [Description], [Types de Moteur], [Coût], [Ère]),
      [Capot Basique],
      [80% Traînée Moteur, +1 Masse.],
      [Refroidi par Air],
      [1þ],
      [Pionnier],
      [Capot Basique Rotatif],
      [40% Traînée Moteur. +1 Masse.],
      [Rotatif],
      [1þ],
      [Pionnier],
      [Capot Fermé],
      [30% Traînée Moteur. -1 Fiabilité, +1 Masse.],
      [Rotatif],
      [1þ],
      [Première Guerre Mondiale],
      [Capot Aérodynamique],
      [40% Traînée Moteur. +3 Fiabilité, +2 Masse.],
      [Refroidi par Air + Rotatif],
      [3þ],
      [Années Folles],
      [Capot à Lattes Réglables],
      [50% Traînée Moteur. +2 Fiabilité, +2 Masse.],
      [Refroidi par Air],
      [2þ],
      [Tempête Imminente],
      [Capot Scellé],
      [50% Traînée Moteur. +1 Masse par 3 Traînée Moteur (avant réduction).],
      [Refroidi par Liquide],
      [1þ],
      [Pionnier],
    )

    Les capots sont plus difficiles à appliquer aux avions propulseurs sur fuselage, nécessitant une ingénierie soignée pour le flux d'air. Augmentez les coûts de +2. L'exception est le Capot Scellé, car, eh bien, ils sont scellés et il n'y a pas de flux d'air à gérer.

    De plus, un ventilateur de refroidissement par air peut être monté à l'intérieur du capot d'un moteur refroidi par air non rotatif. Cela peut aspirer de vastes quantités d'air sur le moteur, bien que cela introduise une pale tournante lourde supplémentaire sur le vilebrequin.

    - Ventilateur de Refroidissement par Air : +6 Fiabilité, +3 Masse. Couple doublé. 4þ

    === Turbocompresseur #html.elem("a", attrs: (id: "_Turbocharger"))[]
    Un turbocompresseur occupe un emplacement de châssis !

    === Moteur comme Générateur #html.elem("a", attrs: (id: "Engine_as_Generator"))[]
    Vous pouvez monter un moteur comme générateur. Il ne fournit aucune puissance pour vous faire avancer, mais vous pouvez l'augmenter indépendamment de vos autres moteurs pour recharger les batteries ou fournir de l'énergie pour d'autres choses. Vous n'avez pas besoin d'alternateur (nous présumons que c'est intégré) et il génère le double de Charge que le même moteur s'il alimentait une hélice avec un alternateur.

    === Refroidissement (Air)
    #label("_Cooling_(Air)")
    Si votre moteur est refroidi par air, génial ! Il suffit de le placer là et il fonctionnera tout seul. Ajoute le Composant Vital Carter d'Huile.

    === Refroidissement (Rotatif)
    #label("_Cooling_(Rotary)")
    Si votre moteur est _rotatif_ ;, vous devrez ajouter 1 Masse pour le Réservoir d'Huile du moteur. C'est un Composant Vital distinct.

    === Refroidissement (Liquide)
    #label("_Cooling_(Liquid)")
    Si votre moteur est _refroidi par liquide_ ;, vous devrez ajouter un radiateur et un refroidisseur d'huile.

    Un refroidisseur d'huile est simple : vous ajoutez +1 traînée par tranche de 15 puissance et cela compte comme un Composant Vital.

    Un radiateur pèse 3 Masse et a une quantité variable de Traînée, que vous choisissez. Vous ne pouvez pas avoir plus de radiateurs que de moteurs, mais vous pouvez choisir de connecter plusieurs moteurs au même radiateur agrandi. Cela économisera du poids, mais sera un point de défaillance unique. Chaque radiateur est un Composant Vital.

    La _Traînée_ d'un radiateur représente la surface du radiateur exposée à l'air. Chaque point de Traînée donne +2 Refroidissement. Vous devez avoir une valeur de Refroidissement égale à celle de votre ou vos moteur(s) ou perdre de la fiabilité. Chaque point de refroidissement que vous avez en moins que cela donne -1 Fiabilité. Avoir plus de Refroidissement que ce que votre Moteur nécessite ne le rendra pas plus fiable.

    Le _Type_ est la conception du radiateur, et le _Montage_ du radiateur est son emplacement par rapport au moteur (pas à l'avion dans son ensemble) et cela affecte les performances du radiateur après avoir été touché. Ces deux éléments peuvent donner des bonus de fiabilité directs au moteur en raison de la simplicité mécanique ou de l'efficacité.

    Les radiateurs peuvent avoir différents types. Si le radiateur gagne plus de Traînée, il n'ajoutera pas plus de Fiabilité : cela provient des autres parties de la conception comme les tuyaux ou le châssis.

    *Type de Radiateur*

    #table(
      columns: 3,
      align: (left, left, left,),
      table.header([Type], [Description], [Ère]),
      [Panneau],
      [Par Défaut.],
      [Pionnier],
      [Boîte],
      [+2 Traînée, -1 Masse.],
      [Pionnier],
      [Entrée d'air],
      [+2 Refroidissement +3þ.],
      [Années Folles],
      [Refroidissement Évaporatif],
      [Voir ci-dessous.],
      [Tempête Imminente],
    )

    *Montage de Radiateur*

    #table(
      columns: 3,
      align: (left, left, left,),
      table.header([Emplacement], [Description], [Ère]),
      [Bas],
      [+1 Fiabilité. Force Refroidissement forcé lorsque touché.],
      [Pionnier],
      [En Ligne],
      [Par Défaut.],
      [Pionnier],
      [Haut],
      [Le bonus persiste pendant 1 Refroidissement après avoir été touché. +1 Traînée. Si l'avion est un cockpit ouvert, il aspergera le pilote avec le liquide du radiateur !],
      [Pionnier],
      [Haut Décalé],
      [Nécessite une Aile Parasol. Comme pour Haut, mais -1 Stabilité Latérale, et le pilote est en sécurité en cas de rupture.],
      [Première Guerre Mondiale],
    )

    *Exemples de Radiateurs :*

    #emph[Les radiateurs Panneau sont toute conception de radiateur sur laquelle l'air "passe", tandis que les radiateurs Boîte sont conçus pour que l'air "passe à travers". En termes simples, s'il dépasse de manière disgracieuse ou se trouve dans le nez, c'est une boîte, s'il est plat contre une surface comme une aile ou la peau, c'est un panneau.]

    Les radiateurs Entrée d'air sont spécifiquement des radiateurs construits à l'intérieur de carters spécialisés conçus pour canaliser l'air et réduire la traînée.

    - Le radiateur d'un Albatros D.II est un radiateur Panneau Haut.

    - Le radiateur sur le côté d'un Sopwith Dolphin ou d'un Albatros D.II précoce est un radiateur Boîte Bas.

    - Le radiateur sur le nez d'un SE5a ou d'un Fokker D.VII est un radiateur Boîte En Ligne.

    - Le radiateur d'un Spitfire ou d'un P-51 est un radiateur Entrée d'air Bas.

    *Liquide de Refroidissement Spécial*

    Normalement, un radiateur est juste rempli d'eau. Si vous voulez être un ingénieur sophistiqué, vous pouvez charger votre radiateur avec un liquide de refroidissement spécial comme suit. N'oubliez pas d'arrondir vers le bas pour le refroidissement !

    Si vous souhaitez utiliser l'un des liquides de refroidissement marqués d'un \*, vous devez dépenser +2þ pour durcir votre radiateur pour cela.

    === Fluide de Radiateur Rare #html.elem("a", attrs: (id: "_Rare_Radiator_Fluid"))[]
    Par défaut, les radiateurs sont remplis d'~eau, mais si vous pouvez trouver des sources, vous pouvez les remplir~ d'autres fluides pour augmenter l'efficacité du moteur.~ Vous devez acheter le liquide à nouveau si le radiateur est endommagé.~ Si le liquide est marqué d'un \*, vous avez besoin d'un radiateur spécial durci pour eux (2 thaler pour l'améliorer).

    #table(
      columns: 4,
      align: (left, left, left, left,),
      table.header([Liquide], [Effets], [Coût], [Ère]),
      [Eau],
      [],
      [\-],
      [Pionnier],
      [Eau Salée\*],
      [+1 Fiabilité (Gratuit pour les Pêcheurs)],
      [1þ],
      [Pionnier],
      [Huile Minérale\*],
      [Absorbe 1 Raté par Refroidissement. Inflammable],
      [1þ],
      [Pionnier],
      [Huile de Ricin],
      [Comme Huile Minérale, mais +2 Stress si fuite],
      [\-],
      [Pionnier],
      [Glycol],
      [+2 Fiabilité],
      [2þ],
      [Années Folles],
      [Fréon],
      [+4 Fiabilité. Subissez 1 Réduction de Puissance tant que le régime est inférieur à 4.],
      [3þ],
      [Tempête Imminente],
      [Ammoniaque],
      [Comme Fréon, mais cause 2 Blessures en cas de fuite],
      [2þ],
      [Pionnier],
    )

    \

    #table(
      columns: 1,
      align: (left,),
      table.header([Refroidissement Évaporatif]),
      [Une manière alternative de refroidir un moteur refroidi par liquide est le refroidissement évaporatif. Cela nécessite une aile suffisamment grande (au moins 5 Surface par moteur) avec une sorte de revêtement métallique. Au lieu d'acheminer l'eau vers un radiateur, l'eau est pulvérisée sous forme de vapeur dans une cavité dans les ailes pour la refroidir, où elle est collectée et réintroduite dans le moteur. C'est plus profilé, mais très fragile.

        Le refroidissement évaporatif ne coûte que les +3 Masse que vous paieriez pour un radiateur. Il n'y a pas de Traînée impliquée, vous êtes juste prêt à partir.

        L'inconvénient est que toute attaque avec un jet de Crit de 16+ mettra le radiateur hors service, en plus de tout autre dommage infligé ou d'autres pièces endommagées.

      ],
    )

    === Pulsoréacteurs #html.elem("a", attrs: (id: "_Pulsejets"))[]
    Les pulsoréacteurs sont simplement boulonnés quelque part sur l'avion. Nous ne nous soucions pas particulièrement de l'emplacement ou de la configuration : nous savons juste que, quelle que soit la méthode utilisée, cela les éloigne de toute pièce fonctionnelle.

    Les pulsoréacteurs coûtent 5þ et 1 d'entretien simplement pour en avoir un sur votre avion. Ils sont durs pour les avions.

    Les pulsoréacteurs produisent du Rumble. Le Rumble cause un stress aux membres d'équipage égal à la moitié du Rumble total, ou 3, selon la valeur la plus basse. De plus, un avion nécessite une structure minimale égale au Rumble total \* 10 pour voler, sinon les vibrations désagrègent l'avion.

    === Moteurs à Réaction & Fusées
    #label("_Jet_Engines_\\&_Rockets")
    Les moteurs à réaction sont montés de l'une des manières suivantes. Les moteurs à réaction entraînent leur propre exigence en Emplacements de Châssis en raison de leur taille.

    #table(
      columns: 2,
      align: (left, left,),
      table.header([Type], [Description]),
      [Entrée d'air Avant/Brûleur Arrière],
      [Par Défaut. Peut monter jusqu'à 2 moteurs.],
      [Pod d'Aile],
      [Réduit la Tension Maximale de la moitié de la masse du moteur. +1 Pertes de Portance.],
      [Pod],
      [+3 Traînée et -1 Visibilité. Garde le moteur à l'écart de tout.],
    )

    == Châssis et Revêtement #html.elem("a", attrs: (id: "_Frame_and_Covering"))[]
    Maintenant que vous avez les sections nécessaires à votre avion, vous devrez les construire. Pour commencer, construisez un châssis. Le châssis donne une Structure de base, plus quelques bonus à mesure que l'avion grandit. Choisissez un seul matériau, celui dont la majorité du châssis est faite, et ajoutez 1 pièce par section.

    Généralement, nous divisons les avions en ceux faits de Longerons ou de Nervures. Si votre avion est maintenu ensemble par des fils de tension avec le châssis fournissant la compression, il est fait de Longerons. Si c'est juste un grand ensemble de pièces solides, il est fait de Nervures.

    Un Sopwith Camel est fait de Longerons en Bois. Un Fokker DR.1 est fait de Longerons en Acier. Le Junkers J.1/J4 est fait de Longerons en Aluminium. Le Polikarpov I-16 est fait de Nervures en Bois. Le P-47 est fait de Nervures en Acier. Le P-51 est fait de Nervures en Aluminium.

    #html.elem("img", attrs: (src: "Frame.png", alt: "Comparaison de Mâts et Nervures"))[]

    #table(
      columns: 6,
      align: (left, left, left, left, left, left,),
      table.header([Matériau du Châssis], [Effet de Base], [Coût de Base], [Effet par Pièce], [Coût par Pièce], [Ère]),
      [Longerons en Bois],
      [15 Structure],
      [\-],
      [+1 Masse, +2 Structure],
      [\-],
      [Pionnier],
      [Longerons en Acier],
      [25 Structure],
      [1þ],
      [+1 Masse, +5 Structure],
      [1þ],
      [Pionnier],
      [Longerons en Aluminium],
      [20 Structure],
      [2þ],
      [+½ Masse, +4 Structure],
      [2þ],
      [Première Guerre Mondiale],
      [Nervures en Bois\*],
      [30 Structure],
      [1þ],
      [+2 Masse, +5 Structure],
      [½þ],
      [Première Guerre Mondiale],
      [Nervures en Acier\*],
      [60 Structure],
      [2þ],
      [+3 Masse, +12 Structure],
      [2þ],
      [Années Folles],
      [Nervures en Aluminium\*],
      [50 Structure],
      [3þ],
      [+2 Masse, +8 Structure],
      [3þ],
      [Années Folles],
      [Titane],
      [\-],
      [],
      [+1 Masse, +10 Structure],
      [8þ],
      [Dernier Hurrah],
      [Living Grove\*],
      [30 Structure, Réparations Gratuites],
      [8þ],
      [+2 Masse, +4 Structure],
      [\-],
      [Himmilgard],
    )

    Le Titane est un cas spécial et ne peut pas être utilisé pour des châssis entiers.

    Un châssis marqué de \* peut être rendu Géodésique, ce qui double le coût par pièce, mais ajoute +50% de Structure par pièce. Les pièces de châssis Géodésiques ne peuvent pas être ensuite Monocoque.

    Par défaut, chaque pièce de châssis ajoute +4 traînée à l'avion, représentant la structure non recouverte qui pend à l'air libre. Vous devez recouvrir ces éléments pour les rendre aérodynamiques. Pour chaque section, choisissez un revêtement ci-dessous. Toute la peau de l'avion doit être la même, choisissez donc le type dominant.

    #table(
      columns: 5,
      align: (left, left, left, left, left,),
      table.header([Matériau de la Peau], [Effets], [Coût], [Structure Monocoque], [Ère]),
      [Nu],
      [\+ 1 Visibilité par Pièce, jusqu'à +3. 60% Masse Cellule.],
      [\-],
      [\-],
      [Pionnier],
      [Toile],
      [50% Traînée Cellule],
      [\-],
      [\-],
      [Pionnier],
      [Celluloïd Transparent],
      [60% Traînée Cellule. + 1 Visibilité par Pièce, jusqu'à +3. Inflammable.],
      [1þ],
      [-],
      [Pionnier],
      [Papier Traité],
      [50% Traînée Cellule. Inflammable. 75% Masse Cellule],
      [\-],
      [\-],
      [Pionnier],
      [Soie Tissée],
      [50% Traînée Cellule. +1 Robustesse par Pièce],
      [1þ],
      [\-],
      [Pionnier],
      [Peau de Dragon],
      [50% Traînée Cellule. L'avion gagne 5 Couverture Blindage PA2.],
      [4þ],
      [\-],
      [Himmilgard],
      [Contreplaqué Moulé],
      [40% Traînée Cellule],
      [½þ],
      [+3],
      [Pionnier],
      [Construction à Clin],
      [50% Traînée Cellule. Monocoque Complet, ajoute +30 Structure.],
      [\-],
      [-3],
      [Pionnier],
      [Plastique Renforcé de Verre],
      [30% Traînée Cellule.],
      [1þ],
      [+0],
      [Dernier Hurrah],
      [Duralumin Ondulé],
      [50% Traînée Cellule, +3 Robustesse par Pièce],
      [1þ],
      [+10],
      [Première Guerre Mondiale],
      [Tôle d'Acier],
      [35% Traînée Cellule, +3 Robustesse par Pièce],
      [1½þ],
      [+8],
      [Années Folles],
      [Tôle d'Aluminium],
      [35% Traînée Cellule, +2 Robustesse par Pièce. 75% Masse Cellule],
      [2þ],
      [+6],
      [Années Folles],
    )

    === Monocoque #html.elem("a", attrs: (id: "_Monocoque"))[]
    Vous pouvez construire un avion monocoque (à coque unique) ou semi-monocoque si vous le souhaitez.

    Un avion monocoque ou semi-monocoque peut être construit en substituant la masse et le bonus structurel d'une pièce de châssis par une pièce de revêtement compatible monocoque. Le châssis existe toujours : rares sont les avions monocoques véritablement sans châssis, ces structures sont juste minimisées et incorporées dans la structure de la coque.

    Les pièces de revêtement monocoque coûtent +1þ chacune, représentant le coût de main-d'œuvre de leur conception et construction. Ceci s'ajoute au coût du châssis : cela ne disparaît pas.

    === Corps Porteur & Aile Volante
    #label("_Lifting Body \\& Flying Wing")
    Un corps porteur et les ailes volantes sont deux réalisations d'ingénierie incroyablement compliquées et nécessitent que l'avion ait une peau solide (Contreplaqué moulé ou mieux).

    Un avion Corps Porteur compte chaque Section de Châssis (pas les supports internes) comme étant 3m2 de surface alaire aux fins du calcul de la vitesse de décrochage, et ajoute +1 Traînée par pièce. Chaque pièce coûte +1 thaler. Pour un corps porteur pur sans ailes du tout, la Tension Maximale est égale à la Structure, avant de soustraire les montages moteur, ou d'ajuster par optimisation.

    Une Aile Volante est un corps porteur qui évite également la traînée supplémentaire en échange de +5 Pertes de Portance, représentant la corde d'aile trop épaisse.

    Ces deux avions ont toujours des queues, même si elles sont intégrées au reste de la machine.

    === Contreventement Interne
    #label("_Internal Bracing")
    Pour augmenter la résilience d'un avion, vous pouvez ajouter du Contreventement Interne. Il s'agit essentiellement de Pièces de Châssis supplémentaires que vous n'avez pas besoin de revêtir, car elles sont à l'intérieur. Vous pouvez avoir 1 pièce de Contreventement Interne par section de châssis réelle. Elles n'ont pas besoin d'être du même matériau que le reste : vous pouvez construire un avion en bois avec quelques contreventements en acier, par exemple.

    Le Titane ne peut être utilisé que pour le contreventement interne. Faire un avion entier en Titane, c'est comme faire un anneau entier en diamants : cool, mais beaucoup trop cher pour que ça en vaille la peine.

    == Queue #html.elem("a", attrs: (id: "_Tail"))[]
    Nous considérons la queue comme les Sections de l'avion qui sont laissées principalement vides. Elles ajoutent des sections de châssis supplémentaires et modifient également la stabilité en tangage de l'avion. Soyez très prudent dans votre sélection : une queue courte semble optimale, mais la stabilité en tangage compense les effets de choses comme le couple, les ailes courtes, et l'instabilité naturelle en roulis des avions, donc en prendre trop se traduira par des avions incontrôlables.

    La plupart des meilleurs chasseurs de la Première Guerre Mondiale seraient Trapus, tout comme les avions de la Seconde Guerre Mondiale comme le I-16, le F2A Buffalo, et le chasseur-fusée Me-163. En règle générale, si vous le regardez et dites "ça ressemble à un jouet", vous êtes Trapu. S'il semble raisonnable, vous êtes Standard. La plupart des gros bombardiers, etc., utiliseront Long.

    #table(
      columns: 3,
      align: (left, left, left,),
      table.header([Emplacement], [Sections de Châssis Additionnelles], [Modificateur Avion]),
      [Sans Queue],
      [+0],
      [-4 Stabilité en Tangage, ne peut pas utiliser d'empennage horizontal ou de dérive traditionnels. +3 Visibilité],
      [Trapu],
      [+1],
      [-3 Stabilité en Tangage.],
      [Standard],
      [+2],
      [Aucun changement.],
      [Long],
      [+3],
      [+3 Stabilité en Tangage.],
    )

    Les sections de queue sont en règle générale vides. Les sections de queue ne sont pas nécessairement à l'"arrière" de l'avion, elles ne font que le gonfler et l'aider à s'équilibrer. Par exemple, pensez aux postes de mitrailleur de queue dans les bombardiers.

    === Farman #html.elem("a", attrs: (id: "_Farman"))[]
    Si vous souhaitez monter des commandes derrière une hélice propulsive (ou devant une hélice tractrice !), vous utilisez une Queue Farman. Il s'agit d'une structure de mâts construite autour de l'hélice qui permet aux surfaces de contrôle d'y être suspendues.

    Elle est construite comme une queue régulière, ci-dessus. Une queue Farman pèse moitié moins qu'une Queue conventionnelle, mais ne peut pas recevoir de surface : c'est toujours une queue nue.

    Une queue Farman ne compte pas comme faisant partie d'un avion monocoque (car cela ne fonctionnerait pas), alors choisissez simplement un type de matériau de châssis.

    === Queues Poutres
    #label("_Boom Tails")
    Les queues poutres sont une autre option utile pour les avions propulseurs et certains avions à nacelles. Elle permet les mêmes choses qu'une queue Farman, mais est à bien des égards plus sophistiquée. Elle présente cependant quelques difficultés aérodynamiques.

    Une Queue Poutre est construite comme une queue régulière, et utilise toutes les mêmes règles. Elle soustrait la Masse de la Queue de la Tension des ailes, et une Queue Poutre qui n'est pas connectée à des nacelles moteur tracteur génère +50% de Traînée.

    Si vous avez le vrillage d'aile et des queues poutres, vous avez fait une erreur, et subissez une pénalité de -2 à la fois à la Stabilité Latérale et à la Stabilité en Tangage. Une aile vrillante défléchira l'empennage horizontal !

    == Ailes #html.elem("a", attrs: (id: "_Wings"))[]
    Vous avez besoin d'ailes pour voler, ou du moins de quelque chose de similaire à une aile. Une plus grande surface alaire signifie plus de portance pour votre avion, mais aussi plus de traînée et moins d'intégrité structurelle.

    Pour commencer, les ailes de votre avion ont un nombre appelé leurs *Pertes de Portance* ;, déterminé par votre Ère. Cela représente la quantité de portance perdue à cause de l'inefficacité de la conception de l'aile. Idéalement, ce nombre serait de 1.

    === Surface Ailaire #html.elem("a", attrs: (id: "_Wing_Area"))[]
    Commencez par décider de la surface alaire totale que vous souhaitez pour votre avion, sur toutes les ailes. Notez-la en Mètres Carrés.

    Maintenant, divisez cette surface en chaque plan d'aile que votre avion aura. Chaque aile ajoutée après la première donne…

    - +3 Contrôle
    - +5 Pertes de Portance
    - -1 Visibilité

    === Allongement
    #label("_Aspect Ratio")
    Les ailes ne sont pas toutes de la même forme ; certaines ailes sont longues et fines (elles ont un _allongement élevé_ ;) et certaines ailes sont courtes et larges (elles ont un _allongement faible_ ;).

    Décidez de l'envergure de chaque aile de l'avion, en plus de la surface que vous lui avez donnée.

    Les ailes ont un modificateur de tension et une Traînée supplémentaire.

    Réduction de la Tension = 2 \* Envergure + Surface - 10. Les ailes ne peuvent pas générer de tension positive, comment cela fonctionnerait-il ?

    La traînée de l'aile est 6 \* Surface^2 / Envergure^2. Toute aile donnée doit toujours générer au moins 1 Traînée.

    - Le Fokker E.III a une surface alaire de 16 mètres carrés et une envergure de 9 mètres. Cela signifie que l'aile génère 18 Traînée et inflige une Pénalité de Tension de -24.
    - Un planeur théorique a 10 mètres carrés d'ailes et une envergure de 15 mètres. Il génère seulement 2 traînée, mais inflige une Pénalité de Tension de -30.

    === Effets de l'Aile la Plus Longue
    #label("_Longest Wing Effects")
    L'aile la plus longue de votre avion donnera le modificateur suivant.

    - 8 - Envergure = Modificateur de Contrôle

    - Chaque point d'Envergure inférieur à 8 : -1 Stabilité Latérale.

    === Plans Ailaires
    #label("_Wing Decks")
    Comme il s'agit d'un jeu sur les débuts de l'aviation, vous pouvez décider d'avoir plus d'une aile. Votre avion sera-t-il un monoplan, un biplan, un triplan ou quelque chose d'encore plus étrange ?

    Choisissez un emplacement pour chaque aile. Sauf si vous construisez un avion à ailes tandem en ligne, vous pouvez avoir au maximum une aile Épaule, une aile Médiane, et une aile Basse. Il n'y a pas de limite au nombre d'ailes Parasol ou Train que vous pouvez avoir.

    Le type d'aile que vous avez est déterminé par sa position par rapport au fuselage et au centre de masse de l'avion, qui sont généralement mais pas toujours au même endroit. Utilisez la partie principale de l'aile, pas l'endroit où elle se fixe. Les Ailes de Mouette peuvent avoir un point de fixation différent de l'emplacement de la partie principale.

    - Une aile Parasol est sur des mâts au-dessus du fuselage, comme un parapluie au-dessus de l'avion.
    - Une aile Épaule (ou aile Haute) est approximativement au sommet du fuselage.
    - Une aile Médiane est autour du milieu du fuselage.
    - Une aile Basse est approximativement au bas du fuselage.
    - Une aile Train est comme une aile Parasol inversée, suspendant le fuselage dans l'air au-dessus de l'aile. Les ailes Train peuvent également représenter de petites surfaces portantes attachées entre les roues du train d'atterrissage en utilisant les règles d'Ailes Miniatures.

    Dans certains cas, comme sur le Macchi M.5 (celui piloté par Porco Rosso pendant la guerre), le centre de masse peut être significativement décalé par le placement du moteur au-dessus ou en dessous du fuselage, vous pouvez donc choisir de considérer le placement de l'aile par rapport au moteur à la place.

    *Plans Ailaires*

    Ces modificateurs s'appliquent à chaque aile complète attachée. Le modificateur Aile la Plus Grande s'applique aux Monoplans et Sesquiplans à l'aile ayant la plus grande Surface.

    #table(
      columns: 3,
      align: (left, left, left,),
      table.header([Emplacement], [Modificateur Avion], [Modificateur Aile la Plus Grande]),
      [Parasol],
      [+3 Stabilité en Tangage, -10 Tension Maximale. -2 Pertes de Portance. -1 Visibilité],
      [+1 Stabilité Latérale. -1 Contrôle],
      [Épaule],
      [+2 Stabilité en Tangage. -1 Pertes de Portance. -1 Visibilité],
      [-1 Contrôle],
      [Médian],
      [\-],
      [-10% Traînée pour cette aile],
      [Bas],
      [-2 Stabilité en Tangage. -1 Sécurité en Cas de Crash. -1 Pertes de Portance],
      [+2 Contrôle, -1 Stabilité Latérale],
      [Train],
      [-3 Stabilité en Tangage. -10 Tension Maximale, -1 Sécurité en Cas de Crash. -2 Pertes de Portance.],
      [+3 Contrôle -1 Stabilité Latérale],
    )

    === Surface Ailaire
    #label("_Wing Surface")
    N'oubliez pas, toujours arrondir vers le bas à des nombres entiers !

    *Surfaces Ailaires*

    #table(
      columns: 4,
      align: (left, left, left, left,),
      table.header([Matériau de la Peau], [Modificateur Avion], [Coût/10 Surface], [Ère]),
      [Toile],
      [\-],
      [\-],
      [Pionnier],
      [Papier Traité],
      [Rend l'avion Inflammable, -1 Masse par 4 Surface, jusqu'à 25% de la masse à sec de l'avion.],
      [\-],
      [Pionnier],
      [Couches de Soie Tissée],
      [90% Pénalité de Tension],
      [2þ],
      [Pionnier],
      [Contreplaqué],
      [90% Pénalité de Tension, 1 Masse/5S],
      [1þ],
      [Pionnier],
      [Tôle d'Aluminium],
      [80% Traînée],
      [3þ],
      [Années Folles],
      [Duralumin Ondulé],
      [60% Pénalité de Tension , 1 Masse/4S],
      [2þ],
      [Première Guerre Mondiale],
      [Tôle d'Acier Fine],
      [60% Pénalité de Tension, 90% Traînée, 1 Masse/5S],
      [3þ],
      [Années Folles],
      [Plume de Grand Aigle],
      [+1 Contrôle par 5S],
      [6þ],
      [Himmilgard],
      [Fibre Solaire],
      [+1 Génération de Charge par 5S],
      [4þ],
      [Himmilgard ou Dernier Hurrah],
      [Peau de Dragon],
      [40% Pénalité de Tension],
      [8þ],
      [Himmilgard],
      [Celluloïd Transparent],
      [Rend l'avion Inflammable. +1 Visibilité par aile. -1 Robustesse par 10 Surface],
      [1þ],
      [Pionnier],
    )

    === Décalage & Aile Tandem
    #label("_Stagger \\& Tandem Wing")
    Si vous avez plusieurs plans d'ailes, vous pouvez décaler les ailes.

    *Décalage des Ailes*

    #table(
      columns: 2,
      align: (left, left,),
      table.header([Emplacement], [Modificateur Avion]),
      [Tandem],
      [Élimine le besoin de Stabilisateurs Horizontaux. +4 Stabilité en Tangage. Ne peut pas être sans queue.],
      [Positive Extrême],
      [+2 Stabilité en Tangage, -2 Pertes de Portance],
      [Positive],
      [+1 Stabilité en Tangage, -1 Pertes de Portance],
      [Négative],
      [-1 Stabilité en Tangage, -1 Pertes de Portance],
      [Négative Extrême],
      [-2 Stabilité en Tangage, -2 Pertes de Portance],
    )

    === Aile Fermée
    #label("_Closed Wing")
    Fermer une paire d'ailes, par exemple en créant une structure en caisson ou circulaire, élimine l'effet de vortex à l'extrémité d'une aile, et permet également une structure plus complète. D'un autre côté, cette conception sera difficile à contrôler, en raison du poids supplémentaire aux extrémités extrêmes des ailes, ce qui augmente l'énergie nécessaire pour induire un roulis.

    Chaque paire d'ailes fermées coûte +1 Masse, -5 Contrôle, et +20 Tension Maximale. (c'est-à-dire : quatre ailes comptent deux fois, pas trois fois)

    Une monowing fermée n'est pas possible : les boucles d'extrémité d'aile pour réduire la traînée feraient partie de l'optimisation. Vous pouvez cependant avoir une aile tandem en ligne fermée.

    === Ailes en Ligne
    #label("_Inline Wings")
    Un style d'Aile Tandem où plusieurs ailes sont au même niveau. Un ensemble en ligne réduit la traînée totale de toutes les ailes du même niveau à 75%, mais donne +3 Pertes de Portance en raison de l'ombre aérodynamique.

    === Ailes Miniatures
    #label("_Miniature Wings")
    Une Aile de 2 mètres carrés ou moins est une Aile Miniature. Celles-ci ne comptent effectivement pas comme une aile : elles n'ajoutent pas les effets du plan d'aile auquel elles sont ajoutées, et ajoutent plutôt juste +1 Contrôle et leur taille pour les besoins de la portance. Chaque Aile Miniature au-delà de la première ajoute +1 Pertes de Portance chacune.

    Chaque aile miniature doit être montée sur son propre plan : elles ne peuvent pas occuper le même espace qu'une autre aile. Pas d'ailes miniatures tandem !

    === Sesquiplans #html.elem("a", attrs: (id: "_Sesquiplanes"))[]
    Si la plus petite de vos ailes fait la moitié de la taille ou moins de votre plus grande aile, et que les ailes ne sont pas tandem, vous avez un Sesquiplan, un eineinhalbdecker ! Cette configuration inhabituelle a été utilisée pour essayer d'obtenir certains des avantages des monoplans et des biplans. Ils ont leurs avantages, mais s'accompagnent de complications structurelles.

    Un Sesquiplan accorde

    - -2 Pertes de Portance
    - +2 Contrôle

    Cependant, l'une des pénalités suivantes s'appliquera.

    - Si l'envergure la plus petite est inférieure à 75% de l'envergure de l'aile la plus grande, votre avion génère 15% moins de Tension, car vous ne pouvez pas contreventer les ailes aux extrémités.
    - Sinon, l'avion est limité aux renforts externes suivants : Mâts en V, Mâts Simples, Mâts en W, Treillis d'Aile, et Attaches de Câble. Il peut toujours utiliser n'importe quel type de Mât Cabane, mais l'aile inférieure plus étroite empêche le support double longeron, limitant les types de longerons qui peuvent être utilisés.

    === Angle d'Aile
    #label("_Wing Angle")
    Les ailes peuvent être construites sous différents angles pour modifier leurs propriétés. Les extrémités d'aile vers le haut (ailes à dièdre) améliorent la stabilité, car elles rendent l'avion plus susceptible de revenir à une position neutre en roulis. Les ailes anèdres font le contraire.

    L'induction d'un angle de dièdre sur l'aile ajoutera de la Stabilité Latérale, tandis qu'une aile anèdre retirera de la Stabilité Latérale à la place. Dans les deux cas, vos Pertes de Portance totales augmentent de la quantité de stabilité ajoutée ou perdue.

    === Ailes de Mouette
    #label("_Gull Wings")
    Toute aile peut être déclarée aile de mouette. Nous considérons le plan de l'aile comme étant l'endroit où se trouve le coude, et non l'endroit où se trouve la racine, car c'est ce qui compte pour les raisons aérodynamiques. Vous ne pouvez pas avoir deux ailes issues de la même racine dans une configuration non-Tandem. Les Ailes de Mouette sont disponibles à l'ère Tempête Imminente.

    Toute Aile de Mouette générera une traînée comme si elle avait +10% de surface, mais elle s'accompagne des avantages suivants :

    - Une Aile Parasol peut être transformée en une _Aile Polonaise_ ;. Cela supprime la pénalité de -10 Tension Maximale et de Visibilité. Non disponible avec les ailes Épaule.
    - Les ailes Médianes, Basses et Train peuvent être transformées en _Aile de Mouette Inversée_ ;. Cela a les effets suivants, meilleurs pour les ailes inférieures.
      - Pour les ailes Basses et Médianes, cela réduit le coût en Traînée et/ou en Masse du Train d'Atterrissage de 15% (hors Coques de Bateau) et augmente la capacité de bombes externes de 10%. Non disponible avec les ailes Médianes et Épaule non-mouette, respectivement.
      - Pour les ailes Train, cela réduit le coût en Traînée et/ou en Masse du Train d'Atterrissage de 25% (hors Coques de Bateau), élimine la -10 Tension Maximale, donne +1 Sécurité en Cas de Crash, et augmente la capacité de bombes externes de 20%. Non disponible avec une aile Basse non-mouette.

    === Ailes en Flèche
    #label("_Swept Wings")
    Les Ailes en Flèche ajoutent +5 Pertes de Portance et donnent -1 Stabilité Latérale. Cependant, elles permettent l'élimination complète de l'empennage horizontal
    _et_ donnent un point de montage naturel pour les Dérives Hors-bord.

    === Poids en Bout d'Aile
    #label("_Wingtip Weight")
    Un avion subit une pénalité de -1 Contrôle pour les éléments suivants :

    - Chaque tranche de 5 Masse d'Armes dans les Montages d'Aile.
    - Chaque réservoir de carburant monté sur aile, interne ou externe.

    === Types d'Ailes Spéciaux
    #label("_Special Wing Types")
    Il existe un certain nombre de types d'ailes spéciaux. Ces types d'ailes peuvent être combinés avec des ailes normales, mais cela en vaudra rarement la peine.

    - Les Autogires utilisent une surface alaire rotative. Ils sont très sûrs pour les avions légers.
    - Les Hélicoptères propulsent une surface alaire rotative, permettant un mouvement vertical et horizontal libre au prix d'une faible stabilité et nécessitant un moteur puissant.
    - Les Ornithoptères utilisent un moteur pour actionner un effet de battement. Cela crée des appareils extrêmement manœuvrables mais délicats et coûteux.

    Leurs règles seront détaillées sur leurs propres pages une fois complètes.

    == Stabilisateurs #html.elem("a", attrs: (id: "_Stabilizers"))[]
    Un avion doit être rendu stable. Il doit avoir un stabilisateur horizontal pour maintenir le nez pointé à plat, et un stabilisateur vertical pour empêcher les vrilles et les roulis. Vous pouvez concevoir un avion sans ces éléments, mais c'est _vraiment difficile_ ;.

    === Taille des Stabilisateurs
    #label("_Stabilizer Size")
    Les avions ont besoin de stabilisateurs pour voler. Point final. Si vous n'en avez pas et que vous n'avez pas fait quelque chose de très, très intelligent, votre avion fera une sorte de mouvement ondulant et s'enfoncera dans le sol.

    Vos Stabilisateurs coûtent de la Traînée, représentant leur présence dans le flux d'air.

    - Tous vos stabilisateurs verticaux ajouteront 1/8ème de la Traînée totale des Ailes. (Minimum 1)
    - Tous vos stabilisateurs horizontaux ajouteront 1/4 de la Traînée totale des Ailes. (Minimum 1)

    L'absence d'un Stabilisateur Vertical soustrait de la Stabilité Latérale une valeur égale à votre Surface Ailaire. L'absence d'un Stabilisateur Horizontal soustrait de la Stabilité en Tangage une valeur égale à la moitié de votre Surface Ailaire, et ajoute également +5 Pertes de Portance !

    Les avions à ailes tandem et à ailes en flèche n'ont pas besoin de stabilisateurs horizontaux : ils ont déjà assez de problèmes. Pour les supprimer, définissez la sélection pour les stabilisateurs horizontaux sur "Les Ailes".

    === Montages de Stabilisateurs
    #label("_Stabilizer Mounts")
    Vous devez choisir où vous montez vos stabilisateurs. Vos options sont…

    *Stabilisateur Horizontal*

    - Empennage Horizontal: Par Défaut
    - Canards (à l'avant): -3 Stabilité en Tangage, Moitié Traînée.
    - Hors-bord (sur l'aile): Nécessite soit des ailes en flèche, soit une aile tandem. \+1 Stabilité Latérale. Nécessite un nombre pair de stabilisateurs.

    *Stabilisateur Vertical*

    - Dérive: Par Défaut.
    - Hors-bord: Nécessite soit des ailes en flèche, une aile tandem, ou des canards. +1 Contrôle. Nécessite un nombre pair de stabilisateurs.

    === Stabilisateurs Multiples
    #label("_Multiple Stabilizers")
    Vous pouvez choisir de monter plusieurs instances d'un stabilisateur sur votre avion. Par exemple, deux dérives sur votre avion montées aux extrémités de l'empennage horizontal. Comme il est préférable que les gouvernes de direction et de profondeur soient dans le flux d'air d'un moteur, vous obtenez plus d'avantages en faisant cela si vous avez plusieurs moteurs.

    Chaque stabilisateur supplémentaire ajoute juste +2 traînée.

    Pour chaque paire de Stabilisateur Vertical avec un Moteur au-delà du premier, vous obtenez un Bonus de Contrôle de +3. Si vous avez un stabilisateur supplémentaire qui n'est pas associé à un moteur, vous obtenez juste +1 Contrôle.

    Les moteurs poussés-tirés comptent comme un seul moteur à ces fins.

    === Queues en V #html.elem("a", attrs: (id: "_V-Tails"))[]
    Une Queue en V combine à la fois la Stabilité en Tangage et la Stabilité Latérale. Elle doit représenter 1/5ème de la traînée totale des ailes, donne +2 aux deux types de Stabilité, et coûte 5þ à concevoir. La Queue en V est de l'ère Tempête Imminente.

    === Queues en T #html.elem("a", attrs: (id: "_T-Tails"))[]
    Une Queue en T est un stabilisateur horizontal monté au sommet (ou près du sommet) du stabilisateur vertical. Elle cause la moitié de la Traînée d'un stabilisateur horizontal conventionnel, réduit les Pertes de Portance de 2, et ajoute une règle spéciale à l'avion. La Queue en T est de l'ère Seconde Guerre Mondiale.

    Décrochage Profond : En cas de vrille/décrochage alors que vous êtes au-dessus de la vitesse de décrochage et sous puissance, vous avez un Désavantage pour récupérer.

    == Surfaces de Contrôle #html.elem("a", attrs: (id: "_Control_Surfaces"))[]
    Les surfaces de contrôle sont la manière dont un avion se déplace.

    Vous _devez_ avoir un moyen de contrôler votre avion. Vous avez besoin d'Ailerons, de Gouvernes de Profondeur et d'une Gouverne de Direction.

    === Ailerons #html.elem("a", attrs: (id: "_Ailerons"))[]
    Les ailerons contrôlent la rotation de votre avion. Vous devez en avoir !

    *Ailerons*

    #table(
      columns: 4,
      align: (left, left, left, left,),
      table.header([Type], [Effets], [Coût], [Ère]),
      [Pas d'Ailerons],
      [-15 Contrôle, -1 Sécurité en Cas de Crash],
      [-2þ],
      [Pionnier],
      [Ailerons-Volets],
      [Par Défaut],
      [\-],
      [Pionnier],
      [Vrillage d'Aile],
      [-1 Traînée. Obtenez +1 à Dogfight! à 15 de vitesse et moins. Réduit la Tension Maximale égale à l'envergure de l'aile la plus longue.],
      [\-],
      [Pionnier],
      [Spoilerons],
      [Lorsque vous lancez Dogfight!, prenez +1, mais réduisez ensuite votre vitesse comme si votre Facteur de Vitesse était doublé.],
      [2þ],
      [Seconde Guerre Mondiale],
    )

    Le Vrillage d'Aile devient de l'ère Dernier Hurrah lorsque l'aile est renforcée avec des cantilevers, et coûte 2þ par cantilever. C'est une technologie avancée !

    === Gouvernes de Direction #html.elem("a", attrs: (id: "_Rudders"))[]
    Les gouvernes de direction donnent le contrôle des virages et travaillent conjointement avec les ailerons et les gouvernes de profondeur pour maintenir l'avion pointé dans la bonne direction. Il existe deux types disponibles :

    #table(
      columns: 4,
      align: (left, left, left, left,),
      table.header([Type], [Effets], [Coût], [Ère]),
      [Gouverne de Direction-Volet],
      [Par Défaut],
      [\-],
      [Pionnier],
      [Gouverne de Direction Entièrement Mobile],
      [-1 Stabilité Latérale. +3 Contrôle.],
      [\-],
      [Pionnier],
    )

    === Gouvernes de Profondeur #html.elem("a", attrs: (id: "_Elevators"))[]
    Les gouvernes de profondeur maintiennent le nez de votre avion pointé vers le ciel et non vers le sol. Il y en a deux...

    #table(
      columns: 4,
      align: (left, left, left, left,),
      table.header([Type], [Effets], [Coût], [Ère]),
      [Gouverne de Profondeur-Volet],
      [Par Défaut],
      [\-],
      [Pionnier],
      [Gouverne de Profondeur Entièrement Mobile],
      [-1 Stabilité en Tangage. +2 Contrôle.],
      [\-],
      [Pionnier],
    )

    === Aides à la Portance #html.elem("a", attrs: (id: "_Lift_Aids"))[]
    Les Volets & Becs de Bord d'Attaque sont des attaches spéciales qui peuvent être placées sur les ailes, modifiant le profil de portance de l'aile. Les volets sont généralement actionnés par un système de poulies et de câbles tendus, ou par hydraulique sur les avions plus grands.

    Vous ne pouvez appliquer qu'un seul type de chacun de ces éléments à un avion.

    *Volets*

    #table(
      columns: 4,
      align: (left, left, left, left,),
      table.header([Type], [Effets], [Coût par 3MP], [Ère]),
      [Volets Basiques],
      [-3 Pertes de Portance, -3 Contrôle.],
      [1þ],
      [Première Guerre Mondiale],
      [Volets Avancés],
      [-5 Pertes de Portance.],
      [2þ],
      [Tempête Imminente],
      [Volets de Contrôle],
      [-5 Pertes de Portance, +3 Contrôle],
      [1þ par MP],
      [Seconde Guerre Mondiale],
      [Spoilers],
      [Lorsqu'ils sont déployés, immédiatement +2 à Sécurité en Cas de Crash. Activez pour +1 à Dogfight, puis induisez immédiatement un décrochage.],
      [1þ par MP],
      [Dernier Hurrah],
    )

    *Becs de Bord d'Attaque*

    #table(
      columns: 4,
      align: (left, left, left, left,),
      table.header([Type], [Effets], [Coût], [Ère]),
      [Fentes Fixes],
      [5 Traînée. -3 Pertes de Portance],
      [1þ],
      [Années Folles],
      [Becs de Bord d'Attaque Automatiques],
      [-1 Pertes de Portance. +3 Contrôle],
      [4þ],
      [Seconde Guerre Mondiale],
    )

    === Inducteurs de Traînée #html.elem("a", attrs: (id: "_Drag_Inducers"))[]
    Les Inducteurs de Traînée sont utilisés pour ralentir un avion, en étendant quelque chose de grand et de traînant dans le flux d'air. Il existe différentes manières de faire cela pour différentes raisons. Il peut s'agir des dispositifs de type "palette" utilisés sur le Stuka ou des grilles du SBD Dauntless ou des freins repliables utilisés sur de nombreux chasseurs à réaction.

    *Inducteurs de Traînée*

    #table(
      columns: 4,
      align: (left, left, left, left,),
      table.header([Type], [Effets], [Coût], [Ère]),
      [Aérofrein],
      [Lorsqu'il est déployé, purgez immédiatement de la Vitesse égale au Facteur de Vitesse et gagnez +1 à Dogfight.],
      [3þ, 1 Masse],
      [Seconde Guerre Mondiale],
      [Frein de Piqué],
      [Lorsqu'il est déployé, les piqués raides échangent l'altitude contre la vitesse à 1-2 au lieu de 1-3.],
      [4þ, 2 Masse],
      [Pionnier],
      [Parachute de Freinage],
      [Donne +3 à Sécurité en Cas de Crash. Peut être activé comme un Aérofrein à usage unique.],
      [3þ],
      [Dernier Hurrah],
    )

    == Renforts #html.elem("a", attrs: (id: "_Reinforcement"))[]
    Un avion aura besoin d'une certaine description de renforts de support pour s'assurer que les ailes ne tombent pas. Sur la plupart des avions, cela implique un agencement soigneusement construit de mâts et de câbles, les mâts étant utilisés pour maintenir les ailes écartées et les câbles étant utilisés pour maintenir les ailes ensemble. Les monoplans peuvent utiliser des câbles contreventés à des points solides du fuselage au lieu de courir entre les ailes, mais c'est moins efficace.

    === Renforts Externes #html.elem("a", attrs: (id: "_External_Reinforcement"))[]
    Les mâts génèrent de la Structure, de la Tension Maximale et une statistique appelée Tension. Vous pouvez en prendre autant que vous voulez de chacun : chaque mât pris représente une paire symétrique, créant une nouvelle travée.

    #table(
      columns: 4,
      align: (left, left, left, left,),
      table.header([Type], [Effets], [Coût], [Ère]),
      [Mâts Parallèles],
      [+2 Traînée, +1 Masse, +5 Structure, +5 Tension Maximale, \+30 Tension.],
      [1þ],
      [Pionnier],
      [Mât en N],
      [+2 Traînée, +1 Masse, +6 Structure, +8 Tension Maximale, +20 Tension.],
      [1þ],
      [Pionnier],
      [Mât en V],
      [+1 Traînée, +1 Masse, -5 Structure, +5 Tension Maximale, +30 Tension.],
      [1þ],
      [Pionnier],
      [Mât en I],
      [+1 Traînée, +1 Masse, +20 Tension Maximale, +15 Tension.],
      [2þ],
      [Première Guerre Mondiale],
      [Mât en W],
      [+3 Traînée, +1 Masse, +35 Tension Maximale.],
      [2þ],
      [Première Guerre Mondiale],
      [Mât en Étoile],
      [+6 Traînée, +2 Masse, +10 Structure, +30 Tension Maximale.],
      [2þ],
      [Première Guerre Mondiale],
      [Treillis d'Aile],
      [+4 Traînée, +40 Tension. Non affecté par la configuration de l'aile.],
      [1þ],
      [Pionnier],
      [Mât Simple],
      [+1 Traînée, +1 Masse, +10 Tension Maximale.],
      [1þ],
      [Pionnier],
      [Attache de Câble],
      [+10 Tension. Ne peut pas être un mât Cabane, ni compter comme votre premier mât non-Cabane.],
      [\-],
      [Pionnier],
    )

    Vous obtenez 1 Mât Cabane sur votre avion : cela peut être votre seul mât si vous le souhaitez. C'est un mât qui génère -2 Traînée (minimum 0), mais seulement la moitié de la Tension. Il coûte la quantité régulière de masse et de coût. Vous ne pouvez pas avoir un treillis d'aile ou une attache de câble cabane.

    Votre premier mât non-Cabane donne +5 Structure, +10 Tension Maximale, et +10 Tension. Cette tension n'est pas affectée par votre configuration d'aile. Cela représente l'avantage général d'avoir ces points d'ancrage : les mâts supplémentaires donnent des rendements décroissants par comparaison.

    N'importe lequel de ces mâts peut être fabriqué en acier au lieu de bois. Cela double leur coût. Les mâts ou treillis en acier (pas les attaches) donnent deux fois plus de Structure, +5 Tension Maximale, et moitié moins de Tension. Un mât en V en acier donne 0 Structure.

    Les câbles convertissent la Tension en Tension Maximale. Si vous choisissez d'ajouter des câbles de contreventement, prenez +3 Traînée par Mât et ajoutez une Tension Maximale égale à la Tension. Max
    1.

    La configuration de vos ailes sur la génération de Tension est multipliée comme suit.

    - Multiplan non décalé ou Sans Ailes : 100%
    - Avion décalé : 90%
    - Avion tandem : 80%
    - Monoplan : 60%

    === Ailes en Cantilever #html.elem("a", attrs: (id: "_Cantilever_Wings"))[]
    L'hypothèse par défaut est que les ailes sont de conception contreventée par tension, utilisant des câbles et des longerons faits de matériaux appropriés pour rester intactes. Construire une
    "aile en cantilever" crée une structure autoportante à l'intérieur de l'aile elle-même, contreventée à un point fort sur le châssis.

    Vous pouvez ajouter 1 Masse de Longeron Cantilever par 5 Structure sur l'avion. L'inclusion de Cantilevers coûte 5þ au total.

    #table(
      columns: 4,
      align: (left, left, left, left,),
      table.header([Matériau du Cantilever], [Effets par Masse], [Coût par Masse], [Ère]),
      [Bouleau],
      [+10 Tension Maximale, +2 Robustesse.],
      [1þ],
      [Première Guerre Mondiale],
      [Duralumin],
      [+15 Tension Maximale, +3 Robustesse.],
      [2þ],
      [Première Guerre Mondiale],
      [Acier],
      [+20 Tension Maximale, +5 Robustesse.],
      [3þ],
      [Première Guerre Mondiale],
      [Aluminium],
      [+25 Tension Maximale, +3 Robustesse.],
      [4þ],
      [Années Folles],
      [Fanons de Baleine],
      [-3 Pertes de Portance, +5 Tension Maximale.],
      [8þ],
      [Himmilgard],
    )

    Une Aile en Cantilever est plus épaisse qu'une aile normale, ouvrant la possibilité de réservoirs de carburant dans l'aile.

    Si vous êtes dans les premières ères, avoir des Cantilevers dans vos ailes soustrait le Bonus Cantilever de vos Pertes de Portance. C'est parce que cela a forcé les concepteurs à rendre les ailes plus épaisses et plus efficaces, mais ils n'avaient aucune idée de ce qu'ils faisaient.

    === Lames d'Aile
    #label("_Wing Blades")
    Vous pouvez ajouter des lames d'aile si vous n'avez pas de renforts externes, et au moins un cantilever en acier. Les Lames d'Aile doublent la masse de tous les cantilevers, mais elles vous permettent de découper votre ennemi.

    == Armes #html.elem("a", attrs: (id: "_Weapons"))[]
    Les armes permettent à votre avion de faire du mal aux choses !

    Les armes sont livrées avec leur propre approvisionnement en munitions, la statistique Munitions avec laquelle elles sont listées. Vous pouvez acheter plus de munitions pour n'importe quelle arme, ce qui coûte toujours +1 Masse. Cela vous donne des munitions supplémentaires égales à celles fournies par défaut avec l'arme. Les munitions ne sont pas si lourdes, mais les chargeurs plus grands et les systèmes plus complexes nécessaires pour alimenter les ceintures plus longues ont tendance à l'être.

    Si une arme est chargée par magasin ou manuelle, vous pouvez dépenser +50% Coût pour la convertir en une arme alimentée par bande.

    === Tailles d'Armes
    #label("_Weapon Sizes")
    Les armes existent en différentes *Tailles* ; : Minuscule, Légère, Moyenne, Lourde et Artillerie.

    Vous pouvez toujours monter des armes plus petites dans les zones avec restrictions, comme les tourelles ou les ailes. Vous pouvez monter deux fois plus d'armes d'une taille inférieure à une arme plus grande. Par exemple, sur une tourelle avec un montage d'arme Moyenne, vous pourriez monter 2 Armes Légères.

    === Systèmes #html.elem("a", attrs: (id: "_Systems"))[]
    Les armes du même type qui tirent dans la même direction forment un *Système* ;. Tous leurs impacts sont additionnés pour créer leurs profils d'arme, créant un nombre d'impacts et une quantité de dégâts infligés aux quatre bandes de portée : Couteau/Proche/Long/Extrême.

    Les armes d'avion listées ci-dessous sont montées dans l'avion en tant que partie d'un
    'système' d'armes identiques. Peu importe où chaque arme du système est montée tant qu'elles tirent toutes au même endroit en même temps.

    Pour créer le tableau de portée, additionnez tous les Impacts des canons, puis multipliez-le par les dégâts de l'arme pour obtenir vos dégâts à cette portée.

    Les Impacts d'Armes diminuent avec la portée. Les armes montées sur l'axe central et les tourelles ont une diminution de 100/75/50/25 pour cent, arrondis vers le bas, pour chaque bande de portée en séquence. Pour les canons montés sur aile, utilisez 100/90/20/10 pour cent à la place. Si vous avez un mélange de canons sur l'axe central et sur aile, calculez les deux groupes séparément, puis additionnez-les.

    === Emplacement #html.elem("a", attrs: (id: "_Placement"))[]
    Vous pouvez placer vos armes sur le fuselage ou les ailes de l'avion. N'importe quel nombre d'armes peut être placé sur ou dans le fuselage de l'avion, notez cependant que les armes de taille Artillerie ou les tourelles contenant plusieurs armes plus petites totalisant plus qu'une arme Lourde doivent chacune avoir leur propre section de châssis.

    Les armes montées sur aile sont restreintes en fonction de la solidité de la construction de l'aile, comme suit.

    - Pas de cantilevers : Max 2 armes Légères uniquement.
    - Cantilevers en bois ou en os : Max 2 armes Moyennes uniquement.
    - Cantilevers métalliques : Max 2 armes Lourdes.

    Monter une arme plus lourde que cela sur l'aile coûtera +2 Masse, représentant l'extension de poutres de support depuis le fuselage de l'avion, à la manière du canon Becker de 20mm sur l'Albatros D.II.

    On peut imaginer ces armes montées au-dessus de l'aile supérieure, le long de l'aile, etc.

    Pour les avions à configurations tractrices traditionnelles, tout emplacement en dehors de l'arc de l'hélice est considéré comme un emplacement sur aile.

    Une arme d'Artillerie montée fixe vers l'avant interférera avec un moteur. Vous devez soit utiliser des nacelles, un propulseur, soit un moteur tracteur monté au centre avec les modifications appropriées.

    Lorsqu'une arme est montée sur aile et non couverte, elle a +1 Traînée.

    === Couvert #html.elem("a", attrs: (id: "_Covered"))[]
    *Les Armes Couvertes peuvent être couvertes ou non couvertes.*

    Lorsque vous ajoutez des armes à votre avion, elles commencent comme non couvertes.

    Les armes non couvertes ajoutent la traînée listée dans la description de l'arme à l'avion.

    Vous pouvez améliorer une arme pour qu'elle soit couverte, éliminant ainsi sa traînée. Cela peut impliquer de déplacer l'arme à l'intérieur du fuselage ou des ailes de l'avion, ou cela peut simplement impliquer la construction de carénages aérodynamiques par-dessus. Le coût varie en fonction de la taille de l'arme, et les coûts sont doublés pour les tourelles.

    #table(
      columns: 2,
      align: (left, left,),
      table.header([Taille de l'Arme], [Coût]),
      [Minuscule],
      [Gratuit],
      [Légère],
      [1],
      [Moyenne],
      [2],
      [Lourde],
      [5],
      [Artillerie],
      [Automatiquement couverte, sauf en tourelle.],
    )

    Les armes montées sur aile ne peuvent pas être couvertes sauf si vous avez un longeron cantilever.

    Les armes tirant à travers le cône sont automatiquement couvertes.

    === Accessibilité #html.elem("a", attrs: (id: "_Accessibility"))[]
    Les armes s'enrayent. Certaines doivent être rechargées manuellement. Les armes sur lesquelles un membre d'équipage peut agir pour effectuer ces types d'activités sont appelées *accessibles* ;. Cela peut impliquer de rendre l'arme accessible, comme un montage Foster qui vous permet de tirer une arme vers votre cockpit, ou cela peut impliquer des systèmes hydrauliques pour charger les canons et dégager les enrayages.

    Les systèmes d'armes sont accessibles ou inaccessibles en groupe. Vous n'avez jamais de situation où une arme peut être utilisée mais l'autre ne le peut pas.

    Un seul montage d'arme placé sur le fuselage peut être rendu librement accessible par poste d'équipage. Quelle arme particulière est accessible depuis quel poste d'équipage doit être décidé lorsque vous placez les armes. Même lorsqu'elles sont couvertes, il n'était pas rare que l'arrière de ces armes dépasse dans la zone du cockpit, ou qu'un simple plongeur mécanique soit utilisé pour dégager les enrayages.

    Toutes les armes placées sur les ailes et les montages d'armes supplémentaires placés sur le fuselage commencent comme inaccessibles.

    Les armes couvertes montées dans une tourelle (voir ci-dessous) commencent comme accessibles si les armes non couvertes dans le même montage seraient accessibles.

    Cela coûte des þ égaux à la moitié des armes d'un groupe pour les rendre toutes accessibles, minimum 1.

    === Synchronisation #html.elem("a", attrs: (id: "_Synchronization"))[]
    Si vous souhaitez tirer à travers l'arc d'une hélice (devant vous avec un avion tracteur ou derrière vous avec un avion propulseur), vous devrez prendre des dispositions pour éviter de toucher les pales de l'hélice. Cela se fait avec la Synchronisation. Pour représenter les différentes qualités des options de Synchronisation, nous utilisons les options suivantes.

    - Un Mécanisme Interrupteur représente les premières versions, et augmente le risque d'enrayage de l'arme de 1. 2þ par canon. Disponible à l'ère Première Guerre Mondiale.
    - Un Mécanisme de Synchronisation représente des systèmes plus sophistiqués. 3þ par canon. Disponible à l'ère Années Folles.

    Un Mécanisme de Synchro/Interrupteur ne peut être monté que sur une arme qui permet sa synchronisation, et ne fonctionnera que si l'arme est également Fixe.

    Si vous êtes économe, vous pouvez remplacer cela par des *Plaques Déflectrices* ;. Elles coûtent 1þ et fonctionneront, mais elles infligent 1 Usure à votre moteur chaque fois que vous obtenez un 5 naturel ou moins sur le premier dé de Crit !

    === Armes dans le Cône #html.elem("a", attrs: (id: "_Spinner_Weapons"))[]
    Si vous avez une Hélice Démultipliée, vous pouvez monter une arme pour qu'elle tire à travers le cône de l'hélice. Cela représente des choses comme le canon central de 37mm sur le SPAD S.XII, le canon du BF 109, ou le P-39.

    Les armes dans le cône contournent le besoin de synchroniseurs. Elles ne peuvent pas être des tourelles.

    Si vous avez une arme d'Artillerie et/ou un moteur rotatif, il doit être monté au centre avec un arbre de transmission étendu, afin de faire de la place pour le canon dans le nez de l'avion.

    === Exemples #html.elem("a", attrs: (id: "_Examples"))[]
    Voici quelques exemples concrets d'armes sur des avions à comparer.

    Les deux MG-08 sur l'Albatros D.III sont exprimés dans Flying Circus comme…

    - Une *paire* de MG *non couvertes synchronisées* *fixes* au *fuselage, accessibles* au pilote.

    Le montage grossier de la mitrailleuse Lewis sur un Nieuport 11 est…

    - Une *seule* LMG *non couverte* *fixe vers l'avant* sur l'*aile, accessible* au pilote.

    Bien que ces canons puissent généralement être basculés vers l'arrière pour être dégagés ou rechargés, cela impliquait souvent de se lever dans le cockpit, offrant une excellente opportunité pour des complications narratives.

    Le montage Foster raffiné du SE.5 est…

    - Une *seule* LMG *non couverte flexible* tirant vers l'avant et vers le haut, montée sur l'*aile, accessible* au pilote.

    Les canons montés sur aile sur un Sopwith Dolphin sont…

    - Une *paire* de LMG *non couvertes* *fixes vers l'avant* sur l'*aile, inaccessible* au pilote.

    Un FE.2 précoce a…

    - 6 *Supports d'Armes* dans son siège d'observateur pour une *LMG* ;.

    Ce qui permet à l'observateur de tirer dans n'importe quelle direction.

    Le canon monté sur moteur du BF-109 est…

    - Un *seul* canon léger *couvert* *fixe* vers l'avant *à travers le cône, accessible* au pilote.

    L'arme a été rendue accessible grâce à l'hydraulique.

    == Charge #html.elem("a", attrs: (id: "_Load"))[]
    La Charge est tout ce qui est ajouté à l'avion une fois qu'il est terminé. C'est de là que vient la différence entre la _Masse à sec_ (l'avion tel qu'il est) et la _Masse totale_ (l'avion avec carburant et bombes).

    La Masse Totale est essentiellement _masse distincte_, et elle est toujours
    _arrondie au supérieur_ au MP le plus proche, contrairement aux calculs habituels. Donc, si vous avez un avion qui pèse 41 Masse à sec (8MP), vous ne pouvez pas y mettre 3 carburant et rester à 8MP. Le carburant ne vient qu'en morceaux de 1MP dans les réservoirs réguliers. 1 Masse de bombes ou 5 comptent tous comme 1 MP, donc si vous le pouvez, prenez toujours un MP de bombes pair.

    C'est pour simplifier la tenue de livres à la table, et s'assurer que le carburant a toujours une pénalité associée.

    === Carburant #html.elem("a", attrs: (id: "_Fuel"))[]
    Les moteurs ont une Consommation de Carburant, qui utilise une unité abstraite de carburant. Chaque Masse de carburant représente 25 de ces points. Donc, en gros, multipliez la quantité de masse de carburant par 25, puis divisez par la consommation de tous vos moteurs, et c'est le nombre d'utilisations de carburant que vous avez.

    Vous pouvez installer 2 Réservoirs de Carburant dans 1 section d'avion, ou ajouter des Réservoirs de Carburant sur une aile pour +3 Traînée chacun. Si vous avez une aile en Cantilever, vous pouvez mettre 1 Réservoir de Carburant par 10 Surface dans les ailes sans traînée supplémentaire à la place.

    Un réservoir de carburant vous donne jusqu'à 5 masse de Carburant. Le réservoir lui-même pèse 1 Masse.

    Un Micro-réservoir est un réservoir de 1 Masse qui contient 25 unités de carburant et n'utilise pas d'emplacement de châssis, mais pèse toujours 1 Masse à vide, et est limité à 4 par avion.

    Vous ne voulez pas mourir ? Cela vous aidera.

    - Extincteur à Distance : Contient 1. Dépensez la charge pour éteindre un incendie. 2 Masse, 3þ
    - Réservoir de Carburant Auto-Obturant : S'applique à tous les réservoirs de carburant internes. La pénalité de fuite de carburant ne s'appliquera qu'au prochain Contrôle de Carburant. +1 Masse et +2þ par réservoir.

    === Bombes #html.elem("a", attrs: (id: "_Bombs"))[]
    Les avions peuvent, s'ils sont équipés pour cela, transporter des bombes. La manière exacte dont cela sera configuré dépend de vous et de votre charge au moment. Les avions sont limités par l'ère quant au nombre de bombes qu'ils peuvent transporter.

    Un Montage de Bombe Externe qui peut transporter jusqu'à 5 Masse de bombes coûte 1 Masse et 1 Traînée et n'occupe pas d'emplacement de châssis.

    Une Soute à Bombes Interne occupe un emplacement de châssis et permet de transporter jusqu'à 10 Masse de bombes en interne. La bombe la plus grande que vous pouvez transporter à l'intérieur de votre avion est égale à un quart de la charge totale de bombes internes.

    Vous pouvez augmenter la taille maximale des bombes d'une soute en ajoutant des sections de châssis pour allonger la soute à bombes. L'ajout de +1 Châssis par Soute vous permet de transporter une bombe jusqu'à la moitié de la charge totale, un autre +1 Châssis vous permet de transporter une seule bombe égale à la charge totale à l'intérieur de l'avion. L'agrandissement de la soute double la masse de bombes qui peuvent être transportées à l'intérieur.

    Les masses de bombes sont toujours arrondies au supérieur jusqu'à la Pénalité de Masse la plus proche ; 1 Masse de bombes est toujours traitée comme 1 Pénalité de Masse.

    Lors de l'utilisation de supports de bombes externes, les bombes réduiront en outre la vitesse de l'avion. Recalculez la vitesse de l'avion avec les bombes causant une Traînée égale à la Masse non arrondie, et inscrivez votre vitesse maximale sous forme de Vitesse Maximale Avec Bombes/Vitesse Maximale.

    Les bombes ne comptent pas dans votre MP chargé aux fins du train d'atterrissage, etc.

    La Charge Maximale de Bombes varie selon l'ère. Les bombes internes comptent à 1/3#super[ème]
    du taux des bombes externes. Par exemple, un bombardier de la Première Guerre Mondiale de 100 Structure pourrait transporter 20 bombes externes, ou 60 internes, ou un mélange tel que 30 internes et 10 externes.

    #table(
      columns: 7,
      align: (left, left, left, left, left, left, left,),
      table.header([Ère], [Pionnier], [Première Guerre Mondiale], [Années Folles], [Tempête Imminente], [Seconde Guerre Mondiale], [Dernier Hurrah]),
      [Charge Maximale de Bombes],
      [1/6 Structure],
      [1/5 Structure],
      [1/4 Structure],
      [1/3 Structure],
      [1/3 Structure],
      [1/2 Structure],
    )

    === Fusées #html.elem("a", attrs: (id: "_Rockets"))[]
    Les fusées fonctionnent exactement comme les bombes.

    === Fret #html.elem("a", attrs: (id: "_Cargo"))[]
    Le Fret est traité exactement comme toute autre charge et arrondi au supérieur à la tranche de 5 Masse la plus proche. Comme la plupart des objets n'ont pas réellement de valeur de masse, improvisez. En gros, 25 kilogrammes représentent 1 Masse.

    L'espace de fret n'est estimé qu'approximativement en raison de la difficulté à prédire la densité du fret et sa capacité d'empilement, nous avons donc juste quelques tailles différentes d'espaces de fret.

    - Un espace minuscule ne coûte que 1 masse et vous donne un petit casier pour les affaires personnelles.
    - Un petit espace peut contenir un coffre, un baril ou une caisse. Il nécessite une section de châssis.
    - Un espace moyen peut contenir un petit véhicule comme une moto, une voiture ou un moteur de dirigeable. Il nécessite 3 sections de châssis.
    - Un grand espace peut contenir un avion de reconnaissance ou de chasse dont les ailes ont été retirées. Il nécessite 5 sections de châssis.
    - Un espace énorme peut contenir à peu près tout ce que vous pouvez imaginer. Il nécessite 10 sections de châssis.

    Chaque section de châssis ajoutée ajoute +3 Masse Chargée à l'avion lorsque vous y mettez des choses. Si vous l'avez à peine rempli et qu'il reste beaucoup d'espace, ignorez simplement cela.

    L'espace de fret peut être utilisé pour stocker des personnes, inconfortablement et temporairement. Sauf les espaces minuscules.

    === Points d'Emport #html.elem("a", attrs: (id: "_Hardpoints"))[]
    À partir de l'Ère Seconde Guerre Mondiale, vous pouvez monter des Points d'Emport sur les avions. Les Points d'Emport sont des montages flexibles qui peuvent accueillir une variété de charges utiles différentes, telles que des réservoirs largables, des bombes, des fusées, des pods canonniers ou des fusées.

    L'ajout d'un point d'emport coûte 5þ, et vous pouvez en avoir un par 20 Structure.

    Nous écrirons ces règles prochainement.

    == Train d'Atterrissage #html.elem("a", attrs: (id: "_Landing_Gear"))[]
    Trains Inférieurs (Choisissez 1)

    - Train d'Atterrissage : +1 Traînée par MP Chargé
    - Flotteurs : +1 ½ Traînée par MP Chargé.
    - Flotteurs Hybrides : +2 Traînée par MP Chargé.
    - Coque de Bateau : +5 Masse. +1 Traînée et +1 Structure par MP Chargé.
    - Patin d'Atterrissage : Lorsque vous atterrissez, lancez Tombez et prenez -1 aux résultats.

    Extras

    - Crochet de Dirigeable : +1 Masse, permet d'atterrir à l'intérieur de dirigeables ou de grands avions.
    - Crochet d'Appontage : +1 Masse par 2 MP. Permet d'atterrir sur les porte-avions.
    - Patin Sous Aile : +3 Traînée, +2 Sécurité en Cas de Crash

    Le train d'atterrissage (sauf les patins) peut être rendu rétractable, échangeant toute la Traînée pour la moitié de cette valeur en Masse, et l'autre moitié en Coût (Arrondir vers le bas comme d'habitude). Pour une Coque de Bateau, ajoutez plutôt un train d'atterrissage rétractable à leur coût total pour permettre l'atterrissage sur l'eau et sur terre.

    Cette masse ajoutée ne rendra pas le train d'atterrissage plus grand, ne vous inquiétez pas.

    === Coques de Bateau #html.elem("a", attrs: (id: "_Boat_Hulls"))[]
    Si vous utilisez une coque de bateau, vous devez maintenir votre (vos) moteur(s) hors de l'eau. Les moteurs doivent être dans un pod, au-dessus d'une aile épaule dans des nacelles ou un conduit, ou montés sur une autre aile.

    En gros, une Coque de Bateau traite toute la coque de l'avion comme le train d'atterrissage, donc ce qui serait une aile épaule serait une aile train.

    == Accessoires #html.elem("a", attrs: (id: "_Upgrades"))[]
    === Blindage #html.elem("a", attrs: (id: "_Armour"))[]
    Le blindage est vraiment simple. Il est défini par ses valeurs de Couverture et d'Épaisseur. La masse du blindage est Couverture multipliée par 2^(Épaisseur-1). C'est-à-dire, pour une Épaisseur 3, c'est Couverture \* 4, et Épaisseur 5 est Couverture \* 16. Le coût est 1/3ème de Couverture \* Épaisseur.

    De plus, multipliez les valeurs de Couverture et d'Épaisseur ensemble, et ajoutez autant de Robustesse à l'avion.

    La quantité maximale de blindage que vous pouvez avoir est de 8 de couverture. De plus, tous les 2 Composants Vitaux que vous avez au-delà de 8 (c'est-à-dire : à 10, 12, 14, etc.) réduisent votre couverture effective de 1, vous devez donc compenser la différence. Cela représente la difficulté de blinder des avions de plus en plus grands avec plus de composants importants à protéger.

    La sauvegarde de blindage que vous obtenez est de 11 moins la Couverture, donc la sauvegarde maximale est de 3+. Une couverture de blindage d'Épaisseur supérieure compte pour la couverture dans les Épaisseurs inférieures, mais le plafond est toujours de 8/3+.

    Une plaque derrière un pilote pour le protéger des balles de fusil est de 2 Couverture de Blindage d'Épaisseur 2.

    === Systèmes Électriques
    #label("_Electrical Systems")
    Tout ce qui génère de l'électricité génère essentiellement cette quantité d'électricité de base, ce qui signifie que tant que ce que vous utilisez ne consomme pas plus de charges que cela, c'est "gratuit". Si cela consomme plus de charges, cela doit les prendre dans une batterie.

    Les batteries se chargent lorsque vous Refroidissez si vous avez une éolienne, un alternateur ou un générateur.

    #table(
      columns: 4,
      align: (left, left, left, left,),
      table.header([Nom], [Effets], [Coût], [Ère]),
      [Éolienne],
      [+1 Traînée, +1 Charges par 10 Vitesse.],
      [1þ],
      [Pionnier],
      [Batterie],
      [+1 Masse, Stocke 5 Charges.],
      [2þ],
      [Pionnier],
      [Batterie (Haute Qualité)],
      [Stocke 5 Charges.],
      [4þ],
      [Années Folles],
      [Alternateur],
      [+1 Masse, +1 Charge, et +1 Charges supplémentaires par 10 Puissance du moteur auquel il est appliqué.],
      [2þ],
      [Pionnier],
    )

    L'électricité peut alimenter les armes et les moteurs. Elle peut également faire fonctionner les systèmes de communication suivants. Les interphones, les projecteurs, les feux de navigation, les récepteurs radio et les ventilateurs n'utilisent jamais de charges, mais nécessitent un système électrique.

    #table(
      columns: 4,
      align: (left, left, left, left,),
      table.header([Nom], [Effets], [Coût], [Ère]),
      [Système d'Interphone],
      [Nécessite le Composant Vital Électricité.],
      [1þ],
      [Pionnier],
      [Récepteur Radio],
      [+2 Masse, +2 Traînée, Nécessite le Composant Vital Électricité.],
      [3þ],
      [Pionnier],
      [Émetteur Radio],
      [+3 Masse, +3 Traînée, -1 Charge.],
      [3þ],
      [Première Guerre Mondiale],
      [Émetteur-Récepteur Radio],
      [+5 Masse, +3 Traînée, -1 Charge],
      [3þ],
      [Première Guerre Mondiale],
      [Récepteur Radio en Fanons de Baleine],
      [Nécessite le Composant Vital Électricité. Ne peut parler qu'à la Station de Base en Fanons de Baleine appariée.],
      [5þ],
      [Himmilgard],
      [Station de Base Radio en Fanons de Baleine],
      [+6 Masse, +1 Traînée, -1 Charge.],
      [12þ],
      [Himmilgard],
      [Station de Base Radio en Fanons de Baleine (Haute Qualité)],
      [+5 Masse, +1 Traînée, -1 Charge.],
      [24þ],
      [Himmilgard],
    )

    === Informations #html.elem("a", attrs: (id: "_Information"))[]
    Voici quelques moyens de recueillir des données.

    #table(
      columns: 3,
      align: (left, left, left,),
      table.header([Nom], [Effets], [Coût]),
      [Caméra de Reconnaissance Intégrée],
      [Peut prendre des photos vers le bas. Les capacités varient selon l'ère.],
      [2þ],
      [Caméra de Tir],
      [Confirme vos éliminations pour vous.],
      [1þ],
    )

    === Visibilité #html.elem("a", attrs: (id: "_Visibility"))[]
    Voir plus loin, mieux.

    #table(
      columns: 3,
      align: (left, left, left,),
      table.header([Nom], [Effets], [Coût]),
      [Découpes d'Aile],
      [+1 Visibilité, +1 Pertes de Portance. Ne peut pas être utilisé avec des ailes en celluloïd transparent coiffées.],
      [\-],
      [Découpes de Coque],
      [+1 Visibilité, -5 Structure. Ne peut pas être utilisé avec des châssis en celluloïd transparent coiffés.],
      [\-],
      [Projecteur],
      [Repérez les cibles la nuit. Nécessite le Composant Vital Électricité.],
      [1þ],
    )

    === Climatisation #html.elem("a", attrs: (id: "_Climate_Control"))[]
    Si vous construisez un avion pour voler en haute altitude ou un hydravion pour les eaux froides, vous aurez besoin de chauffage. Si vous volez sous les tropiques ou dans le désert, il est important de rester au frais. Ces systèmes peuvent atténuer les effets du Stress dus au climat défavorable.

    #table(
      columns: 3,
      align: (left, left, left,),
      table.header([Nom], [Effets], [Coût]),
      [Chauffage Électrique],
      [-1 Charge.],
      [1þ],
      [Circuit de Radiateur],
      [Nécessite un Radiateur.],
      [1þ],
      [Ventilateur Basique],
      [(Déplacé dans la section Cockpit)],
      [\-],
      [Climatisation],
      [-2 Charges],
      [4þ],
    )

    === Pilotes Automatiques #html.elem("a", attrs: (id: "_Autopilots"))[]
    Les pilotes automatiques ont commencé à être utilisés dans la décennie suivant l'invention de l'avion, et certains disponibles dans Flying Circus sont plutôt fantaisistes.

    Ils vous simplifieront la vie.

    #table(
      columns: 4,
      align: (left, left, left, left,),
      table.header([Nom], [Effets], [Coût], [Ère]),
      [Gyroscopique],
      [Donne +4 aux jets de Siège Vide.],
      [3þ],
      [Première Guerre Mondiale],
      [Maintien d'Altitude],
      [+1 Masse, Permet d'ignorer la règle du Siège Vide.],
      [5þ],
      [Tempête Imminente],
      [Programmable à Remontoir],
      [+1 Masse. Peut recevoir un ordre simple unique comme monter, plonger, virer, voler vers un lieu. Ne peut pas faire de Dogfight, tirer avec des armes, larguer des bombes, ou atterrir.],
      [6þ],
      [Himmilgard],
      [Programmable],
      [+1 Masse, -2 Charges. Peut recevoir un ordre simple unique comme monter, plonger, virer, voler vers un lieu. Ne peut pas faire de Dogfight, tirer avec des armes, larguer des bombes, ou atterrir.],
      [6þ],
      [Seconde Guerre Mondiale],
      [Rattenhirn],
      [+3 Masse, -3 Charges, S'occupe du pilotage pour vous, étant entièrement automatisé. Les joueurs n'utilisent généralement pas ceux-ci, ils sont pour les avions-robots.],
      [25þ],
      [Himmilgard ou Dernier Hurrah],
    )

    === Systèmes de Contrôle #html.elem("a", attrs: (id: "_Control_Systems"))[]
    Normalement, vous contrôlez votre avion en tirant directement sur des câbles. Ceci vous permet de le faire mieux. Choisissez-en un. Voir Fatigue du Pilote pour les règles complètes.

    #table(
      columns: 4,
      align: (left, left, left, left,),
      table.header([Nom], [Effets], [Coût], [Ère]),
      [Tringles de Commande],
      [+1 Masse. La Fatigue Maximale de Vol due au MP est de 1.],
      [2þ],
      [Première Guerre Mondiale],
      [Assisté par Hydraulique],
      [+3 Masse, Élimine la Fatigue de Vol due au MP.],
      [5þ],
      [Seconde Guerre Mondiale],
      [Commandes Électriques (Fly-by-Wire)],
      [+3 Masse. Élimine toute Fatigue de Vol.],
      [10þ],
      [Dernier Hurrah],
    )

    == Hélice #html.elem("a", attrs: (id: "_Propeller"))[]
    Lorsque vous montez votre hélice, elle acquiert un Pas. Notez-le pour les calculs ultérieurs. Si vous utilisez des pulsoréacteurs, vous obtenez quand même des nombres, bien que vous n'ayez pas d'hélice.

    #table(
      columns: 5,
      align: (left, left, left, left, left,),
      table.header([Mod Hélice], [Mod Vitesse Pas], [Mod Boost Pas], [Énergie], [Virage]),
      [Haute Puissance],
      [.8],
      [0.9],
      [1.5],
      [8],
      [Puissance],
      [.9],
      [0.8],
      [2],
      [7],
      [Pas par Défaut],
      [1],
      [0.6],
      [3],
      [6],
      [Vitesse],
      [1.1],
      [0.4],
      [4],
      [5],
      [Haute Vitesse],
      [1.2],
      [0.3],
      [4.5],
      [4],
      [Pulsoréacteur],
      [1.3],
      [0.6],
      [5],
      [2.5],
    )

    Chacune de ces valeurs de pas représente une hélice unique, chaque hélice ayant un coût de 1þ. Votre première hélice par moteur est toujours gratuite et peut être construite comme vous le souhaitez.

    Vous pouvez améliorer votre hélice (sauf les pulsoréacteurs, ils n'ont pas de véritables hélices) à l'une des options suivantes à la place.

    #table(
      columns: 4,
      align: (left, left, left, left,),
      table.header([Nom], [Effets], [Coût par Hélice], [Ère]),
      [Variable Manuellement],
      [Permet d'ajuster le pas des pales au sol sans les remplacer.],
      [2þ],
      [Pionnier],
      [Variable Automatiquement],
      [+1 Masse. +0.1 Vitesse Pas, +0.1 Boost Pas, \+0.5 Énergie, +1 Virage.],
      [8þ],
      [Années Folles],
    )

    === Optimisation #html.elem("a", attrs: (id: "_Optimization"))[]
    Les optimisations sont faciles à abuser. Elles ne devraient être utilisées que pour représenter des décisions de conception spécifiques qui ne sont pas reflétées dans les statistiques d'un avion, ou pour que la réplique d'un avion réel se rapproche de ses statistiques réelles. Par exemple, le V-173 Flying Pancake est conçu pour échanger une traînée accrue contre une portance réduite.

    Les optimisations se produisent après tout le reste. À titre d'exemple, les optimisations de masse n'augmenteront ni ne diminueront la traînée du train d'atterrissage externe.

    Les modificateurs en pourcentage utilisent le nombre d'origine non modifié : ils ne sont pas cumulatifs. N'oubliez pas d'arrondir vers le bas.

    Équilibrez le tableau.

    Utilisez votre bon sens ici : plus cher est pire, plus de robustesse ou de tension maximale est mieux !

    #table(
      columns: 7,
      align: (left, left, left, left, left, left, left,),
      table.header(table.cell(colspan: 3, [Négatif]), [*Effet*;], table.cell(colspan: 3, [Positif])),
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [Dépense: \+/- 10% Coût],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [Efficacité de Portance: +/- 3 Pertes de Portance],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [Espace pour les Jambes: +/- 1 Évacuation, Visibilité],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [Masse: \+/- 10% Masse (n'inclut pas la masse des bombes)],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [Redondance: \+/- 25% Robustesse],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [Support: \+/- 15% Tension Maximale],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [Fiabilité: \+/- 2 Fiabilité],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [Profilage: \+/- 10% Traînée (n'inclut pas le carburant ni les bombes)],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
    )

    == Calculs Finaux #html.elem("a", attrs: (id: "_Final_Calculations"))[]
    *Procédure de Calcul*

    Calculez chacune de ces statistiques pour Carburant Plein avec Bombes (également fret, passagers, etc.), Carburant Plein, et Carburant Vide. Les versions Carburant à Moitié de ces statistiques sont la moyenne des nombres Plein et Vide, arrondis vers le bas.

    *Masse*

    Additionnez tous vos points de masse. Votre Pénalité de Masse (MP) est 1/5ème de cela (arrondis vers le bas), minimum 1.

    N'incluez pas la masse de votre Carburant ou de vos Bombes (ce sera votre Poids à Sec). Le MP Total inclut la masse de votre Carburant et de vos Bombes. Maintenez votre MP bas pour pouvoir monter plus facilement et manœuvrer.

    *Traînée*

    Ajoutez votre Pénalité de Masse (MP) directement à votre Traînée. Puis additionnez tous vos points de Traînée. Votre Pénalité de Traînée (DP) est 1/5ème de cela (arrondis vers le bas), minimum 1.

    Maintenez votre DP bas pour voyager plus rapidement.

    *Puissance, Boost, & Décrochage*

    La Vitesse Maximale de votre avion est déterminée par cette équation comparant votre puissance moteur totale à votre pénalité de traînée.

    Vitesse Maximale =~Vitesse Pas \* √((2000 \* Puissance) / (DP \* 9)))

    Arrondir vers le bas, comme d'habitude.

    Vous pouvez également utiliser pour calculer la valeur.

    Votre Boost est la Puissance de votre ou vos moteur(s) divisée par votre MP, arrondis vers le bas. Si vous obtenez 0, vous avez besoin de plus de puissance pour vaincre la friction au repos, alors prenez des moteurs plus gros ou perdez du poids.

    Votre Décrochage (Dropoff) est votre Vitesse Maximale finale multipliée par votre Mod Boost Pas.

    *Taux de Montée*

    Le taux de montée est (23 \* Puissance) / (MP Total \* Vitesse Pas \* DP), minimum 1.

    *Vitesse de Décrochage*

    Pour obtenir votre vitesse de décrochage, multipliez les Pertes de Portance par la Pénalité de Masse, et divisez par la Surface Ailaire.

    *Stabilité*

    Il suffit d'additionner vos deux Stabilités pour obtenir votre valeur. Cependant, si vos deux Stabilités sont positives, ajoutez un +2 Stabilité supplémentaire, et faites l'inverse si elles sont toutes deux négatives. Les avions doivent être un peu instables pour voler, mais trop instables et ils ne volent pas vraiment.

    Votre Stabilité crée un modificateur de Contrôle comme suit.

    #table(
      columns: 10,
      align: (left, left, left, left, left, left, left, left, left, left,),
      table.header([Stabilité], [-10], [-7 à -9], [-4 à -6], [-1 à \-3], [0], [+1 à +3], [+4 à +6], [+7 à +9], [+10]),
      [Mod Contrôle],
      [+4],
      [+3],
      [+2],
      [+1],
      [0],
      [-1],
      [-2],
      [-3],
      [-4],
    )

    Un avion avec une stabilité supérieure à 10 ou inférieure à -10 est impilotable par des êtres humains.

    *Maniabilité*

    Maniabilité = 100 + Contrôle - Pénalité de Masse

    *Perte d'Énergie vs Pertes en Virage*

    Ces deux statistiques représentent la quantité de vitesse que vous perdez lorsque vous tirez sur le manche, et la quantité de vitesse que vous perdez dans un virage de combat. Elles sont affectées par vos statistiques Énergie et Virage provenant du pas de votre hélice. Les pulsoréacteurs sont dans le même tableau bien qu'ils n'utilisent pas réellement d'hélices.

    Vos Pertes en Virage sont

    Vitesse de Décrochage (Carburant à Moitié, Sans Bombes) Divisée par Pas Hélice Virage.

    Pour des raisons d'équilibre, arrondissez au supérieur, minimum 1.

    Vos Pertes en Virage seront +1 lorsque vous transportez des bombes, des fusées, du fret ou des passagers.

    Votre Perte d'Énergie est

    Pénalité de Traînée (Sans Bombes) Divisée par Pas Hélice Énergie

    Pour des raisons d'équilibre, arrondissez au supérieur, minimum 1, maximum 10.

    *Fatigue du Pilote*

    Le Stress par vol par défaut est de 1. Vous gagnez +1 Stress pour chacun des facteurs qui est vrai.

    - Une Stabilité supérieure à 3 ou inférieure à -3.
    - Chaque tranche de 10MP.
    - Par point de Rumble (maximum 3).
    - Un moteur rotatif tracteur + un cockpit exposé.

    Les co-pilotes peuvent réduire le stress de tout sauf le Rumble et les moteurs rotatifs.

    Si vous avez des Tringles de Commande, le Stress Maximal de Vol dû à la Pénalité de Masse est de 1.

    Si vous avez des commandes assistées par hydraulique, vous ne subissez pas de Stress de Vol dû à la Masse de l'avion.

    Les commandes Électriques (Fly-by-Wire) éliminent toute Fatigue de Vol, sauf si les moteurs rotatifs vous aspergent d'huile au visage. Ne vous endormez pas dans votre mobile ennuyeux.

    *Entretien*

    Cette statistique est la Puissance Moteur divisée par 10, ou le coût total de tous les moteurs, selon la valeur la plus basse. À cette fin, les générateurs comptent comme des moteurs, et utilisent la puissance avant réduction (c'est-à-dire : moteurs Poussé-Tiré).

    *Tension Maximale, et Robustesse*

    Votre Structure totale est juste votre Structure. Aucune modification n'est nécessaire.

    Soustrayez votre MP de votre Tension Maximale à la fin. Votre Tension Maximale est toujours limitée par votre Structure totale.

    Votre Robustesse est Structure/5 + Blindage.

    *Composants Vitaux*

    Déterminez la liste des Composants Vitaux comme suit.

    Tous les avions ont le Composant Vital Commandes.

    Tous les avions ont un composant vital pour leur train d'atterrissage, quel qu'il soit.

    Chaque Système d'Armes de l'avion est un Composant Vital.

    Si l'avion a des systèmes électriques, ils forment tous un seul Composant Vital appelé Électricité.

    Si l'avion a des réservoirs de carburant, ils forment collectivement un Composant Vital.

    - Chaque Moteur est un Composant Vital.
    - Chaque Radiateur est un Composant Vital.
    - Chaque Réservoir d'Huile est un Composant Vital.
    - Chaque Refroidisseur d'Huile est un Composant Vital.
    - Chaque Carter d'Huile est un Composant Vital.

    #table(
      columns: 1,
      align: (left,),
      table.header([Avion Double]),
      [Une manière simple et peu coûteuse de fabriquer un chasseur lourd est de coller deux chasseurs légers ensemble. Additionnez simplement toutes leurs statistiques et recalculez. Vous pouvez choisir de retirer l'autre cockpit pour économiser 1 masse, mais sinon, les deux fonctionnent.

        L'avion résultant peut ensuite être modifié séparément. Techniquement, vous pourriez faire un avion triple ou plus de cette manière aussi ! Mais alors cela commence à devenir un peu absurde.

      ],
    )

    == Ingénierie Maison #html.elem("a", attrs: (id: "_Home_Engineering"))[]
    Autant ce système essaie d'être totalement complet, il ne peut pas toujours l'être. Parfois, vous voulez aller au-delà des limites du système, ou vous pensez que votre personnage peut faire quelque chose d'intelligent. C'est là qu'intervient l'Ingénierie Maison.

    === Modification Imprudente #html.elem("a", attrs: (id: "_Unwise_Modification"))[]
    Allez voir votre MJ et dites : "J'ai une idée de quelque chose que je veux faire à mon avion." Exposez les mécanismes de la manière dont vous envisagez cela.

    Si cette modification ne brise pas totalement le système, le MJ vous facturera alors un prix juste en Thaler, traînée, masse, etc. Il devrait toujours se tromper sur le côté moins cher.

    La modification a l'effet que vous souhaitez, mais il y a un prix à payer. Le MJ peut ajouter un nouveau Coup Dur qu'il peut utiliser contre vous, comme suit.

    Leur modification spéciale échoue de manière spectaculaire et horrible.

    Ils ne sont jamais _obligés_ de l'utiliser. Cela pourrait ne jamais arriver. Mais c'est là.

    Menacant.

    == Avions d'Occasion #html.elem("a", attrs: (id: "_Used_Planes"))[]
    La plupart des avions que les joueurs achètent ou récupèrent sont d'Occasion. Les avions d'Occasion coûtent la moitié du prix affiché en thaler (arrondis vers le bas), mais ont l'un des inconvénients suivants. Après l'avoir acheté, lancez 1d10 pour savoir ce qui ne va pas avec ! Si une règle vous donne plusieurs pénalités d'occasion, elles ne peuvent pas être les mêmes.

    #table(
      columns: 3,
      align: (left, left, left,),
      table.header([d10], [Nom], [Pénalité]),
      [1],
      [Épave],
      [Lancez à nouveau, deux fois ! Si vous obtenez cela à nouveau, ignorez-le.],
      [2],
      [Épuisé],
      [Les moteurs sont à -1 Fiabilité],
      [3],
      [Délabré],
      [Réduisez votre Vitesse Maximale de 10%],
      [4],
      [Lourd],
      [Augmentez votre Vitesse de Décrochage de 20%],
      [5],
      [Canons Grippés],
      [Augmentez le risque d'enrayage des canons de 1],
      [6],
      [Faible],
      [Coupez la Robustesse de l'avion en deux],
      [7],
      [Fragile],
      [Réduisez la Tension Maximale de 20%],
      [8],
      [Fuyard],
      [Réduisez votre Carburant de 20%],
      [9],
      [Lent],
      [Réduisez votre Maniabilité de 5],
      [10],
      [Neuf],
      [Pas de pénalité],
    )

    Il coûte 5 thaler pour restaurer un avion d'Occasion et supprimer l'inconvénient, et vous devez effectuer au moins une mission avant qu'il ne puisse être réparé. Chaque vol ultérieur réduit le coût de 1 : vous le réparez gratuitement après six vols.

    == Effets de l'Altitude #html.elem("a", attrs: (id: "_Altitude_Rules"))[]
    La plupart des campagnes n'interagiront pas vraiment avec les règles d'altitude en détail, donc le livre de règles recommande de les ignorer si elles ne sont pas essentielles. Si vous utilisez les règles d'altitude, cette section montre les effets sur votre avion. À mesure que vous montez en altitude, l'air devient plus rare. La traînée, la portance et l'autorité de contrôle sont réduites, et les moteurs ont du mal à obtenir suffisamment d'oxygène. Les règles pour calculer cela se trouvent à la page 56 du livre de règles de base.

    Votre Facteur d'Altitude (AF) est comme le Facteur de Vitesse ; la dizaine sur votre jauge. Les performances de votre avion changent avec le Facteur d'Altitude. La Vitesse de Décrochage augmente avec l'altitude, et votre moteur ne fonctionne à sa performance maximale qu'à l'intérieur de votre Plage d'Altitude Idéale (PAI).
  ]
]