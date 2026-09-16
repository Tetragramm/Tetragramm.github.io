#html.elem(
  "html",
)[
  #html.elem("head")[
    #html.elem("meta", attrs: (charset: "utf-8"))[]
    #html.elem("meta", attrs: (name: "viewport", content: "width=device-width, initial-scale=1"))[]
    #html.elem("title")[Reglas del Constructor de Aviones de Flying Circus]
    #html.elem("link", attrs: (rel: "shortcut icon", type: "image/x-icon", href: "../favicon.ico"))
    #html.elem("link", attrs: (rel: "stylesheet", type: "text/css", href: "../page/style.css"))[]
  ]
  #html.elem(
    "body",
  )[
    #html.elem("h1")[Reglas del Constructor de Aviones]
    Estas son las reglas que usarás para crear aviones. Este es un proyecto complejo y laborioso, ¡pero puedes lograrlo!

    = Estadísticas de Construcción de Aviones
    #label("_Plane Building Stats")
    Aquí tienes una lista de las estadísticas importantes para los aviones a medida que los construyes.

    Estadísticas de Entrada

    - Masa: La Masa es cuánto pesan las cosas. Mantener la masa baja es una prioridad, pero los motores se hacen mucho más grandes a medida que son más potentes, por lo que importa cada vez menos con el tiempo.
    - Drag: Drag (Resistencia Aerodinámica) es cuánto atrapa el flujo de aire, ralentizando el avión. Cuanto menor, mejor.
    - Estructura: Se utiliza para determinar cuán resistente es un avión en general. La Estructura se utiliza como límite para la Tensión Máxima y eventualmente se relaciona con la estadística de Resistencia (Toughness). Cuanto mayor, mejor.
    - Estabilidad: Se utiliza para determinar cuán estable es la aeronave en vuelo. Se divide en dos estadísticas, que se sintetizarán al final para crear la estadística de Estabilidad final. Menos o más depende de lo que quieras que haga la aeronave.
      - Estabilidad Lateral: Combina la estabilidad de Guiñada (Yaw) y Alabeo (Roll). Suele ser menor, especialmente en aviones con alto torque.
      - Estabilidad de Cabeceo: Suele ser la mayor de las dos, esta estadística se cambia más fácilmente.
    - Control: Cuánto control tiene la aeronave. Cuanto más, mejor.
    - Costo: Cuánto cuesta todo. Más cuesta más.
    - Secciones: Cuán grande físicamente es el fuselaje de la aeronave. Más significa una aeronave más grande y pesada.
    - Área del Ala: Cuán grande es un ala. Más grande induce más Drag pero también levanta aviones más pesados.
    - Envergadura del Ala: Cuán larga es un ala. Más larga es más eficiente para el Drag y más estable, pero más frágil y reduce el Control.
    - Pérdida de Sustentación: Cuán eficientes son las alas. Cuanto menor, mejor.
    - Potencia: Cuánto impulso tiene el motor.

    Estadísticas de Salida

    - Velocidad Máxima: Qué tan rápido vuela el avión.
    - Boost: Qué tan rápido acelera el avión.
    - Caída de Velocidad (Dropoff): El punto de velocidad en el que tu motor es más o menos eficiente.
    - Stall Speed: Qué tan lento puede ir el avión antes de caer del cielo.
    - Maniobrabilidad (Handling): Qué tan bien se maneja la aeronave.
    - Integridad Estructural: Qué tan resistente es el avión. Básicamente HP. Se divide en dos estadísticas.
    - Tensión Máxima: Cuántas Fuerzas G puede soportar el avión.
    - Resistencia (Toughness): Salud adicional.
    - Visibilidad: Qué tan difícil es ver fuera del avión.
    - Estabilidad: Qué tan bien el avión no se voltea accidentalmente.
    - Capacidad de Combustible: Cuánto combustible lleva el avión.
    - Estrés por Vuelo: Cuán difícil es volar el avión por un tiempo.

    Estadísticas de Seguridad

    - Seguridad en Caída: Qué tan seguro es realizar un aterrizaje forzoso.
    - Escape: Qué tan fácil es salir con prisa.
    - Mantenimiento: Cuánto cuesta la aeronave por rutina (solo juego estándar).

    == Nociones Básicas #html.elem("a", attrs: (id: "_Basics"))[]
    Los aviones se construyen a partir de componentes. Lo construiremos parte por parte en el siguiente orden.
    - #html.elem("a", attrs: (href: "#_Era"))[Era]: ¿De cuándo es el avión?
    - #html.elem("a", attrs: (href: "#_Crew"))[Tripulación]: Definir quién está dentro de la aeronave y los pasajeros.
    - #html.elem("a", attrs: (href: "#_Engines"))[Motores]: Definir cómo se impulsa la aeronave y cómo se enfría.
    - #html.elem("a", attrs: (href: "#_Frame_and_Covering"))[Estructura y Revestimiento]: Poner una estructura real alrededor de todo.
    - #html.elem("a", attrs: (href: "#_Wings"))[Alas]: Hacerlo volar.
    - #html.elem("a", attrs: (href: "#_Stabilizers"))[Estabilizadores]: Mantener el avión firme.
    - #html.elem("a", attrs: (href: "#_Control_Surfaces"))[Superficies de Control]: Dirigir el avión.
    - #html.elem("a", attrs: (href: "#_Reinforcement"))[Refuerzos]: Asegurarse de que la aeronave se mantenga unida.
    - #html.elem("a", attrs: (href: "#_Weapons"))[Armamento]: Con qué está armada la aeronave.
    - #html.elem("a", attrs: (href: "#_Load"))[Carga]: Combustible, Bombas y Carga.
    - #html.elem("a", attrs: (href: "#_Landing_Gear"))[Tren de Aterrizaje]: Dónde el avión se encuentra con la tierra.
    - #html.elem("a", attrs: (href: "#_Upgrades"))[Accesorios]: Mejoras para hacer el avión mejor.
    - #html.elem("a", attrs: (href: "#_Propeller"))[Hélice]: Qué tipo de hélice poner en el avión.
    - #html.elem("a", attrs: (href: "#_Optimization"))[Optimizaciones]: Afinar la aeronave.
    - #html.elem("a", attrs: (href: "#_Final_Calculations"))[Estadísticas Finales]: Unirlo todo en un perfil que puedas usar en el juego.
    - #html.elem("a", attrs: (href: "#_Used_Planes"))[Aviones Usados]: Reglas para comprar aviones usados.
    - #html.elem("a", attrs: (href: "#_Altitude_Rules"))[Efectos de Altitud]: ¿Qué pasa cuando vas muy alto?

    Tu avión generalmente necesitará, como mínimo, un piloto, un motor y algunas alas. Sin alas, es un coche. Sin motor, es un planeador. Sin piloto, es un misil.

    Al construir el avión, recuerda que los aviones no pueden tener Drag o Masa negativos; si logras hacer uno así, siempre tendrás al menos 1 MP y 1 Drag.

    == Era #html.elem("a", attrs: (id: "_Era"))
    Tu Era determinará algunos factores sobre tu aeronave al inicio. El Flying Circus regular es generalmente de la Era WWI. Cuando estés haciendo una aeronave real, sé un poco estricto con las eras; un Spitfire FR.XIV es técnicamente de 1944 y una aeronave de Last Hurrah, pero el motor es de la WW2 y la aerodinámica es mayormente de Coming Storm. Para diseños personalizados, es mejor que la mayoría de los personajes se mantengan dentro de los límites de la era, con quizás una excepción. Los Estudiantes, con sus diseños de vanguardia, pueden tener dos componentes, o un componente dos eras por delante. Como siempre, discútelo con el Director de Juego y el resto del grupo.

    #table(
      columns: 7,
      align: (left, left, left, left, left, left, left,),
      table.header(
        [Era],
        [Años],
        [Pérdida de Sustentación],
        [Carga Máxima de Bombas],
        [Bonificación de Voladizo],
        [Ajuste de Costo],
        [Modificador de Estabilidad de Cabeceo],
      ),
      [Pioneer],
      [1903-1914],
      [30],
      [1/6 Estructura],
      [+4],
      [-2þ],
      [+0],
      [WW1],
      [1915-1919],
      [25],
      [1/5 Estructura],
      [+3],
      [0þ],
      [+0],
      [Roaring 20s],
      [1920-1929],
      [23],
      [1/4 Estructura],
      [+1],
      [+5þ],
      [+0],
      [Coming Storm],
      [1930-1938],
      [22],
      [1/3 Estructura],
      [0],
      [+10þ],
      [+2],
      [WW2],
      [1939-1943],
      [20],
      [1/3 Estructura],
      [0],
      [+15þ],
      [+2],
      [Last Hurrah],
      [1944+],
      [18],
      [1/2 Estructura],
      [0],
      [+20þ],
      [+2],
    )

    Los componentes de la aeronave están asociados con una era, cuando se hicieron ampliamente disponibles por primera vez. Para Himmilgard, esta era es WWI. Esta no es una regla estricta e inquebrantable; los aviones suelen tener características adelantadas a su tiempo, y al replicar un avión real, simplemente usa las características que poseía realmente. Para diseños personalizados, es mejor para la mayoría de los personajes permanecer dentro de los límites de la era, con quizás una excepción. Los Estudiantes, con sus diseños de vanguardia, pueden tener dos componentes, o un componente dos eras por delante. Como siempre, discútelo con el Director de Juego y el resto del grupo.

    == Tripulación #html.elem("a", attrs: (id: "_Crew"))[]
    Cada miembro de la tripulación, incluyendo el piloto, se sienta dentro de la estructura de la aeronave.

    === Cabinas #html.elem("a", attrs: (id: "_Cockpits"))[]
    Primero, decide a continuación cómo se construye la cabina seleccionando una para cada posición de tripulación.

    Los modificadores de Visibilidad, Estrés por Vuelo y Escape se aplican a cada posición de tripulación individualmente.

    #table(
      columns: 5,
      align: (left, left, left, left, left,),
      table.header([Tipo], [Descripción], [Efectos], [Costo], [Era]),
      [Abierta],
      [El piloto está completamente expuesto al aire.],
      [+1 Masa, +3 Drag, +2 Escape, +1 Visibilidad],
      [\-],
      [Pioneer],
      [Parabrisas],
      [Una pieza de cristal delante del piloto.],
      [+2 Masa, +1 Drag. +2 Escape, +1 Visibilidad],
      [1þ],
      [Pioneer],
      [Sellada],
      [No hay ventana ni vista exterior.],
      [+2 Masa, -3 Escape, -1 Estrés por Vuelo. Este miembro de la tripulación no puede ver fuera.],
      [1þ],
      [Pioneer],
      [Canopy Estrecha],
      [Una estructura con pequeñas ventanas.],
      [+3 Masa, -1 Visibilidad. -1 Estrés por Vuelo.],
      [3þ],
      [WWI],
      [Canopy de Burbuja],
      [Una cabina hecha de cristal curvado.],
      [+3 Masa, -3 Drag, -1 Estrés por Vuelo],
      [8þ],
      [WWII],
    )

    A cada cabina, puedes añadir las siguientes mejoras.

    #table(
      columns: 4,
      align: (left, left, left, left,),
      table.header([Mejora], [Descripción], [Costo], [Era]),
      [Controles de Copiloto],
      [Permite que este asiento también controle la aeronave. -2 Estrés por Vuelo para Pilotos.],
      [1þ],
      [Pioneer],
      [Escotilla de Escape],
      [+1 Masa, +3 Escape],
      [2þ],
      [Pioneer],
      [Asiento Eyector],
      [+2 Masa, +5 Escape],
      [4þ],
      [Last Hurrah],
      [Conectividad],
      [Conecta esta cabina a cualquier otra cabina con la misma mejora. +1 Masa.],
      [\-],
      [Pioneer],
      [Máscara de Oxígeno],
      [El piloto ignora los efectos de la alta altitud y niega hasta 2 Penalizadores G. Requiere 1 Carga Continua.],
      [2þ],
      [WWI],
      [Aislado],
      [Una cesta o caja que permite montajes inusuales (como delante de una hélice) ignorando completamente el sistema habitual. +5 Drag, +1 Masa, +2 Visibilidad, -2 Escape, +1 Estrés por Vuelo.

        Recibe el doble de Lesión cuando Go Down.],
      [1þ],
      [Pioneer],
    )

    Estas opciones de cabina pueden representar diferentes ideas dependiendo del área de la tripulación. La Canopy Estrecha representa los paneles de cristal de la cabina de un B-17 y la Abierta el agujero cortado en la pared para el artillero de cintura, por ejemplo.

    === Seguridad #html.elem("a", attrs: (id: "_Safety"))[]
    ¡Intenta no morir! Tienes que comprar estas mejoras por cada cabina.

    #table(
      columns: 4,
      align: (left, left, left, left,),
      table.header([Tipo], [Efectos], [Costo], [Era]),
      [Acolchado],
      [Niega 1 Lesión para esta posición cuando Go Down.],
      [1þ],
      [Pioneer],
      [Arnés],
      [Niega 1 Lesión para esta posición cuando Go Down, -1 Escape.],
      [1þ],
      [Pioneer],
      [Sistema de Liberación Rápida],
      [+2 a Escape.],
      [1þ],
      [Coming Storm],
      [Barra Antivuelco],
      [+2 Masa. Niega 1 Lesión para esta posición cuando Go Down.],
      [\-],
      [WWI],
      [Ranura para Bengalas],
      [Permite disparar bengalas desde una cabina cerrada sin abrir la cabina.],
      [1þ],
      [Roaring 20s],
      [Ventilador Básico],
      [Requiere la Parte Vital de Electricidad.],
      [\-],
      [Pioneer],
    )

    === Miras #html.elem("a", attrs: (id: "_Gunsights"))[]
    ¡Esto puede ayudarte a apuntar! Por defecto, asumimos que un avión tiene poco más que simples miras de anillo. Estas miras pueden ayudarte a hacerlo mejor. Sin embargo, solo puedes usar una a la vez.

    Cada mira que metes en tu cabina da -1 Visibilidad, ¡así que sé moderado!

    #table(
      columns: 4,
      align: (left, left, left, left,),
      table.header([Tipo], [Efectos], [Costo], [Era]),
      [Mira Colimada X1],
      [+1 a Open Fire.],
      [2þ],
      [WWI],
      [Mira Telescópica],
      [+2 a Open Fire si Apuntas un Blanco.],
      [3þ],
      [WWI],
      [Mira Réflex Iluminada],
      [+2 a Open Fire. Deshabilitada cuando la Parte Vital de Electricidad es golpeada.],
      [6þ],
      [WWI],
      [Mira Giroscópica],
      [+2 a Open Fire, y +2 adicional si Apuntas un Blanco. Deshabilitada cuando la Parte Vital de Electricidad es golpeada.],
      [12þ],
      [WWII],
    )

    === Miras de Bombardeo #html.elem("a", attrs: (id: "_Bombsights"))[]
    ¡Las miras de bombardeo ayudan a lanzar bombas al objetivo!

    Una mira de bombardeo cuesta 2 thaler para un modelo Básico de Calidad 4, y luego +1 thaler por cada 3 de Calidad adicional.

    === Capacidad de Pasajeros #html.elem("a", attrs: (id: "_Passenger_Capacity"))[]
    La capacidad para 5 pasajeros ocupa 2 secciones de fuselaje que no pueden usarse para nada más. Los aperitivos en vuelo deben comprarse por separado. El área de pasajeros se trata colectivamente como una posición de tripulación, por lo que puede conectarse a las posiciones de tripulación con una mejora de Conectividad.

    Una cama, camilla o alojamiento de primera clase ocupa 2 asientos de pasajero.

    Cada Pasajero en una aeronave (una persona en o dentro del avión que no opera una de sus funciones) añade 1 Masa de Bombas. Al igual que con otras formas de carga, redondeamos esto al MP más cercano.

    El espacio para pasajeros puede usarse como carga, con cada asiento de pasajero o camilla utilizándose para contener 1 Carga. Esto representa las restricciones de espacio causadas por los asientos, etc.

    == Motores #html.elem("a", attrs: (id: "_Engines"))[]
    Los motores vienen en dos tipos generales: motores propulsores (Pusher) y motores tractores (Tractor). Los motores tractores tienen la hélice delante del avión tirando de él, mientras que los propulsores la tienen detrás del avión empujándolo.

    === Elegir tu Motor
    #label("_Choosing your Engine")
    Puedes elegir tu motor de la lista de motores prefabricados apropiados para el escenario, o fabricarlo en el constructor de motores de otra manera.

    En general, los motores refrigerados por aire son más ligeros pero menos potentes, mientras que los motores refrigerados por agua son más pesados pero más potentes.

    === Montar tu Motor
    #label("_Mounting your Engine")
    Los motores pueden montarse de diversas maneras.

    Un propulsor montado en la parte trasera representa un motor montado en el extremo más alejado del cuerpo de la aeronave, como los motores propulsores de un Kyushu J7W. Un motor propulsor montado en el centro representa un motor propulsor que todavía tiene cola, utilizando un eje de transmisión extendido o cola Farman para evitar el desequilibrio.

    La visibilidad será la peor visibilidad de todos los montajes de motor. Tener un montaje propulsor no te ayuda a ver bien alrededor de un motor montado en góndola.

    *Montajes de Motor en el Fuselaje*

    Los montajes de motor en el fuselaje requieren un Espacio de Estructura para cada motor.

    #table(
      columns: 2,
      align: (left, left,),
      table.header([Tipo], [Descripción]),
      [Tractor],
      [Normal.

        Las armas fijas que disparan hacia adelante necesitarán engranajes de sincronización/montajes de cono de hélice. Las torretas no pueden disparar hacia adelante. ],
      [Tractor Montado en el Centro],
      [-2 Estabilidad de Cabeceo, +1 Visibilidad.

        Las armas fijas que disparan hacia adelante necesitarán engranajes de sincronización. Requerirá un Eje de Transmisión Extendido.

        Con el espacio libre en la parte delantera de la aeronave, puedes montar una sola arma que dispare a través del cono de hélice.

        (Representa montajes de motor estilo P-39.) ],
      [Propulsor Montado en la Parte Trasera],
      [-4 Estabilidad de Cabeceo, +2 Visibilidad, -2 Escape.

        Las armas fijas que disparan hacia atrás necesitarán engranajes de sincronización/montajes de cono de hélice. Las torretas no pueden disparar hacia atrás.

        (representa motores montados en la parte trasera de la aeronave) ],
      [Propulsor Montado en el Centro],
      [-2 Estabilidad de Cabeceo. +2 Visibilidad, -2 Escape.

        Requiere Eje de Transmisión Extendido, Cola Farman, Alas en Flecha con Timones de Dirección, o Cola de Viga.

        Las armas fijas que disparan hacia atrás necesitarán engranajes de sincronización/montajes de cono de hélice. Las torretas no pueden disparar hacia atrás.

        (representa motores montados en el centro de la aeronave como en el DH2) ],
      [Góndola],
      [+5 Drag y -2 Visibilidad. Mantiene el motor apartado de todo lo demás.],
    )

    *Montajes de Motor en el Ala*

    #table(
      columns: 2,
      align: (left, left,),
      table.header([Tipo], [Descripción]),
      [Góndola (Interior)],
      [Reduce la Tensión Máxima a la mitad de la masa del motor. +1 Pérdida de Sustentación.],
      [Góndola (Desplazada)],
      [Añade Drag igual a la masa del Motor.],
      [Tractor en Canal],
      [-1 Pérdida de Sustentación. Reduce la Tensión Máxima igual a la masa del motor.],
    )

    Si quisieras, podrías construir un avión asimétrico, con diferentes tipos de motor a cada lado de un ala, o un único motor grande en un ala. En estos casos, recibe -3 Estabilidad Lateral.

    === Torque del Motor y Rotativos
    #label("_Engine Torque and Rotaries")
    Los motores tienen Torque, que se resta directamente de su Estabilidad Lateral si utilizan cualquier montaje en el fuselaje. Los montajes en el ala y en góndola minimizan el efecto del Torque en la estabilidad, así que ignóralo ahí.

    Los motores rotativos suelen ser los únicos motores con los que necesitas preocuparte en los aviones antiguos, ya que son una gran masa de metal girando a altas velocidades.

    Los motores rotativos montados en el ala reducen tu Tensión en la cantidad del Torque (usa todos los motores), representando la fuerza contra el ala. En una configuración push-pull, puedes optar por reducir la Estructura en su lugar.

    Los motores Fuselage Push-Pull también pueden optar por reducir la Estructura, en cuyo caso esto niega el efecto del Torque en la estabilidad y elimina la bonificación de los rotativos para Dogfight!.

    Los motores contrarrotativos son un tipo especial de motor que reducen a la mitad el Torque del motor. Deben estar emparejados con una Hélice Engranada para poder funcionar.

    === Configuración Push-Pull
    #label("_Push-Pull Configuration")
    Una configuración Push-Pull permite montar dos motores a lo largo de la misma línea. Esto requiere que se use el mismo modelo de motor para ambos.

    En cualquier configuración Push-Pull, usa solo el Drag de un motor y aplica los siguientes modificadores.

    *Diseños Push-Pull*

    #table(
      columns: 2,
      align: (left, left,),
      table.header([Tipo], [Descripción]),
      [Tractor + Propulsor/Trasero],
      [90% Potencia del Motor. La -2 Estabilidad de Cabeceo y -2 Escape de tener un Propulsor. El costo del Carenado es +2 para el motor Propulsor como es normal.],
      [Góndola/Góndola],
      [80% Potencia del Motor. Aplica la penalización de la góndola solo a un motor.],
      [Góndola en Tándem],
      [90% Potencia del Motor. Aplica la penalización de +5 Drag solo una vez.],
    )

    == Mejoras del Motor #html.elem("a", attrs: (id: "_Engine_Upgrades"))[]
    === Ejes de Transmisión Extendidos
    #label("_Extended Driveshafts")
    Un eje de transmisión extendido básicamente significa que, mientras el motor está montado en el medio del avión, la hélice aún puede estar en cualquiera de los extremos porque la varilla que conecta ambos es más larga de lo habitual y atraviesa la longitud del avión.

    Los ejes de transmisión extendidos añaden +1 Masa.

    Esto se puede hacer por diversas razones. En aviones tractores, esto puede permitir montar un arma de artillería internamente, disparando a través de la hélice sin el uso del engranaje de sincronización al pasar el cañón directamente por el buje de la hélice. Por ejemplo, un arma montada delante del motor en un espacio dedicado, como el cañón automático de 37 mm en el morro del P-39 Airacobra.

    En un avión propulsor con montaje central de motor, un eje de transmisión extendido elimina la necesidad de una cola Farman. Simplemente puedes montar una cola convencional alrededor del motor sin problemas. De manera similar, un tractor montado en el centro con canards (es decir, la cola está delante del avión) puede usar el eje de transmisión extendido para evitar la cola Farman.

    === Hélices Externas
    #label("_Outboard Propellers")
    Las Hélices Externas son cuando se utiliza un conjunto de correas, engranajes y poleas para desplazar la hélice (o hélices) al lado del motor y el fuselaje. Esto requiere la mejora del eje de transmisión extendido e incurre en un costo de +3 Drag y -2 Fiabilidad. Como beneficio, las armas montadas en el fuselaje ya no necesitan estar sincronizadas, porque las hélices están fuera del camino.

    Esta mejora se puede aplicar a Motores Tractores, Tractores Montados en el Centro y Push-Pull. En el caso de un motor Push-Pull, es el motor trasero el que acciona las hélices externas y, por lo tanto, las armas que disparan hacia adelante aún necesitan estar sincronizadas, pero no hay una penalización de -2 a Escape.

    === Hélice Engranada
    #label("_Geared Propeller")
    Esta mejora se puede aplicar a cualquier motor. Cuesta +1þ por cada iteración. Disponible en la era WWI.

    Añadir esto añadirá +50% a la Velocidad Excesiva (Overspeed) del motor y dará -1 Fiabilidad. Puedes añadir esto tantas veces como quieras.

    Puedes pagar 1þ adicional para negar la penalización de Fiabilidad solo de la hélice engranada, 1 a 1. Disponible en la era Roaring 20s.

    *Nota:* Aunque técnicamente puedes engranar un motor Rotativo (y hay algunos ejemplos históricos), esto es una abominación contra la ingeniería y deberías pensártelo dos veces, o una docena, antes de hacerlo.

    === Carenado #html.elem("a", attrs: (id: "_Cowling"))[]
    El carenado se puede aplicar a cualquier motor refrigerado por aire.

    #table(
      columns: 5,
      align: (left, left, left, left, left,),
      table.header([Tipo], [Descripción], [Tipos de Motor], [Costo], [Era]),
      [Carenado Básico],
      [80% Drag del Motor, +1 Masa.],
      [Refrigerado por Aire],
      [1þ],
      [Pioneer],
      [Carenado Básico Rotativo],
      [40% Drag del Motor. +1 Masa.],
      [Rotativo],
      [1þ],
      [Pioneer],
      [Carenado Cerrado],
      [30% Drag del Motor. -1 Fiabilidad, +1 Masa.],
      [Rotativo],
      [1þ],
      [WWI],
      [Carenado Airfoil],
      [40% Drag del Motor. +3 Fiabilidad, +2 Masa.],
      [Refrigerado por Aire + Rotativo],
      [3þ],
      [Roaring 20s],
      [Carenado de Lamas Ajustable],
      [50% Drag del Motor. +2 Fiabilidad, +2 Masa.],
      [Refrigerado por Aire],
      [2þ],
      [Coming Storm],
      [Carenado Sellado],
      [50% Drag del Motor. +1 Masa por cada 3 Drag del Motor (antes de la reducción).],
      [Refrigerado por Líquido],
      [1þ],
      [Pioneer],
    )

    Los carenados son más difíciles de aplicar a los aviones propulsores de fuselaje, lo que requiere una ingeniería cuidadosa para el flujo de aire. Aumenta los costos en +2. La excepción es el Carenado Sellado, ya que están sellados y no hay flujo de aire que ingenierizar.

    Además, se puede montar un ventilador de enfriamiento de aire dentro del carenado de un motor refrigerado por aire no rotativo. Esto puede aspirar vastas cantidades de aire sobre el motor, aunque introduce una cuchilla giratoria pesada adicional al cigüeñal.

    - Ventilador de Enfriamiento de Aire: +6 Fiabilidad, +3 Masa. Doble Torque. 4þ

    === Turbocompresor #html.elem("a", attrs: (id: "_Turbocharger"))[]
    ¡Un turbocompresor ocupa un espacio de estructura!

    === Motor como Generador #html.elem("a", attrs: (id: "Engine_as_Generator"))[]
    Puedes montar un motor como generador. No proporciona ninguna potencia para impulsarte hacia adelante, pero puedes impulsarlo independientemente de tus otros motores para recargar baterías o proporcionar energía para otras cosas. No requieres un alternador (presumimos que está incorporado) y genera el doble de Carga que el mismo motor si estuviera impulsando una hélice con un alternador.

    === Enfriamiento (Aire)
    #label("_Cooling_(Air)")
    Si tu motor es refrigerado por aire, ¡genial! Simplemente colócalo ahí y funcionará por sí solo. Añade la Parte Vital de la Bandeja de Aceite.

    === Enfriamiento (Rotativo)
    #label("_Cooling_(Rotary)")
    Si tu motor es _rotativo_;, necesitarás añadir 1 Masa para el Tanque de Aceite del motor. Esta es una Parte Vital separada.

    === Enfriamiento (Líquido)
    #label("_Cooling_(Liquid)")
    Si tu motor es _refrigerado por líquido_;, necesitarás añadir un radiador y un enfriador de aceite.

    Un enfriador de aceite es simple: añades +1 drag por cada 15 de potencia y cuenta como una Parte Vital.

    Un radiador pesa 3 Masa y tiene una cantidad variable de Drag, que tú eliges. No puedes tener más radiadores de los que tienes motores, pero puedes optar por conectar múltiples motores al mismo radiador agrandado. Esto ahorrará peso, pero será un único punto de fallo. Cada radiador es una Parte Vital.

    El _Drag_ de un radiador es cuánto de la superficie del radiador está expuesta al aire. Cada punto de Drag da +2 Enfriamiento. Debes tener un valor de Enfriamiento igual al Enfriamiento de tu(s) motor(es) o perder fiabilidad. Cada punto de enfriamiento que tengas menos que eso da -1 Fiabilidad. Tener más Enfriamiento de lo que tu Motor requiere no lo hará más fiable.

    El _Tipo_ es el diseño del radiador, y el _Montaje_ del radiador es dónde está en relación con el motor (no con la aeronave en su conjunto) y afecta el rendimiento del radiador después de ser disparado. Ambas cosas pueden dar bonificaciones directas de fiabilidad al motor debido a la simplicidad mecánica o la eficiencia.

    Los radiadores pueden tener diferentes tipos. Si el radiador gana más Drag, no añadirá más Fiabilidad: esto proviene de las otras partes del diseño como mangueras o la estructura.

    *Tipo de Radiador*

    #table(
      columns: 3,
      align: (left, left, left,),
      table.header([Tipo], [Descripción], [Era]),
      [Panel],
      [Por defecto.],
      [Pioneer],
      [Caja],
      [+2 Drag, -1 Masa.],
      [Pioneer],
      [Entrada],
      [+2 Enfriamiento +3þ.],
      [Roaring 20s],
      [Enfriamiento Evaporativo],
      [Ver Abajo.],
      [Coming Storm],
    )

    *Montaje de Radiador*

    #table(
      columns: 3,
      align: (left, left, left,),
      table.header([Ubicación], [Descripción], [Era]),
      [Bajo],
      [+1 Fiabilidad. Fuerza Cool Down cuando recibe un disparo.],
      [Pioneer],
      [En Línea],
      [Por defecto.],
      [Pioneer],
      [Alto],
      [La bonificación persiste durante 1 Cool Down después de ser disparado. +1 Drag. Si el avión tiene una cabina abierta, ¡rociará al piloto con el fluido del radiador!],
      [Pioneer],
      [Alto Desplazado],
      [Requiere un Ala Parasol. Igual que Alto, pero -1 Estabilidad Lateral, y el piloto está a salvo si se rompe.],
      [WWI],
    )

    *Ejemplos de Radiador:*

    #emph[Los radiadores de panel son cualquier diseño de radiador sobre el que el aire "pasa por encima", mientras que los radiadores de caja son radiadores diseñados para que el aire "pase a través". En términos más sencillos, si sobresale de forma fea o está en el morro, es una caja; si está plano contra una superficie como un ala o la piel, es un panel.]

    Los radiadores de entrada son específicamente radiadores construidos dentro de carcasas especializadas diseñadas para canalizar el aire y reducir el drag.

    - El radiador de un Albatros D.II es un radiador de Panel Alto.

    - El radiador en el lateral de un Sopwith Dolphin o un Albatros D.II temprano es un radiador de Caja Baja.

    - El radiador en el morro de un SE5a o un Fokker D.VII es un radiador de Caja En Línea.

    - El radiador de un Spitfire o un P-51 es un radiador de Entrada Baja.

    *Refrigerante Especial*

    Normalmente, un radiador simplemente está lleno de agua. Si quieres ser un ingeniero sofisticado, puedes cargar tu radiador con refrigerante especial de la siguiente manera. ¡Recuerda redondear hacia abajo con el enfriamiento!

    Si quieres usar alguno de los refrigerantes marcados con \*, necesitas gastar +2þ para endurecer tu radiador para ello.

    === Fluido de Radiador Raro #html.elem("a", attrs: (id: "_Rare_Radiator_Fluid"))[]
    Por defecto, los radiadores se llenan con~agua, pero si puedes encontrar fuentes, puedes llenarlos~con otros fluidos para aumentar la eficiencia del motor.~ Debes comprar el líquido de nuevo si el radiador se daña.~ Si el líquido está marcado con \*, necesitas un radiador endurecido especial para ellos (2 thaler para mejorar).

    #table(
      columns: 4,
      align: (left, left, left, left,),
      table.header([Líquido], [Efectos], [Costo], [Era]),
      [Agua],
      [],
      [\-],
      [Pioneer],
      [Agua Salada\*],
      [+1 Fiabilidad (Gratis para Pescadores)],
      [1þ],
      [Pioneer],
      [Aceite Mineral\*],
      [Absorbe 1 Fallo por Cool Off. Inflamable],
      [1þ],
      [Pioneer],
      [Aceite de Ricino],
      [Como Aceite Mineral, pero +2 Estrés si tiene fugas],
      [\-],
      [Pioneer],
      [Glicol],
      [+2 Fiabilidad],
      [2þ],
      [Roaring 20s],
      [Freón],
      [+4 Fiabilidad. Recibe 1 Reducción de Potencia mientras el RPM esté por debajo de 4.],
      [3þ],
      [Coming Storm],
      [Amoníaco],
      [Como Freón, pero causa 2 Lesiones si tiene fugas],
      [2þ],
      [Pioneer],
    )

    \

    #table(
      columns: 1,
      align: (left,),
      table.header([Enfriamiento Evaporativo]),
      [Una forma alternativa de enfriar un motor refrigerado por líquido es el enfriamiento evaporativo. Esto requiere un ala suficientemente grande (al menos 5 Área por motor) con algún tipo de piel metálica. En lugar de enviar agua a un radiador, el agua se pulveriza como vapor en una cavidad en las alas para enfriarla, donde se recoge y se devuelve al motor. Esto es más aerodinámico, pero es muy frágil.

        El enfriamiento evaporativo solo cuesta las +3 Masa que pagarías por tener un radiador. No hay Drag involucrado, simplemente estás listo para funcionar.

        La desventaja es que cualquier ataque con un resultado de Crítico de 16+ dejará fuera de combate el radiador, además de cualquier otro daño causado o otras partes dañadas.

      ],
    )

    === Pulsorreactores #html.elem("a", attrs: (id: "_Pulsejets"))[]
    Los pulsorreactores simplemente se atornillan en algún lugar del avión. No nos importa particularmente dónde o en qué configuración: solo sabemos que, sea como sea, se mantiene alejado de cualquier pieza en funcionamiento.

    Los pulsorreactores cuestan 5þ y 1 de mantenimiento simplemente por tener uno en tu aeronave. Son duros con los aviones.

    Los pulsorreactores producen Rumble. El Rumble causa estrés a los miembros de la tripulación igual a la mitad del Rumble total, o 3, lo que sea menor. Además, una aeronave requiere una estructura mínima de Rumble total \* 10 para volar, o las vibraciones desmoronan la aeronave.

    === Motores a Reacción y Cohetes
    #label("_Jet_Engines_\\&_Rockets")
    Los motores a reacción se montan de una de las siguientes maneras. Los motores a reacción traen consigo su propio requisito en Espacios de Estructura debido a su tamaño.

    #table(
      columns: 2,
      align: (left, left,),
      table.header([Tipo], [Descripción]),
      [Entrada Delantera/Quemador Trasero],
      [Por defecto. Puede montar hasta 2 motores.],
      [Góndola de Ala],
      [Reduce la Tensión Máxima a la mitad de la masa del motor. +1 Pérdida de Sustentación.],
      [Góndola],
      [+3 Drag y -1 Visibilidad. Mantiene el motor apartado de todo lo demás.],
    )

    == Estructura y Revestimiento #html.elem("a", attrs: (id: "_Frame_and_Covering"))[]
    Ahora que tienes las secciones que tu aeronave necesita, deberás construirlas. Para empezar, construye una estructura. La estructura proporciona una Estructura básica, más algunas bonificaciones a medida que el avión se hace más grande. Elige solo una, de lo que esté construida la mayor parte de la estructura, y añade 1 pieza por sección.

    Generalmente, dividimos los aviones en aquellos hechos de Largueros (Spars) o de Costillas (Ribs). Si tu avión se mantiene unido por cables de tensión con la estructura proporcionando compresión, está hecho de Largueros. Si es solo un gran conjunto de piezas sólidas, está hecho de Costillas.

    Un Sopwith Camel está hecho de Largueros de Madera. Un Fokker DR.1 está hecho de Largueros de Acero. El Junkers J.1/J4 está hecho de Largueros de Aluminio. El Polikarpov I-16 está hecho de Costillas de Madera. El P-47 está hecho de Costillas de Acero. El P-51 está hecho de Costillas de Aluminio.

    // #image("Frame.png")
    #html.elem("img", attrs: (src: "Frame.png", alt: "Comparison of Struts and Ribs"))[]

    #table(
      columns: 6,
      align: (left, left, left, left, left, left,),
      table.header([Material de Estructura], [Efecto Base], [Costo Base], [Efecto por Pieza], [Costo por Pieza], [Era]),
      [Largueros de Madera],
      [15 Estructura],
      [\-],
      [+1 Masa, +2 Estructura],
      [\-],
      [Pioneer],
      [Largueros de Acero],
      [25 Estructura],
      [1þ],
      [+1 Masa, +5 Estructura],
      [1þ],
      [Pioneer],
      [Largueros de Aluminio],
      [20 Estructura],
      [2þ],
      [+½ Masa, +4 Estructura],
      [2þ],
      [WWI],
      [Costillas de Madera\*],
      [30 Estructura],
      [1þ],
      [+2 Masa, +5 Estructura],
      [½þ],
      [WWI],
      [Costillas de Acero\*],
      [60 Estructura],
      [2þ],
      [+3 Masa, +12 Estructura],
      [2þ],
      [Roaring 20s],
      [Costillas de Aluminio\*],
      [50 Estructura],
      [3þ],
      [+2 Masa, +8 Estructura],
      [3þ],
      [Roaring 20s],
      [Titanio],
      [\-],
      [],
      [+1 Masa, +10 Estructura],
      [8þ],
      [Last Hurrah],
      [Living Grove\*],
      [30 Estructura, Reparaciones Gratuitas],
      [8þ],
      [+2 Masa, +4 Estructura],
      [\-],
      [Himmilgard],
    )

    El Titanio es un caso especial y no se puede usar para estructuras completas.

    Una estructura marcada con \* se puede hacer Geodésica, lo que duplica el costo por pieza, pero añade +50% de Estructura por pieza. Las piezas de estructura Geodésica no pueden ser posteriormente Monocasco.

    Por defecto, cada pieza de estructura añade +4 de drag a la aeronave, representando la estructura descubierta expuesta. Debes cubrir estos elementos para hacerlos aerodinámicos. Para cada sección, elige un revestimiento de la siguiente lista. Toda la piel de la aeronave debe ser la misma, así que elige el tipo dominante.

    #table(
      columns: 5,
      align: (left, left, left, left, left,),
      table.header([Material de Piel], [Efectos], [Costo], [Estructura Monocasco], [Era]),
      [Desnuda],
      [+1 Visibilidad por Pieza, hasta +3. 60% Masa del Fuselaje.],
      [\-],
      [\-],
      [Pioneer],
      [Lona de Tela],
      [50% Drag del Fuselaje],
      [\-],
      [\-],
      [Pioneer],
      [Celuloide Transparente],
      [60% Drag del Fuselaje. +1 Visibilidad por Pieza, hasta +3. Inflamable.],
      [1þ],
      [-],
      [Pioneer],
      [Papel Tratado],
      [50% Drag del Fuselaje. Inflamable. 75% Masa del Fuselaje],
      [\-],
      [\-],
      [Pioneer],
      [Seda Tensa],
      [50% Drag del Fuselaje. +1 Resistencia (Toughness) por Pieza],
      [1þ],
      [\-],
      [Pioneer],
      [Piel de Dragón],
      [50% Drag del Fuselaje. El avión gana 5 Cobertura Armadura AP2.],
      [4þ],
      [\-],
      [Himmilgard],
      [Contrachapado Moldeado],
      [40% Drag del Fuselaje],
      [½þ],
      [+3],
      [Pioneer],
      [Construcción de Tracas (Clinker Build)],
      [50% Drag del Fuselaje. Monocasco Completo, añade +30 Estructura plana.],
      [\-],
      [-3],
      [Pioneer],
      [Plástico Reforzado con Vidrio],
      [30% Drag del Fuselaje.],
      [1þ],
      [+0],
      [Last Hurrah],
      [Duraluminio Corrugado],
      [50% Drag del Fuselaje, +3 Resistencia (Toughness) por Pieza],
      [1þ],
      [+10],
      [WWI],
      [Chapa de Acero],
      [35% Drag del Fuselaje, +3 Resistencia (Toughness) por Pieza],
      [1½þ],
      [+8],
      [Roaring 20s],
      [Chapa de Aluminio],
      [35% Drag del Fuselaje, +2 Resistencia (Toughness) por Pieza. 75% Masa del Fuselaje],
      [2þ],
      [+6],
      [Roaring 20s],
    )

    === Monocasco #html.elem("a", attrs: (id: "_Monocoque"))[]
    Puedes construir un avión monocasco (una sola cáscara) o semimonocasco si lo deseas.

    Un avión monocasco o semimonocasco puede construirse sustituyendo la masa y la bonificación estructural de una pieza de estructura por una pieza de piel compatible con monocasco. La estructura aún existe: pocos aviones monocasco carecen realmente de estructura, estos marcos simplemente se minimizan e incorporan a la estructura de la cáscara.

    Las piezas de piel monocasco cuestan +1þ cada una, representando el costo de mano de obra de diseñarlas y construirlas. Esto se suma al costo de la estructura: eso no desaparece.

    === Cuerpo Sustentador y Ala Volante
    #label("_Lifting Body \\& Flying Wing")
    Un cuerpo sustentador y las alas volantes son logros de ingeniería increíblemente complicados y requieren que la aeronave tenga una piel sólida (contrachapado moldeado o mejor).

    Una aeronave de Cuerpo Sustentador cuenta cada Sección de Estructura (no los soportes internos) como si fueran 3m2 de área de ala a efectos de calcular la Stall Speed, y añade +1 Drag por pieza. Cada pieza cuesta +1 thaler. Para un cuerpo sustentador puro sin alas, la Tensión Máxima es igual a la Estructura, antes de restar los montajes de motor o ajustar por optimización.

    Un Ala Volante es un cuerpo sustentador que también evita el drag adicional a cambio de recibir +5 Pérdida de Sustentación, representando la cuerda del ala excesivamente gruesa.

    Ambas aeronaves aún tienen colas, incluso si están integradas con el resto de la máquina.

    === Arriostramiento Interno
    #label("_Internal Bracing")
    Para aumentar la resiliencia de una aeronave, puedes añadir Arriostramiento Interno. Esto son básicamente Piezas de Estructura adicionales a las que no tienes que poner Piel, porque están en el interior. Puedes tener 1 pieza de Arriostramiento Interno por sección de estructura real. No tienen que ser del mismo material que todo lo demás: puedes construir una aeronave de madera con algunos arriostramientos de acero, por ejemplo.

    El Titanio solo puede usarse para arriostramiento interno. Hacer un avión entero de Titanio es como hacer un anillo entero de diamantes: genial, pero demasiado caro para que valga la pena.

    == Cola #html.elem("a", attrs: (id: "_Tail"))[]
    Consideramos la cola como las Secciones de la aeronave que quedan mayormente vacías. Añaden secciones de estructura adicionales y también cambian la estabilidad de cabeceo de la aeronave. Ten mucho cuidado con tu selección: una cola corta parece óptima, pero la estabilidad de cabeceo compensa los efectos de cosas como el torque, las alas cortas y la inestabilidad natural de alabeo de las aeronaves, por lo que quitar demasiado resultará en aeronaves incontrolables.

    La mayoría de los mejores cazas de la WWI serían de tipo Stubby, al igual que aviones de la WW2 como el I-16, el F2A Buffalo y el caza cohete Me-163. Como regla general, si lo miras y dices "parece un juguete", eres Stubby. Si parece razonable, eres Standard. La mayoría de los grandes bombarderos y similares usarán Long.

    #table(
      columns: 3,
      align: (left, left, left,),
      table.header([Ubicación], [Secciones de Estructura Adicionales], [Modificador de Avión]),
      [Sin Cola (Tailless)],
      [+0],
      [-4 Estabilidad de Cabeceo, no puede usar plano de cola tradicional ni estabilizador vertical. +3 Visibilidad],
      [Stubby (Corto)],
      [+1],
      [-3 Estabilidad de Cabeceo.],
      [Standard],
      [+2],
      [Sin cambio.],
      [Long (Larga)],
      [+3],
      [+3 Estabilidad de Cabeceo.],
    )

    Las secciones de cola, por regla general, están vacías. Las secciones de cola no están necesariamente en la "parte trasera" de una aeronave, simplemente le dan volumen y ayudan a equilibrarla. Por ejemplo, piensa en las posiciones de los artilleros de cola en los bombarderos.

    === Farman #html.elem("a", attrs: (id: "_Farman"))[]
    Si quieres montar controles detrás de una hélice propulsora (¡o delante de una tractora!), usas una Cola Farman. Esta es una estructura de puntales construida alrededor de la hélice que permite que las superficies de control cuelguen de ella.

    Esto se construye como una cola normal, arriba. Una cola Farman pesa la mitad que una cola convencional, pero no se le puede dar una superficie: siempre es una cola desnuda.

    Una cola Farman no cuenta como parte de una aeronave monocasco (ya que eso no funcionaría), así que simplemente selecciona un tipo de material de estructura.

    === Colas de Viga (Boom Tails)
    #label("_Boom Tails")
    Las colas de viga son otra opción útil tanto para aviones propulsores como para algunos aviones con góndolas. Permiten las mismas cosas que una cola Farman, pero son en muchos aspectos más sofisticadas. Sin embargo, tienen algunas dificultades aerodinámicas.

    Una Cola de Viga se construye como una cola normal y usa las mismas reglas. Resta la Masa de la Cola de la Tensión de las alas, y una Cola de Viga que no está conectada a las góndolas de motor tractor genera +50% Drag.

    Si tienes Wing Warping y colas de viga, has cometido un error y recibes una penalización de -2 tanto a la Estabilidad Lateral como a la de Cabeceo. ¡Un ala deformante deflectará el plano de cola!

    == Superficies de Control #html.elem("a", attrs: (id: "_Control_Surfaces"))[]
    Las superficies de control son cómo se mueve un avión.

    _Debes_ tener alguna forma de controlar tu avión. Necesitas Alerones, Timones de Profundidad y un Timón de Dirección.

    === Alerones #html.elem("a", attrs: (id: "_Ailerons"))[]
    Los alerones controlan la rotación de tu avión. ¡Debes tenerlos!

    *Alerones*

    #table(
      columns: 4,
      align: (left, left, left, left,),
      table.header([Tipo], [Efectos], [Costo], [Era]),
      [Sin Alerones],
      [-15 Control, -1 Seguridad en Caída],
      [-2þ],
      [Pioneer],
      [Alerones Flap],
      [Por defecto],
      [\-],
      [Pioneer],
      [Wing Warping],
      [-1 Drag. Obtén +1 a Dogfight! a 15 speed o menos. Reduce la Tensión Máxima igual a la envergadura del ala más larga.],
      [\-],
      [Pioneer],
      [Spoilerons],
      [Cuando tires Dogfight!, recibe +1, pero luego reduce tu speed como si tu Factor de Speed se duplicara.],
      [2þ],
      [WWII],
    )

    Wing Warping se convierte en era Last Hurrah cuando el ala se refuerza con voladizos, y cuesta 2þ por voladizo. ¡Eso es tecnología avanzada!

    === Timones de Dirección #html.elem("a", attrs: (id: "_Rudders"))[]
    Los timones de dirección dan control de giro y trabajan junto con los alerones y timones de profundidad para mantener la aeronave apuntando en la dirección correcta. Hay dos tipos disponibles:

    #table(
      columns: 4,
      align: (left, left, left, left,),
      table.header([Tipo], [Efectos], [Costo], [Era]),
      [Timón de Dirección Flap],
      [Por defecto],
      [\-],
      [Pioneer],
      [Timón de Dirección Volador],
      [-1 Estabilidad Lateral. +3 Control.],
      [\-],
      [Pioneer],
    )

    === Timones de Profundidad #html.elem("a", attrs: (id: "_Elevators"))[]
    Los timones de profundidad mantienen el morro de tu avión apuntando hacia el cielo y no hacia el suelo. Hay dos...

    #table(
      columns: 4,
      align: (left, left, left, left,),
      table.header([Tipo], [Efectos], [Costo], [Era]),
      [Timón de Profundidad Flap],
      [Por defecto],
      [\-],
      [Pioneer],
      [Timón de Profundidad Volador],
      [-1 Estabilidad de Cabeceo. +2 Control.],
      [\-],
      [Pioneer],
    )

    === Ayudas de Sustentación #html.elem("a", attrs: (id: "_Lift_Aids"))[]
    Los Flaps y Slats son accesorios especiales que se pueden colocar en las alas, cambiando el perfil de sustentación del ala. Los Flaps suelen ser accionados por un sistema de poleas con cables tensos, o por hidráulicos en aeronaves más grandes.

    Solo puedes aplicar 1 tipo de cada uno de estos a una aeronave.

    *Flaps*

    #table(
      columns: 4,
      align: (left, left, left, left,),
      table.header([Tipo], [Efectos], [Costo], [Era]),
      [Flaps Básicos],
      [-3 Pérdida de Sustentación, -3 Control.],
      [1þ por 3MP],
      [WWI],
      [Flaps Avanzados],
      [-5 Pérdida de Sustentación.],
      [2þ por 3MP],
      [Coming Storm],
      [Flaps de Control],
      [-5 Pérdida de Sustentación, +3 Control],
      [1þ por MP],
      [WWII],
      [Lift Dumpers],
      [+2 a Seguridad en Caída. Activa para +1 a Dogfight!, luego induce inmediatamente un stall.],
      [1þ por MP],
      [Last Hurrah],
    )

    *Slats*

    #table(
      columns: 4,
      align: (left, left, left, left,),
      table.header([Tipo], [Efectos], [Costo], [Era]),
      [Slots Fijos],
      [5 Drag. -3 Pérdida de Sustentación],
      [1þ],
      [Roaring 20s],
      [Slats Automáticos],
      [-1 Pérdida de Sustentación. +3 Control],
      [4þ],
      [WWII],
    )

    === Inductores de Resistencia (Drag Inducers) #html.elem("a", attrs: (id: "_Drag_Inducers"))[]
    Los Inductores de Resistencia se utilizan para ralentizar una aeronave, extendiendo algo grande y con mucho drag en el flujo de aire. Hay diferentes formas de hacerlo para diferentes propósitos. Podrían ser los dispositivos tipo paleta usados en el Stuka o las rejillas del SBD Dauntless o los frenos plegables usados en muchos cazas a reacción.

    *Inductores de Resistencia*

    #table(
      columns: 4,
      align: (left, left, left, left,),
      table.header([Tipo], [Efectos], [Costo], [Era]),
      [Aerofreno (Air Brake)],
      [Cuando se despliega, reduce inmediatamente la Speed igual al Factor de Speed y gana +1 a Dogfight!.],
      [3þ, 1 Masa],
      [WWII],
      [Aerofreno de Picado (Dive Brake)],
      [Cuando se despliega, los picados pronunciados intercambian altitud por speed a 1-2 en lugar de 1-3.],
      [4þ, 2 Masa],
      [Pioneer],
      [Paracaídas de Frenado (Drogue Chute)],
      [Otorga +3 a Seguridad en Caída. Puede activarse como un Aerofreno de un solo uso.],
      [3þ],
      [Last Hurrah],
    )

    == Refuerzos #html.elem("a", attrs: (id: "_Reinforcement"))[]
    Una aeronave necesitará alguna descripción de refuerzo de soporte para asegurar que las alas no se caigan. En la mayoría de las aeronaves, esto implica un montaje cuidadosamente construido de puntales y cables, usándose los puntales para mantener las alas separadas y los cables para mantener las alas unidas. Los monoplanos pueden usar cables arriostrados a puntos fuertes en el fuselaje en lugar de correr entre las alas, pero es menos eficiente.

    === Refuerzo Externo #html.elem("a", attrs: (id: "_External_Reinforcement"))[]
    Los puntales generan Estructura, Tensión Máxima y una estadística llamada Tensión. Puedes tomar tantos de cualquiera de estos como quieras: cada uno tomado representa un par simétrico, creando un nuevo compartimento.

    #table(
      columns: 4,
      align: (left, left, left, left,),
      table.header([Tipo], [Efectos], [Costo], [Era]),
      [Puntales Paralelos],
      [+2 Drag, +1 Masa, +5 Estructura, +5 Tensión Máxima, +30 Tensión.],
      [1þ],
      [Pioneer],
      [Puntal N],
      [+2 Drag, +1 Masa, +6 Estructura, +8 Tensión Máxima, +20 Tensión.],
      [1þ],
      [Pioneer],
      [Puntal V],
      [+1 Drag, +1 Masa, -5 Estructura, +5 Tensión Máxima, +30 Tensión.],
      [1þ],
      [Pioneer],
      [Puntal I],
      [+1 Drag, +1 Masa, +20 Tensión Máxima, +15 Tensión.],
      [2þ],
      [WWI],
      [Puntal W],
      [+3 Drag, +1 Masa, +35 Tensión Máxima.],
      [2þ],
      [WWI],
      [Puntal Estrella],
      [+6 Drag, +2 Masa, +10 Estructura, +30 Tensión Máxima.],
      [2þ],
      [WWI],
      [Armadura de Ala],
      [+4 Drag, +40 Tensión. Sin afectar por la configuración del ala.],
      [1þ],
      [Pioneer],
      [Puntal Simple],
      [+1 Drag, +1 Masa, +10 Tensión Máxima.],
      [1þ],
      [Pioneer],
      [Raíz de Cable],
      [+10 Tensión. No puede ser un puntal Cabane, ni contar como tu primer puntal no Cabane.],
      [\-],
      [Pioneer],
    )

    Obtienes 1 Puntal Cabane en tu aeronave: puede ser tu único puntal si lo deseas. Este es un puntal que genera -2 Drag (mínimo 0), pero solo la mitad de Tensión. Cuesta la cantidad normal de masa y costo. No puedes tener una armadura de ala Cabane ni una raíz de cable.

    Tu primer puntal no Cabane otorga +5 Estructura, +10 Tensión Máxima y +10 Tensión. Esta tensión no se ve afectada por la configuración de tu ala. Esto representa el beneficio general de tener estos puntos de anclaje: los puntales adicionales dan rendimientos decrecientes en comparación.

    Cualquiera de estos puntales puede hacerse de acero en lugar de madera. Esto duplica su costo. Los puntales o armaduras de acero (no raíces) dan el doble de Estructura, +5 Tensión Máxima y la mitad de Tensión. Un puntal V de acero da 0 Estructura.

    Los cables convierten la Tensión en Tensión Máxima. Si eliges añadir cables de arriostramiento, recibe +3 Drag por Puntal y añade Tensión Máxima igual a la Tensión. Máx.
    1.

    La configuración de tus alas en la generación de Tensión se multiplica de la siguiente manera.

    - Multiplano Sin Escalón o Sin Ala: 100%
    - Avión con Escalón: 90%
    - Avión en Tándem: 80%
    - Monoplano: 60%

    === Alas en Voladizo #html.elem("a", attrs: (id: "_Cantilever_Wings"))[]
    La suposición por defecto es que las alas son de diseño arriostrado por tensión, utilizando cables y largueros hechos de materiales apropiados para mantenerse intactas. Construir un "ala en voladizo" crea una estructura autoportante dentro del ala misma, arriostrada a un punto fuerte en la estructura.

    Puedes añadir 1 Masa de Larguero en Voladizo por cada 5 de Estructura en la aeronave. Cuesta 5þ incluir Voladizos en absoluto.

    #table(
      columns: 4,
      align: (left, left, left, left,),
      table.header([Material del Voladizo], [Efectos por Masa], [Costo por Masa], [Era]),
      [Abedul],
      [+10 Tensión Máxima, +2 Resistencia (Toughness).],
      [1þ],
      [WWI],
      [Duraluminio],
      [+15 Tensión Máxima, +3 Resistencia (Toughness).],
      [2þ],
      [WWI],
      [Acero],
      [+20 Tensión Máxima, +5 Resistencia (Toughness).],
      [3þ],
      [WWI],
      [Aluminio],
      [+25 Tensión Máxima, +3 Resistencia (Toughness).],
      [4þ],
      [Roaring 20s],
      [Baleena],
      [-3 Pérdida de Sustentación, +5 Tensión Máxima.],
      [8þ],
      [Himmilgard],
    )

    Un Ala en Voladizo es más gruesa que un ala regular, abriendo la posibilidad de tanques de combustible dentro del ala.

    Si estás en eras tempranas, tener Voladizos en tus alas resta la Bonificación de Voladizo de tu Pérdida de Sustentación. Esto se debe a que forzó a los diseñadores a hacer alas más gruesas y eficientes, pero no tenían idea de que eso era lo que estaban haciendo.

    === Cuchillas de Ala (Wing Blades)
    #label("_Wing Blades")
    Puedes añadir cuchillas de ala si no tienes refuerzos externos y al menos un voladizo de acero. Las Cuchillas de Ala duplican la masa de todos los voladizos, pero te permiten cortar a tu enemigo.

    == Armamento #html.elem("a", attrs: (id: "_Weapons"))[]
    ¡El armamento permite que tu avión dañe cosas!

    Las armas vienen con su propio suministro de munición, la estadística de Munición con la que están listadas. Puedes comprar más munición para cualquier arma, lo que siempre cuesta +1 Masa. Esto te da munición adicional igual a la que viene por defecto con el arma. La munición no es tan pesada, pero las tolvas más grandes y los sistemas más complejos necesarios para alimentar correas más largas tienden a serlo.

    Si un arma se carga por cargador o es manual, puedes gastar +50% del Costo para convertirla en un arma alimentada por correa.

    === Tamaños de Armamento
    #label("_Weapon Sizes")
    Las armas vienen en diferentes *Tamaños*;: Pequeño, Ligero, Mediano, Pesado y Artillería.

    Siempre puedes montar armas más pequeñas en áreas con restricciones, como torretas o alas. Puedes montar el doble de armas de un tamaño menor que un arma más grande. Por ejemplo, en una torreta con un montaje de arma Mediana, podrías montar 2 Armas Ligeras.

    === Sistemas #html.elem("a", attrs: (id: "_Systems"))[]
    Las armas del mismo tipo que disparan en la misma dirección forman un *Sistema*; Todos sus impactos se suman para crear sus perfiles de arma, creando un número de impactos y una cantidad de daño causado en las cuatro bandas de alcance: Knife/Close/Long/Extreme.

    Las armas de aeronave listadas a continuación se montan en aeronaves como parte de un 'sistema' de armas idénticas. No importa dónde esté montada cada arma del sistema, siempre y cuando todas disparen al mismo lugar a la vez.

    Para crear la tabla de alcance, suma todos los Impactos de las armas, luego multiplícalos por el daño del arma para obtener tu daño a ese alcance.

    Los Impactos de Arma disminuyen con el alcance. Las armas de línea central y de torreta tienen una caída del 100/75/50/25 por ciento, redondeando hacia abajo, para cada banda de alcance en secuencia. Para las armas montadas en el ala, usa 100/90/20/10 por ciento en su lugar. Si tienes una mezcla de armas de línea central y de ala, calcula los dos grupos por separado, luego súmalos.

    === Posicionamiento #html.elem("a", attrs: (id: "_Placement"))[]
    Puedes colocar tus armas en el fuselaje o en las alas de la aeronave. Se puede colocar cualquier número de armas en o dentro del fuselaje de la aeronave, aunque ten en cuenta que las armas de tamaño Artillería o las torretas que contienen múltiples armas más pequeñas que suman más que un arma Pesada deben tener cada una su propia sección de estructura.

    Las armas montadas en el ala están restringidas según la fuerza de la construcción del ala, de la siguiente manera.

    - Sin voladizos: Máximo 2 armas Ligeras solamente.
    - Voladizos de madera o hueso: Máximo 2 armas Medianas solamente.
    - Voladizos de metal: Máximo 2 armas Pesadas.

    Montar un arma más pesada que esta en el ala costará +2 Masa, representando la extensión de vigas de soporte desde el fuselaje del avión, a la manera del cañón Becker de 20 mm en el Albatros D.II.

    Podemos imaginar estas armas montadas sobre el ala superior, a lo largo del ala, etc.

    Para aviones con configuraciones tradicionales de tractor, cualquier ubicación fuera del arco de la hélice se considera una ubicación de ala.

    Un arma de Artillería montada fija hacia adelante interferirá con un motor. Debes usar góndolas, un propulsor o un motor tractor de montaje central con las modificaciones apropiadas.

    Cuando un arma está montada en el ala y descubierta, tiene +1 Drag.

    === Carenado (Covered) #html.elem("a", attrs: (id: "_Covered"))[]
    *Las Armas con Carenado pueden estar cubiertas o descubiertas.*

    Cuando añades armas a tu avión, empiezan descubiertas.

    Las armas descubiertas añaden el drag listado en la descripción del arma a la aeronave.

    Puedes mejorar un arma a carenada, eliminando su drag. Esto puede implicar mover el arma al interior del fuselaje o las alas de la aeronave, o simplemente construir carenados aerodinámicos sobre ella. El costo escala con el tamaño del arma, y los costos se duplican para las torretas.

    #table(
      columns: 2,
      align: (left, left,),
      table.header([Tamaño de Arma], [Costo]),
      [Pequeño],
      [Gratis],
      [Ligero],
      [1],
      [Mediano],
      [2],
      [Pesado],
      [5],
      [Artillería],
      [Automáticamente carenada, a menos que esté en una torreta.],
    )

    Las armas montadas en el ala no pueden estar carenadas a menos que tengas largueros en voladizo.

    Las armas que disparan a través del cono de hélice están automáticamente carenadas.

    === Accesibilidad #html.elem("a", attrs: (id: "_Accessibility"))[]
    Las armas se encasquillan. Algunas necesitan ser recargadas manualmente. Las armas sobre las que un miembro de la tripulación puede operar para llevar a cabo este tipo de actividades se llaman *accesibles*; Esto puede implicar hacer que puedas alcanzar el arma, como un montaje Foster que te permite llevar un arma a tu cabina, o puede implicar sistemas hidráulicos para cargar armas y despejar atascos.

    Los sistemas de armas son accesibles o inaccesibles como grupo. Nunca tienes una situación en la que un arma pueda ser operada pero la otra no.

    Un solo montaje de arma colocado en el fuselaje puede hacerse libremente accesible por estación de tripulación. Qué arma en particular es accesible desde qué estación de tripulación debe decidirse cuando colocas las armas. Incluso cuando están carenadas, no era raro que la parte trasera de estas armas sobresaliera en el área de la cabina, o que se utilizara un simple émbolo mecánico para despejar atascos.

    Cualquier arma colocada en las alas y montajes de armas adicionales colocados en el fuselaje comienzan como inaccesibles.

    Las armas carenadas montadas en una torreta (ver más abajo) comienzan como accesibles si las armas descubiertas en el mismo montaje serían accesibles.

    Cuesta þ igual a la mitad de las armas de un grupo hacerlas todas accesibles, mínimo 1.

    === Arcos y Montajes
    #label("_Arcs_\\&_Mounting")
    Dividimos los arcos de fuego de un arma en las siguientes direcciones.

    - Adelante (Forward)
    - Atrás (Rearward), Arriba (Up), Abajo (Down), Izquierda (Left), Derecha (Right)

    Las armas *Fijas* disparan en solo una de estas direcciones porque están atornilladas directamente a la estructura de la aeronave. Esta dirección probablemente será Adelante, a menos que estés haciendo algo muy inteligente.

    Las armas *Flexibles* pueden cambiarse para disparar en más de una dirección, teniendo diferentes configuraciones para la dirección a la que apuntan sin ser movidas y disparadas al mismo tiempo. Las armas Flexibles cuestan 1þ y eso te da dos direcciones a las que se puede apuntar el arma. Pueden ser operadas por el piloto.

    Las armas de *Torreta* son cualquier arma que esté montada de forma flexible en un punto. Requieren un operador dedicado para apuntar. Esto cuesta 1þ para configurar, y abarca un sistema completo apuntado por el artillero. Elige más de dos direcciones para que el arma dispare. Ampliar el arco de fuego de una torreta cuesta 1þ por 2 direcciones adicionales, luego 1þ cada una.

    Una Torret inicialmente tiene capacidad para un solo arma Ligera (o dos armas Pequeñas). Se pueden mejorar a un arma Mediana por 1þ, un espacio para arma Pesada por 1 Masa y 3þ, y un arma de Artillería por 2 Masa y 5þ. Como de costumbre, puedes montar dos armas de cualquier tamaño un tamaño menor que la capacidad en la torreta.

    Finalmente, puedes instalar *Braces de Armamento* dentro de una cabina. Estos son básicamente clips o montajes a los que se puede sujetar un arma para disparar en cualquier dirección. 3 direcciones de Bracing cuestan 1þ. Estos montajes permitirán a un observador un +1 para disparar un arma suelta que lleve en las manos. La desventaja es que esto a menudo es muy peligroso y provocará movimientos frecuentes de Wingwalking.

    === Sincronización #html.elem("a", attrs: (id: "_Synchronization"))[]
    Si deseas disparar a través del arco de una hélice (delante de ti con un avión tractor o detrás de ti con un avión propulsor), deberás tomar medidas para evitar golpear las palas de la hélice. Esto se hace con Sincronización. Para representar las diferentes calidades de las opciones de Sincronización, usamos las siguientes opciones.

    - Un Engranaje Interrumptor representa las versiones tempranas y aumenta la probabilidad de atasco del arma en 1. 2þ por arma. Disponible en la era WWI.
    - Un Engranaje de Sincronización representa sistemas más sofisticados. 3þ por arma. Disponible en la era Roaring 20s.

    Un Engranaje de Sincronización/Interrumptor solo se puede montar en un arma que permita ser sincronizada y solo funcionará si el arma también es Fija.

    Si eres tacaño, puedes sustituir esto con *Placas Deflectoras*; Estas cuestan 1þ y funcionarán, ¡pero infligen 1 Desgaste en tu motor cada vez que tiras un 5 natural o menos en el primer dado de Crítico!

    === Armamento en el Cono de la Hélice #html.elem("a", attrs: (id: "_Spinner_Weapons"))[]
    Si tienes una Hélice Engranada, puedes montar un arma para que dispare a través del cono de la hélice. Esto representa cosas como el cañón de línea central de 37 mm en el SPAD S.XII, el cañón del BF 109 o el P-39.

    Las armas en el cono de hélice evitan la necesidad de sincronizadores. No pueden ser torretas.

    Si tienes un arma de Artillería y/o un motor rotativo, debe estar montado en el centro con un eje de transmisión extendido, para dejar espacio al arma en el morro del avión.

    === Ejemplos #html.elem("a", attrs: (id: "_Examples"))[]
    Aquí tienes algunos ejemplos del mundo real de armas en aviones para comparar.

    Las ametralladoras MG-08 gemelas en el Albatros D.III se expresan en Flying Circus como...

    - Un *par* de ametralladoras MG *descubiertas sincronizadas* *fijas* al *fuselaje, accesibles* para el piloto.

    El tosco montaje de ametralladora Lewis en un Nieuport 11 es...

    - Una *única* ametralladora ligera LMG *descubierta fija hacia adelante* en el *ala, accesible* para el piloto.

    Aunque estas armas solían poder inclinarse hacia atrás para ser despejadas o recargadas, esto a menudo implicaba levantarse en la cabina, dando una excelente oportunidad para complicaciones narrativas.

    El refinado Montaje Foster del SE.5 es...

    - Una *única* ametralladora ligera LMG *descubierta flexible* que dispara hacia adelante y hacia arriba, montada en el *ala, accesible* para el piloto.

    Las armas montadas en el ala en un Sopwith Dolphin son...

    - Un *par* de ametralladoras ligeras LMG *descubiertas fijas hacia adelante* en el *ala, inaccesibles* para el piloto.

    Un FE.2 temprano tiene...

    - 6 *Braces de Armamento* en su asiento de observador para una *LMG*;

    Lo que permite al observador disparar en cualquier dirección.

    El cañón montado en el motor del BF-109 es...

    - Un *único* cañón ligero *carenado fijo* hacia adelante *a través del cono de hélice, accesible* para el piloto.

    El arma se ha hecho accesible a través de hidráulicos.

    == Carga #html.elem("a", attrs: (id: "_Load"))[]
    La Carga es todo lo que va encima de la aeronave después de estar completa. De aquí proviene la diferencia entre la _Masa Seca_ (la aeronave tal como está) y la _Masa Húmeda_ (la aeronave con combustible y bombas).

    La Masa Húmeda es esencialmente _masa separada_, y siempre se _redondea hacia arriba_ al MP más cercano, a diferencia de los cálculos habituales. Así que si tienes un avión que pesa 41 Masa Seca (8MP), no puedes ponerle 3 de combustible y permanecer en 8MP. El combustible solo viene en trozos de 1MP en los tanques regulares. 1 Masa de bombas o 5, todo cuenta como 1 MP, así que si puedes, siempre toma una cantidad par de MP de bombas.

    Esto es para simplificar la contabilidad en la mesa, y asegurar que el combustible siempre tenga una penalización asociada.

    === Combustible #html.elem("a", attrs: (id: "_Fuel"))[]
    Los motores tienen Consumo de Combustible, que utiliza una unidad de combustible abstraída. Cada Masa de combustible son 25 de esos puntos. Así que básicamente, multiplica la cantidad de masa de combustible por 25, luego divídelo por el consumo de todos tus motores, y esa es la cantidad de usos de combustible que tienes.

    Puedes colocar 2 Tanques de Combustible en 1 sección de aeronave, o añadir Tanques de Combustible en un ala por +3 Drag cada uno. Si tienes un ala en Voladizo, puedes poner 1 Tanque de Combustible por cada 10 Área en las alas sin drag adicional en su lugar.

    Un tanque de combustible te da hasta 5 masas de Combustible. El tanque en sí pesa 1 Masa.

    Un Micro-Tanque es un tanque de 1 Masa que contiene 25 unidades de combustible y no utiliza un espacio de estructura, pero aun así pesa 1 Masa vacío, y está limitado a 4 por avión.

    ¿No quieres morir? Esto te ayudará.

    - Extintor Remoto: Aguanta 1. Gasta la carga para apagar un incendio. 2 Masa, 3þ
    - Tanque de Combustible Auto-sellante: Se aplica a todos los tanques de combustible internos. La penalización por fuga de combustible se aplicará solo a la siguiente Prueba de Combustible. +1 Masa y +2þ por tanque.

    === Bombas #html.elem("a", attrs: (id: "_Bombs"))[]
    Las aeronaves pueden, si están preparadas para ello, llevar bombas. Cómo se llena exactamente eso depende de ti y de tu configuración en ese momento. Las aeronaves están limitadas por era en cuanto a cuántas bombas pueden llevar.

    Un Montaje Externo de Bombas que puede llevar hasta 5 Masas de bombas cuesta 1 Masa y 1 Drag y no ocupa un espacio de estructura.

    Una Bahía Interna de Bombas ocupa un espacio de estructura y permite transportar hasta 10 Masas de bombas internamente. La bomba más grande que puedes llevar dentro de tu avión es igual a un cuarto de la carga interna total de bombas.

    Puedes ampliar el tamaño máximo de bomba de una bahía añadiendo secciones de estructura para alargar la bahía de bombas. Añadir +1 Estructura por Bahía te permite llevar una bomba de hasta la mitad de la carga total, otra +1 Estructura te permite llevar una sola bomba igual a la carga total dentro de la aeronave. Ampliar la bahía duplica la masa de bombas que se pueden transportar dentro.

    Las masas de bombas siempre se redondean al Penalizador de Masa más cercano; 1 Masa de bombas sigue tratándose como 1 Penalizador de Masa.

    Al usar soportes externos de bombas, las bombas reducirán adicionalmente la velocidad del avión. Vuelve a calcular la velocidad de la aeronave con las bombas causando Drag igual a la Masa sin redondear, y escribe tu velocidad máxima como Velocidad Máxima Con Bombas/Velocidad Máxima.

    Las bombas no cuentan para tu MP cargado a efectos del tren de aterrizaje y similares.

    La Carga Máxima de Bombas varía según la era. Las bombas internas cuentan a 1/3#super[rd]
    la tasa de las bombas externas. Por ejemplo, un bombardero de la WWI con 100 de Estructura podría llevar 20 bombas externamente, o 60 internamente, o una mezcla como 30 internamente y 10 externamente.

    #table(
      columns: 7,
      align: (left, left, left, left, left, left, left,),
      table.header([Era], [Pioneer], [WW1], [Roaring 20s], [Coming Storm], [WW2], [Last Hurrah]),
      [Carga Máxima de Bombas],
      [1/6 Estructura],
      [1/5 Estructura],
      [1/4 Estructura],
      [1/3 Estructura],
      [1/3 Estructura],
      [1/2 Estructura],
    )

    === Cohetes #html.elem("a", attrs: (id: "_Rockets"))[]
    Los cohetes funcionan exactamente igual que las bombas.

    === Carga #html.elem("a", attrs: (id: "_Cargo"))[]
    La Carga se trata exactamente como cualquier otra carga y se redondea a las 5 Masas más cercanas. Como la mayoría de las cosas no tienen realmente un valor de masa, improvisa. Aproximadamente, 25 kilogramos son 1 Masa.

    El espacio de carga solo se estima aproximadamente debido a la dificultad para predecir la densidad de la carga y cuán bien se apila, por lo que solo tenemos unos pocos tamaños diferentes de espacios de carga.

    - Un espacio pequeño solo cuesta 1 masa y te da un pequeño armario para cosas personales.
    - Un espacio pequeño cabrá un baúl, barril o caja. Requiere una sección de estructura.
    - Un espacio mediano cabrá un vehículo pequeño como una motocicleta, coche o motor de zepelín. Requiere 3 secciones de estructura.
    - Un espacio grande cabrá un avión de reconocimiento o caza con las alas quitadas. Requiere 5 secciones de estructura.
    - Un espacio enorme cabrá casi cualquier cosa que puedas imaginar. Requiere 10 secciones de estructura.

    Cada sección de estructura añadida agrega +3 Masa Cargada a la aeronave cuando le pones cosas. Sin embargo, si apenas lo has llenado y te sobra mucho espacio, simplemente ignóralo.

    El espacio de carga puede usarse para almacenar personas, de forma incómoda y temporal. Excepto los espacios pequeños.

    === Puntos Fuertes (Hardpoints) #html.elem("a", attrs: (id: "_Hardpoints"))[]
    A partir de la Era WW2, puedes montar Puntos Fuertes en las aeronaves. Los Puntos Fuertes son montajes flexibles que pueden montar una variedad de cargas diferentes, como tanques de caída, bombas, cohetes, vainas de armamento o cohetes.

    Añadir un punto fuerte cuesta 5þ, y puedes tener uno por cada 20 de Estructura.

    Escribiremos estas reglas en breve.

    == Tren de Aterrizaje #html.elem("a", attrs: (id: "_Landing_Gear"))[]
    Trenes Inferiores (Elige 1)

    - Tren de Aterrizaje: +1 Drag por MP Cargado
    - Flotadores: +1 ½ Drag por MP Cargado.
    - Flotadores Híbridos: +2 Drag por MP Cargado.
    - Casco de Barco: +5 Masa. +1 Drag y +1 Estructura por MP Cargado.
    - Patín de Aterrizaje: Cuando aterrices, tira Go Down y recibe -1 en los resultados.

    Extras

    - Gancho de Zepelín: +1 Masa, permite aterrizar dentro de dirigibles o aviones grandes.
    - Gancho de Portaviones: +1 Masa por cada 2 MP. Permite aterrizar en portaviones.
    - Patín Bajo Ala: +3 Drag, +2 Seguridad en Caída

    El tren de aterrizaje (excepto los patines) puede hacerse retráctil, cambiando todo el Drag por la mitad de ese valor en Masa, y la otra mitad como Costo (Redondea hacia abajo como de costumbre). Para un Casco de Barco, en su lugar, añade trenes de aterrizaje retráctiles a su costo completo para permitir aterrizar tanto en agua como en tierra.

    Esta masa añadida no hará que el tren de aterrizaje sea más grande, no te preocupes.

    === Cascos de Barco (Boat Hulls) #html.elem("a", attrs: (id: "_Boat_Hulls"))[]
    Si usas un casco de barco, necesitas mantener tu(s) motor(es) lejos del agua. Los motores deben estar en una góndola, encima de un ala de hombro en góndolas o un canal, o montados en otra ala.

    Básicamente, un Casco de Barco trata todo el fuselaje de la aeronave como los trenes de aterrizaje, por lo que lo que sería un ala de hombro sería un ala de tren.

    == Accesorios #html.elem("a", attrs: (id: "_Upgrades"))[]
    === Blindaje #html.elem("a", attrs: (id: "_Armour"))[]
    El Blindaje es muy simple. Viene en valores de Cobertura y Espesor. La masa del blindaje es Cobertura por 2^(Espesor-1). Es decir, para Espesor 3, es Cobertura \* 4, y Espesor 5 es Cobertura \* 16. El costo es 1/3 de la Cobertura \* Espesor.

    Además, multiplica el valor de Cobertura y Espesor, y añade esa cantidad de Resistencia (Toughness) a la aeronave.

    La cantidad máxima de blindaje que puedes tener es 8 de cobertura. Además, cada 2 Partes Vitales que tengas por encima de 8 (es decir, en 10, 12, 14, etc.) reduce tu cobertura efectiva en 1, por lo que tienes que comprar la diferencia. Esto representa la dificultad de blindar aviones cada vez más grandes con componentes más importantes que proteger.

    La salvación de blindaje que obtienes es 11 menos Cobertura, por lo que la salvación máxima es 3+. La cobertura de blindaje de mayor Espesor cuenta para la cobertura en Espesores menores, pero el límite sigue siendo 8/3+.

    Una placa detrás de un piloto para protegerlo de balas de fusil es 2 de Cobertura de Blindaje de Espesor 2.

    === Sistemas Eléctricos
    #label("_Electrical Systems")
    Todo lo que genera electricidad, esencialmente genera esa cantidad de electricidad como base, lo que significa que mientras lo que estés usando no consuma más cargas que eso, es "gratis". Si consume más cargas que eso, tiene que tomarlas de una batería.

    Las baterías se cargan cuando Cool Down si tienes un molino de viento, alternador o generador.

    #table(
      columns: 4,
      align: (left, left, left, left,),
      table.header([Nombre], [Efectos], [Costo], [Era]),
      [Molino de Viento],
      [+1 Drag, +1 Cargas por cada 10 Speed.],
      [1þ],
      [Pioneer],
      [Batería],
      [+1 Masa, Almacena 5 Cargas.],
      [2þ],
      [Pioneer],
      [Batería de Alta Calidad],
      [Almacena 5 Cargas.],
      [4þ],
      [Roaring 20s],
      [Alternador],
      [+1 Masa, +1 Carga, y +1 Cargas adicional por cada 10 Potencia del motor al que se aplica.],
      [2þ],
      [Pioneer],
    )

    La electricidad puede alimentar armas y motores. También pueden hacer funcionar los siguientes sistemas de comunicación. Intercomunicadores, reflectores, luces de navegación, receptores de radio y ventiladores nunca usan cargas, pero requieren un sistema eléctrico.

    #table(
      columns: 4,
      align: (left, left, left, left,),
      table.header([Nombre], [Efectos], [Costo], [Era]),
      [Sistema de Intercomunicación],
      [Requiere la Parte Vital de Electricidad.],
      [1þ],
      [Pioneer],
      [Receptor de Radio],
      [+2 Masa, +2 Drag, Requiere la Parte Vital de Electricidad.],
      [3þ],
      [Pioneer],
      [Transmisor de Radio],
      [+3 Masa, +3 Drag, -1 Carga.],
      [3þ],
      [WWI],
      [Transceptor de Radio],
      [+5 Masa, +3 Drag, -1 Carga],
      [3þ],
      [WWI],
      [Receptor de Radio (Alta Calidad)],
      [+1 Masa, +2 Drag, Requiere la Parte Vital de Electricidad.],
      [6þ],
      [Roaring 20s],
      [Transmisor de Radio (Alta Calidad)],
      [+2 Masa, +3 Drag, -1 Carga.],
      [6þ],
      [Roaring 20s],
      [Transceptor de Radio (Alta Calidad)],
      [+3 Masa, +3 Drag, -1 Carga],
      [6þ],
      [Roaring 20s],
      [Receptor de Baleena],
      [Requiere la Parte Vital de Electricidad. Solo puede hablar con la Estación Base de Baleena emparejada.],
      [5þ],
      [Himmilgard],
      [Estación Base de Baleena],
      [+6 Masa, +1 Drag, -1 Carga.],
      [12þ],
      [Himmilgard],
      [Estación Base de Baleena (Alta Calidad)],
      [+5 Masa, +1 Drag, -1 Carga.],
      [24þ],
      [Himmilgard],
    )

    === Información #html.elem("a", attrs: (id: "_Information"))[]
    Aquí tienes algunas formas de recopilar datos.

    #table(
      columns: 3,
      align: (left, left, left,),
      table.header([Nombre], [Efectos], [Costo]),
      [Cámara de Reconocimiento Integrada],
      [Puede tomar fotos hacia abajo. Las capacidades escalan con la era.],
      [2þ],
      [Guncam],
      [Confirma tus derribos por ti.],
      [1þ],
    )

    === Visibilidad #html.elem("a", attrs: (id: "_Visibility"))[]
    Ver más lejos, mejor.

    #table(
      columns: 3,
      align: (left, left, left,),
      table.header([Nombre], [Efectos], [Costo]),
      [Recortes de Ala],
      [+1 Visibilidad, +1 Pérdida de Sustentación. No se puede usar con alas de celuloide transparente con tapas.],
      [\-],
      [Recortes de Fuselaje],
      [+1 Visibilidad, -5 Estructura. No se puede usar con estructuras de celuloide transparente con tapas.],
      [\-],
      [Reflector],
      [Permite identificar objetivos de noche. Requiere la Parte Vital de Electricidad.],
      [1þ],
    )

    === Control Climático #html.elem("a", attrs: (id: "_Climate_Control"))[]
    Si estás construyendo un avión de alta altitud o un hidroavión para aguas frías, necesitarás calefacción. Si estás volando en los trópicos o el desierto, es importante mantenerse fresco. Esto puede mitigar los efectos de Estrés de climas adversos.

    #table(
      columns: 3,
      align: (left, left, left,),
      table.header([Nombre], [Efectos], [Costo]),
      [Calefacción Eléctrica],
      [-1 Carga.],
      [1þ],
      [Bucle de Radiador],
      [Requiere un Radiador.],
      [1þ],
      [Ventilador Básico],
      [(Trasladado a la sección de Cabina)],
      [\-],
      [Aire Acondicionado],
      [-2 Cargas],
      [4þ],
    )

    === Pilotos Automáticos #html.elem("a", attrs: (id: "_Autopilots"))[]
    Los pilotos automáticos comenzaron a usarse en la década siguiente a la invención del avión, y algunos disponibles en Flying Circus son bastante fantásticos.

    Esto te hará la vida más fácil.

    #table(
      columns: 4,
      align: (left, left, left, left,),
      table.header([Nombre], [Efectos], [Costo], [Era]),
      [Giroscópico],
      [Otorga +4 a las tiradas de Asiento Vacío.],
      [3þ],
      [WWI],
      [Mantenimiento de Altitud],
      [+1 Masa, Permite ignorar la regla de Asiento Vacío.],
      [5þ],
      [Coming Storm],
      [Programable de Relojería],
      [+1 Masa. Se le puede dar una única orden simple como ascender, picar, girar, volar a una ubicación. No puede Dogfight!, disparar armas, lanzar bombas o aterrizar.],
      [6þ],
      [Himmilgard],
      [Programable],
      [+1 Masa, -2 Cargas. Se le puede dar una única orden simple como ascender, picar, girar, volar a una ubicación. No puede Dogfight!, disparar armas, lanzar bombas o aterrizar.],
      [6þ],
      [WWII],
      [Rattenhirn],
      [+3 Masa, -3 Cargas, Hace el vuelo por ti, estando completamente automatizado. Los jugadores no suelen usarlos, son para robo-aviones.],
      [25þ],
      [Himmilgard o Last Hurrah],
    )

    === Sistemas de Control #html.elem("a", attrs: (id: "_Control_Systems"))[]
    Normalmente controlas tu avión tirando directamente de cables. Esto te permite hacerlo mejor. Elige uno. Consulta Fatiga del Piloto para las reglas completas.

    #table(
      columns: 4,
      align: (left, left, left, left,),
      table.header([Nombre], [Efectos], [Costo], [Era]),
      [Varillas de Control],
      [+1 Masa. La Tensión Máxima de Vuelo por MP es 1.],
      [2þ],
      [WWI],
      [Asistencia Hidráulica],
      [+3 Masa, Elimina la Tensión de Vuelo por MP.],
      [5þ],
      [WWII],
      [Fly by Wire],
      [+3 Masa. Elimina toda la Tensión de Vuelo.],
      [10þ],
      [Last Hurrah],
    )

    == Hélice #html.elem("a", attrs: (id: "_Propeller"))[]
    Cuando montas tu hélice, gana un Paso (Pitch). Anótalo para cálculos posteriores. Si usas pulsorreactores, obtendrás números de todos modos, a pesar de no tener una hélice.

    #table(
      columns: 5,
      align: (left, left, left, left, left,),
      table.header([Mod de Hélice], [Mod de Paso de Speed], [Mod de Paso de Boost], [Energía], [Giro]),
      [Alta Potencia],
      [.8],
      [0.9],
      [1.5],
      [8],
      [Potencia],
      [.9],
      [0.8],
      [2],
      [7],
      [Paso Por Defecto],
      [1],
      [0.6],
      [3],
      [6],
      [Speed],
      [1.1],
      [0.4],
      [4],
      [5],
      [Alta Speed],
      [1.2],
      [0.3],
      [4.5],
      [4],
      [Pulsejet],
      [1.3],
      [0.6],
      [5],
      [2.5],
    )

    Cada uno de estos valores de paso representa una hélice única, con cada hélice teniendo un costo de 1þ. Tu primera hélice por motor siempre es gratis y puede construirse de la forma que elijas.

    Puedes mejorar tu hélice (excepto los pulsorreactores, no tienen hélices reales) a una de las siguientes opciones.

    #table(
      columns: 4,
      align: (left, left, left, left,),
      table.header([Nombre], [Efectos], [Costo por Hélice], [Era]),
      [Variable Manualmente],
      [Permite ajustar el paso de las palas en tierra sin reemplazarlas.],
      [2þ],
      [Pioneer],
      [Variable Automática],
      [+1 Masa. +0.1 Paso de Speed, +0.1 Paso de Boost, +0.5 Energía, +1 Giro.],
      [8þ],
      [Roaring 20s],
    )

    === Optimización #html.elem("a", attrs: (id: "_Optimization"))[]
    Las optimizaciones son fáciles de abusar. Solo deben usarse para representar decisiones de diseño específicas que no se reflejan en las estadísticas de un avión, o para hacer que un avión real se ajuste más a sus estadísticas reales. Por ejemplo, el V-173 Flying Pancake está diseñado para intercambiar un aumento de drag por una reducción en la pérdida de sustentación.

    Las optimizaciones ocurren después de todo lo demás. Como ejemplo, las optimizaciones de masa no aumentarán ni disminuirán el drag del tren de aterrizaje externo.

    Los modificadores porcentuales usan el número original sin modificar: no se componen. Recuerda redondear hacia abajo.

    Equilibra la tabla.

    Usa tu sentido común aquí: ¡más caro es peor, más resistencia o tensión máxima es mejor!

    #table(
      columns: 7,
      align: (left, left, left, left, left, left, left,),
      table.header(table.cell(colspan: 3, [Negativo]), [*Efecto*;], table.cell(colspan: 3, [Positivo])),
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [Gasto: +/- 10% Costo],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [Eficiencia de Sustentación: +/- 3 Pérdida de Sustentación],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [Espacio para las Piernas: +/- 1 Escape, Visibilidad],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [Masa: +/- 10% Masa (sin incluir la masa de bombas)],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [Redundancia: +/- 25% Resistencia (Toughness)],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [Soporte: +/- 15% Tensión Máxima],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [Fiabilidad: +/- 2 Fiabilidad],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [Aerodinámica: +/- 10% Drag (sin incluir combustible ni bombas)],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
      [#sym.square.stroked.medium],
    )

    == Cálculos Finales #html.elem("a", attrs: (id: "_Final_Calculations"))[]
    *Procedimiento de Cálculo*

    Calcula cada una de estas estadísticas para Combustible Completo con Bombas (también carga, pasajeros, etc.), Combustible Completo y Combustible Vacío. Las versiones con Medio Combustible son el promedio de los números de Completo y Vacío, redondeado hacia abajo.

    *Masa*

    Suma todos tus puntos de masa. Tu Penalizador de Masa (MP) es 1/5 de eso (redondeando hacia abajo), mínimo 1.

    No incluyas la masa de tu Combustible o Bombas (este será tu Peso Seco). El MP Húmedo sí incluye la masa de tu Combustible y Bombas. Mantén tu MP bajo para poder ascender más fácilmente y maniobrar.

    *Resistencia (Drag)*

    Añade tu Penalizador de Masa (MP) directamente a tu Drag. Luego suma todos tus puntos de Drag. Tu Penalizador de Drag (DP) es 1/5 de eso (redondeando hacia abajo), mínimo 1.

    Mantén tu DP bajo para viajar más rápidamente.

    *Potencia, Boost y Caída de Velocidad*

    La Velocidad Máxima de tu avión se determina mediante esta ecuación comparando tu potencia total del motor con tu penalizador de drag.

    Velocidad Máxima =~Paso de Speed \* √((2000 \* Potencia) / (DP \* 9)))

    Redondea hacia abajo, como de costumbre.

    También puedes usar para calcular el valor.

    Tu Boost es la Potencia de tu(s) motor(es) dividida por tu MP, redondeado hacia abajo. Si obtienes 0, necesitas más potencia para superar la fricción en reposo, así que consigue motores más grandes o pierde algo de peso.

    Tu Caída de Velocidad (Dropoff) es tu Velocidad Máxima final multiplicada por tu Modificador de Paso de Boost.

    *Tasa de Ascenso*

    La tasa de ascenso es (23 \* Potencia) / (MP Húmedo \* Paso de Speed \* DP), mínimo 1.

    *Velocidad de Pérdida (Stall Speed)*

    Para obtener tu velocidad de pérdida, multiplica la Pérdida de Sustentación por el Penalizador de Masa y divídelo por el Área del Ala.

    *Estabilidad*

    Simplemente suma tus dos Estabilidades para obtener tu valor. Sin embargo, si ambas Estabilidades son positivas, añade +2 de Estabilidad adicional, y haz lo contrario si ambas son negativas. Los aviones necesitan ser un poco inestables para volar, pero si son demasiado inestables, no vuelan realmente.

    Tu Estabilidad crea un modificador de Control de la siguiente manera.

    #table(
      columns: 10,
      align: (left, left, left, left, left, left, left, left, left, left,),
      table.header([Estabilidad], [-10], [-7 a -9], [-4 a -6], [-1 a -3], [0], [+1 a +3], [+4 a +6], [+7 a +9], [+10]),
      [Mod Control],
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

    Un avión con más de 10 o menos de -10 de estabilidad es inviable para seres humanos.

    *Maniobrabilidad (Handling)*

    Maniobrabilidad = 100 + Control - Penalizador de Masa

    *Pérdida de Energía vs Sangrado de Giro*

    Estas dos estadísticas son cuánta velocidad pierdes al ascender y cuánta velocidad pierdes en un giro de combate. Se ve afectada por tus estadísticas de Energía y Giro según el paso de tu hélice. Los pulsorreactores están en la misma tabla a pesar de no usar hélices.

    Tu Sangrado de Giro es

    Stall Speed (Medio Combustible, Sin Bombas) Dividido por Giro de Paso de Hélice.

    Por razones de equilibrio, redondea hacia arriba, mínimo 1.

    Tu Sangrado de Giro será +1 mientras lleves bombas, cohetes, carga o pasajeros.

    Tu Pérdida de Energía es

    Penalizador de Drag (Sin Bombas) Dividido por Energía de Paso de Hélice

    Por razones de equilibrio, redondea hacia arriba, mínimo 1, máximo 10.

    *Fatiga del Piloto*

    El Estrés por Vuelo por defecto es 1. Ganas +1 de Estrés por cada uno de los factores que sea cierto.

    - Una Estabilidad superior a 3 o inferior a -3.
    - Cada 10MP.
    - Por punto de Rumble (máximo 3).
    - Un motor rotativo tractor + una cabina expuesta.

    Los copilotos pueden reducir el estrés de todo excepto el Rumble y los motores rotativos.

    Si tienes Varillas de Control, el Estrés Máximo de Vuelo por Penalizador de Masa es 1.

    Si tienes controles con asistencia hidráulica, no recibes Estrés de Vuelo por la Masa de la aeronave.

    Los controles Fly by Wire eliminan todo el Estrés de Vuelo, excepto el de los motores rotativos que te rocían aceite en la cara. Simplemente no te duermas en tu vehículo aburrido.

    *Mantenimiento*

    Esta estadística es la Potencia del Motor dividida por 10, o el costo total de todos los motores, lo que sea menor. Para este propósito, los generadores cuentan como motores y usan la potencia anterior a la reducción (es decir, motores Push-Pull).

    *Tensión Máxima y Resistencia*

    Tu Estructura total es simplemente tu Estructura. No se necesitan modificaciones.

    Resta tu MP de tu Tensión Máxima al final. Tu Tensión Máxima siempre está limitada por tu Estructura total.

    Tu Resistencia (Toughness) es Estructura/5 + Blindaje.

    *Partes Vitales*

    Determina la lista de Partes Vitales de la siguiente manera.

    Todas las aeronaves tienen la Parte Vital de Controles.

    Todas las aeronaves tienen una parte vital para su tren de aterrizaje, sea cual sea.

    Cada Sistema de Armas en la aeronave es una Parte Vital.

    Si la aeronave tiene algún sistema eléctrico, todos forman una Parte Vital llamada Electricidad.

    Si la aeronave tiene algún tanque de combustible, colectivamente forman una Parte Vital.

    - Cada Motor es una Parte Vital.
    - Cada Radiador es una Parte Vital.
    - Cada Tanque de Aceite es una Parte Vital.
    - Cada Enfriador de Aceite es una Parte Vital.
    - Cada Bandeja de Aceite es una Parte Vital.

    #table(
      columns: 1,
      align: (left,),
      table.header([Avión Doble]),
      [Una forma barata y fácil de hacer un caza pesado es pegar dos cazas ligeros. Simplemente suma todas sus estadísticas y vuelve a calcular. Puedes optar por eliminar la otra cabina para ahorrar 1 masa, pero de lo contrario, ambas funcionan.

        El avión resultante puede ser modificado por sí solo. Técnicamente, podrías hacer un avión triple o más de esta manera también. ¡Pero entonces empieza a volverse un poco tonto!

      ],
    )

    == Ingeniería Casera #html.elem("a", attrs: (id: "_Home_Engineering"))[]
    Aunque este sistema intenta ser completamente exhaustivo, no siempre puede serlo. A veces quieres ir más allá de los límites del sistema, o crees que tu personaje puede hacer algo ingenioso. Ahí es donde entra la Ingeniería Casera.

    === Modificación Poco Aconsejable #html.elem("a", attrs: (id: "_Unwise_Modification"))[]
    Ve a tu Director de Juego y dile: "Tengo una idea para algo que quiero hacerle a mi avión". Expón las mecánicas de cómo visualizas esto.

    Si esta modificación no rompe por completo el sistema, el Director de Juego te cobrará entonces un precio justo por ella en Thaler, drag, masa, etc. Siempre debería inclinarse hacia el lado más barato.

    La modificación tiene el efecto que deseas, pero hay un precio. El Director de Juego puede añadir un nuevo Movimiento Difícil que puede usar en tu contra, de la siguiente manera.

    Su modificación especial falla de manera espectacular y horrible.

    Nunca _tienen_ que usarlo. Puede que nunca surja. Pero está ahí.

    Acechando.

    == Aviones Usados #html.elem("a", attrs: (id: "_Used_Planes"))[]
    La mayoría de los aviones que los jugadores compran o recuperan son Usados. Los aviones Usados cuestan la mitad del precio de lista en thaler (redondeando hacia abajo), pero tienen uno de los siguientes inconvenientes. Después de comprarlo, tira 1d10 para saber qué le pasa. Si una regla te da múltiples penalizaciones de usado, no pueden ser la misma.

    #table(
      columns: 3,
      align: (left, left, left,),
      table.header([d10], [Nombre], [Penalización]),
      [1],
      [Destrozado],
      [¡Tira de nuevo, dos veces! Si obtienes esto de nuevo, ignóralo.],
      [2],
      [Quemado],
      [Los motores tienen -1 de Fiabilidad],
      [3],
      [Desgastado],
      [Reduce tu Velocidad Máxima en un 10%],
      [4],
      [Pesado],
      [Aumenta tus Stall Speed en un 20%],
      [5],
      [Armas Pegajosas],
      [Aumenta la probabilidad de que las armas se encasquillen en 1],
      [6],
      [Débil],
      [Corta la Resistencia (Toughness) del avión a la mitad],
      [7],
      [Frágil],
      [Reduce tu Tensión Máxima en un 20%],
      [8],
      [Con Fugas],
      [Reduce tu Combustible en un 20%],
      [9],
      [Lento],
      [Reduce tu Maniobrabilidad (Handling) en 5],
      [10],
      [Impecable],
      [Sin penalización],
    )

    Cuesta 5 thaler restaurar un avión Usado y eliminar el inconveniente, y necesitas volar al menos una misión antes de que pueda ser reparado. Cada vuelo subsiguiente reduce el costo en 1: lo arreglas gratis después de seis vuelos.

    == Reglas de Altitud #html.elem("a", attrs: (id: "_Altitude_Rules"))[]
    La mayoría de las campañas no interactuarán realmente con las reglas de altitud en gran detalle, por lo que el libro de reglas recomienda ignorarlas si no es crítico. Si estás usando las reglas de altitud, esta sección muestra los efectos en tu avión. A medida que te mueves a altitudes más altas, el aire se vuelve más delgado. Drag, sustentación y autoridad de control se reducen, y los motores luchan por obtener suficiente oxígeno. Las reglas para calcular esto están en la página 56 del libro de reglas básico.

    Tu Factor de Altitud (FA) es como el Factor de Speed; la cifra de las decenas en tu indicador. El rendimiento de tu aeronave cambia con el Factor de Altitud. La Stall Speed aumenta con la altitud, y tu motor solo opera al máximo rendimiento dentro de tu Rango de Altitud Ideal (RAI).
  ]
]