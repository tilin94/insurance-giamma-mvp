"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type PackType = "pack1" | "pack2" | "pack3" | "pack4"

export interface Pack {
  id: PackType
  name: string
  price: string
  description: string
  features: string[]
  disabled?: boolean
}

export const PACKS: Pack[] = [
  {
    id: "pack1",
    name: "MVP",
    price: "3000 USD",
    description: "Funcionalidades básicas para comenzar",
    features: ["Login", "Sección de carga de datos (sin roles)", "Dashboard de contactación con filtros y edición"],
  },
  {
    id: "pack2",
    name: "MVP + Role-Based Access",
    price: "3500 USD",
    description: "Incluye gestión de roles y permisos",
    features: ["Todo lo del Pack 1", "Roles management", "Asignación/visibilidad de datos", "Dashboard de reportes"],
  },
  {
    id: "pack3",
    name: "MVP + Roles + Advanced",
    price: "4000 USD",
    description: "Funcionalidades avanzadas completas",
    features: ["Todo lo del Pack 2", "Dashboard de auditoría", "Dashboard de vendedores", "Exportación Excel/PDF"],
  },
  {
    id: "pack4",
    name: "Integración WhatsApp",
    price: "Version 2",
    description: "Integración completa con WhatsApp (próximamente)",
    features: [
      "Todo lo del Pack 3",
      "Integración WhatsApp Business",
      "Mensajería automatizada",
      "Templates de mensajes",
    ],
    disabled: true,
  },
]

interface PackContextType {
  selectedPack: PackType
  setSelectedPack: (pack: PackType) => void
  getCurrentPack: () => Pack
  hasFeature: (feature: string) => boolean
}

const PackContext = createContext<PackContextType | undefined>(undefined)

export function PackProvider({ children }: { children: ReactNode }) {
  const [selectedPack, setSelectedPack] = useState<PackType>("pack3") // Default to pack3 to show all features

  const getCurrentPack = () => {
    return PACKS.find((pack) => pack.id === selectedPack) || PACKS[0]
  }

  const hasFeature = (feature: string): boolean => {
    switch (feature) {
      case "login":
        return true // All packs have login
      case "cargar-datos":
        return selectedPack === "pack1" ? true : selectedPack !== "pack1" // Pack1 shows to all, others only to admin
      case "contactacion":
        return true // All packs have contactacion
      case "roles":
        return ["pack2", "pack3"].includes(selectedPack)
      case "reportes":
        return ["pack2", "pack3"].includes(selectedPack)
      case "auditoria":
        return selectedPack === "pack3"
      case "vendedores":
        return selectedPack === "pack3"
      case "export":
        return selectedPack === "pack3"
      case "whatsapp":
        return selectedPack === "pack4"
      default:
        return false
    }
  }

  return (
    <PackContext.Provider
      value={{
        selectedPack,
        setSelectedPack,
        getCurrentPack,
        hasFeature,
      }}
    >
      {children}
    </PackContext.Provider>
  )
}

export function usePack() {
  const context = useContext(PackContext)
  if (context === undefined) {
    throw new Error("usePack must be used within a PackProvider")
  }
  return context
}
