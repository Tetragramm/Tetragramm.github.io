#html.elem(
  "html",
)[
  #html.elem("head")[
    #html.elem("meta", attrs: (charset: "utf-8"))[]
    #html.elem("meta", attrs: (name: "viewport", content: "width=device-width, initial-scale=1"))[]
    #html.elem("title")[Regeln für den Flugzeug-Konstrukteur von Flying Circus]
    #html.elem("link", attrs: (rel: "shortcut icon", type: "image/x-icon", href: "../favicon.ico"))
    #html.elem("link", attrs: (rel: "stylesheet", type: "text/css", href: "../page/style.css"))[]
  ]
  #html.elem(
    "body",
  )[
    #html.elem("h1")[Regeln für den Flugzeug-Konstrukteur]
    Dies sind die Regeln, die du verwenden wirst, um Flugzeuge zu erstellen. Dies ist ein umfangreiches und komplexes
    Projekt, aber du schaffst es!

    = Flugzeug-Konstruktionswerte
    #label("_Flugzeug-Konstruktionswerte")
    Hier ist eine Liste der Werte, die beim Bau von Flugzeugen wichtig sind.

    Input-Werte

    - Masse: Masse ist, wie viel etwas wiegt. Eine geringe Masse zu halten, hat Priorität, aber Motoren werden viel größer, je
      leistungsfähiger sie werden, daher wird dies mit der Zeit immer weniger wichtig.
    - Luftwiderstand: Luftwiderstand ist, wie viel Oberfläche dem Luftstrom ausgesetzt ist und das Flugzeug verlangsamt.
      Weniger ist besser.
    - Struktur: Wird verwendet, um die allgemeine Robustheit eines Flugzeugs zu bestimmen. Struktur wird als Obergrenze für
      Maximale Belastung verwendet und steht schließlich in Beziehung zum Wert Zähigkeit. Mehr ist besser.
    - Stabilität: Wird verwendet, um die Stabilität des Flugzeugs im Flug zu bestimmen. Sie ist in zwei Werte unterteilt, die
      am Ende synthetisiert werden, um den endgültigen Stabilitätswert zu bilden. Weniger oder mehr hängt davon ab, was das
      Flugzeug tun soll.
      - Seitenstabilität: Kombiniert Gier- und Rollstabilität. Meist niedriger, besonders bei Flugzeugen mit hohem Drehmoment.
      - Längsstabilität: Meist der höhere der beiden Werte, dieser Wert lässt sich leichter ändern.
    - Steuerung: Wie viel Kontrolle das Flugzeug hat. Mehr ist besser.
    - Kosten: Wie viel alles kostet. Mehr kostet mehr.
    - Sektionen: Wie physisch groß der Rumpf des Flugzeugs ist. Mehr bedeutet ein größeres, schwereres Flugzeug.
    - Flügelfläche: Wie groß ein Flügel ist. Eine größere Fläche induziert mehr Luftwiderstand, hebt aber auch schwerere
      Flugzeuge.
    - Spannweite: Wie lang ein Flügel ist. Länger ist effizienter für den Luftwiderstand und stabiler, aber fragiler und
      verringert die Steuerung.
    - Lift Bleed: Wie effizient die Flügel sind. Weniger ist besser.
    - Leistung: Wie viel Kraft der Motor hat.

    Output-Werte

    - Höchstgeschwindigkeit: Wie schnell das Flugzeug fliegt.
    - Boost: Wie schnell das Flugzeug beschleunigt.
    - Dropoff: Der Geschwindigkeitspunkt, an dem dein Motor mehr oder weniger effizient ist.
    - Abrissgeschwindigkeit: Wie langsam das Flugzeug fliegen kann, bevor es vom Himmel fällt.
    - Wendigkeit: Wie gut das Flugzeug steuert.
    - Strukturelle Integrität: Wie robust das Flugzeug ist. Im Grunde LP. Unterteilt in zwei Werte.
    - Maximale Belastung: Wie viele G-Kräfte das Flugzeug aushalten kann.
    - Zähigkeit: Überschüssige Gesundheit.
    - Sicht: Wie schwer es ist, aus dem Flugzeug zu sehen.
    - Stabilität: Wie gut das Flugzeug nicht versehentlich umkippt.
    - Treibstoffkapazität: Wie viel Treibstoff das Flugzeug mitführt.
    - Stress pro Flug: Wie anstrengend es ist, das Flugzeug längere Zeit zu fliegen.

    Sicherheitswerte

    - Aufprallsicherheit: Wie sicher eine Bruchlandung ist.
    - Flucht: Wie einfach es ist, sich schnell zu retten.
    - Wartung: Wie viel das Flugzeug pro Routine kostet (nur im Standardspiel).

    == Grundlagen #html.elem("a", attrs: (id: "_Basics"))[]
    Flugzeuge werden aus Komponenten gebaut. Wir werden sie nacheinander in der folgenden Reihenfolge bauen.
    - #html.elem("a", attrs: (href: "#_Era"))[Ära]: Aus welcher Zeit stammt das Flugzeug?
    - #html.elem("a", attrs: (href: "#_Crew"))[Besatzung]: Festlegen, wer sich im Flugzeug befindet, und Passagiere.
    - #html.elem("a", attrs: (href: "#_Engines"))[Motoren]: Festlegen, wie das Flugzeug angetrieben und wie es gekühlt wird.
    - #html.elem("a", attrs: (href: "#_Frame_and_Covering"))[Struktur und Bespannung]: Eine tatsächliche Struktur um alles
      herum bauen.
    - #html.elem("a", attrs: (href: "#_Wings"))[Tragflächen]: Damit es fliegt.
    - #html.elem("a", attrs: (href: "#_Stabilizers"))[Stabilisatoren]: Das Flugzeug stabil halten.
    - #html.elem("a", attrs: (href: "#_Control_Surfaces"))[Steuerflächen]: Das Flugzeug steuern.
    - #html.elem("a", attrs: (href: "#_Reinforcement"))[Verstärkung]: Sicherstellen, dass das Flugzeug zusammenhält.
    - #html.elem("a", attrs: (href: "#_Weapons"))[Waffen]: Womit das Flugzeug bewaffnet ist.
    - #html.elem("a", attrs: (href: "#_Load"))[Zuladung]: Treibstoff, Bomben und Fracht.
    - #html.elem("a", attrs: (href: "#_Landing_Gear"))[Fahrwerk]: Wo das Flugzeug auf die Erde trifft.
    - #html.elem("a", attrs: (href: "#_Upgrades"))[Zubehör]: Upgrades, um das Flugzeug zu verbessern.
    - #html.elem("a", attrs: (href: "#_Propeller"))[Propeller]: Welche Art von Propeller am Flugzeug angebracht wird.
    - #html.elem("a", attrs: (href: "#_Optimization"))[Optimierungen]: Das Flugzeug feinabstimmen.
    - #html.elem("a", attrs: (href: "#_Final_Calculations"))[Endgültige Werte]: Alles zu einem Profil zusammenfügen, das du im
      Spiel verwenden kannst.
    - #html.elem("a", attrs: (href: "#_Used_Planes"))[Gebrauchte Flugzeuge]: Regeln für den Kauf gebrauchter Flugzeuge.
    - #html.elem("a", attrs: (href: "#_Altitude_Rules"))[Höheneffekte]: Was passiert, wenn du wirklich hoch fliegst?

    Dein Flugzeug benötigt im Allgemeinen mindestens einen Piloten, einen Motor und einige Tragflächen. Ohne Tragflächen ist
    es ein Auto. Ohne Motor ist es ein Segelflugzeug. Ohne Piloten ist es eine Rakete.

    Denke beim Bau des Flugzeugs daran, dass Flugzeuge keinen negativen Luftwiderstand oder negative Masse haben können;
    wenn du es schaffst, ein solches zu bauen, hast du immer mindestens 1 MP und 1 Luftwiderstand.

    == Ära #html.elem("a", attrs: (id: "_Era"))
    Deine Ära bestimmt zu Beginn einige Faktoren deines Flugzeugs. Das reguläre Flying Circus ist im Allgemeinen aus der Ära
    Erster Weltkrieg. Wenn du ein echtes Flugzeug nachbildest, sei ein wenig streng mit den Ären; eine Spitfire FR.XIV ist
    technisch aus dem Jahr 1944 und ein Flugzeug der Ära Letztes Hurra, aber der Motor ist aus dem Zweiten Weltkrieg und die
    Aerodynamik größtenteils aus der Ära Heraufziehender Sturm.

    #table(
      columns: 7,
      align: (left, left, left, left, left, left, left,),
      table.header(
        [Ära],
        [Jahre],
        [Lift Bleed],
        [Maximale Bombenzuladung],
        [Bonus für Kragträger],
        [Kostenanpassung],
        [Modifikator für Längsstabilität],
      ),
      [Pionier],
      [1903-1914],
      [30],
      [1/6 Struktur],
      [+4],
      [-2þ],
      [+0],
      [Erster Weltkrieg],
      [1915-1919],
      [25],
      [1/5 Struktur],
      [+3],
      [0þ],
      [+0],
      [Goldene Zwanziger],
      [1920-1929],
      [23],
      [1/4 Struktur],
      [+1],
      [+5þ],
      [+0],
      [Heraufziehender Sturm],
      [1930-1938],
      [22],
      [1/3 Struktur],
      [0],
      [+10þ],
      [+2],
      [Zweiter Weltkrieg],
      [1939-1943],
      [20],
      [1/3 Struktur],
      [0],
      [+15þ],
      [+2],
      [Letztes Hurra],
      [1944+],
      [18],
      [1/2 Struktur],
      [0],
      [+20þ],
      [+2],
    )

    Komponenten des Flugzeugs sind mit einer Ära verbunden, in der sie erstmals weit verbreitet waren. Für Himmilgard ist
    diese Ära der Erste Weltkrieg. Dies ist keine harte und schnelle Regel, Flugzeuge verfügen oft über Merkmale, die ihrer
    Zeit voraus sind, und bei der Nachbildung eines echten Flugzeugs verwende einfach die Merkmale, die es tatsächlich
    besaß. Bei kundenspezifischen Designs ist es für die meisten Charaktere am besten, innerhalb der Ärenbeschränkungen zu
    bleiben, vielleicht mit einer Ausnahme. Studenten können mit ihren hochmodernen Designs zwei Komponenten oder eine
    Komponente zwei Ären im Voraus haben. Wie immer, besprich dies mit dem Spielleiter und dem Rest der Gruppe.

    == Besatzung #html.elem("a", attrs: (id: "_Crew"))[]
    Jedes Mitglied der Besatzung, einschließlich des Piloten, sitzt innerhalb der Struktur des Flugzeugs.

    === Cockpits #html.elem("a", attrs: (id: "_Cockpits"))[]
    Lege zunächst unten fest, wie das Cockpit für jede Besatzungsposition konstruiert ist, indem du eine Option auswählst.

    Sicht-, Flugstress- und Fluchtmodifikatoren gelten individuell für jede Besatzungsposition.

    #table(
      columns: 5,
      align: (left, left, left, left, left,),
      table.header([Typ], [Beschreibung], [Effekte], [Kosten], [Ära]),
      [Offen],
      [Der Pilot ist vollständig der Luft ausgesetzt.],
      [+1 Masse, +3 Luftwiderstand, \+2 Flucht, +1 Sicht],
      [\-],
      [Pionier],
      [Windschutzscheibe],
      [Eine Glasscheibe vor dem Piloten.],
      [+2 Masse, \+1 Luftwiderstand. +2 Flucht, +1 Sicht],
      [1þ],
      [Pionier],
      [Versiegelt],
      [Es gibt kein Fenster oder keine externe Sicht.],
      [+2 Masse, -3 Flucht, -1 Flugstress. Dieses Besatzungsmitglied kann nicht nach draußen sehen.],
      [1þ],
      [Pionier],
      [Schmale Kanzel],
      [Eine Struktur mit kleinen Fenstern.],
      [+3 Masse, -1 Sicht. -1 Flugstress.],
      [3þ],
      [Erster Weltkrieg],
      [Blasenkanzel],
      [Ein Cockpit aus gebogenem Glas.],
      [+3 Masse, -3 Luftwiderstand, -1 Flugstress],
      [8þ],
      [Zweiter Weltkrieg],
    )

    Zu jedem Cockpit kannst du die folgenden Upgrades hinzufügen.

    #table(
      columns: 4,
      align: (left, left, left, left,),
      table.header([Upgrade], [Beschreibung], [Kosten], [Ära]),
      [Copiloten-Steuerung],
      [Ermöglicht diesem Sitz, das Flugzeug ebenfalls zu steuern. \-2 Flugstress für Piloten.],
      [1þ],
      [Pionier],
      [Notluke],
      [+1 Masse, +3 Flucht],
      [2þ],
      [Pionier],
      [Schleudersitz],
      [+2 Masse, +5 Flucht],
      [4þ],
      [Letztes Hurra],
      [Verbindbarkeit],
      [Verbindet dieses Cockpit mit jedem anderen Cockpit mit demselben Upgrade. +1 Masse.],
      [\-],
      [Pionier],
      [Sauerstoffmaske],
      [Der Pilot ignoriert die Auswirkungen großer Höhe und negiert bis zu 2 G-Malus. Erfordert 1 Ladung kontinuierlich.],
      [2þ],
      [Erster Weltkrieg],
      [Isoliert],
      [Ein Korb oder Kasten, der ungewöhnliche Montagen (wie vor einem Propeller) ermöglicht und das übliche System vollständig
        ignoriert. +5 Luftwiderstand, +1 Masse, +2 Sicht, -2 Flucht, +1 Flugstress.

        Erleide doppelten Schaden, wenn du Go Down würfelst.],
      [1þ],
      [Pionier],
    )

    Diese Cockpit-Optionen können je nach Besatzungsbereich unterschiedliche Ideen darstellen. Die Schmale Kanzel stellt die
    Glasflächen des B-17-Cockpits dar, und Offen das in die Wand geschnittene Loch für den Heckschützen, zum Beispiel.

    === Sicherheit #html.elem("a", attrs: (id: "_Safety"))[]
    Versuche nicht zu sterben! Du musst diese Upgrades pro Cockpit kaufen.

    #table(
      columns: 4,
      align: (left, left, left, left,),
      table.header([Typ], [Effekte], [Kosten], [Ära]),
      [Polsterung],
      [Negiere 1 Schaden für diese Position, wenn du Go Down würfelst.],
      [1þ],
      [Pionier],
      [Gurt],
      [Negiere 1 Schaden für diese Position, wenn du Go Down würfelst, -1 Flucht.],
      [1þ],
      [Pionier],
      [Schnellentriegelungssystem],
      [+2 auf Flucht.],
      [1þ],
      [Heraufziehender Sturm],
      [Überrollbügel],
      [+2 Masse. Negiere 1 Schaden für diese Position, wenn du Go Down würfelst.],
      [\-],
      [Erster Weltkrieg],
      [Leuchtpatronen-Schacht],
      [Ermöglicht das Abfeuern von Leuchtpatronen aus einem geschlossenen Cockpit, ohne das Cockpit öffnen zu müssen.],
      [1þ],
      [Goldene Zwanziger],
      [Einfacher Ventilator],
      [Erfordert das Vitalteil Elektrik.],
      [\-],
      [Pionier],
    )

    === Zielvisiere #html.elem("a", attrs: (id: "_Gunsights"))[]
    Diese können dir beim Zielen helfen! Standardmäßig gehen wir davon aus, dass ein Flugzeug kaum mehr als einfache
    Ringvisiere hat. Diese Zielvisiere können dir helfen, besser zu zielen. Du kannst jedoch nur eines gleichzeitig
    verwenden.

    Jedes Zielvisier, das du in dein Cockpit einbaust, gibt -1 Sicht, also sei sparsam!

    #table(
      columns: 4,
      align: (left, left, left, left,),
      table.header([Typ], [Effekte], [Kosten], [Ära]),
      [X1 Kollimiertes Zielvisier],
      [+1 auf Open Fire.],
      [2þ],
      [Erster Weltkrieg],
      [Teleskop-Zielvisier],
      [+2 auf Open Fire, wenn du angepeilt hast.],
      [3þ],
      [Erster Weltkrieg],
      [Beleuchtetes Reflexvisier],
      [+2 auf Open Fire. Deaktiviert, wenn das Vitalteil Elektrik getroffen wird.],
      [6þ],
      [Erster Weltkrieg],
      [Gyro-Zielvisier],
      [+2 auf Open Fire und zusätzlich +2, wenn du angepeilt hast. Deaktiviert, wenn das Vitalteil Elektrik getroffen wird.],
      [12þ],
      [Zweiter Weltkrieg],
    )

    === Bombenzielgeräte #html.elem("a", attrs: (id: "_Bombsights"))[]
    Bombenzielgeräte helfen, Bomben ins Ziel zu bringen!

    Ein Bombenzielgerät kostet 2 Thaler für ein Modell der Grundqualität 4 und dann +1 Thaler für jede weitere 3 Qualität.

    === Passagierkapazität #html.elem("a", attrs: (id: "_Passenger_Capacity"))[]
    Kapazität für 5 Passagiere benötigt 2 Rumpfsektionen, die für nichts anderes verwendet werden können. Snacks im Flug
    müssen separat gekauft werden. Der Passagierbereich wird kollektiv als Besatzungsposition behandelt und kann daher mit
    den Besatzungspositionen durch ein Verbindbarkeit-Upgrade verbunden werden.

    Ein Bett, eine Trage oder Erste-Klasse-Unterkünfte belegen 2 Passagiersitze.

    Jeder Passagier an Bord eines Flugzeugs (eine Person an oder im Flugzeug, die keine seiner Funktionen bedient) fügt 1
    Bombenmasse hinzu. Wie bei anderen Zuladungsarten runden wir dies auf die nächste MP auf.

    Passagierplätze können als Frachtraum genutzt werden, wobei jeder Passagiersitz oder jede Trage 1 Fracht aufnehmen kann.
    Dies soll die durch Sitze etc. verursachten Platzbeschränkungen darstellen.

    == Motoren #html.elem("a", attrs: (id: "_Engines"))[]
    Motoren gibt es in zwei allgemeinen Typen: Schubmotoren und Zugmotoren. Zugmotoren haben den Propeller vor dem Flugzeug,
    der es zieht, während Schubmotoren ihn hinter dem Flugzeug haben, der es wegschiebt.

    === Motor auswählen
    #label("_Choosing your Engine")
    Dein Motor kann aus der Liste der vorgefertigten Motoren, die zum Setting passen, ausgewählt oder andernfalls im
    Motoren-Konstrukteur erstellt werden.

    Im Allgemeinen sind luftgekühlte Motoren leichter, aber weniger leistungsfähig, während wassergekühlte Motoren schwerer,
    aber leistungsfähiger sind.

    === Motor montieren
    #label("_Mounting your Engine")
    Motoren können auf verschiedene Arten montiert werden.

    Ein hinten montierter Schubpropeller stellt einen Motor dar, der am hinteren Ende des Flugzeugkörpers montiert ist, wie
    die Schubmotoren einer Kyushu J7W. Ein mittig montierter Schubmotor stellt einen Schubmotor dar, der immer noch ein Heck
    hat, wobei eine verlängerte Antriebswelle oder ein Farman-Heck verwendet wird, um ein Ungleichgewicht zu vermeiden.

    Die Sicht ist die schlechteste aller Motorhalterungen. Eine Schubpropeller-Montage hilft dir nicht besonders gut, um
    einen Gondel-montierten Motor herum zu sehen.

    *Rumpf-Motorhalterungen*

    Rumpf-Motorhalterungen erfordern für jeden Motor eine Struktursektion.

    #table(
      columns: 2,
      align: (left, left,),
      table.header([Typ], [Beschreibung]),
      [Zugpropeller],
      [Normal.

        Vorwärts feuernde feste Waffen benötigen Synchronisationsgetriebe/Spinner-Halterungen. Türme können nicht nach vorne
        feuern. ],
      [Mittig montierter Zugpropeller],
      [-2 Längsstabilität, +1 Sicht.

        Vorwärts feuernde feste Waffen benötigen Synchronisationsgetriebe. Erfordert eine verlängerte Antriebswelle.

        Mit dem freien Platz an der Flugzeugfront kannst du eine einzelne Waffe montieren, die durch den Spinner feuert.

        (Stellt P-39-ähnliche Motorhalterungen dar.) ],
      [Hinten montierter Schubpropeller],
      [-4 Längsstabilität, +2 Sicht, -2 Flucht.

        Rückwärts feuernde feste Waffen benötigen Synchronisationsgetriebe/Spinner-Halterungen. Türme können nicht nach hinten
        feuern.

        (stellt am Heck montierte Motoren dar) ],
      [Mittig montierter Schubpropeller],
      [-2 Längsstabilität. +2 Sicht, -2 Flucht.

        Erfordert verlängerte Antriebswelle, Farman-Heck, Pfeilflügel mit Rudern oder Heckausleger.

        Rückwärts feuernde feste Waffen benötigen Synchronisationsgetriebe/Spinner-Halterungen. Türme können nicht nach hinten
        feuern.

        (stellt in der Flugzeugmitte montierte Motoren dar, à la DH2) ],
      [Gondel],
      [+5 Luftwiderstand und -2 Sicht. Hält den Motor von allem anderen fern.],
    )

    *Flügel-Motorhalterungen*

    #table(
      columns: 2,
      align: (left, left,),
      table.header([Typ], [Beschreibung]),
      [Motorgondel (Innen)],
      [Reduziert Maximale Belastung um die Hälfte der Motormasse. +1 Lift Bleed.],
      [Motorgondel (Versetzt)],
      [Fügt Luftwiderstand in Höhe der Motormasse hinzu.],
      [Kanal-Zugpropeller],
      [-1 Lift Bleed. Reduziert Maximale Belastung in Höhe der Motormasse.],
    )

    Wenn du möchtest, kannst du ein Flugzeug asymmetrisch bauen, mit verschiedenen Motortypen auf jeder Seite eines Flügels
    oder einem einzelnen großen Motor an einem Flügel. In diesen Fällen erleide -3 Seitenstabilität.

    === Motordrehmoment und Umlaufmotoren
    #label("_Engine Torque and Rotaries")
    Motoren haben Drehmoment, das direkt von ihrer Seitenstabilität abgezogen wird, wenn sie Rumpfhalterungen verwenden.
    Flügel- und Gondelhalterungen minimieren den Stabilitätseffekt des Drehmoments, ignoriere es also dort.

    Umlaufmotoren sind normalerweise die einzigen Motoren, bei denen du dir in frühen Flugzeugen darüber Gedanken machen
    musst, da sie eine riesige Metallmasse sind, die sich mit hoher Geschwindigkeit dreht.

    Flügelmontierte Umlaufmotoren reduzieren deine Belastung um das Drehmoment (verwende alle Motoren), was die Kraft gegen
    den Flügel darstellt. In einer Schub-Zug-Konfiguration kannst du stattdessen wählen, die Struktur zu reduzieren.

    Rumpf-Schub-Zug-Motoren können auch wählen, die Struktur zu reduzieren; in diesem Fall negiert dies den
    Stabilitätseffekt des Drehmoments und entfernt den Umlaufmotor-Bonus auf Dogfighting.

    Gegenläufige Motoren sind ein spezieller Motortyp, der das Drehmoment des Motors halbiert. Sie müssen mit einem
    untersetzten Propeller gepaart werden, um zu funktionieren.

    === Schub-Zug-Konfiguration
    #label("_Push-Pull Configuration")
    Eine Schub-Zug-Konfiguration ermöglicht die Montage zweier Motoren entlang derselben Linie. Dies erfordert, dass
    dasselbe Motormodell für beide verwendet wird.

    In jeder Schub-Zug-Konfiguration verwende nur den Luftwiderstand eines Motors und wende die folgenden Modifikatoren an.

    *Schub-Zug-Konfigurationen*

    #table(
      columns: 2,
      align: (left, left,),
      table.header([Typ], [Beschreibung]),
      [Zugpropeller + Schubpropeller/Rückwärts],
      [90% Motorleistung. Die -2 Längsstabilität und -2 Flucht durch den Schubpropeller. Die Motorverkleidung kostet +2 für den
        Schubpropeller wie normal.],
      [Motorgondel/Motorgondel],
      [80% Motorleistung. Wende den Motorgondel-Malus nur für einen Motor an.],
      [Tandem-Gondel],
      [90% Motorleistung. Wende den +5 Luftwiderstands-Malus nur einmal an.],
    )

    == Motor-Upgrades #html.elem("a", attrs: (id: "_Engine_Upgrades"))[]
    === Verlängerte Antriebswellen
    #label("_Extended Driveshafts")
    Eine verlängerte Antriebswelle bedeutet im Grunde, dass, während der Motor in der Mitte des Flugzeugs montiert ist, der
    Propeller dennoch an beiden Enden sein kann, da die Stange, die beide verbindet, länger als üblich ist und durch die
    Länge des Flugzeugs verläuft.

    Verlängerte Antriebswellen fügen +1 Masse hinzu.

    Dies kann aus verschiedenen Gründen geschehen. Bei Zugpropeller-Flugzeugen kann dies die interne Montage einer
    Artilleriewaffe ermöglichen, die durch den Propeller feuert, ohne das Synchronisationsgetriebe zu verwenden, indem der
    Lauf direkt durch den Propeller-Spinner geführt wird. Zum Beispiel eine Waffe, die vor dem Motor in einem dedizierten
    Raum montiert ist, wie die 37mm Maschinenkanone in der Nase der P-39 Airacobra.

    Bei einem mittig montierten Schubpropeller-Flugzeug eliminiert eine verlängerte Antriebswelle die Notwendigkeit eines
    Farman-Hecks. Du kannst einfach ein konventionelles Heck um den Motor herum montieren, ohne Probleme. Ebenso kann ein
    mittig montierter Zugpropeller mit Canards (d.h. das Heck befindet sich vor dem Flugzeug) die verlängerte Antriebswelle
    verwenden, um das Farman-Heck zu vermeiden.

    === Außenbordpropeller
    #label("_Outboard Propellers")
    Außenbordpropeller sind, wenn ein Satz von Riemen, Zahnrädern und Riemenscheiben verwendet wird, um den Propeller (oder
    die Propeller) seitlich vom Motor und Rumpf zu versetzen. Dies erfordert das Upgrade auf die verlängerte Antriebswelle
    und zieht Kosten von +3 Luftwiderstand und -2 Zuverlässigkeit nach sich. Als Vorteil benötigen Rumpf-montierte Waffen
    keine Synchronisation mehr, da die Propeller aus dem Weg sind.

    Dieses Upgrade kann auf Zugpropeller, mittig montierte Zugpropeller und Schub-Zug-Motoren angewendet werden. Im Falle
    eines Schub-Zug-Motors ist es der hintere Motor, der die Außenbordpropeller antreibt, und daher müssen vorwärts feuernde
    Waffen weiterhin synchronisiert werden, aber es gibt keinen -2 Malus auf Flucht.

    === Untersetzter Propeller
    #label("_Geared Propeller")
    Dieses Upgrade kann auf jeden Motor angewendet werden. Es kostet +1þ für jede Iteration. Verfügbar in der Ära Erster
    Weltkrieg.

    Dies erhöht die Übergeschwindigkeit des Motors um +50% und gibt -1 Zuverlässigkeit. Du kannst dies so oft hinzufügen,
    wie du möchtest.

    Du kannst zusätzliche 1þ bezahlen, um den Zuverlässigkeits-Malus nur durch den untersetzten Propeller zu negieren, im
    Verhältnis 1:1. Verfügbar in der Ära Goldene Zwanziger.

    *Hinweis:* Obwohl du technisch gesehen einen Umlaufmotor untersetzen kannst (und es einige historische Beispiele gibt),
    ist dies eine Abscheulichkeit gegen die Ingenieurskunst, und du solltest es dir zweimal oder ein Dutzend Mal überlegen,
    bevor du es tust.

    === Motorverkleidung #html.elem("a", attrs: (id: "_Cowling"))[]
    Motorverkleidung kann auf jeden luftgekühlten Motor angewendet werden.

    #table(
      columns: 5,
      align: (left, left, left, left, left,),
      table.header([Typ], [Beschreibung], [Motortypen], [Kosten], [Ära]),
      [Einfache Motorverkleidung],
      [80% Motor-Luftwiderstand, +1 Masse.],
      [Luftgekühlt],
      [1þ],
      [Pionier],
      [Einfache Motorverkleidung für Umlaufmotor],
      [40% Motor-Luftwiderstand. +1 Masse.],
      [Umlaufmotor],
      [1þ],
      [Pionier],
      [Geschlossene Motorverkleidung],
      [30% Motor-Luftwiderstand. -1 Zuverlässigkeit, +1 Masse.],
      [Umlaufmotor],
      [1þ],
      [Erster Weltkrieg],
      [Flügelprofil-Motorverkleidung],
      [40% Motor-Luftwiderstand. +3 Zuverlässigkeit, +2 Masse.],
      [Luftgekühlt + Umlaufmotor],
      [3þ],
      [Goldene Zwanziger],
      [Motorverkleidung mit einstellbaren Lamellen],
      [50% Motor-Luftwiderstand. +2 Zuverlässigkeit, +2 Masse.],
      [Luftgekühlt],
      [2þ],
      [Heraufziehender Sturm],
      [Versiegelte Motorverkleidung],
      [50% Motor-Luftwiderstand. +1 Masse pro 3 Motor-Luftwiderstand (vor Reduzierung).],
      [Flüssigkeitsgekühlt],
      [1þ],
      [Pionier],
    )

    Motorverkleidungen sind bei Rumpf-Schubpropeller-Flugzeugen schwieriger anzuwenden und erfordern sorgfältige
    Ingenieursarbeit für den Luftstrom. Erhöhe die Kosten um +2. Die Ausnahme ist die Versiegelte Motorverkleidung, da sie
    nun ja versiegelt ist und kein Luftstrom manipuliert werden muss.

    Zusätzlich kann ein Luftkühlungslüfter innerhalb der Motorverkleidung eines nicht-umlaufenden, luftgekühlten Motors
    montiert werden. Dies kann große Luftmengen über den Motor ziehen, führt jedoch zu einer zusätzlichen schweren
    rotierenden Klinge an der Kurbelwelle.

    - Luftkühlungslüfter: +6 Zuverlässigkeit, +3 Masse. Doppeltes Drehmoment. 4þ

    === Turbolader #html.elem("a", attrs: (id: "_Turbocharger"))[]
    Ein Turbolader belegt eine Struktursektion!

    === Motor als Generator #html.elem("a", attrs: (id: "Engine_as_Generator"))[]
    Du kannst einen Motor als Generator montieren. Er liefert keine Leistung für den Vortrieb, aber du kannst ihn unabhängig
    von deinen anderen Motoren hochfahren, um Batterien aufzuladen oder Energie für andere Dinge bereitzustellen. Du
    benötigst keine Lichtmaschine (wir gehen davon aus, dass diese eingebaut ist) und erzeugt doppelt so viel Ladung wie
    derselbe Motor, wenn er einen Propeller mit einer Lichtmaschine antreiben würde.

    === Kühlung (Luft)
    #label("_Cooling_(Air)")
    Wenn dein Motor luftgekühlt ist, super! Platziere ihn einfach dort, und er läuft von allein. Fügt das Vitalteil Ölwanne
    hinzu.

    === Kühlung (Umlaufmotor)
    #label("_Cooling_(Rotary)")
    Wenn dein Motor _umlaufend_; ist, musst du 1 Masse für den Öltank des Motors hinzufügen. Dies ist ein separates
    Vitalteil.

    === Kühlung (Flüssigkeit)
    #label("_Cooling_(Liquid)")
    Wenn dein Motor _flüssigkeitsgekühlt_; ist, musst du einen Kühler und einen Ölkühler hinzufügen.

    Ein Ölkühler ist einfach: Du fügst +1 Luftwiderstand pro 15 Leistung hinzu und er zählt als Vitalteil.

    Ein Kühler wiegt 3 Masse und hat eine variable Menge an Luftwiderstand, die du wählst. Du kannst nicht mehr Kühler haben
    als Motoren, aber du kannst mehrere Motoren an denselben vergrößerten Kühler anschließen. Das spart Gewicht, ist aber
    eine einzelne Ausfallstelle. Jeder Kühler ist ein Vitalteil.

    Der _Luftwiderstand_ eines Kühlers ist, wie viel Oberfläche des Kühlers dem Luftstrom ausgesetzt ist. Jeder
    Luftwiderstandswert gibt +2 Kühlung. Du musst einen Kühlwert haben, der der Kühlung deines Motors (oder deiner Motoren)
    entspricht, sonst verlierst du Zuverlässigkeit. Jeder Kühlwert, der darunter liegt, gibt -1 Zuverlässigkeit. Mehr
    Kühlung als dein Motor benötigt, macht ihn nicht zuverlässiger.

    Der _Typ_ ist das Design des Kühlers, und die _Montage_ des Kühlers ist, wo er sich im Verhältnis zum Motor (nicht zum
    Flugzeug als Ganzes) befindet, und beeinflusst die Kühlerleistung, nachdem er getroffen wurde. Beide können direkte
    Zuverlässigkeitsboni für den Motor aufgrund mechanischer Einfachheit oder Effizienz geben.

    Kühler können verschiedene Typen haben. Wenn der Kühler mehr Luftwiderstand erhält, fügt er nicht mehr Zuverlässigkeit
    hinzu: Dies resultiert aus den anderen Teilen des Designs wie Schläuchen oder Rahmenwerk.

    *Kühlertyp*

    #table(
      columns: 3,
      align: (left, left, left,),
      table.header([Typ], [Beschreibung], [Ära]),
      [Verkleidung],
      [Standard.],
      [Pionier],
      [Kasten],
      [+2 Luftwiderstand, -1 Masse.],
      [Pionier],
      [Lufteinlass],
      [+2 Kühlung +3þ.],
      [Goldene Zwanziger],
      [Verdunstungskühlung],
      [Siehe unten.],
      [Heraufziehender Sturm],
    )

    *Kühler-Montage*

    #table(
      columns: 3,
      align: (left, left, left,),
      table.header([Ort], [Beschreibung], [Ära]),
      [Niedrig],
      [+1 Zuverlässigkeit. Erzwinge Cool Down bei Treffer.],
      [Pionier],
      [Inline],
      [Standard.],
      [Pionier],
      [Hoch],
      [Bonus bleibt für 1 Cool Down nach Treffer bestehen. +1 Luftwiderstand. Wenn das Flugzeug ein offenes Cockpit hat,
        bespritzt es den Piloten mit der Kühlflüssigkeit!],
      [Pionier],
      [Hoch versetzt],
      [Erfordert einen Schirmdecker. Wie bei 'Hoch', aber -1 Seitenstabilität, und der Pilot ist bei Riss sicher.],
      [Erster Weltkrieg],
    )

    *Kühler-Beispiele:*

    #emph[Verkleidungskühler sind alle Kühler, bei denen Luft "über" die Oberfläche strömt, während Kasten-Kühler so konstruiert
      sind, dass Luft
      "hindurch" strömt. Vereinfacht gesagt: Wenn er hässlich herausragt oder in der Nase ist, ist es ein Kasten, wenn er
      flach an einer Oberfläche wie einem Flügel oder der Außenhaut anliegt, ist es eine Verkleidung.]

    Lufteinlasskühler sind speziell Kühler, die in speziellen Gehäusen eingebaut sind, um Luft zu kanalisieren und den
    Luftwiderstand zu reduzieren.

    - Der Kühler an einer Albatros D.II ist ein Hoch-Verkleidungskühler.

    - Der Kühler an der Seite einer Sopwith Dolphin oder Albatros D.II (frühe Version) ist ein Niedrig-Kastenkühler.

    - Der Kühler an der Nase einer SE5a oder Fokker D.VII ist ein Inline-Kastenkühler.

    - Der Kühler an einer Spitfire oder P-51 ist ein Niedrig-Lufteinlasskühler.

    *Spezialkühlmittel*

    Normalerweise ist ein Kühler nur mit Wasser gefüllt. Wenn du ein versierter Ingenieur sein möchtest, kannst du deinen
    Kühler mit Spezialkühlmittel befüllen, um die Motoreffizienz zu steigern. ~Du musst die Flüssigkeit erneut kaufen, wenn
    der Kühler beschädigt wird.~ Wenn die Flüssigkeit mit einem \* gekennzeichnet ist, benötigst du dafür einen speziell
    gehärteten Kühler (2 Thaler zum Upgrade).

    === Seltenes Kühlmittel #html.elem("a", attrs: (id: "_Rare_Radiator_Fluid"))[]
    Standardmäßig sind Kühler mit Wasser gefüllt, aber wenn du Quellen findest, kannst du sie mit anderen Flüssigkeiten
    befüllen, um die Motoreffizienz zu steigern. ~Du musst die Flüssigkeit erneut kaufen, wenn der Kühler beschädigt wird.~
    Wenn die Flüssigkeit mit einem \* gekennzeichnet ist, benötigst du dafür einen speziell gehärteten Kühler (2 Thaler zum
    Upgrade).

    #table(
      columns: 4,
      align: (left, left, left, left,),
      table.header([Flüssigkeit], [Effekte], [Kosten], [Ära]),
      [Wasser],
      [],
      [\-],
      [Pionier],
      [Salzwasser\*],
      [+1 Zuverlässigkeit (Kostenlos für Fischer)],
      [1þ],
      [Pionier],
      [Mineralöl\*],
      [Absorbiert 1 Fehlschuss pro Cool Off. Entzündlich],
      [1þ],
      [Pionier],
      [Rizinusöl],
      [Wie Mineralöl, aber +2 Stress bei Leckage],
      [\-],
      [Pionier],
      [Glykol],
      [+2 Zuverlässigkeit],
      [2þ],
      [Goldene Zwanziger],
      [Freon],
      [+4 Zuverlässigkeit. Erleide 1 Leistungsreduzierung, während die Drehzahl unter 4 liegt.],
      [3þ],
      [Heraufziehender Sturm],
      [Ammoniak],
      [Wie Freon, verursacht aber 2 Schaden bei Leckage],
      [2þ],
      [Pionier],
    )

    \

    #table(
      columns: 1,
      align: (left,),
      table.header([Verdunstungskühlung]),
      [Eine alternative Methode zur Kühlung eines flüssigkeitsgekühlten Motors ist die Verdunstungskühlung. Dies erfordert
        einen ausreichend großen Flügel (mindestens 5 Fläche pro Motor) mit einer Art Metallhaut. Anstatt Wasser zu einem Kühler
        zu leiten, wird das Wasser als Dampf in einen Hohlraum in den Flügeln gesprüht, um es zu kühlen, wo es gesammelt und
        wieder in den Motor zurückgeführt wird. Dies ist stromlinienförmiger, aber sehr fragil.

        Verdunstungskühlung kostet nur die +3 Masse, die du für einen Kühler bezahlen würdest. Es ist kein Luftwiderstand
        beteiligt, du bist einfach bereit.

        Der Nachteil ist, dass jeder Angriff mit einem Krit-Wurf von 16+ den Kühler ausschaltet, zusätzlich zu allen anderen
        verursachten Schäden oder beschädigten Teilen.

      ],
    )

    === Pulsstrahltriebwerke #html.elem("a", attrs: (id: "_Pulsejets"))[]
    Pulsstrahltriebwerke werden einfach irgendwo am Flugzeug angeschraubt. Es ist uns nicht besonders wichtig, wo oder in
    welcher Konfiguration: Wir wissen nur, dass sie so montiert sind, dass sie von allen funktionierenden Teilen
    ferngehalten werden.

    Pulsstrahltriebwerke kosten 5þ und 1 Wartung nur, weil sie an deinem Flugzeug montiert sind. Sie sind hart zu
    Flugzeugen.

    Pulsstrahltriebwerke erzeugen Rumble. Rumble verursacht Stress bei Besatzungsmitgliedern in Höhe der Hälfte des gesamten
    Rumble, oder 3, je nachdem, welcher Wert niedriger ist. Zusätzlich benötigt ein Flugzeug eine minimale Struktur von
    Gesamt-Rumble \* 10 zum Fliegen, sonst zerfallen die Vibrationen das Flugzeug.

    === Strahltriebwerke & Raketen
    #label("_Jet_Engines_\\&_Rockets")
    Strahltriebwerke werden auf eine der folgenden Arten montiert. Strahltriebwerke bringen aufgrund ihrer Größe ihre eigene
    Anforderung an Struktursektionen mit sich.

    #table(
      columns: 2,
      align: (left, left,),
      table.header([Typ], [Beschreibung]),
      [Frontaler Lufteinlass/Heckbrenner],
      [Standard. Kann bis zu 2 Motoren aufnehmen.],
      [Flügelgondel],
      [Reduziert Maximale Belastung um die Hälfte der Motormasse. +1 Lift Bleed.],
      [Gondel],
      [+3 Luftwiderstand und -1 Sicht. Hält den Motor von allem anderen fern.],
    )

    == Struktur und Bespannung #html.elem("a", attrs: (id: "_Frame_and_Covering"))[]
    Nachdem du nun die Sektionen hast, die dein Flugzeug benötigt, musst du sie bauen. Beginne damit, eine Struktur zu
    bauen. Die Struktur verleiht eine grundlegende Strukturstärke sowie einige Boni, wenn das Flugzeug größer wird. Wähle
    nur ein Material, aus dem der größte Teil der Struktur besteht, und füge pro Sektion 1 Teil hinzu.

    Im Allgemeinen unterteilen wir Flugzeuge in solche, die aus Holmen oder aus Rippen bestehen. Wenn dein Flugzeug durch
    Zugdrähte zusammengehalten wird, wobei die Struktur Kompression bietet, besteht es aus Holmen. Wenn es sich nur um einen
    großen Satz massiver Teile handelt, besteht es aus Rippen.

    Eine Sopwith Camel besteht aus Holzholmen. Eine Fokker DR.1 besteht aus Stahlholmen. Die Junkers J.1/J4 besteht aus
    Aluminiumholmen. Die Polikarpov I-16 besteht aus Holzrippen. Die P-47 besteht aus Stahlrippen. Die P-51 besteht aus
    Aluminiumrippen.

    // #image("Frame.png")
    #html.elem("img", attrs: (src: "Frame.png", alt: "Vergleich von Streben und Rippen"))[]

    #table(
      columns: 6,
      align: (left, left, left, left, left, left,),
      table.header([Strukturmaterial], [Basiseffekt], [Basiskosten], [Effekt pro Teil], [Kosten pro Teil], [Ära]),
      [Holzholme],
      [15 Struktur],
      [\-],
      [+1 Masse, +2 Struktur],
      [\-],
      [Pionier],
      [Stahlholme],
      [25 Struktur],
      [1þ],
      [+1 Masse, +5 Struktur],
      [1þ],
      [Pionier],
      [Aluminiumholme],
      [20 Struktur],
      [2þ],
      [+½ Masse, +4 Struktur],
      [2þ],
      [Erster Weltkrieg],
      [Holzrippen\*],
      [30 Struktur],
      [1þ],
      [+2 Masse, +5 Struktur],
      [½þ],
      [Erster Weltkrieg],
      [Stahlrippen\*],
      [60 Struktur],
      [2þ],
      [+3 Masse, +12 Struktur],
      [2þ],
      [Goldene Zwanziger],
      [Aluminiumrippen\*],
      [50 Struktur],
      [3þ],
      [+2 Masse, +8 Struktur],
      [3þ],
      [Goldene Zwanziger],
      [Titan],
      [\-],
      [],
      [+1 Masse, +10 Struktur],
      [8þ],
      [Letztes Hurra],
      [Lebender Hain\*],
      [30 Struktur, Kostenlose Reparaturen],
      [8þ],
      [+2 Masse, +4 Struktur],
      [\-],
      [Himmilgard],
    )

    Titan ist ein Sonderfall und kann nicht für ganze Strukturen verwendet werden.

    Eine Struktur, die mit \* gekennzeichnet ist, kann geodätisch gebaut werden, was die Kosten pro Teil verdoppelt, aber
    +50% Struktur pro Teil hinzufügt. Geodätische Strukturteile können anschließend nicht monocoque sein.

    Standardmäßig fügt jedes Strukturteil dem Flugzeug +4 Luftwiderstand hinzu, was unverkleidete Struktur darstellt, die in
    der Luft hängt. Du musst diese Elemente verkleiden, um sie stromlinienförmiger zu machen. Wähle für jede Sektion eine
    Bespannung von unten. Die gesamte Haut des Flugzeugs muss gleich sein, wähle also den dominanten Typ.

    #table(
      columns: 5,
      align: (left, left, left, left, left,),
      table.header([Bespannungsmaterial], [Effekte], [Kosten], [Monocoque-Struktur], [Ära]),
      [Unverkleidet],
      [\+ 1 Sicht pro Teil, bis zu +3. 60% Flugwerkmasse.],
      [\-],
      [\-],
      [Pionier],
      [Stoffbespannung],
      [50% Flugwerk-Luftwiderstand],
      [\-],
      [\-],
      [Pionier],
      [Transparentes Zelluloid],
      [60% Flugwerk-Luftwiderstand. + 1 Sicht pro Teil, bis zu +3. Entzündlich.],
      [1þ],
      [-],
      [Pionier],
      [Behandeltes Papier],
      [50% Flugwerk-Luftwiderstand. Entzündlich. 75% Flugwerkmasse],
      [\-],
      [\-],
      [Pionier],
      [Gespanntes Seidentuch],
      [50% Flugwerk-Luftwiderstand. +1 Zähigkeit pro Teil],
      [1þ],
      [\-],
      [Pionier],
      [Drachenhaut],
      [50% Flugwerk-Luftwiderstand. Flugzeug erhält 5 Abdeckung DP2 Panzerung.],
      [4þ],
      [\-],
      [Himmilgard],
      [Formsperrholz],
      [40% Flugwerk-Luftwiderstand],
      [½þ],
      [+3],
      [Pionier],
      [Klinkerbauweise],
      [50% Flugwerk-Luftwiderstand. Volles Monocoque, fügt pauschal +30 Struktur hinzu.],
      [\-],
      [-3],
      [Pionier],
      [Glasfaserverstärkter Kunststoff],
      [30% Flugwerk-Luftwiderstand.],
      [1þ],
      [+0],
      [Letztes Hurra],
      [Wellblech-Duraluminium],
      [50% Flugwerk-Luftwiderstand, +3 Zähigkeit pro Teil],
      [1þ],
      [+10],
      [Erster Weltkrieg],
      [Stahlblech],
      [35% Flugwerk-Luftwiderstand, +3 Zähigkeit pro Teil],
      [1½þ],
      [Rost],
      [Goldene Zwanziger],
      [Aluminiumblech],
      [35% Flugwerk-Luftwiderstand, +2 Zähigkeit pro Teil. 75% Flugwerkmasse],
      [2þ],
      [+6],
      [Goldene Zwanziger],
    )

    === Monocoque #html.elem("a", attrs: (id: "_Monocoque"))[]
    Du kannst ein Monocoque (einschaliges) oder Semi-Monocoque-Flugzeug bauen, wenn du möchtest.

    Ein Monocoque- oder Semi-Monocoque-Flugzeug kann gebaut werden, indem die Masse und der Strukturbonus eines
    Strukturteils durch ein monocoque-kompatibles Hautteil ersetzt werden. Die Struktur existiert weiterhin: Nur wenige
    Monocoque-Flugzeuge sind wirklich ohne Struktur, diese Strukturen sind nur minimiert und in die Schalenstruktur
    integriert.

    Monocoque-Hautteile kosten +1þ pro Stück, was die Arbeitskosten für Entwurf und Bau darstellt. Dies kommt zu den
    Strukturkosten hinzu: diese verschwinden nicht.

    === Auftriebskörper & Nurflügel
    #label("_Lifting Body \\& Flying Wing")
    Ein Auftriebskörper und Nurflügel sind beide unglaublich komplizierte ingenieurtechnische Errungenschaften und
    erfordern, dass das Flugzeug eine solide Außenhaut hat (Formsperrholz oder besser).

    Ein Auftriebskörper-Flugzeug zählt jede Struktursektion (nicht interne Stützen) für die Berechnung der
    Abrissgeschwindigkeit als 3m² Flügelfläche und fügt +1 Luftwiderstand pro Teil hinzu. Jedes Teil kostet +1 Thaler. Bei
    einem reinen Auftriebskörper ohne Flügel entspricht die Maximale Belastung der Struktur, vor Abzug von Motorhalterungen
    oder Anpassung durch Optimierung.

    Ein Nurflügel ist ein Auftriebskörper, der zusätzlich den zusätzlichen Luftwiderstand vermeidet, indem er +5 Lift Bleed
    in Kauf nimmt, was die übermäßig dicke Flügelprofiltiefe darstellt.

    Beide Flugzeugtypen haben weiterhin Heckteile, auch wenn diese in den Rest der Maschine integriert sind.

    === Interne Verstrebung
    #label("_Internal Bracing")
    Um die Widerstandsfähigkeit eines Flugzeugs zu erhöhen, kannst du interne Verstrebung hinzufügen. Dies sind im Grunde
    zusätzliche Strukturteile, die du nicht verkleiden musst, da sie sich im Inneren befinden. Du kannst 1 internes
    Verstrebungsteil pro tatsächlicher Struktursektion haben. Sie müssen nicht aus demselben Material wie alles andere sein:
    Du kannst zum Beispiel ein Flugzeug aus Holz mit einigen Stahlverstrebungen bauen.

    Titan kann nur für interne Verstrebungen verwendet werden. Ein ganzes Flugzeug aus Titan zu bauen ist wie einen ganzen
    Ring aus Diamanten zu machen: cool, aber viel zu teuer, um sich zu lohnen.

    == Heck #html.elem("a", attrs: (id: "_Tail"))[]
    Wir betrachten das Heck als die Sektionen des Flugzeugs, die größtenteils leer bleiben. Sie fügen zusätzliche
    Struktursektionen hinzu und ändern auch die Längsstabilität des Flugzeugs. Sei sehr vorsichtig bei deiner Auswahl: ein
    kurzes Heck scheint optimal, aber die Längsstabilität gleicht die Auswirkungen von Dingen wie Drehmoment, kurzen Flügeln
    und der natürlichen Rollinstabilität von Flugzeugen aus, sodass ein zu starkes Reduzieren zu unkontrollierbaren
    Flugzeugen führt.

    Die meisten der besten Jagdflugzeuge des Ersten Weltkriegs wären Stummelheck, ebenso wie Flugzeuge des Zweiten
    Weltkriegs wie die I-16, die F2A Buffalo und der Raketenjäger Me-163. Als Faustregel gilt: Wenn es für dich wie ein
    Spielzeug aussieht, hast du ein Stummelheck. Wenn es vernünftig aussieht, bist du Standard. Die meisten großen Bomber
    und dergleichen verwenden Lang.

    #table(
      columns: 3,
      align: (left, left, left,),
      table.header([Ort], [Zusätzliche Struktursektionen], [Flugzeugmodifikator]),
      [Schwanzlos],
      [+0],
      [-4 Längsstabilität, kann kein traditionelles Höhen- oder Seitenleitwerk verwenden. +3 Sicht.],
      [Stummelheck],
      [+1],
      [-3 Längsstabilität.],
      [Standard],
      [+2],
      [Keine Änderung.],
      [Lang],
      [+3],
      [+3 Längsstabilität.],
    )

    Hecksektionen sind in der Regel leer. Hecksektionen befinden sich nicht unbedingt am "Heck" eines Flugzeugs, sie
    vergrößern es nur und helfen beim Ausgleich. Denke zum Beispiel an die Heckschützenpositionen in Bombern.

    === Farman #html.elem("a", attrs: (id: "_Farman"))[]
    Wenn du Steuerungen hinter einem Schubpropeller (oder vor einem Zugpropeller!) montieren möchtest, verwendest du ein
    Farman-Heck. Dies ist eine Struktur aus Streben, die um den Propeller herum gebaut ist und es den Steuerflächen
    ermöglicht, daran zu hängen.

    Dies wird wie ein reguläres Heck gebaut, siehe oben. Ein Farman-Heck wiegt halb so viel wie ein konventionelles Heck,
    kann aber keine Oberfläche erhalten: es ist immer ein nacktes Heck.

    Ein Farman-Heck zählt nicht als Teil eines Monocoque-Flugzeugs (da das nicht funktionieren würde), wähle also einfach
    einen Typ von Strukturmaterial.

    === Heckausleger
    #label("_Boom Tails")
    Heckausleger sind eine weitere Option, die sowohl für Schubpropeller-Flugzeuge als auch für einige Flugzeuge mit Gondeln
    nützlich ist. Sie ermöglichen dieselben Dinge wie ein Farman-Heck, sind aber in vielerlei Hinsicht raffinierter. Sie
    haben jedoch einige aerodynamische Schwierigkeiten.

    Ein Heckausleger wird wie ein reguläres Heck gebaut und verwendet dieselben Regeln. Er subtrahiert die Masse des Hecks
    von der Belastung der Tragflächen, und ein Heckausleger, der nicht an Gondeln von Zugpropellermotoren angeschlossen ist,
    erzeugt +50% Luftwiderstand.

    Wenn du Flügelverwindung und Heckausleger hast, hast du einen Fehler gemacht und erhältst einen -2 Malus auf Seiten- und
    Längsstabilität. Ein sich verwindender Flügel lenkt das Höhenleitwerk ab!

    == Tragflächen #html.elem("a", attrs: (id: "_Wings"))[]
    Du brauchst Tragflächen zum Fliegen, oder zumindest etwas Flügelähnliches. Eine größere Flügelfläche bedeutet mehr
    Auftrieb für dein Flugzeug, bedeutet aber auch mehr Luftwiderstand und weniger strukturelle Integrität.

    Zunächst haben die Tragflächen deines Flugzeugs einen Wert namens _Lift Bleed_;, bestimmt durch deine Ära. Dies stellt
    dar, wie viel Auftrieb durch Ineffizienzen im Flügeldesign verloren geht. Idealerweise wäre dieser Wert 1.

    === Flügelfläche #html.elem("a", attrs: (id: "_Wing_Area"))[]
    Beginne damit, zu entscheiden, wie viel Flügelfläche dein Flugzeug insgesamt über alle Flügel hinweg haben soll.
    Schreibe es in Quadratmetern auf.

    Teile diese Fläche nun auf die einzelnen Flügelebenen auf, die dein Flugzeug haben wird. Jeder weitere Flügel nach dem
    ersten gibt...

    - +3 Steuerung
    - +5 Lift Bleed
    - -1 Sicht

    === Streckung
    #label("_Aspect Ratio")
    Flügel haben nicht alle dieselbe Form; manche Flügel sind lang und schmal (sie haben eine _hohe Streckung_;), und manche
    Flügel sind kurz und breit (sie haben eine _geringe Streckung_;).

    Bestimme die Spannweite jedes Flügels am Flugzeug, zusammen mit der Fläche, die du ihm gegeben hast.

    Flügel haben einen Belastungsmodifikator und zusätzlichen Luftwiderstand.

    Belastungsreduzierung = 2 \* Spannweite + Fläche - 10. Flügel können keine positive Belastung erzeugen, wie sollte das
    auch funktionieren?

    Flügel-Luftwiderstand ist 6 \* (Fläche² / Spannweite²). Jeder gegebene Flügel muss immer mindestens 1 Luftwiderstand
    erzeugen.

    - Die Fokker E.III hat eine Flügelfläche von 16 Quadratmetern und eine Spannweite von 9 Metern. Das bedeutet, der Flügel
    erzeugt 18 Luftwiderstand und verursacht einen -24 Belastungs-Malus.
    - Ein theoretischer Segelflieger hat 10 Quadratmeter Flügel und eine Spannweite von 15m. Er erzeugt nur 2 Luftwiderstand,
    verursacht aber einen -30 Belastungs-Malus.

    === Effekte des längsten Flügels
    #label("_Longest Wing Effects")
    Der längste Flügel an deinem Flugzeug gibt den folgenden Modifikator.

    - 8 - Spannweite = Steuerungsmodifikator

    - Jeder Punkt Spannweite weniger als 8: -1 Seitenstabilität.

    === Tragflächenanordnung
    #label("_Wing Decks")
    Da dies ein Spiel über frühe Flugzeuge ist, kannst du dich entscheiden, mehr als einen Flügel zu haben. Wird dein
    Flugzeug ein Eindecker, ein Doppeldecker, ein Dreidecker oder etwas Seltsameres sein?

    Wähle einen Ort für jeden Flügel. Sofern du kein Inline-Tandemflügel-Flugzeug baust, kannst du höchstens einen
    Schulterdecker, einen Mitteldecker und einen Tiefdecker haben. Es gibt keine Begrenzung für die Anzahl der Schirmdecker-
    oder Fahrwerksflügel, die du haben kannst.

    Der Typ des Flügels wird durch seine Position relativ zum Rumpf und dem Massenmittelpunkt des Flugzeugs bestimmt, die
    normalerweise, aber nicht immer, am selben Ort sind. Verwende den Hauptteil des Flügels, nicht dort, wo er befestigt
    ist. Möwenflügel können einen anderen Befestigungspunkt als den Ort des Hauptteils haben.

    - Ein Schirmdecker befindet sich auf Streben über dem Rumpf, wie ein Regenschirm über dem Flugzeug.
    - Ein Schulterdecker (oder Hochdecker) befindet sich ungefähr am oberen Teil des Rumpfes.
    - Ein Mitteldecker befindet sich um die Mitte des Rumpfes herum.
    - Ein Tiefdecker befindet sich ungefähr am unteren Teil des Rumpfes.
    - Ein Fahrwerksflügel ist wie ein umgekehrter Schirmdecker, der den Rumpf in der Luft über dem Flügel aufhängt.
      Fahrwerksflügel können auch kleine Auftriebsflächen darstellen, die mit den Miniaturflügel-Regeln zwischen den Rädern
      des Fahrwerks angebracht sind.

    In einigen Fällen, wie bei der Macchi M.5 (der, die Porco Rosso im Krieg flog), kann der Massenmittelpunkt durch die
    Motorplatzierung deutlich über oder unter dem Rumpf verschoben sein, sodass du wählen kannst, die Flügelplatzierung
    relativ zum Motor zu zählen.

    *Tragflächenanordnung*

    Diese gelten für jeden angebrachten vollen Flügel. Der Modifikator für die größte Tragfläche gilt für Eindecker und
    Anderthalbdecker für den Flügel mit der größten Fläche.

    #table(
      columns: 3,
      align: (left, left, left,),
      table.header([Ort], [Flugzeugmodifikator], [Modifikator für die größte Tragfläche]),
      [Schirmdecker],
      [+3 Längsstabilität, -10 Maximale Belastung. -2 Lift Bleed. -1 Sicht],
      [+1 Seitenstabilität. -1 Steuerung],
      [Schulterdecker],
      [+2 Längsstabilität. -1 Lift Bleed. -1 Sicht],
      [-1 Steuerung],
      [Mitteldecker],
      [\-],
      [-10% Luftwiderstand für diesen Flügel],
      [Tiefdecker],
      [-2 Längsstabilität. -1 Aufprallsicherheit. -1 Lift Bleed],
      [+2 Steuerung, -1 Seitenstabilität],
      [Fahrwerk],
      [-3 Längsstabilität. -10 Maximale Belastung, -1 Aufprallsicherheit. -2 Lift Bleed.],
      [+3 Steuerung -1 Seitenstabilität],
    )

    === Flügeloberfläche
    #label("_Wing Surface")
    Denke daran, immer auf ganze Zahlen abzurunden!

    *Flügeloberflächen*

    #table(
      columns: 4,
      align: (left, left, left, left,),
      table.header([Bespannungsmaterial], [Flugzeugmodifikator], [Kosten/10 Fläche], [Ära]),
      [Stoffbespannung],
      [\-],
      [\-],
      [Pionier],
      [Behandeltes Papier],
      [Macht das Flugzeug entzündlich, -1 Masse pro 4 Fläche, bis zu 25% der Leermasse des Flugzeugs.],
      [\-],
      [Pionier],
      [Schichten aus gespanntem Seidentuch],
      [90% Belastungs-Malus],
      [2þ],
      [Pionier],
      [Sperrholz],
      [90% Belastungs-Malus, 1 Masse/5A],
      [1þ],
      [Pionier],
      [Aluminiumblech],
      [80% Luftwiderstand],
      [3þ],
      [Goldene Zwanziger],
      [Wellblech-Duraluminium],
      [60% Belastungs-Malus, 1 Masse/4A],
      [2þ],
      [Erster Weltkrieg],
      [Dünnes Stahlblech],
      [60% Belastungs-Malus, 90% Luftwiderstand, 1 Masse/5A],
      [3þ],
      [Goldene Zwanziger],
      [Große Adlerfeder],
      [+1 Steuerung pro 5A],
      [6þ],
      [Himmilgard],
      [Solarfaser],
      [+1 Ladungserzeugung pro 5A],
      [4þ],
      [Himmilgard oder Letztes Hurra],
      [Drachenhaut],
      [40% Belastungs-Malus],
      [8þ],
      [Himmilgard],
      [Transparentes Zelluloid],
      [Macht das Flugzeug entzündlich. +1 Sicht pro Flügel. -1 Zähigkeit pro 10 Fläche],
      [1þ],
      [Pionier],
    )

    === Staffelung & Tandemflügel
    #label("_Stagger \\& Tandem Wing")
    Wenn du mehrere Tragflächenanordnungen hast, kannst du die Flügel staffeln.

    *Flügelstaffelung*

    #table(
      columns: 2,
      align: (left, left,),
      table.header([Ort], [Flugzeugmodifikator]),
      [Tandem],
      [Eliminiert die Notwendigkeit horizontaler Stabilisatoren. +4 Längsstabilität. Kann nicht schwanzlos sein.],
      [Extrem positiv],
      [+2 Längsstabilität, -2 Lift Bleed],
      [Positiv],
      [+1 Längsstabilität, -1 Lift Bleed],
      [Negativ],
      [-1 Längsstabilität, -1 Lift Bleed],
      [Extrem negativ],
      [-2 Längsstabilität, -2 Lift Bleed],
    )

    === Geschlossener Flügel
    #label("_Closed Wing")
    Das Schließen eines Flügelpaares, z. B. durch Erstellen einer Kasten- oder Kreisstruktur, eliminiert den Wirbeleffekt am
    Ende eines Flügels und ermöglicht auch eine vollständigere Struktur. Andererseits wird dieses Design aufgrund des
    zusätzlichen Gewichts an den äußersten Enden der Flügel schwer zu steuern sein, da die benötigte Energie für eine
    Rollbewegung zunimmt.

    Jedes geschlossene Flügelpaar kostet +1 Masse, -5 Steuerung und +20 Maximale Belastung. (d.h. vier Flügel zählen
    doppelt, nicht dreimal)

    Ein geschlossener Monoflügel ist nicht möglich: Flügelspitzenschleifen zur Reduzierung des Luftwiderstands wären Teil
    der Optimierung. Du kannst jedoch einen geschlossenen Inline-Tandemflügel haben.

    === Inline-Flügel
    #label("_Inline Wings")
    Ein Stil des Tandemflügels, bei dem mehrere Flügel auf derselben Ebene liegen. Ein Inline-Satz reduziert den gesamten
    Luftwiderstand aller Flügel auf derselben Ebene auf 75%, ergibt aber +3 Lift Bleed aufgrund von Abschattung.

    === Miniaturflügel
    #label("_Miniature Wings")
    Ein Flügel von 2 Quadratmetern oder weniger ist ein Miniaturflügel. Diese zählen effektiv nicht als Flügel: sie fügen
    die Effekte der Tragflächenanordnung, an der sie angebracht sind, nicht hinzu, sondern fügen stattdessen nur +1
    Steuerung und ihre Größe für Auftriebszwecke hinzu. Jeder Miniaturflügel nach dem ersten fügt jeweils +1 Lift Bleed
    hinzu.

    Jeder Miniaturflügel muss auf einer eigenen Anordnung montiert werden: sie können nicht denselben Platz wie ein anderer
    Flügel einnehmen. Keine Tandem-Miniaturflügel!

    === Anderthalbdecker #html.elem("a", attrs: (id: "_Sesquiplanes"))[]
    Wenn der kleinste deiner Flügel halb so groß oder weniger als der größte Flügel ist und die Flügel keine Tandemflügel
    sind, hast du einen Anderthalbdecker! Diese ungewöhnliche Konfiguration wurde verwendet, um einige der Vorteile sowohl
    von Eindeckern als auch von Doppeldeckern zu erzielen. Sie haben ihre Vorteile, bringen aber strukturelle Komplikationen
    mit sich.

    Ein Anderthalbdecker gewährt

    - -2 Lift Bleed
    - +2 Steuerung

    Allerdings tritt einer der folgenden Mali auf.

    - Wenn die kleinste Spannweite weniger als 75% der Spannweite des größten Flügels beträgt, erzeugt dein Flugzeug 15%
      weniger
    Spannung, da du die Flügel an den Spitzen nicht aussteifen kannst.
    - Andernfalls ist das Flugzeug auf die folgenden externen Verstärkungen beschränkt: V-Streben, Einzelstreben, W-Streben,
    Flügelstrebenwerk und Drahtwurzeln. Es kann weiterhin jede Art von Kabinenstrebe verwenden, aber der schmalere untere
    Flügel schließt die Unterstützung durch Doppelholme aus und begrenzt die Arten von Holmen, die verwendet werden können.

    === Flügelwinkel
    #label("_Wing Angle")
    Flügel können unter Winkeln gebaut werden, um ihre Eigenschaften zu ändern. Hochgezogene Flügelspitzen (Flügel mit
    V-Stellung) verbessern die Stabilität, da sie das Flugzeug eher dazu bringen, in eine neutrale Position zurückzurollen.
    Flügel mit negativer V-Stellung bewirken das Gegenteil.

    Das Einleiten eines Winkels mit V-Stellung am Flügel fügt Seitenstabilität hinzu, während ein Flügel mit negativer
    V-Stellung stattdessen Seitenstabilität entfernt. In beiden Fällen erhöht sich dein gesamter Lift Bleed um den Betrag
    der hinzugefügten oder verlorenen Stabilität.

    === Möwenflügel
    #label("_Gull Wings")
    Jeder Flügel kann als Möwenflügel deklariert werden. Wir betrachten die Ebene des Flügels als den Ort der Biegung, nicht
    als den Ort der Wurzel, da dies für aerodynamische Zwecke relevant ist. Du kannst nicht zwei Flügel von derselben Wurzel
    in einer Nicht-Tandem-Konfiguration haben. Möwenflügel sind in der Ära Heraufziehender Sturm verfügbar.

    Jeder Möwenflügel erzeugt Luftwiderstand, als hätte er +10% Fläche, bringt aber die folgenden Vorteile mit sich:

    - Ein Schirmdecker kann zu einem _Polnischen Flügel_ werden. Dies entfernt den Malus von -10 Maximale Belastung und Sicht.
    Nicht verfügbar bei Schulterdeckern.
    - Mittel-, Tiefdecker- und Fahrwerksflügel können zu einem _Umgekehrten Möwenflügel_ werden. Dies hat die folgenden
      Effekte, besser
    für tiefere Flügel.
    - Für Tiefdecker- und Mitteldecker-Flügel reduziert dies die Luftwiderstands- und/oder Massekosten des Fahrwerks um 15%
      (ausgenommen Bootsrümpfe) und
    erhöht die externe Bombenkapazität um 10%. Nicht verfügbar bei Nicht-Möwen-Mitteldeckern bzw. Schulterdeckern.
    - Für Fahrwerksflügel reduziert dies die Luftwiderstands- und/oder Massekosten des Fahrwerks um 25% (ausgenommen
      Bootsrümpfe), eliminiert
    die -10 Maximale Belastung, gibt +1 Aufprallsicherheit und erhöht die externe Bombenkapazität um 20%. Nicht verfügbar
    bei einem Nicht-Möwen-Tiefdecker.

    === Pfeilflügel
    #label("_Swept Wings")
    Pfeilflügel fügen +5 Lift Bleed hinzu und geben -1 Seitenstabilität. Allerdings ermöglichen sie die vollständige
    Eliminierung des Höhenleitwerks _und_ bieten einen natürlichen Montagepunkt für Außenbord-Seitenleitwerke.

    === Flügelspitzengewicht
    #label("_Wingtip Weight")
    Ein Flugzeug erhält einen -1 Steuerungs-Malus für Folgendes:

    - Alle 5 Masse an Waffen an Flügelhalterungen.
    - Jeder Flügel-montierte Treibstofftank, intern oder extern.

    === Spezielle Flügeltypen
    #label("_Special Wing Types")
    Es gibt eine Reihe spezieller Flügeltypen. Diese Flügeltypen können mit normalen Flügeln kombiniert werden, aber es
    lohnt sich selten.

    - Tragschrauber verwenden eine rotierende Flügelfläche. Sie sind sehr sicher für leichte Flugzeuge.
    - Helikopter treiben eine rotierende Flügelfläche an, was freie vertikale und horizontale Bewegung ermöglicht, auf Kosten
      geringer
    Stabilität und erforderlicher starker Motoren.
    - Ornithopter verwenden einen Motor, um einen Schlag-Effekt zu erzeugen. Dies schafft äußerst wendige, aber zerbrechliche
      und teure
    Flugzeuge.

    Ihre Regeln werden auf separaten Seiten detailliert, sobald sie fertig sind.

    == Stabilisatoren #html.elem("a", attrs: (id: "_Stabilizers"))[]
    Ein Flugzeug muss stabilisiert werden. Es muss ein Höhenleitwerk haben, um die Nase flach zu halten, und ein
    Seitenleitwerk, um Trudeln und Rollen zu verhindern. Du kannst ein Flugzeug ohne diese Dinge entwerfen, aber es ist _wirklich schwer_;.

    === Stabilisatorgröße
    #label("_Stabilizer Size")
    Flugzeuge brauchen Stabilisatoren zum Fliegen. Punkt. Wenn du sie nicht hast und nichts sehr, sehr Kluges gemacht hast,
    macht dein Flugzeug eine wackelige Bewegung und geht zu Boden.

    Deine Stabilisatoren kosten Luftwiderstand, was bedeutet, dass sie in den Luftstrom geraten.

    - Alle deine Seitenleitwerke fügen 1/8 des gesamten Flügel-Luftwiderstands hinzu. (Minimum 1)
    - Alle deine Höhenleitwerke fügen 1/4 des gesamten Flügel-Luftwiderstands hinzu. (Minimum 1)

    Das Fehlen eines Seitenleitwerks subtrahiert Seitenstabilität in Höhe deiner Flügelfläche. Das Fehlen eines
    Höhenleitwerks subtrahiert Längsstabilität in Höhe der Hälfte deiner Flügelfläche und fügt zusätzlich +5 Lift Bleed
    hinzu!

    Tandemflügel- und Pfeilflügel-Flugzeuge benötigen keine Höhenleitwerke: sie haben genug Probleme. Um sie zu entfernen,
    setze die Auswahl für Höhenleitwerke auf "Die Tragflächen".

    === Stabilisator-Montage
    #label("_Stabilizer Mounts")
    Du musst wählen, wo du deine Stabilisatoren montierst. Deine Optionen sind...

    *Höhenleitwerk*

    - Tailplane: Standard
    - Canards (vorne): -3 Längsstabilität, halber Luftwiderstand.
    - Außenbord (am Flügel): Erfordert entweder Pfeilflügel oder einen Tandemflügel. +1 Seitenstabilität. Erfordert eine
      gerade Anzahl von Stabilisatoren.

    *Seitenleitwerk*

    - Tailfin: Standard.
    - Außenbord: Erfordert entweder Pfeilflügel, einen Tandemflügel oder Canards. +1 Steuerung. Erfordert eine gerade Anzahl
      von Stabilisatoren.

    === Mehrere Stabilisatoren
    #label("_Multiple Stabilizers")
    Du kannst wählen, mehrere Instanzen eines Stabilisators an deinem Flugzeug zu montieren. Zum Beispiel zwei Heckflossen
    an deinem Flugzeug, montiert an den Enden des Höhenleitwerks. Da es am besten ist, wenn Seitenruder und Höhenruder im
    Luftstrom eines Motors sind, profitierst du mehr davon, wenn du mehrere Motoren hast.

    Jeder zusätzliche Stabilisator fügt einfach +2 Luftwiderstand hinzu.

    Für jedes Paar Seitenleitwerk mit einem Motor jenseits des ersten erhältst du einen Bonus von +3 Steuerung. Wenn du
    einen zusätzlichen Stabilisator hast, der nicht mit einem Motor gepaart ist, erhältst du nur +1 Steuerung.

    Schub-Zug-Motoren zählen für diese Zwecke als ein einzelner Motor.

    === V-Leitwerke #html.elem("a", attrs: (id: "_V-Tails"))[]
    Ein V-Leitwerk kombiniert sowohl Längs- als auch Seitenstabilität. Es muss 1/5 des gesamten Flügel-Luftwiderstands
    betragen, gibt +2 auf beide Stabilitätstypen und kostet 5þ für die Konstruktion. Das V-Leitwerk stammt aus der Ära
    Heraufziehender Sturm.

    === T-Leitwerke #html.elem("a", attrs: (id: "_T-Tails"))[]
    Ein T-Leitwerk ist ein Höhenleitwerk, das am oberen (oder nahe dem oberen) Ende des Seitenleitwerks montiert ist. Es
    verursacht den halben Luftwiderstand eines konventionellen Höhenleitwerks, reduziert den Lift Bleed um 2 und fügt dem
    Flugzeug eine spezielle Regel hinzu. Das T-Leitwerk stammt aus der Ära Zweiter Weltkrieg.

    Deep Stall: Im Falle eines Trudelns/Strömungsabrisses bei Geschwindigkeit über der Abrissgeschwindigkeit und unter Last,
    bist du im Nachteil, dich zu erholen.

    == Steuerflächen #html.elem("a", attrs: (id: "_Control_Surfaces"))[]
    Steuerflächen sind, wie sich ein Flugzeug bewegt.

    Du _musst_ eine Möglichkeit haben, dein Flugzeug zu steuern. Du brauchst Querruder, Höhenruder und ein Seitenruder.

    === Querruder #html.elem("a", attrs: (id: "_Ailerons"))[]
    Querruder steuern die Rotation deines Flugzeugs. Du musst diese haben!

    *Querruder*

    #table(
      columns: 4,
      align: (left, left, left, left,),
      table.header([Typ], [Effekte], [Kosten], [Ära]),
      [Keine Querruder],
      [-15 Steuerung, -1 Aufprallsicherheit.],
      [-2þ],
      [Pionier],
      [Querruderklappen],
      [Standard],
      [\-],
      [Pionier],
      [Flügelverwindung],
      [-1 Luftwiderstand. Erhalte +1 auf Dogfight! bei Geschwindigkeit 15 und darunter. Reduziere Maximale Belastung in Höhe
        der Spannweite des längsten Flügels.],
      [\-],
      [Pionier],
      [Spoilerons],
      [Wenn du Dogfight! würfelst, erhältst du +1, reduzierst aber deine Geschwindigkeit, als wäre dein Geschwindigkeitsfaktor
        verdoppelt.],
      [2þ],
      [Zweiter Weltkrieg],
    )

    Flügelverwindung wird zur Ära Letztes Hurra, wenn der Flügel mit Kragträgern verstärkt wird, und kostet 2þ pro
    Kragträger. Das ist fortschrittliche Technologie!

    === Seitenruder #html.elem("a", attrs: (id: "_Rudders"))[]
    Seitenruder geben Drehsteuerung und arbeiten mit Querrudern und Höhenrudern zusammen, um das Flugzeug in der richtigen
    Richtung zu halten. Es gibt zwei verfügbare Arten:

    #table(
      columns: 4,
      align: (left, left, left, left,),
      table.header([Typ], [Effekte], [Kosten], [Ära]),
      [Ruderklappe],
      [Standard],
      [\-],
      [Pionier],
      [Fliegendes Ruder],
      [-1 Seitenstabilität. +3 Steuerung.],
      [\-],
      [Pionier],
    )

    === Höhenruder #html.elem("a", attrs: (id: "_Elevators"))[]
    Höhenruder halten die Nase deines Flugzeugs zum Himmel und nicht zum Boden gerichtet. Es gibt zwei...

    #table(
      columns: 4,
      align: (left, left, left, left,),
      table.header([Typ], [Effekte], [Kosten], [Ära]),
      [Höhenruderklappe],
      [Standard],
      [\-],
      [Pionier],
      [Fliegendes Höhenruder],
      [-1 Längsstabilität. +2 Steuerung.],
      [\-],
      [Pionier],
    )

    === Auftriebshilfen #html.elem("a", attrs: (id: "_Lift_Aids"))[]
    Landeklappen & Vorflügel sind spezielle Anbauten, die an Flügeln angebracht werden können und das Auftriebsprofil des
    Flügels verändern. Landeklappen werden typischerweise durch ein Seilzugsystem aus gespannten Kabeln oder durch Hydraulik
    bei größeren Flugzeugen betätigt.

    Du kannst nur 1 Typ von jedem dieser Anbauten an einem Flugzeug anbringen.

    *Landeklappen*

    #table(
      columns: 4,
      align: (left, left, left, left,),
      table.header([Typ], [Effekte], [Kosten], [Ära]),
      [Einfache Landeklappen],
      [-3 Lift Bleed, -3 Steuerung.],
      [1þ pro 3MP],
      [Erster Weltkrieg],
      [Fortschrittliche Landeklappen],
      [-5 Lift Bleed.],
      [2þ pro 3MP],
      [Heraufziehender Sturm],
      [Steuerklappen],
      [-5 Lift Bleed, +3 Steuerung],
      [1þ pro MP],
      [Zweiter Weltkrieg],
      [Auftriebsminderer],
      [+2 Aufprallsicherheit. Aktivieren für +1 auf Dogfight!, danach sofort Strömungsabriss einleiten.],
      [1þ pro MP],
      [Letztes Hurra],
    )

    *Vorflügel*

    #table(
      columns: 4,
      align: (left, left, left, left,),
      table.header([Typ], [Effekte], [Kosten], [Ära]),
      [Feste Vorflügel],
      [5 Luftwiderstand. -3 Lift Bleed],
      [1þ],
      [Goldene Zwanziger],
      [Automatische Vorflügel],
      [-1 Lift Bleed. +3 Steuerung],
      [4þ],
      [Zweiter Weltkrieg],
    )

    === Luftwiderstandserzeuger #html.elem("a", attrs: (id: "_Drag_Inducers"))[]
    Luftwiderstandserzeuger werden verwendet, um ein Flugzeug zu verlangsamen, indem etwas Großes und Windschlüssiges in den
    Luftstrom ausgefahren wird. Es gibt verschiedene Möglichkeiten, dies für verschiedene Zwecke zu tun. Dies könnten die
    leitblechartigen Vorrichtungen an der Stuka oder die Gitter der SBD Dauntless oder die Faltbremsen vieler Düsenjäger
    sein.

    *Luftwiderstandserzeuger*

    #table(
      columns: 4,
      align: (left, left, left, left,),
      table.header([Typ], [Effekte], [Kosten], [Ära]),
      [Luftbremse],
      [Beim Ausfahren verlierst du sofort Geschwindigkeit in Höhe des Geschwindigkeitsfaktors und erhältst +1 auf Dogfight!.],
      [3þ, 1 Masse],
      [Zweiter Weltkrieg],
      [Sturzflugbremse],
      [Beim Ausfahren tauschen steile Sturzflüge Höhe gegen Geschwindigkeit im Verhältnis 1:2 anstelle von 1:3.],
      [4þ, 2 Masse],
      [Pionier],
      [Bremsschirm],
      [Verleiht +3 Aufprallsicherheit. Kann als einmalige Luftbremse aktiviert werden.],
      [3þ],
      [Letztes Hurra],
    )

    == Verstärkungen #html.elem("a", attrs: (id: "_Reinforcement"))[]
    Ein Flugzeug benötigt eine Beschreibung der tragenden Verstärkungen, um sicherzustellen, dass die Tragflächen nicht
    abfallen. Bei den meisten Flugzeugen handelt es sich dabei um eine sorgfältig konstruierte Anordnung von Streben und
    Drähten, wobei die Streben dazu dienen, die Tragflächen auseinander zu halten, und die Drähte dazu dienen, die
    Tragflächen zusammenzuhalten. Eindecker können Drähte verwenden, die an starken Punkten am Rumpf befestigt sind, anstatt
    zwischen den Tragflächen zu verlaufen, aber das ist weniger effizient.

    === Externe Verstärkung #html.elem("a", attrs: (id: "_External_Reinforcement"))[]
    Streben erzeugen Struktur, Maximale Belastung und einen Wert namens Spannung. Du kannst so viele davon nehmen, wie du
    möchtest: Jeder genommene repräsentiert ein gespiegeltes Paar, das eine neue Sektion schafft.

    #table(
      columns: 4,
      align: (left, left, left, left,),
      table.header([Typ], [Effekte], [Kosten], [Ära]),
      [Parallelstreben],
      [+2 Luftwiderstand, +1 Masse, +5 Struktur, +5 Maximale Belastung, \+30 Spannung.],
      [1þ],
      [Pionier],
      [N-Strebe],
      [+2 Luftwiderstand, +1 Masse, +6 Struktur, +8 Maximale Belastung, +20 Spannung.],
      [1þ],
      [Pionier],
      [V-Strebe],
      [+1 Luftwiderstand, +1 Masse, -5 Struktur, +5 Maximale Belastung, +30 Spannung.],
      [1þ],
      [Pionier],
      [I-Strebe],
      [+1 Luftwiderstand, +1 Masse, +20 Maximale Belastung, +15 Spannung.],
      [2þ],
      [Erster Weltkrieg],
      [W-Strebe],
      [+3 Luftwiderstand, +1 Masse, +35 Maximale Belastung.],
      [2þ],
      [Erster Weltkrieg],
      [Sternstrebe],
      [+6 Luftwiderstand, +2 Masse, +10 Struktur, +30 Maximale Belastung.],
      [2þ],
      [Erster Weltkrieg],
      [Flügelstrebenwerk],
      [+4 Luftwiderstand, +40 Spannung. Unbeeinflusst von der Flügelkonfiguration.],
      [1þ],
      [Pionier],
      [Einzelstrebe],
      [+1 Luftwiderstand, +1 Masse, +10 Maximale Belastung.],
      [1þ],
      [Pionier],
      [Drahtwurzel],
      [+10 Spannung. Kann keine Kabinenstrebe sein und nicht als deine erste Nicht-Kabinenstrebe zählen.],
      [\-],
      [Pionier],
    )

    Du erhältst 1 Kabinenstrebe an deinem Flugzeug: sie kann deine einzige Strebe sein, wenn du möchtest. Dies ist eine
    Strebe, die -2 Luftwiderstand (Minimum 0) erzeugt, aber nur halb so viel Spannung. Sie kostet die reguläre Menge an
    Masse und Kosten. Du kannst kein Kabinenflügelstrebenwerk oder Drahtwurzel haben.

    Deine erste Nicht-Kabinenstrebe gibt +5 Struktur, +10 Maximale Belastung und +10 Spannung. Diese Spannung wird durch
    deine Flügelkonfiguration nicht beeinflusst. Dies stellt den allgemeinen Vorteil dar, diese Ankerpunkte überhaupt zu
    haben: weitere Streben bringen im Vergleich dazu geringere Erträge.

    Jede dieser Streben kann stattdessen aus Stahl hergestellt werden. Dies verdoppelt ihre Kosten. Stahlstreben oder
    -strebenwerke (keine Drahtwurzeln) verleihen doppelt so viel Struktur, +5 Maximale Belastung und halb so viel Spannung.
    Eine V-Stahlstrebe ergibt 0 Struktur.

    Drähte wandeln Spannung in Maximale Belastung um. Wenn du Aussteifungsdrähte hinzufügst, erleide +3 Luftwiderstand pro
    Strebe und füge Maximale Belastung in Höhe der Spannung hinzu. Max 1.

    Die Konfiguration deiner Tragflächen bezüglich der Spannungserzeugung wird wie folgt multipliziert.

    - Ungestaffelter Mehrdecker oder flügellos: 100%
    - Gestaffeltes Flugzeug: 90%
    - Tandemflugzeug: 80%
    - Eindecker: 60%

    === Kragflügel #html.elem("a", attrs: (id: "_Cantilever_Wings"))[]
    Die Standardannahme ist, dass Flügel eine spannungsverstrebte Konstruktion aufweisen und Drähte und Holme aus geeigneten
    Materialien verwenden, um intakt zu bleiben. Der Bau eines "Kragflügels" schafft eine selbsttragende Struktur innerhalb
    des Flügels selbst, die an einem starken Punkt an der Struktur verstrebt ist.

    Du kannst 1 Masse Kragholm pro 5 Struktur am Flugzeug hinzufügen. Die Aufnahme von Kragträgern kostet insgesamt 5þ.

    #table(
      columns: 4,
      align: (left, left, left, left,),
      table.header([Kragträgermaterial], [Effekte pro Masse], [Kosten pro Masse], [Ära]),
      [Birke],
      [+10 Maximale Belastung, +2 Zähigkeit.],
      [1þ],
      [Erster Weltkrieg],
      [Duraluminium],
      [+15 Maximale Belastung, +3 Zähigkeit.],
      [2þ],
      [Erster Weltkrieg],
      [Stahl],
      [+20 Maximale Belastung, +5 Zähigkeit.],
      [3þ],
      [Erster Weltkrieg],
      [Aluminium],
      [+25 Maximale Belastung, +3 Zähigkeit.],
      [4þ],
      [Goldene Zwanziger],
      [Walknochen],
      [-3 Lift Bleed, +5 Maximale Belastung.],
      [8þ],
      [Himmilgard],
    )

    Ein Kragflügel ist dicker als ein regulärer Flügel, was die Möglichkeit von Treibstofftanks im Flügel eröffnet.

    Wenn du in frühen Ären Kragträger in deinen Flügeln hast, wird der Kragträger-Bonus von deinem Lift Bleed abgezogen.
    Dies liegt daran, dass es Konstrukteure zwang, Flügel dicker und effizienter zu gestalten, aber sie hatten keine Ahnung,
    dass sie das taten.

    === Flügelklingen
    #label("_Wing Blades")
    Du kannst Flügelklingen hinzufügen, wenn du keine externe Verstärkung und mindestens einen Stahlkragträger hast.
    Flügelklingen verdoppeln die Masse aller Kragträger, ermöglichen es dir aber, deinen Feind auseinanderzuschneiden.

    == Waffen #html.elem("a", attrs: (id: "_Weapons"))[]
    Waffen lassen dein Flugzeug Dinge verletzen!

    Waffen kommen mit eigener Munitionsversorgung, dem Munitionswert, mit dem sie aufgeführt sind. Du kannst zusätzliche
    Munition für jede Waffe kaufen, was immer +1 Masse kostet. Dies gibt dir zusätzliche Munition in Höhe der standardmäßig
    mit der Waffe gelieferten Menge. Munition ist nicht so schwer, aber die größeren Behälter und komplexeren Systeme, die
    zum Zuführen längerer Gurte benötigt werden, sind es tendentiell.

    Wenn eine Waffe Magazin-geladen oder manuell ist, kannst du +50% Kosten ausgeben, um sie in eine Gurtgespeiste Waffe
    umzuwandeln.

    === Waffengrößen
    #label("_Weapon Sizes")
    Waffen gibt es in verschiedenen _Größen_: Winzig, Leicht, Mittel, Schwer und Artillerie.

    Du kannst immer kleinere Waffen in Bereichen mit Einschränkungen montieren, wie Türme oder Tragflächen. Du kannst
    doppelt so viele Waffen einer Größe kleiner als eine größere Waffe montieren. Zum Beispiel könntest du auf einem Turm
    mit einer mittleren Waffenhalterung 2 leichte Waffen montieren.

    === Systeme #html.elem("a", attrs: (id: "_Systems"))[]
    Waffen desselben Typs, die in dieselbe Richtung feuern, bilden ein _System_. Alle ihre Treffer werden zusammengezählt,
    um ihre Waffenprofile zu erstellen, was eine Anzahl von Treffern und eine Menge Schaden in den vier Entfernungsbändern
    Nahkampf/Nah/Fern/Extrem ergibt.

    Die unten aufgeführten Flugzeugwaffen werden als Teil eines "Systems" identischer Waffen in Flugzeuge montiert. Es
    spielt keine Rolle, wo jede Waffe im System montiert ist, solange sie alle gleichzeitig auf denselben Punkt feuern.

    Um die Reichweitentabelle zu erstellen, addiere alle Treffer der Waffen und multipliziere sie dann mit dem Schaden der
    Waffe, um deinen Schaden in dieser Entfernung zu erhalten.

    Die Treffer von Waffen nehmen mit zunehmender Entfernung ab. Waffen in der Mittellinie und in Türmen haben einen Abfall
    von 100/75/50/25 Prozent, abgerundet, für jedes Entfernungsband in Folge. Für Flügel-montierte Waffen verwende
    stattdessen 100/90/20/10 Prozent. Wenn du eine Mischung aus Mittellinien- und Flügel-Waffen hast, berechne die beiden
    Gruppen separat und addiere sie dann.

    === Platzierung #html.elem("a", attrs: (id: "_Placement"))[]
    Du kannst deine Waffen am Rumpf oder an den Tragflächen des Flugzeugs platzieren. Beliebig viele Waffen können am oder
    im Rumpf des Flugzeugs platziert werden, beachte jedoch, dass Waffen der Größe Artillerie oder Türme, die mehrere
    kleinere Waffen enthalten, die zusammen mehr als eine schwere Waffe ergeben, jeweils eine eigene Struktursektion
    benötigen.

    Flügel-montierte Waffen sind basierend auf der Stärke der Flügelkonstruktion eingeschränkt, wie folgt.

    - Keine Kragträger: Maximal 2 leichte Waffen.
    - Holz- oder Knochen-Kragträger: Maximal 2 mittlere Waffen.
    - Metall-Kragträger: Maximal 2 schwere Waffen.

    Das Montieren einer schwereren Waffe als dieser am Flügel kostet +2 Masse, was das Ausfahren von Stützbalken vom Rumpf
    des Flugzeugs darstellt, auf die Weise der 20mm Becker Kanone an der Albatros D.II.

    Wir können uns vorstellen, dass diese Waffen oben am Oberflügel, entlang der Spannweite des Flügels usw. montiert sind.

    Bei Flugzeugen mit traditionellen Zugpropeller-Konfigurationen wird jede Platzierung außerhalb des Propellerkreises als
    Flügelplatzierung betrachtet.

    Eine fest nach vorne gerichtete Artillerie-Waffe stört einen Motor. Du musst entweder Gondeln, einen Schubpropeller oder
    einen mittig montierten Zugpropellermotor mit den entsprechenden Modifikationen verwenden.

    Wenn eine Waffe am Flügel montiert und unverkleidet ist, hat sie +1 Luftwiderstand.

    === Verkleidet #html.elem("a", attrs: (id: "_Covered"))[]
    *Verkleidete Waffen können verkleidet oder unverkleidet sein.*

    Wenn du Waffen zu deinem Flugzeug hinzufügst, beginnen sie als unverkleidet.

    Unverkleidete Waffen fügen dem Flugzeug den im Waffenbeschreibung aufgeführten Luftwiderstand hinzu.

    Du kannst eine Waffe auf "verkleidet" aufrüsten, wodurch ihr Luftwiderstand eliminiert wird. Dies kann bedeuten, dass
    die Waffe ins Innere des Rumpfes oder der Tragflächen des Flugzeugs verlegt wird, oder es kann einfach bedeuten,
    aerodynamische Verkleidungen darüber zu bauen. Die Kosten skalieren mit der Waffengröße und die Kosten verdoppeln sich
    für Türme.

    #table(
      columns: 2,
      align: (left, left,),
      table.header([Waffengröße], [Kosten]),
      [Winzig],
      [Kostenlos],
      [Leicht],
      [1],
      [Mittel],
      [2],
      [Schwer],
      [5],
      [Artillerie],
      [Automatisch verkleidet, es sei denn in einem Turm.],
    )

    Flügel-montierte Waffen können nicht verkleidet werden, es sei denn, du hast Kragholme.

    Waffen, die durch den Spinner feuern, sind automatisch verkleidet.

    === Zugänglichkeit #html.elem("a", attrs: (id: "_Accessibility"))[]
    Waffen verklemmen. Einige müssen manuell nachgeladen werden. Waffen, an denen ein Besatzungsmitglied diese Art von
    Aktivitäten durchführen kann, werden als _zugänglich_ bezeichnet. Dies kann bedeuten, dass du die Waffe erreichen
    kannst, z. B. eine Foster-Halterung, die es dir ermöglicht, eine Waffe zu deinem Cockpit zu ziehen, oder es kann
    hydraulische Systeme beinhalten, um Waffen zu laden und Verklemmungen zu beseitigen.

    Waffensysteme sind als Gruppe zugänglich oder unzugänglich. Es gibt nie eine Situation, in der eine Waffe bedient werden
    kann, die andere aber nicht.

    Eine einzelne Waffenhalterung am Rumpf kann pro Besatzungsposition frei zugänglich gemacht werden. Welche bestimmte
    Waffe von welcher Besatzungsposition aus zugänglich ist, muss entschieden werden, wenn du die Waffen platzierst. Selbst
    wenn sie verkleidet waren, war es nicht ungewöhnlich, dass die Rückseiten dieser Waffen in den Cockpitbereich ragten
    oder dass ein einfacher mechanischer Plunger verwendet wurde, um Verklemmungen zu beseitigen.

    Alle Waffen, die an den Flügeln platziert werden, und zusätzliche Waffenhalterungen am Rumpf beginnen als unzugänglich.

    Verkleidete Waffen, die in einem Turm montiert sind (siehe unten), beginnen als zugänglich, wenn unverkleidete Waffen in
    derselben Halterung zugänglich wären.

    Es kostet Þ in Höhe der Hälfte der Waffen in einer Gruppe, sie alle zugänglich zu machen, Minimum 1.

    === Schussbereiche & Montage
    #label("_Arcs_\\&_Mounting")
    Wir teilen die Schussbereiche einer Waffe in die folgenden Richtungen ein.

    - Vorwärts
    - Rückwärts, Hoch, Runter, Links, Rechts

    _Feste_ Waffen feuern nur in eine dieser Richtungen, da sie direkt an der Flugzeugstruktur verschraubt sind. Diese
    Richtung wird wahrscheinlich Vorwärts sein, es sei denn, du machst etwas sehr Kluges.

    _Flexible_ Waffen können so geändert werden, dass sie in mehr als eine Richtung feuern können, mit verschiedenen
    Einstellungen für die Richtung, ohne gleichzeitig bewegt und abgefeuert zu werden. Flexible Waffen kosten 1þ und das
    gibt dir zwei Richtungen, in die die Waffe gerichtet werden kann. Sie können vom Piloten bedient werden.

    _Turm_ waffen sind jede Waffe, die flexibel an einem Punkt montiert ist. Sie erfordern einen dedizierten Bediener zum
    Zielen. Dies kostet 1þ für die Einrichtung und umfasst ein ganzes System, das vom Schützen gezielt wird. Wähle mehr als
    zwei Richtungen, in die die Waffe feuern soll. Das Erweitern des Schussbereichs eines Turms kostet 1þ für 2 zusätzliche
    Richtungen, dann je 1þ.

    Ein Turm hat anfänglich die Kapazität für eine einzelne Leichte Waffe (oder zwei Winzige Waffen). Sie können für 1þ auf
    eine mittlere Waffe, für 1 Masse und 3þ auf eine schwere Waffe und für 2 Masse und 5þ auf eine Artillerie-Waffe
    aufgerüstet werden. Wie üblich kannst du zwei beliebige Waffen einer Größe kleiner als die Kapazität im Turm montieren.

    Schließlich kannst du _Waffenhalterungen_ in ein Cockpit einbauen. Dies sind im Grunde Clips oder Halterungen, an denen
    eine Waffe befestigt werden kann, um in jede Richtung zu feuern. 3 Richtungen Bracing kosten 1þ. Diese Halterungen
    ermöglichen einem Beobachter einen Bonus von +1, um mit einer losen Waffe, die er in den Händen trägt, einen
    Persönlichen Angriff auszuführen. Der Nachteil ist, dass dies oft sehr gefährlich ist und häufige Wingwalking-Manöver
    erfordert.

    === Synchronisation #html.elem("a", attrs: (id: "_Synchronization"))[]
    Wenn du durch den Kreis eines Propellers feuern möchtest (vor dir bei einem Zugpropellerflugzeug oder hinter dir bei
    einem Schubpropellerflugzeug), musst du Vorkehrungen treffen, um die Propellerblätter nicht zu treffen. Dies geschieht
    durch Synchronisation. Um die verschiedenen Qualitäten der Synchronisationsoptionen darzustellen, verwenden wir die
    folgenden Optionen.

    - Ein Unterbrechergetriebe stellt die frühen Versionen dar und erhöht die Verklemmungschance der Waffe um 1. 2þ pro Waffe.
      Verfügbar in der Ära Erster Weltkrieg.
    - Ein Synchronisationsgetriebe stellt raffiniertere Systeme dar. 3þ pro Waffe. Verfügbar in der Ära Goldene Zwanziger.

    Ein Synchronisations-/Unterbrechergetriebe kann nur an einer Waffe montiert werden, die synchronisiert werden kann, und
    funktioniert nur, wenn die Waffe auch Fest ist.

    Wenn du sparsam bist, kannst du dies durch _Ablenkplatten_ ersetzen. Diese kosten 1þ und funktionieren, aber sie
    verursachen 1 Abnutzung an deinem Motor, jedes Mal, wenn du eine natürliche 5 oder weniger auf dem ersten Krit-Würfel
    würfelst!

    === Spinner-Waffen #html.elem("a", attrs: (id: "_Spinner_Weapons"))[]
    Wenn du einen untersetzten Propeller hast, kannst du eine Waffe so montieren, dass sie durch den Propeller-Spinner
    schießt. Dies stellt Dinge wie die mittige 37mm Kanone an der SPAD S.XII, die Kanone der BF 109 oder die P-39 dar.

    Spinner-Waffen umgehen die Notwendigkeit von Synchronisierern. Sie können keine Türme sein.

    Wenn du eine Artillerie-Waffe und/oder einen Umlaufmotor hast, muss dieser mittig mit einer verlängerten Antriebswelle
    montiert werden, um Platz für die Waffe an der Flugzeugnase zu schaffen.

    === Beispiele #html.elem("a", attrs: (id: "_Examples"))[]
    Hier sind einige Beispiele aus der realen Welt von Waffen an Flugzeugen zum Vergleich.

    Die Zwillings-MG-08s an der Albatros D.III werden im Flying Circus wie folgt ausgedrückt...

    - Ein _Paar_ von _unverkleideten, synchronisierten_ MGs, _fest_ am _Rumpf montiert, zugänglich_ für den Piloten.

    Die rohe Lewis-MG-Halterung an einer Nieuport 11 ist...

    - Ein _einzelnes, unverkleidetes_ LMG, _fest nach vorne_ am _Flügel montiert, zugänglich_ für den Piloten.

    Obwohl diese Waffen normalerweise nach hinten gekippt werden konnten, um sie zu säubern oder nachzuladen, bedeutete dies
    oft, dass man im Cockpit aufstehen musste, was eine ausgezeichnete Gelegenheit für narrative Komplikationen bot.

    Die verbesserte Foster-Halterung der SE.5 ist...

    - Ein _einzelnes, unverkleidetes, flexibles_ LMG, feuert nach vorne und oben, montiert am _Flügel, zugänglich_ für den
      Piloten.

    Flügel-montierte Waffen an einer Sopwith Dolphin sind...

    - Ein _Paar_ von _unverkleideten_ LMGs, _fest nach vorne_ am _Flügel montiert, unzugänglich_ für den Piloten.

    Eine frühe FE.2 hat...

    - 6 _Waffenhalterungen_ in ihrem Beobachtersitz für ein _LMG_;.

    die es dem Beobachter ermöglichen, in jede Richtung zu feuern.

    Die Motor-montierte Kanone der BF-109 ist...

    - Eine _einzelne, verkleidete_ leichte Kanone, _fest_ nach vorne _durch den Spinner feuernd, zugänglich_ für den Piloten.

    Die Waffe wurde durch Hydraulik zugänglich gemacht.

    == Zuladung #html.elem("a", attrs: (id: "_Load"))[]
    Die Zuladung ist alles, was zusätzlich zum Flugzeug hinzugefügt wird, nachdem es fertiggestellt ist. Hier entsteht der
    Unterschied zwischen der _Leermasse_ (das Flugzeug, wie es ist) und der _Beladenen Masse_ (das Flugzeug mit Treibstoff
    und Bomben).

    Die Beladene Masse ist im Wesentlichen _separate Masse_, und sie wird immer _aufgerundet_ auf die nächste MP, im
    Gegensatz zu den üblichen Berechnungen. Wenn du also ein Flugzeug hast, das 41 Leermasse (8MP) wiegt, kannst du nicht 3
    Treibstoff einfüllen und bei 8MP bleiben. Treibstoff kommt in regulären Tanks nur in 1MP-Schritten. 1 Masse Bomben oder
    5 zählt alles als 1 MP, also nimm, wenn möglich, eine gerade MP an Bomben.

    Dies dient der Vereinfachung der Buchführung am Tisch und stellt sicher, dass Treibstoff immer mit einem Malus verbunden
    ist.

    === Treibstoff #html.elem("a", attrs: (id: "_Fuel"))[]
    Motoren haben einen Treibstoffverbrauch, der eine abstrahierte Einheit Treibstoff verwendet. Jede Masse Treibstoff
    entspricht 25 dieser Punkte. Multipliziere also im Grunde die Menge der Treibstoffmasse mit 25, teile dann durch den
    Verbrauch aller deiner Motoren, und das ist die Anzahl der Treibstoffnutzungen, die du hast.

    Du kannst 2 Treibstofftanks in 1 Flugzeugsektion einbauen oder Treibstofftanks am Flügel für jeweils +3 Luftwiderstand
    hinzufügen. Wenn du einen Kragflügel hast, kannst du stattdessen 1 Treibstofftank pro 10 Fläche in die Flügel einbauen,
    ohne zusätzlichen Luftwiderstand.

    Ein Treibstofftank gibt dir bis zu 5 Masse Treibstoff. Der Tank selbst wiegt 1 Masse.

    Ein Mikrotank ist ein 1-Masse-Tank, der 25 Treibstoffeinheiten fasst und keine Struktursektion benötigt, aber im leeren
    Zustand immer noch 1 Masse wiegt und auf 4 pro Flugzeug begrenzt ist.

    Möchtest du nicht sterben? Diese helfen.

    - Fernbedienbarer Feuerlöscher: Hält 1. Gib den Halt aus, um ein Feuer zu löschen. 2 Masse, 3þ
    - Selbstdichtender Kraftstofftank: Gilt für alle internen Kraftstofftanks. Der Malus für Treibstofflecks gilt nur für den
      nächsten Treibstoff-Check. +1 Masse und +2þ pro Tank.

    === Bomben #html.elem("a", attrs: (id: "_Bombs"))[]
    Flugzeuge können, wenn dafür eingerichtet, Bomben mitführen. Wie genau das ausgefüllt wird, hängt von dir und deiner
    Zuladung zum Zeitpunkt ab. Flugzeuge sind je nach Ära begrenzt, wie viele Bomben sie mitführen können.

    Eine externe Bombenhalterung, die bis zu 5 Masse Bomben tragen kann, kostet 1 Masse und 1 Luftwiderstand und benötigt
    keine Struktursektion.

    Ein interner Bombenschacht belegt eine Struktursektion und ermöglicht die interne Mitführung von bis zu 10 Masse Bomben.
    Die größte Bombe, die du im Inneren deines Flugzeugs mitführen kannst, entspricht einem Viertel der gesamten internen
    Bombenzuladung.

    Du kannst die maximale Bombengröße eines Schachts erweitern, indem du Struktursektionen hinzufügst, um den Bombenschacht
    zu verlängern. Das Hinzufügen von +1 Struktur pro Schacht ermöglicht es dir, eine Bombe von bis zu der Hälfte der
    gesamten Zuladung mitzuführen, ein weiteres +1 Struktur ermöglicht es dir, eine einzelne Bombe in Höhe der gesamten
    Zuladung im Flugzeug mitzuführen. Das Erweitern des Schachts verdoppelt die Masse der Bomben, die darin mitgeführt
    werden können.

    Bombenmassen werden immer auf den nächsten Masse-Malus aufgerundet; 1 Masse Bomben wird immer noch als 1 Masse-Malus
    behandelt.

    Bei Verwendung externer Bombenträger reduzieren Bomben zusätzlich die Geschwindigkeit des Flugzeugs. Berechne die
    Geschwindigkeit des Flugzeugs neu, wobei Bomben Luftwiderstand in Höhe der ungerundeten Masse verursachen, und schreibe
    deine Höchstgeschwindigkeit als Höchstgeschwindigkeit mit Bomben/Höchstgeschwindigkeit auf.

    Bomben zählen nicht zu deinem beladenen MP für Fahrwerk und dergleichen.

    Die maximale Bombenzuladung variiert je nach Ära. Interne Bomben zählen mit 1/3#super[tel] der Rate externer Bomben. Zum
    Beispiel könnte ein Bomber aus dem Ersten Weltkrieg mit 100 Struktur 20 Bomben extern, oder 60 intern, oder eine
    Mischung wie 30 intern und 10 extern tragen.

    #table(
      columns: 7,
      align: (left, left, left, left, left, left, left,),
      table.header(
        [Ära],
        [Pionier],
        [Erster Weltkrieg],
        [Goldene Zwanziger],
        [Heraufziehender Sturm],
        [Zweiter Weltkrieg],
        [Letztes Hurra],
      ),
      [Maximale Bombenzuladung],
      [1/6 Struktur],
      [1/5 Struktur],
      [1/4 Struktur],
      [1/3 Struktur],
      [1/3 Struktur],
      [1/2 Struktur],
    )

    === Raketen #html.elem("a", attrs: (id: "_Rockets"))[]
    Raketen funktionieren genau wie Bomben.

    === Fracht #html.elem("a", attrs: (id: "_Cargo"))[]
    Fracht wird genau wie jede andere Zuladung behandelt und auf die nächsten 5 Masse aufgerundet. Da die meisten Dinge
    tatsächlich keinen Massenwert haben, improvisiere. Grob gesagt sind 25 Kilogramm 1 Masse.

    Der Frachtraum wird nur grob geschätzt, da die Dichte der Fracht und wie gut sie stapelbar ist, schwer vorherzusagen
    sind, daher haben wir nur ein paar verschiedene Größen von Frachträumen.

    - Ein winziges Fach kostet nur 1 Masse und gibt dir ein kleines Schließfach für persönliche Dinge.
    - Ein kleiner Raum fasst einen Koffer, ein Fass oder eine Kiste. Er erfordert eine Struktursektion.
    - Ein mittlerer Raum fasst ein kleines Fahrzeug wie ein Motorrad, Auto oder Zeppelinmotor. Er erfordert 3
      Struktursektionen.
    - Ein großer Raum fasst ein Aufklärungs- oder Jagdflugzeug mit abgenommenen Tragflächen. Er erfordert 5 Struktursektionen.
    - Ein riesiger Raum fasst so ziemlich alles, was du dir vorstellen kannst. Er erfordert 10 Struktursektionen.

    Jede hinzugefügte Struktursektion fügt dem Flugzeug beim Beladen mit Zeug +3 Beladene Masse hinzu. Wenn du es kaum
    gefüllt hast und viel Platz übrig hast, ignoriere das jedoch.

    Frachtraum kann genutzt werden, um Personen unbequem und vorübergehend zu lagern. Ausgenommen winzige Fächer.

    === Hardpoints #html.elem("a", attrs: (id: "_Hardpoints"))[]
    Beginnend in der Ära Zweiter Weltkrieg kannst du Hardpoints an Flugzeugen montieren. Hardpoints sind flexible
    Halterungen, die eine Vielzahl verschiedener Nutzlasten montieren können, wie Zusatztanks, Bomben, Raketen,
    Waffenbehälter oder Raketen.

    Das Hinzufügen eines Hardpoints kostet 5þ, und du kannst einen für jede 20 Struktur haben.

    Wir werden diese Regeln in Kürze schreiben.

    == Fahrwerk #html.elem("a", attrs: (id: "_Landing_Gear"))[]
    Unterseitiges Fahrwerk (Wähle 1)

    - Fahrwerk: +1 Luftwiderstand pro beladenem MP
    - Schwimmer: +1 ½ Luftwiderstand pro beladenem MP.
    - Hybrid-Schwimmer: +2 Luftwiderstand pro beladenem MP.
    - Bootsrumpf: +5 Masse. +1 Luftwiderstand und +1 Struktur pro beladenem MP.
    - Landekufe: Wenn du landest, würfle auf Go Down und erhalte -1 Ergebnis.

    Extras

    - Zeppelin-Haken: +1 Masse, ermöglicht Landung in Luftschiffen oder großen Flugzeugen.
    - Fanghaken: +1 Masse pro 2 MP. Ermöglicht Landung auf Flugzeugträgern.
    - Unterflügelkufe: +3 Luftwiderstand, +2 Aufprallsicherheit

    Fahrwerke (außer Kufen) können einziehbar gemacht werden, wobei der gesamte Luftwiderstand gegen die Hälfte dieses
    Wertes in Masse und die andere Hälfte als Kosten getauscht wird (wie üblich abrunden). Für einen Bootsrumpf füge
    stattdessen einziehbares Fahrwerk zu vollen Kosten hinzu, um Landungen sowohl auf Wasser als auch an Land zu
    ermöglichen.

    Diese hinzugefügte Masse macht das Fahrwerk nicht größer, keine Sorge.

    === Bootsrümpfe #html.elem("a", attrs: (id: "_Boat_Hulls"))[]
    Wenn du einen Bootsrumpf verwendest, musst du deine(n) Motor(en) vom Wasser fernhalten. Die Motoren müssen sich in einer
    Gondel, über einem Schulterdecker in Gondeln oder einem Kanal befinden, oder an einem anderen Flügel montiert sein.

    Im Grunde behandelt ein Bootsrumpf den gesamten Rumpf des Flugzeugs als Fahrwerk, sodass ein Schulterdecker ein
    Fahrwerksflügel wäre.

    == Zubehör #html.elem("a", attrs: (id: "_Upgrades"))[]
    === Panzerung #html.elem("a", attrs: (id: "_Armour"))[]
    Panzerung ist wirklich einfach. Sie kommt in Abdeckungs- und Dickenwerten. Die Masse der Panzerung ist Abdeckung mal
    2^(Dicke-1). Das heißt, für Dicke 3 ist es Abdeckung \* 4, und Dicke 5 ist Abdeckung \* 16. Die Kosten betragen 1/3 der
    Abdeckung \* Dicke.

    Zusätzlich multipliziere den Abdeckungs- und Dickenwert miteinander und füge diese Menge Zähigkeit zum Flugzeug hinzu.

    Die maximale Menge an Panzerung, die du haben kannst, beträgt 8 Abdeckung. Zusätzlich reduziert jeder 2. Vitalteil, den
    du über 8 hast (z. B. bei 10, 12, 14 usw.), deine effektive Abdeckung um 1, sodass du den Unterschied aufkaufen musst.
    Dies stellt die Schwierigkeit dar, zunehmend größere Flugzeuge mit wichtigeren zu schützenden Komponenten zu panzern.

    Der Panzerwurf, den du erhältst, ist 11 minus Abdeckung, der maximale Wurf beträgt also 3+. Panzerungsabdeckung mit
    höherer Dicke zählt für die Abdeckung bei geringeren Dicken, aber die Obergrenze bleibt 8/3+.

    Eine Platte hinter einem Piloten zum Schutz vor Gewehrkugeln hat 2 Abdeckung und Dicke 2.

    === Elektrische Systeme
    #label("_Electrical Systems")
    Alles, was Elektrizität erzeugt, erzeugt im Wesentlichen diese Menge an Elektrizität als Grundlinie, was bedeutet, dass,
    solange das, was du verwendest, nicht mehr Ladungen zieht als das, es "kostenlos" ist. Wenn es mehr Ladungen zieht, muss
    es diese aus einer Batterie ziehen.

    Batterien laden sich auf, wenn du Cool Down würfelst, wenn du eine Windmühle, eine Lichtmaschine oder einen Generator
    hast.

    #table(
      columns: 4,
      align: (left, left, left, left,),
      table.header([Name], [Effekte], [Kosten], [Ära]),
      [Windmühle],
      [+1 Luftwiderstand, +1 Ladungen pro 10 Geschwindigkeit.],
      [1þ],
      [Pionier],
      [Batterie],
      [+1 Masse, speichert 5 Ladungen.],
      [2þ],
      [Pionier],
      [Batterie (Hohe Qualität)],
      [Speichert 5 Ladungen.],
      [4þ],
      [Goldene Zwanziger],
      [Lichtmaschine],
      [+1 Masse, +1 Ladung, und zusätzlich +1 Ladungen pro 10 Leistung des Motors, auf den es angewendet wird.],
      [2þ],
      [Pionier],
    )

    Elektrizität kann Waffen und Motoren antreiben. Sie kann auch die folgenden Kommunikationssysteme betreiben.
    Gegensprechanlagen, Suchscheinwerfer, Navigationslichter, Funkempfänger und Ventilatoren verbrauchen nie Ladungen,
    erfordern aber ein elektrisches System.

    #table(
      columns: 4,
      align: (left, left, left, left,),
      table.header([Name], [Effekte], [Kosten], [Ära]),
      [Gegensprechanlage],
      [Erfordert das Vitalteil Elektrik.],
      [1þ],
      [Pionier],
      [Funkempfänger],
      [+2 Masse, +2 Luftwiderstand, erfordert das Vitalteil Elektrik.],
      [3þ],
      [Pionier],
      [Funksender],
      [+3 Masse, +3 Luftwiderstand, -1 Ladung.],
      [3þ],
      [Erster Weltkrieg],
      [Funkgerät],
      [+5 Masse, +3 Luftwiderstand, -1 Ladung],
      [3þ],
      [Erster Weltkrieg],
      [Funkempfänger (Hohe Qualität)],
      [+1 Masse, +2 Luftwiderstand, erfordert das Vitalteil Elektrik.],
      [6þ],
      [Goldene Zwanziger],
      [Funksender (Hohe Qualität)],
      [+2 Masse, +3 Luftwiderstand, -1 Ladung.],
      [6þ],
      [Goldene Zwanziger],
      [Funkgerät (Hohe Qualität)],
      [+3 Masse, +3 Luftwiderstand, -1 Ladung],
      [6þ],
      [Goldene Zwanziger],
      [Funkempfänger aus Walknochen],
      [Erfordert das Vitalteil Elektrik. Kann nur mit der gekoppelten Funkbasisstation aus Walknochen kommunizieren.],
      [5þ],
      [Himmilgard],
      [Funkbasisstation aus Walknochen],
      [+6 Masse, +1 Luftwiderstand, -1 Ladung.],
      [12þ],
      [Himmilgard],
      [Funkbasisstation aus Walknochen (Hohe Qualität)],
      [+5 Masse, +1 Luftwiderstand, -1 Ladung.],
      [24þ],
      [Himmilgard],
    )

    === Informationen #html.elem("a", attrs: (id: "_Information"))[]
    Hier sind einige Möglichkeiten, Daten zu sammeln.

    #table(
      columns: 3,
      align: (left, left, left,),
      table.header([Name], [Effekte], [Kosten]),
      [Integrierte Aufklärungskamera],
      [Kann Bilder nach unten aufnehmen. Fähigkeiten skalieren mit der Ära.],
      [2þ],
      [Bordkamera],
      [Bestätigt deine Abschüsse für dich.],
      [1þ],
    )

    === Sichtbarkeit #html.elem("a", attrs: (id: "_Visibility"))[]
    Besser und weiter sehen.

    #table(
      columns: 3,
      align: (left, left, left,),
      table.header([Name], [Effekte], [Kosten]),
      [Flügel-Aussparungen],
      [+1 Sicht, +1 Lift Bleed. Kann nicht mit abgedeckten Transparenten Zelluloidflügeln verwendet werden.],
      [\-],
      [Rumpf-Aussparungen],
      [+1 Sicht, -5 Struktur. Kann nicht mit abgedeckten Transparenten Zelluloidstrukturen verwendet werden.],
      [\-],
      [Suchscheinwerfer],
      [Kann Ziele bei Nacht erkennen. Erfordert das Vitalteil Elektrik.],
      [1þ],
    )

    === Klimatisierung #html.elem("a", attrs: (id: "_Climate_Control"))[]
    Wenn du einen Hochhöhenflieger oder ein Wasserflugzeug für kalte Gewässer baust, brauchst du Heizung. Wenn du in den
    Tropen oder der Wüste fliegst, ist es wichtig, kühl zu bleiben. Diese können Stresseffekte durch ungünstiges Klima
    mindern.

    #table(
      columns: 3,
      align: (left, left, left,),
      table.header([Name], [Effekte], [Kosten]),
      [Elektrische Heizung],
      [-1 Ladung.],
      [1þ],
      [Kühlerkreislauf],
      [Erfordert einen Kühler.],
      [1þ],
      [Einfacher Ventilator],
      [(Verschoben in den Abschnitt Cockpit)],
      [\-],
      [Klimaanlage],
      [-2 Ladungen],
      [4þ],
    )

    === Autopiloten #html.elem("a", attrs: (id: "_Autopilots"))[]
    Autopiloten wurden innerhalb eines Jahrzehnts nach der Erfindung des Flugzeugs eingesetzt, und einige, die im Flying
    Circus verfügbar sind, sind eher fantastisch.

    Diese werden dein Leben erleichtern.

    #table(
      columns: 4,
      align: (left, left, left, left,),
      table.header([Name], [Effekte], [Kosten], [Ära]),
      [Gyroskopischer Autopilot],
      [Verleiht +4 auf Leerersitz-Würfe.],
      [3þ],
      [Erster Weltkrieg],
      [Höhenhaltung],
      [+1 Masse, ermöglicht, die Leerersitz-Regel zu ignorieren.],
      [5þ],
      [Heraufziehender Sturm],
      [Mechanisch programmierbar],
      [+1 Masse. Kann einen einzelnen einfachen Befehl erhalten, z.B. steigen, sinken, drehen, zu einem Ort fliegen. Kann
        keinen Dogfight führen, keine Waffen abfeuern, keine Bomben abwerfen oder landen.],
      [6þ],
      [Himmilgard],
      [Programmierbar],
      [+1 Masse, -2 Ladungen. Kann einen einzelnen einfachen Befehl erhalten, z.B. steigen, sinken, drehen, zu einem Ort
        fliegen. Kann keinen Dogfight führen, keine Waffen abfeuern, keine Bomben abwerfen oder landen.],
      [6þ],
      [Zweiter Weltkrieg],
      [Rattenhirn],
      [+3 Masse, -3 Ladungen. Führt das Fliegen für dich aus, ist voll automatisiert. Spieler verwenden diese normalerweise
        nicht, sie sind für Roboter-Flugzeuge.],
      [25þ],
      [Himmilgard oder Letztes Hurra],
    )

    === Steuerungssysteme #html.elem("a", attrs: (id: "_Control_Systems"))[]
    Normalerweise steuerst du dein Flugzeug, indem du direkt an Drähten ziehst. Das ermöglicht dir, es besser zu machen.
    Wähle eins. Siehe Pilotenermüdung für die vollständigen Regeln.

    #table(
      columns: 4,
      align: (left, left, left, left,),
      table.header([Name], [Effekte], [Kosten], [Ära]),
      [Steuerstangen],
      [+1 Masse. Maximaler Flugstress durch MP ist 1.],
      [2þ],
      [Erster Weltkrieg],
      [Hydraulisch unterstützt],
      [+3 Masse, eliminiert Flugstress durch MP.],
      [5þ],
      [Zweiter Weltkrieg],
      [Fly-by-Wire],
      [+3 Masse. Eliminiert jeglichen Flugstress.],
      [10þ],
      [Letztes Hurra],
    )

    == Propeller #html.elem("a", attrs: (id: "_Propeller"))[]
    Wenn du deinen Propeller montierst, erhält er eine Blattneigung. Notiere dir dies für spätere Berechnungen. Wenn du
    Pulsstrahltriebwerke verwendest, erhältst du trotzdem Zahlen, obwohl du keinen Propeller hast.

    #table(
      columns: 5,
      align: (left, left, left, left, left,),
      table.header([Propeller-Modifikator], [Pitch Speed Modifikator], [Pitch Boost Modifikator], [Energie], [Wende]),
      [Hohe Leistung],
      [.8],
      [0.9],
      [1.5],
      [8],
      [Leistung],
      [.9],
      [0.8],
      [2],
      [7],
      [Standardblattneigung],
      [1],
      [0.6],
      [3],
      [6],
      [Geschwindigkeit],
      [1.1],
      [0.4],
      [4],
      [5],
      [Hohe Geschwindigkeit],
      [1.2],
      [0.3],
      [4.5],
      [4],
      [Pulsstrahltriebwerk],
      [1.3],
      [0.6],
      [5],
      [2.5],
    )

    Jeder dieser Blattneigungswerte stellt einen einzigartigen Propeller dar, wobei jeder Propeller Kosten von 1þ hat. Dein
    erster Propeller pro Motor ist immer kostenlos und kann beliebig gebaut werden.

    Du kannst deinen Propeller (außer Pulsstrahltriebwerke, die haben keine eigentlichen Propeller) stattdessen auf eine der
    folgenden Optionen aufrüsten.

    #table(
      columns: 4,
      align: (left, left, left, left,),
      table.header([Name], [Effekte], [Kosten pro Propeller], [Ära]),
      [Manuell verstellbar],
      [Ermöglicht die Einstellung der Blattneigung am Boden, ohne den Propeller austauschen zu müssen.],
      [2þ],
      [Pionier],
      [Automatisch verstellbar],
      [+1 Masse. +0.1 Pitch Speed, +0.1 Pitch Boost, \+0.5 Energie, +1 Wende.],
      [8þ],
      [Goldene Zwanziger],
    )

    === Optimierung #html.elem("a", attrs: (id: "_Optimization"))[]
    Optimierungen sind leicht zu missbrauchen. Sie sollten nur verwendet werden, um spezifische Designentscheidungen
    darzustellen, die nicht in den Werten eines Flugzeugs widergespiegelt sind, oder um ein echtes Flugzeug seinen
    tatsächlichen Werten anzunähern. Zum Beispiel ist die V-173 Flying Pancake darauf ausgelegt, erhöhten Luftwiderstand
    gegen reduzierten Lift Bleed einzutauschen.

    Optimierungen erfolgen nach allem anderen. Zum Beispiel erhöhen oder verringern Massenoptimierungen nicht den
    Luftwiderstand durch externes Fahrwerk.

    Prozentuale Modifikatoren verwenden den ursprünglichen, unmodifizierten Wert: sie kumulieren nicht. Denke daran,
    abzurunden.

    Balanciere die Tabelle.

    Benutze hier deinen gesunden Menschenverstand: teurer ist schlechter, mehr Zähigkeit oder Maximale Belastung ist besser!

    #table(
      columns: 7,
      align: (left, left, left, left, left, left, left,),
      table.header(table.cell(colspan: 3, [Negativ]), [*Effekt*;], table.cell(colspan: 3, [Positiv])),
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [Kosten: +/- 10% Kosten],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [Auftriebseffizienz: +/- 3 Lift Bleed],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [Beinfreiheit: +/- 1 Flucht, Sicht],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [Masse: +/- 10% Masse (ohne Bombenmasse)],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [Redundanz: +/- 25% Zähigkeit],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [Unterstützung: +/- 15% Maximale Belastung],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [Zuverlässigkeit: +/- 2 Zuverlässigkeit],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [Stromlinienform: +/- 10% Luftwiderstand (ohne Treibstoff oder Bomben)],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
    )

    == Endgültige Berechnungen #html.elem("a", attrs: (id: "_Final_Calculations"))[]
    *Berechnungsverfahren*

    Berechne jeden dieser Werte für vollen Treibstoff mit Bomben (auch Fracht, Passagiere usw.), vollen Treibstoff und
    leeren Treibstoff. Die Halb-Treibstoff-Versionen davon sind der Durchschnitt der Werte für vollen und leeren Treibstoff,
    abgerundet.

    *Masse*

    Addiere alle deine Massenpunkte. Dein Masse-Malus (MP) ist 1/5 davon (abgerundet), Minimum 1.

    Beziehe die Masse deines Treibstoffs oder deiner Bomben nicht mit ein (dies ist deine Leermasse). Beladener MP
    beinhaltet die Masse deines Treibstoffs und deiner Bomben. Halte deinen MP niedrig, damit du leichter steigen und
    manövrieren kannst.

    *Luftwiderstand*

    Addiere deinen Masse-Malus (MP) direkt zu deinem Luftwiderstand. Addiere dann alle deine Luftwiderstandspunkte. Dein
    Luftwiderstands-Malus (DP) ist 1/5 davon (abgerundet), Minimum 1.

    Halte deinen DP niedrig, um schneller zu fliegen.

    *Leistung, Boost & Dropoff*

    Die Höchstgeschwindigkeit deines Flugzeugs wird durch diese Gleichung bestimmt, die die Gesamtleistung deines Motors mit
    deinem Luftwiderstands-Malus vergleicht.

    Höchstgeschwindigkeit =~Pitch Speed \* √((2000 \* Leistung) / (DP \* 9)))

    Runde ab, wie üblich.

    Du kannst dies auch verwenden, um den Wert zu berechnen.

    Dein Boost ist die Leistung deines Motors (oder deiner Motoren) geteilt durch deinen MP, abgerundet. Wenn du 0 erhältst,
    brauchst du mehr Leistung, um die Ruhereibung zu überwinden, also nimm größere Motoren oder verliere Gewicht.

    Dein Dropoff ist deine endgültige Höchstgeschwindigkeit multipliziert mit deinem Pitch Boost Modifikator.

    *Steigrate*

    Die Steigrate ist (23 \* Leistung) / (Beladener MP \* Pitch Speed \* DP), Minimum 1.

    *Abrissgeschwindigkeit*

    Um deine Abrissgeschwindigkeit zu erhalten, multipliziere Lift Bleed mit Masse-Malus und teile durch Flügelfläche.

    *Stabilität*

    Addiere einfach deine beiden Stabilitäten, um deinen Wert zu erhalten. Wenn jedoch beide deiner Stabilitäten positiv
    sind, füge zusätzlich +2 Stabilität hinzu, und tue das Gegenteil, wenn sie beide negativ sind. Flugzeuge müssen ein
    wenig instabil sein, um zu fliegen, aber zu instabil, und sie fliegen nicht wirklich.

    Deine Stabilität erzeugt einen Steuerungsmodifikator wie folgt.

    #table(
      columns: 10,
      align: (left, left, left, left, left, left, left, left, left, left,),
      table.header([Stabilität], [-10], [-7 bis -9], [-4 bis -6], [-1 bis \-3], [0], [+1 bis +3], [+4 bis +6], [+7 bis +9], [+10]),
      [Steuerungsmodifikator],
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

    Ein Flugzeug mit mehr als 10 oder weniger als -10 Stabilität ist für Menschen nicht fliegbar.

    *Wendigkeit*

    Wendigkeit = 100 + Steuerung - Masse-Malus

    *Energieverlust vs. Kurvenverlust*

    Diese beiden Werte geben an, wie viel Geschwindigkeit du beim Hochziehen verlierst und wie viel Geschwindigkeit du in
    einer Kampfwende verlierst. Sie werden von deinen Energie- und Wende-Werten aus der Blattneigung deines Propellers
    beeinflusst. Pulsstrahltriebwerke sind in derselben Tabelle, obwohl sie keine eigentlichen Propeller verwenden.

    Dein Kurvenverlust ist

    Abrissgeschwindigkeit (halber Treibstoff, keine Bomben) geteilt durch Propellerblattneigung Wende.

    Aus Gründen der Ausgewogenheit runde auf, Minimum 1.

    Dein Kurvenverlust beträgt +1, während du Bomben, Raketen, Fracht oder Passagiere mitführst.

    Dein Energieverlust ist

    Luftwiderstands-Malus (keine Bomben) geteilt durch Propellerblattneigung Energie

    Aus Gründen der Ausgewogenheit runde auf, Minimum 1, Maximum 10.

    *Pilotenermüdung*

    Der Standard-Stress pro Flug beträgt 1. Du erhältst +1 Stress für jeden der Faktoren, der zutrifft.

    - Eine Stabilität über 3 oder unter -3.
    - Alle 10 MP.
    - Pro Punkt Rumble (maximal 3).
    - Ein Zugpropeller-Umlaufmotor + ein offenes Cockpit.

    Copiloten können Stress von allem außer Rumble und Umlaufmotoren reduzieren.

    Wenn du Steuerstangen hast, beträgt der maximale Flugstress durch Masse-Malus 1.

    Wenn du hydraulisch unterstützte Steuerungen hast, erleidest du keinen Flugstress durch die Flugzeugmasse.

    Fly-by-Wire-Steuerungen eliminieren jeglichen Flugstress, außer wenn dir Öl aus den Umlaufmotoren ins Gesicht spritzt.
    Schlafe einfach nicht in deinem langweiligen Fahrzeug ein.

    *Wartung*

    Dieser Wert ist Motorleistung geteilt durch 10 oder die Gesamtkosten aller Motoren, je nachdem, welcher Wert niedriger
    ist. Für diesen Zweck zählen Generatoren als Motoren und verwenden die Leistung vor der Reduzierung (d.h.
    Schub-Zug-Motoren).

    *Maximale Belastung und Zähigkeit*

    Deine Gesamtstruktur ist einfach deine Struktur. Keine Modifikationen sind erforderlich.

    Ziehe am Ende deinen MP von deiner Maximalen Belastung ab. Deine Maximale Belastung ist immer auf deine Gesamtstruktur
    begrenzt.

    Deine Zähigkeit ist Struktur/5 + Panzerung.

    *Vitalteile*

    Bestimme die Liste der Vitalteile wie folgt.

    Alle Flugzeuge haben das Vitalteil Steuerung.

    Alle Flugzeuge haben ein Vitalteil für ihr Fahrwerk, was auch immer es ist.

    Jedes Waffensystem am Flugzeug ist ein Vitalteil.

    Wenn das Flugzeug überhaupt elektrische Systeme hat, bilden sie alle ein Vitalteil namens Elektrik.

    Wenn das Flugzeug überhaupt Treibstofftanks hat, bilden sie zusammen ein Vitalteil.

    - Jeder Motor ist ein Vitalteil.
    - Jeder Kühler ist ein Vitalteil.
    - Jeder Öltank ist ein Vitalteil.
    - Jeder Ölkühler ist ein Vitalteil.
    - Jede Ölwanne ist ein Vitalteil.

    #table(
      columns: 1,
      align: (left,),
      table.header([Doppelflugzeug]),
      [Eine billige und einfache Möglichkeit, einen schweren Jäger zu bauen, besteht darin, zwei leichte Jäger
        zusammenzukleben. Addiere einfach alle ihre Werte und berechne sie neu. Du kannst optional das andere Cockpit entfernen,
        um 1 Masse zu sparen, aber ansonsten funktionieren beide.

        Das resultierende Flugzeug kann dann selbst modifiziert werden. Technisch könntest du auf diese Weise auch ein
        Dreifach-Flugzeug oder mehr bauen! Aber dann wird es ein bisschen albern.

      ],
    )

    == Eigenkonstruktionen #html.elem("a", attrs: (id: "_Home_Engineering"))[]
    So umfassend dieses System auch sein mag, es kann nicht immer alles abdecken. Manchmal möchtest du über die Grenzen des
    Systems hinausgehen, oder du glaubst, dass dein Charakter etwas Kluges tun kann. Hier kommt die Eigenkonstruktion ins
    Spiel.

    === Unweise Modifikation #html.elem("a", attrs: (id: "_Unwise_Modification"))[]
    Geh zu deinem Spielleiter und sage: "Ich habe eine Idee für etwas, das ich mit meinem Flugzeug machen möchte." Lege die
    Mechaniken dar, wie du dir das vorstellst.

    Wenn diese Modifikation das System nicht völlig sprengt, wird der Spielleiter dir einen fairen Preis dafür in Thaler,
    Luftwiderstand, Masse usw. berechnen. Sie sollten sich immer auf der günstigeren Seite irren.

    Die Modifikation hat den von dir gewünschten Effekt, aber es gibt einen Preis. Der Spielleiter kann einen neuen Schweren
    Zug hinzufügen, den er gegen dich verwenden kann, wie folgt.

    Ihre spezielle Modifikation schlägt auf spektakuläre und schreckliche Weise fehl.

    Sie müssen es nie verwenden. Es mag nie vorkommen. Aber es ist da.

    Drohend.

    == Gebrauchte Flugzeuge #html.elem("a", attrs: (id: "_Used_Planes"))[]
    Die meisten Flugzeuge, die Spieler kaufen oder bergen, sind Gebraucht. Gebrauchte Flugzeuge kosten die Hälfte des
    Listenpreises in Thaler (abgerundet), haben aber einen der folgenden Nachteile. Nachdem du es gekauft hast, würfle 1W10,
    um herauszufinden, was damit nicht stimmt! Wenn eine Regel dir mehrere gebrauchte Mali gibt, können sie nicht gleich
    sein.

    #table(
      columns: 3,
      align: (left, left, left,),
      table.header([W10], [Name], [Malus]),
      [1],
      [Wrack],
      [Würfle erneut, zweimal! Wenn du dies noch einmal erhältst, ignoriere es.],
      [2],
      [Ausgebrannt],
      [Motoren haben -1 Zuverlässigkeit],
      [3],
      [Zerzaust],
      [Reduziere deine Höchstgeschwindigkeit um 10%.],
      [4],
      [Wuchtig],
      [Erhöhe deine Abrissgeschwindigkeit um 20%.],
      [5],
      [Klebrige Waffen],
      [Erhöhe die Wahrscheinlichkeit, dass Waffen verklemmen, um 1.],
      [6],
      [Schwach],
      [Halbiere die Zähigkeit des Flugzeugs.],
      [7],
      [Zerbrechlich],
      [Reduziere Maximale Belastung um 20%.],
      [8],
      [Undicht],
      [Reduziere deinen Treibstoff um 20%.],
      [9],
      [Träge],
      [Reduziere deine Wendigkeit um 5.],
      [10],
      [Neuwertig],
      [Kein Malus],
    )

    Es kostet 5 Thaler, ein Gebraucht-Flugzeug zu restaurieren und den Nachteil zu beseitigen, und du musst mindestens eine
    Mission fliegen, bevor es repariert werden kann. Jeder weitere Flug reduziert die Kosten um 1: nach sechs Flügen
    reparierst du es kostenlos.

    == Höhenregeln #html.elem("a", attrs: (id: "_Altitude_Rules"))[]
    Die meisten Kampagnen werden nicht sehr detailliert mit den Höhenregeln interagieren, daher empfiehlt das Regelwerk, sie
    zu ignorieren, wenn sie nicht kritisch sind. Wenn du die Höhenregeln verwendest, zeigt dieser Abschnitt die Auswirkungen
    auf dein Flugzeug. Wenn du in höhere Höhen aufsteigst, wird die Luft dünner. Luftwiderstand, Auftrieb und Steuerbarkeit
    werden reduziert, und Motoren kämpfen, um genug Sauerstoff zu bekommen. Die Regeln zur Berechnung findest du auf Seite
    56 des Grundregelwerks.

    Dein Höhenfaktor (HF) ist wie der Geschwindigkeitsfaktor; die Zehnerstelle auf deinem Instrument. Die Leistung deines
    Flugzeugs ändert sich mit dem Höhenfaktor. Die Abrissgeschwindigkeit erhöht sich mit der Höhe, und dein Motor arbeitet
    nur innerhalb deines Idealen Höhenbereichs (IHB) mit Spitzenleistung.
  ]
]