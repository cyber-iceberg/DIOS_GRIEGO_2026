export const QUOTES = [
  "El cuerpo logra lo que la mente cree.",
  "No cuentas las repeticiones. Empiezas a contar cuando duele.",
  "Eras un flaco con fuerza. Vas a ser una bestia con técnica.",
  "Agosto se construye en mayo.",
  "El gemelo o lo destruyes, o no crece. Hoy lo destruyes.",
  "La disciplina es elegir entre lo que quieres ahora y lo que quieres más.",
  "Nadie ve el trabajo. Todos ven el resultado.",
  "RIR 1. Una en reserva. Cero excusas.",
  "El descanso también es entrenamiento. Pero hoy no toca descansar.",
  "Cada serie es un voto por la persona en la que te conviertes.",
  "El dolor es temporal. El no haberlo intentado es para siempre.",
  "Activa el sistema nervioso. Despierta a la bestia.",
  "Tu única competencia es quien fuiste ayer.",
  "La cadera se abre con constancia, no con intensidad.",
  "Construye el cuello, construye la presencia.",
  "Explosivo arriba. Controlado abajo. Siempre.",
  "El físico se forja con hierro y se sostiene con hábitos.",
  "No entrenas para verte bien. Entrenas para ser indestructible.",
]

export const RFT_GUIDE = [
  { name: "Forward to Reverse Crawl", spec: "3×4 viajes", desc: "Cuadrupedia, rodillas 2cm del suelo, movimiento cruzado (brazo y pierna opuestos). 4 pasos adelante, 4 atrás. Caderas bajas, core tenso." },
  { name: "Sit-Thrus", spec: "3×6/lado", desc: "Desde crawl, levanta una mano y lleva la rodilla contraria por debajo del cuerpo girando la cadera. El pie cruza. Alterna sin parar. Core rotacional puro." },
  { name: "Hostage Squat", spec: "3×10", desc: "Manos entrelazadas en la nuca, codos abiertos, pecho arriba. Baja a 90° con talones planos. Pausa 1 seg abajo. Mide tu movilidad de cadera real." },
  { name: "Side / Reverse Crawl", spec: "2×4 cada dir", desc: "Crawl lateral 4 pasos a cada lado y crawl hacia atrás. Coordinación cruzada siempre. Entrena patrones que el gym ignora." },
  { name: "3-Step Drop", spec: "3×5", desc: "Sentadilla profunda, explosión vertical máxima, aterrizaje suave absorbiendo con rodillas. El aterrizaje importa tanto como el salto." },
  { name: "Stationary Gorilla", spec: "3×30 seg", desc: "Posición baja, rodillas abiertas, pies planos, manos al suelo. Roca adelante-atrás y lateral. Abre cadera activa, fortalece hombros." },
  { name: "Explosive Push-up", spec: "4×6", desc: "Bajada 2 seg, explosión máxima hacia arriba. Despega las manos. Progresión: palmada → palmada en el pecho → archer explosivo." },
]

export const RULES = [
  { t: "Si completas todas las series con RIR 2+", d: "Sube el peso la semana siguiente. Compuestos +2.5–5kg, aislados +1–2.5kg. Sin negociar." },
  { t: "Si completas con RIR 0–1", d: "Mantén el peso. El cuerpo necesita una semana más para consolidar." },
  { t: "Si no completas 2 semanas seguidas", d: "Baja 5–10% y reconsolida. No es fracaso, es periodización." },
  { t: "Fallo absoluto NUNCA en compuestos", d: "DL, hang clean, press, remo. Sin spotter el fallo es lesión. RIR 1 siempre." },
  { t: "Fallo controlado SÍ en aislados", d: "Curl, extensión tríceps, lateral, gemelo. Última serie al fallo con técnica limpia." },
  { t: "Semanas de descarga: 4 y 7", d: "50% volumen, 80% carga. El cuerpo supercompensa. La semana siguiente subes más." },
  { t: "Gemelo: 3 seg excéntrico + drop set", d: "Sin excéntrico lento no hay hipertrofia. Drop set en la última serie hasta fallo absoluto." },
]

