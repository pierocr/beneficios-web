"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type BenefitSearchBarProps = {
  defaultValue?: string
  placeholder?: string
  redirectTo?: string
  onSearch?: (value: string) => void
  className?: string
}

export function BenefitSearchBar({
  defaultValue = "",
  placeholder = "Busca por comercio, banco o categoría",
  redirectTo,
  onSearch,
  className,
}: BenefitSearchBarProps) {
  const [value, setValue] = useState(defaultValue)
  const router = useRouter()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    onSearch?.(value)

    if (redirectTo) {
      const url = value
        ? `${redirectTo}?q=${encodeURIComponent(value)}`
        : redirectTo
      router.push(url)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex items-center gap-2 rounded-[28px] border border-slate-200 bg-white p-2 shadow-[0_18px_40px_rgba(15,23,42,0.08)]",
        className
      )}
      role="search"
    >
      <div className="flex flex-1 items-center gap-3 rounded-[22px] bg-slate-50 px-4 py-2.5">
        <Search className="size-4 text-slate-400" />
        <Input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="h-auto border-0 bg-transparent px-0 py-0 text-[15px] shadow-none focus-visible:ring-0"
        />
      </div>
      <Button
        type="submit"
        className="h-11 rounded-[22px] bg-slate-950 px-5 text-white hover:bg-slate-800"
      >
        Buscar
      </Button>
    </form>
  )
}
