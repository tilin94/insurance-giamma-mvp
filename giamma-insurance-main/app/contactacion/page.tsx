"use client"

import { useState, useMemo } from "react"
import { clientsData } from "@/data/clients-mock"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Phone, Search, Star, Users, TrendingUp, X } from "lucide-react"
import { ClientDetailsModal } from "@/components/client-details-modal"
import type { Client } from "@/data/clients-mock"

type SortOption = "none" | "phones" | "scoring" | "name"
type FilterOption = "all" | "available" | "sold"

export default function ContactacionPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("none")
  const [filterBy, setFilterBy] = useState<FilterOption>("all")
  const [minScoring, setMinScoring] = useState<number>(0)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const clearFilters = () => {
    setSearchTerm("")
    setSortBy("none")
    setFilterBy("all")
    setMinScoring(0)
  }

  const handleViewDetails = (client: Client) => {
    setSelectedClient(client)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedClient(null)
  }

  const filteredAndSortedClients = useMemo(() => {
    const filtered = clientsData.filter((client) => {
      const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus =
        filterBy === "all" || (filterBy === "available" && !client.sellout) || (filterBy === "sold" && client.sellout)
      const matchesScoring = client.scoring >= minScoring

      return matchesSearch && matchesStatus && matchesScoring
    })

    if (sortBy === "none") {
      return filtered
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "phones":
          return b.phone.length - a.phone.length
        case "scoring":
          return b.scoring - a.scoring
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    return filtered
  }, [searchTerm, sortBy, filterBy, minScoring])

  const renderStars = (scoring: number, isSold = false) => {
    return Array.from({ length: 5 }, (_, i) => {
      if (i < scoring) {
        return (
          <span key={i} className={isSold ? "text-gray-500" : "text-yellow-400"}>
            ⭐
          </span>
        )
      } else {
        return (
          <span key={i} className="text-gray-600">
            ☆
          </span>
        )
      }
    })
  }

  const stats = useMemo(() => {
    const available = clientsData.filter((c) => !c.sellout).length
    const sold = clientsData.filter((c) => c.sellout).length
    const avgScoring = clientsData.reduce((sum, c) => sum + c.scoring, 0) / clientsData.length
    const withPhones = clientsData.filter((c) => c.phone.length > 0).length

    return { available, sold, avgScoring, withPhones }
  }, [])

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Contactación</h1>
        <p className="text-muted-foreground">Gestiona y filtra los clientes potenciales para el equipo de ventas</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponibles</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{stats.available}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendidos</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">{stats.sold}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Con Teléfonos</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">{stats.withPhones}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Puntuación Promedio</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">{stats.avgScoring.toFixed(1)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Filtros y Ordenamiento</span>
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="flex items-center space-x-1 bg-transparent"
            >
              <X className="h-4 w-4" />
              <span>Limpiar Filtros</span>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar por nombre</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Ordenar por</label>
              <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin ordenar</SelectItem>
                  <SelectItem value="phones">Cantidad de Teléfonos</SelectItem>
                  <SelectItem value="scoring">Probabilidad de Contacto</SelectItem>
                  <SelectItem value="name">Nombre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Estado</label>
              <Select value={filterBy} onValueChange={(value: FilterOption) => setFilterBy(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="available">Disponibles</SelectItem>
                  <SelectItem value="sold">Vendidos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Puntuación mínima</label>
              <Select value={minScoring.toString()} onValueChange={(value) => setMinScoring(Number.parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Todas (0+)</SelectItem>
                  <SelectItem value="1">1+ estrellas</SelectItem>
                  <SelectItem value="2">2+ estrellas</SelectItem>
                  <SelectItem value="3">3+ estrellas</SelectItem>
                  <SelectItem value="4">4+ estrellas</SelectItem>
                  <SelectItem value="5">5 estrellas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Clientes ({filteredAndSortedClients.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAndSortedClients.map((client, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors ${
                  client.sellout ? "opacity-60 bg-gray-50 dark:bg-gray-900" : ""
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className={`font-semibold ${client.sellout ? "text-gray-500" : ""}`}>{client.name}</h3>
                    <Badge variant={client.sellout ? "secondary" : "default"}>
                      {client.sellout ? "Vendido" : "Disponible"}
                    </Badge>
                  </div>

                  <div
                    className={`flex items-center space-x-4 text-sm ${client.sellout ? "text-gray-500" : "text-muted-foreground"}`}
                  >
                    <div className="flex items-center space-x-1">
                      <Phone className="h-4 w-4" />
                      <span>
                        {client.phone.length} teléfono{client.phone.length !== 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1">
                      <span>Probabilidad de Contacto:</span>
                      <div className="flex">{renderStars(client.scoring, client.sellout)}</div>
                      <span>({client.scoring}/5)</span>
                    </div>
                  </div>

                  {client.phone.length > 0 && (
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-2">
                        {client.phone.map((phone, phoneIndex) => (
                          <Badge
                            key={phoneIndex}
                            variant="outline"
                            className={client.sellout ? "text-gray-500 border-gray-400" : "text-blue-400"}
                          >
                            {phone}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleViewDetails(client)}>
                    Ver Detalles
                  </Button>
                  {!client.sellout && <Button size="sm">Contactar</Button>}
                </div>
              </div>
            ))}

            {filteredAndSortedClients.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No se encontraron clientes que coincidan con los filtros seleccionados.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Client Details Modal */}
      <ClientDetailsModal client={selectedClient} isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  )
}
