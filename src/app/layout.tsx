import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import { AppHeader } from "@/components/layout/app-header"
import { APP_NAME, APP_TAGLINE } from "@/lib/constants"
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav"
import { AuthProvider } from "@/providers/auth-provider"
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

export const metadata: Metadata = {
  metadataBase: new URL("https://luppa.cl"),
  title: {
    default: `${APP_NAME} | ${APP_TAGLINE}`,
    template: `%s | ${APP_NAME}`,
  },
  description:
    "Encuentra descuentos, beneficios y oportunidades para salir más en Chile sin gastar de más.",
  applicationName: APP_NAME,
  openGraph: {
    title: APP_NAME,
    description: APP_TAGLINE,
    type: "website",
    locale: "es_CL",
  },
  twitter: {
    card: "summary_large_image",
    title: APP_NAME,
    description: APP_TAGLINE,
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
          <AuthProvider>
            <div className="relative min-h-screen overflow-x-hidden">
              <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.16),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(49,46,129,0.14),_transparent_28%),linear-gradient(180deg,_rgba(248,250,252,1),_rgba(248,250,252,0.72)_36%,_rgba(248,250,252,1)_100%)]" />
              <AppHeader />
              <main className="pb-24 md:pb-10">{children}</main>
              <MobileBottomNav />
            </div>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
