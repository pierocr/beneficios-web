export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Luppa"
export const APP_TAGLINE = "Salir más, gastar menos."

export const QUICK_FILTERS = [
  "Hoy",
  "Supermercados",
  "Comida",
  "Farmacias",
  "Viajes",
  "Online",
]

export const SORT_OPTIONS = [
  { value: "best", label: "Mejor beneficio" },
  { value: "discount", label: "Mayor descuento" },
  { value: "ending", label: "Vence pronto" },
] as const

export const CHANNEL_OPTIONS = [
  { value: "ambos", label: "Presencial + online" },
  { value: "presencial", label: "Solo presencial" },
  { value: "online", label: "Solo online" },
] as const

export const DAY_OPTIONS = [
  { value: "lunes", label: "Lunes" },
  { value: "martes", label: "Martes" },
  { value: "miercoles", label: "Miércoles" },
  { value: "jueves", label: "Jueves" },
  { value: "viernes", label: "Viernes" },
  { value: "sabado", label: "Sábado" },
  { value: "domingo", label: "Domingo" },
] as const

export const REGION_OPTIONS = [
  { value: "metropolitana", label: "Metropolitana" },
  { value: "valparaiso", label: "Valparaíso" },
  { value: "biobio", label: "Biobío" },
  { value: "coquimbo", label: "Coquimbo" },
  { value: "araucania", label: "Araucanía" },
  { value: "nacional", label: "Todo Chile" },
] as const

export const CATEGORY_ORDER = [
  "Supermercados",
  "Restaurantes",
  "Comida rapida",
  "Cafeterias",
  "Delivery",
  "Retail",
  "Moda",
  "Tecnologia",
  "Viajes",
  "Combustible",
  "Hogar",
  "Salud",
  "Belleza",
  "Entretencion",
  "Servicios",
  "Otros",
]
