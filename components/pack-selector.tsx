"use client"

import { useState } from "react"
import { ChevronDown, Package, MessageCircle } from "lucide-react"
import { usePack, PACKS, type PackType } from "@/contexts/pack-context"

export function PackSelector() {
  const { selectedPack, setSelectedPack, getCurrentPack } = usePack()
  const [isOpen, setIsOpen] = useState(false)
  const currentPack = getCurrentPack()

  const handlePackSelect = (packId: PackType) => {
    if (PACKS.find((p) => p.id === packId)?.disabled) return
    setSelectedPack(packId)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-xl font-bold hover:text-primary transition-colors"
      >
        <Package className="h-5 w-5" />
        <span>Ventas CRM</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-2 w-80 bg-card border rounded-lg shadow-lg z-20">
            <div className="p-3 border-b">
              <h3 className="font-semibold text-sm text-muted-foreground">Seleccionar Pack de Desarrollo</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {PACKS.map((pack) => (
                <div key={pack.id} className="relative group">
                  <button
                    onClick={() => handlePackSelect(pack.id)}
                    disabled={pack.disabled}
                    className={`w-full text-left p-4 hover:bg-muted transition-colors border-b last:border-b-0 ${
                      selectedPack === pack.id ? "bg-primary/10 border-l-4 border-l-primary" : ""
                    } ${pack.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">📦 {pack.name}</span>
                          {pack.id === "pack4" && <MessageCircle className="h-4 w-4 text-green-500" />}
                          {pack.disabled && (
                            <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                              Próximamente
                            </span>
                          )}
                        </div>
                        <div className="text-sm font-semibold text-primary mt-1">{pack.price}</div>
                        <div className="text-xs text-muted-foreground mt-1">{pack.description}</div>
                      </div>
                      {selectedPack === pack.id && <div className="text-primary">✓</div>}
                    </div>
                  </button>

                  {/* Tooltip */}
                  <div className="absolute left-full top-0 ml-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-30">
                    <div className="font-semibold mb-2">{pack.name}</div>
                    <ul className="space-y-1">
                      {pack.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-1">
                          <span className="text-green-400 mt-0.5">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="absolute right-full top-4 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
