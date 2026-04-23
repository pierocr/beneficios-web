"use client"

import Image from "next/image"
import { useState } from "react"
import { ImageIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type BenefitMediaProps = {
  imageUrl?: string | null
  merchantName: string
  categoryName?: string
  className?: string
  imageClassName?: string
  priority?: boolean
  showLabel?: boolean
}

function getMerchantInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

export function BenefitMedia({
  imageUrl,
  merchantName,
  categoryName,
  className,
  imageClassName,
  priority = false,
  showLabel = true,
}: BenefitMediaProps) {
  const [hasImageError, setHasImageError] = useState(false)
  const imageSrc = imageUrl && !hasImageError ? imageUrl : null
  const initials = getMerchantInitials(merchantName) || "B"

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-slate-100 text-slate-900",
        className
      )}
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,_rgba(15,23,42,0.08),_rgba(16,185,129,0.12)_50%,_rgba(245,158,11,0.12))]" />

      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={`Imagen de ${merchantName}`}
          fill
          priority={priority}
          unoptimized
          sizes="(max-width: 768px) 100vw, 420px"
          onError={() => setHasImageError(true)}
          className={cn("absolute inset-0 size-full object-cover", imageClassName)}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex size-16 items-center justify-center rounded-2xl border border-white/70 bg-white/75 text-xl font-semibold shadow-sm backdrop-blur">
            {initials || <ImageIcon className="size-6 text-slate-500" />}
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(15,23,42,0.02),_rgba(15,23,42,0.42))]" />

      {showLabel && categoryName ? (
        <div className="absolute right-3 bottom-3 left-3 flex items-center justify-between gap-3">
          <span className="truncate rounded-full bg-white/88 px-3 py-1 text-xs font-semibold text-slate-900 shadow-sm backdrop-blur">
            {merchantName}
          </span>
          <span className="shrink-0 rounded-full bg-slate-950/82 px-3 py-1 text-xs font-medium text-white backdrop-blur">
            {categoryName}
          </span>
        </div>
      ) : null}
    </div>
  )
}
