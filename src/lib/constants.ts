export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Beneficios Chile"

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

export const CATEGORY_ORDER = [
  "Supermercados",
  "Comida",
  "Farmacias",
  "Viajes",
  "Combustible",
  "Delivery",
  "Hogar",
]
