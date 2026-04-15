import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import { AppHeader } from "@/components/layout/app-header"
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav"
import { QueryProvider } from "@/providers/query-provider"

import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const appName = process.env.NEXT_PUBLIC_APP_NAME || "Beneficios Chile"

export const metadata: Metadata = {
  metadataBase: new URL("https://beneficioschile.cl"),
  title: {
    default: `${appName} | Compara descuentos, topes y beneficios bancarios`,
    template: `%s | ${appName}`,
  },
  description:
    "Compara beneficios de bancos, tarjetas y fintechs en Chile. Revisa descuentos, topes, días, medios de pago y condiciones con una experiencia rápida y confiable.",
  applicationName: appName,
  openGraph: {
    title: appName,
    description:
      "Encuentra qué tarjeta te conviene usar hoy comparando descuentos, topes y condiciones reales.",
    type: "website",
    locale: "es_CL",
  },
  twitter: {
    card: "summary_large_image",
    title: appName,
    description:
      "Compara descuentos, topes y beneficios bancarios en Chile.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es-CL"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <QueryProvider>
          <div className="relative min-h-screen overflow-x-hidden">
            <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.16),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(49,46,129,0.14),_transparent_28%),linear-gradient(180deg,_rgba(248,250,252,1),_rgba(248,250,252,0.72)_36%,_rgba(248,250,252,1)_100%)]" />
            <AppHeader />
            <main className="pb-24 md:pb-10">{children}</main>
            <MobileBottomNav />
          </div>
        </QueryProvider>
      </body>
    </html>
  )
}