export const TRACKER_EXERCISES = [
  { id: "press_inclinado", name: "Press inclinado", sub: "kg / mano", start: 18, step: 2 },
  { id: "peso_muerto", name: "Peso muerto", sub: "kg total", start: 62, step: 5 },
  { id: "hang_clean", name: "Hang clean", sub: "kg total", start: 50, step: 5 },
  { id: "hip_thrust", name: "Hip thrust", sub: "kg total", start: 60, step: 5 },
  { id: "bulgara", name: "Sentadilla búlgara", sub: "kg / mano", start: 16, step: 2 },
  { id: "remo_barra", name: "Remo Pendlay", sub: "kg", start: 62, step: 3 },
  { id: "curl", name: "Curl mancuerna", sub: "kg / mano", start: 16, step: 1 },
  { id: "cuello", name: "Cuello con disco", sub: "kg", start: 5, step: 1.25 },
  { id: "dominadas", name: "Dominadas limpias", sub: "reps", start: 4, step: 1 },
]

export const DAYS = [
  {
    key: "lun", short: "Lun", label: "Push", train: true,
    title: "Push — Pecho · Hombro · Tríceps · Cuello",
    focus: ["Hipertrofia", "70 min"],
    blocks: [
      { t: "RFT — activación SNC", rft: true, rest: "fluido · sin pausa", exs: [
        { n: "Explosive push-up", d: "Bajada 2 seg, explosión máxima. Con tu nivel: palmada en el pecho.", s: "4×6" },
        { n: "Stationary Gorilla", d: "Posición baja, roca en todas direcciones. Abre cadera activa.", s: "3×30s" },
        { n: "Sit-Thrus", d: "Knee drive lateral desde crawl girando la cadera. Alterna sin parar.", s: "3×6/l" },
      ]},
      { t: "Bloque principal", rest: "75–90s", exs: [
        { n: "Press inclinado mancuernas (30–35°)", d: "MEDIBLE. S1: 18kg/mano. +2kg cuando completes 4×10 a RIR 1. Meta agosto: 24–26kg.", s: "4×8–10", r: "2 min" },
        { n: "HSPU estricto contra pared", d: "Ya tienes 10 frescos. Con carga acumulada + pausa 2 seg desde S3. S5+: deficit con libros.", s: "4×8–10", r: "2 min" },
        { n: "Press hombro mancuernas sentado", d: "16kg S1. +1.25kg/semana. Codos algo delante — protege manguito.", s: "4×10–12" },
        { n: "Elevación lateral", d: "Pausa 1 seg arriba. Deltoide medio — anchura que estrecha la cintura.", s: "4×15" },
        { n: "Pull-over mancuerna", d: "Expansión costal + serrato. Fundamental para el pectus.", s: "3×12" },
      ]},
      { t: "Cuello + tríceps", rest: "45–60s", exs: [
        { n: "Flexión cuello con disco", d: "5kg S1. +1.25kg cuando hagas 3×15. Diámetro visible en 6 semanas.", s: "3×12–15" },
        { n: "Extensión tríceps overhead", d: "Cabeza larga. Fallo en última serie.", s: "4×12+f" },
        { n: "Flexiones diamante", d: "Manos bajo el esternón, codos atrás. Fallo última serie.", s: "3×máx" },
      ]},
    ],
  },
  {
    key: "mar", short: "Mar", label: "Legs A", train: true,
    title: "Legs A — Peso muerto · Hang clean · Glúteo",
    focus: ["Pierna pesada", "70 min"],
    blocks: [
      { t: "RFT — activación SNC", rft: true, rest: "fluido · sin pausa", exs: [
        { n: "Forward to Reverse Crawl", d: "Cuadrupedia, rodillas 2cm, cruzado. 4 adelante, 4 atrás. Caderas bajas.", s: "3×4" },
        { n: "3-Step Drop", d: "Sentadilla → explosión vertical → aterrizaje suave. El aterrizaje importa.", s: "3×5" },
        { n: "Hostage Squat", d: "Manos en nuca, talones planos. Pausa 1 seg. Mide movilidad de cadera.", s: "3×10" },
      ]},
      { t: "Fuerza principal", rest: "2–3 min", exs: [
        { n: "Peso muerto convencional", d: "MEDIBLE PRINCIPAL. S1: 62kg. Bajada 3 seg. +5kg cuando completes 4×5 RIR 2. Meta: 85kg.", s: "4×5", r: "3 min" },
        { n: "Hang clean barra", d: "MEDIBLE. S1: 50kg. Triple extensión, codos veloces al frente. +5kg/sem con técnica limpia.", s: "4×5", r: "3 min" },
        { n: "Sentadilla búlgara", d: "Pie trasero en banco, rodilla casi al suelo. S1: 16kg/mano. +2kg/sem.", s: "4×10/l", r: "90s" },
        { n: "Hip thrust barra", d: "Barra sobre cadera con toalla. Aprieta glúteo 1 seg arriba. S1: 60kg. +5kg/sem.", s: "4×12", r: "90s" },
      ]},
      { t: "Gemelo gastrocnemio", rest: "45–60s", exs: [
        { n: "Elevación gemelo de pie (recto)", d: "3 seg excéntrico SIEMPRE. S3+: con mancuerna. Drop set última serie.", s: "4×20+d", r: "drop set sin pausa al final" },
        { n: "Calf jumps", d: "Rodilla recta, saltos solo de tobillo. 30 continuos. Fibras rápidas.", s: "3×30" },
      ]},
    ],
  },
  {
    key: "mie", short: "Mié", label: "Movilidad", train: false,
    title: "Movilidad activa",
    opts: [
      "90/90 hip stretch: 2 min/lado. Pierna delantera 90° delante, trasera 90° detrás. Espalda recta, baja en cada exhale.",
      "Frog stretch: rodillas máximo abiertas, cadera atrás y abajo. 2 min + 20 rockings. Abre aductor profundo.",
      "Pigeon pose: rodilla al pecho, pie al lado contrario, pierna trasera extendida. 2 min/lado. Psoas + glúteo profundo.",
      "Apertura costal con toalla enrollada bajo la espalda media, brazos arriba, 2 min. Lo más efectivo para el pectus.",
      "Andar 30–45 min. Recuperación activa, no cardio.",
    ],
  },
  {
    key: "jue", short: "Jue", label: "Pull", train: true,
    title: "Pull — Espalda ancha · Bíceps · Cuello",
    focus: ["Espalda + brazos", "70 min"],
    blocks: [
      { t: "RFT — activación SNC", rft: true, rest: "fluido · sin pausa", exs: [
        { n: "Side Crawl", d: "Crawl lateral 4 pasos a cada lado. Cruzado siempre. Estabilizadores laterales.", s: "2×4" },
        { n: "Sit-Thrus", d: "Knee drive lateral con rotación completa de cadera.", s: "3×6/l" },
        { n: "Stationary Gorilla", d: "Posición baja, roca en todas direcciones. Activa hombros antes del remo.", s: "3×30s" },
      ]},
      { t: "Bloque principal", rest: "75–90s", exs: [
        { n: "Remo Pendlay con barra", d: "MEDIBLE. S1: 62–65kg. Barra toca suelo entre reps. +2.5–5kg/sem.", s: "4×8", r: "2 min" },
        { n: "Remo mancuerna una mano", d: "S1: 20kg. +2kg/sem. Lleva el codo al techo. Máxima contracción dorsal.", s: "4×10/l" },
        { n: "Dominadas asistidas (armario)", d: "Mínima ayuda de piernas. Grábate cada semana. Meta agosto: 8 limpias.", s: "4×máx", r: "2 min" },
        { n: "Curl mancuerna supino", d: "S1: 16kg. +1kg/sem objetivo. Supina la muñeca en la subida.", s: "4×10–12" },
        { n: "Curl martillo", d: "Braquial — grosor del brazo de lado. Fallo última serie.", s: "3×12+f" },
      ]},
      { t: "Cuello", rest: "45–60s", exs: [
        { n: "Flexión cuello lateral con disco", d: "Tumbado de lado, disco en sien con toalla. 3 seg excéntrico. Diámetro frontal.", s: "3×12/l" },
        { n: "Shrug barra Z", d: "Máximo arriba, pausa 1 seg. Trapecios — masa del cuello de detrás.", s: "4×15" },
      ]},
    ],
  },
  {
    key: "vie", short: "Vie", label: "Legs B", train: true,
    title: "Legs B — Cuádriceps · Sóleo · Core griego",
    focus: ["Cuáds + Sóleo", "Core 20 min"],
    blocks: [
      { t: "RFT — activación SNC", rft: true, rest: "fluido · sin pausa", exs: [
        { n: "3-Step Drop", d: "Explosión vertical máxima, aterrizaje absorbido. Activa potencia.", s: "3×5" },
        { n: "Hostage Squat", d: "Movilidad de cadera profunda. Talones planos. Mide cada semana.", s: "3×10" },
        { n: "Explosive push-up", d: "Calienta hombros para las flexiones de pino del core.", s: "3×6" },
      ]},
      { t: "Fuerza pierna", rest: "90s", exs: [
        { n: "Sentadilla goblet", d: "S1: 22kg. +2.5kg/sem. Baja al máximo de rango. Cuádriceps completo.", s: "4×12", r: "2 min" },
        { n: "Peso muerto rumano mancuernas", d: "S1: 18kg/mano. +2kg/sem. Siente el estiramiento isquio.", s: "4×10" },
        { n: "Zancada reverse", d: "Paso atrás — más seguro para rodilla. 14–16kg/mano S1. Alterna.", s: "3×12/l" },
      ]},
      { t: "Gemelo sóleo", rest: "45–60s", exs: [
        { n: "Elevación gemelo sentado (rodilla doblada)", d: "Disco en el muslo. 3 seg excéntrico. Sóleo = volumen lateral. S1: 10kg.", s: "4×20+d", r: "drop set sin pausa al final" },
        { n: "Sentadilla profunda pausa 10 seg", d: "Fondo de la goblet, aguanta 10 seg. Sóleo máximo + abre cadera.", s: "3×10s" },
      ]},
      { t: "Core griego — 20 min", rest: "45s", exs: [
        { n: "HSPU deficit (libros) o estricto", d: "Según semana. El mejor core overhead que existe.", s: "4×8–10", r: "90s" },
        { n: "Dragon flag negativo", d: "Sube recto, baja en 4 seg. S1–S3: rodillas dobladas. S4+: piernas rectas.", s: "3×5–8" },
        { n: "Windmill mancuerna", d: "Mancuerna arriba, inclínate al suelo. Oblicuos + cadera. La V-taper.", s: "3×8/l" },
        { n: "L-sit en sillas", d: "S1–S3: rodillas dobladas. S7+: ambas rectas. El abs estético brutal.", s: "3×máx" },
        { n: "Hollow body rock", d: "Espalda plana, extremidades extendidas, roca. Anti-extensión.", s: "3×20s" },
      ]},
    ],
  },
  {
    key: "sab", short: "Sáb", label: "Andar", train: false,
    title: "Andar + movilidad",
    opts: [
      "45–60 min andar. Paso ligero. Recuperación activa y mental.",
      "10 min: 90/90 + frog. La constancia diaria mueve la cadera más que la intensidad.",
      "Sin hierro. La síntesis proteica sigue activa 48h post-entrenamiento.",
    ],
  },
  {
    key: "dom", short: "Dom", label: "Descanso", train: false,
    title: "Descanso real",
    opts: [
      "Descanso completo. El músculo crece aquí, no en el entrenamiento.",
      "Batch cooking de la semana. 130–140g proteína diaria mínimo.",
      "Revisa el tracker: qué pesos vas a intentar esta semana.",
    ],
  },
]

