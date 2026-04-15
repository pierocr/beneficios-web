"use client"

import { SlidersHorizontal } from "lucide-react"

import { FiltersSidebar } from "@/components/filters/filters-sidebar"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

export function MobileFiltersDrawer() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className="rounded-full md:hidden">
          <SlidersHorizontal className="size-4" />
          Filtros
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[85vh] rounded-t-[28px] border-slate-200 bg-white">
        <DrawerHeader>
          <DrawerTitle>Filtra beneficios</DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto px-4 pb-6">
          <FiltersSidebar />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