export const RFT_ROTATION = {
  lun: ["Explosive push-up", "Stationary Gorilla", "Sit-Thrus"],
  mar: ["Forward/Reverse Crawl", "3-Step Drop", "Hostage Squat"],
  jue: ["Side Crawl", "Sit-Thrus", "Stationary Gorilla"],
  vie: ["3-Step Drop", "Hostage Squat", "Explosive push-up"],
}

export const OFFICE_HABITS = [
  { t: "Cada hora: 20 flexiones", d: "Sin excusa. 8 horas = 160 flexiones diarias acumuladas sin contar el entrenamiento. Volumen real." },
  { t: "Cada hora: 90/90 + respiración", d: "2 min. Activa cadera, descomprime lumbar, oxigena. En 10 semanas cambia la postura completa." },
  { t: "Cada hora: isométrico cuello", d: "30 seg cada dirección. Puedes hacerlo de pie sin que se note en una videollamada." },
  { t: "Mañana en ayunas: 5 min movilidad cadera", d: "Frog + pigeon. El cuerpo está rígido — el mejor momento para ganar rango." },
  { t: "Antes del café: 30g proteína", d: "Whey o huevos. Tras 8h en ayunas, evita que el cuerpo use músculo como combustible." },
  { t: "130–140g proteína diaria", d: "Divide en 4–5 tomas. Sin esto el entrenamiento no construye nada." },
  { t: "Superávit 300–400 kcal", d: "No más. 2400–2500 kcal totales. Superávit agresivo = grasa sin definición en agosto." },
  { t: "Postura: escápulas bajas y retraídas", d: "Activa el serrato pasivamente y mejora la apariencia del pecho durante horas." },
]
