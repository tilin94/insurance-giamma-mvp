"use client"

import { useState, useMemo } from "react"
import { sellersData } from "@/data/sellers-mock"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, TrendingUp, DollarSign, Target, Search, Filter, X, Users } from "lucide-react"

export default function VendedoresPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"none" | "sales" | "amount" | "efficiency">("none")
  const [minSales, setMinSales] = useState("")

  const filteredAndSortedSellers = useMemo(() => {
    let filtered = sellersData.filter((seller) => seller.name.toLowerCase().includes(searchTerm.toLowerCase()))

    if (minSales) {
      const minSalesNum = Number.parseInt(minSales)
      filtered = filtered.filter((seller) => seller.totalSales >= minSalesNum)
    }

    if (sortBy === "none") {
      return filtered
    }

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "sales":
          return b.totalSales - a.totalSales
        case "amount":
          return b.salesAmount - a.salesAmount
        case "efficiency":
          return b.efficiency - a.efficiency
        default:
          return 0
      }
    })
  }, [searchTerm, sortBy, minSales])

  const topSeller = sellersData.reduce((prev, current) => (prev.totalSales > current.totalSales ? prev : current))

  const clearFilters = () => {
    setSearchTerm("")
    setSortBy("none")
    setMinSales("")
  }

  const hasActiveFilters = searchTerm || sortBy !== "none" || minSales

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount)
  }

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return "bg-green-500"
    if (efficiency >= 80) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard de Vendedores</h1>
        <p className="text-muted-foreground">Gestiona y analiza el rendimiento de tu equipo de ventas</p>
      </div>

      {/* Top Seller Highlight */}
      <Card className="mb-8 border-2 border-yellow-500 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
            <Trophy className="h-6 w-6" />
            Vendedora Destacada del Mes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-yellow-500">
              <AvatarImage src={topSeller.avatar || "/placeholder.svg"} alt={topSeller.name} />
              <AvatarFallback>
                {topSeller.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-bold">{topSeller.name}</h3>
              <div className="flex gap-4 mt-2">
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                >
                  {topSeller.totalSales} ventas
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {formatCurrency(topSeller.salesAmount)}
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                >
                  {topSeller.efficiency}% eficiencia
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros y Ordenamiento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-2 block">Buscar vendedor</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Nombre del vendedor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="min-w-[180px]">
              <label className="text-sm font-medium mb-2 block">Ordenar por</label>
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sin ordenar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin ordenar</SelectItem>
                  <SelectItem value="sales">Cantidad de ventas</SelectItem>
                  <SelectItem value="amount">Monto total</SelectItem>
                  <SelectItem value="efficiency">Eficiencia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-[150px]">
              <label className="text-sm font-medium mb-2 block">Ventas mínimas</label>
              <Input
                type="number"
                placeholder="Ej: 30"
                value={minSales}
                onChange={(e) => setMinSales(e.target.value)}
              />
            </div>

            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2 bg-transparent">
                <X className="h-4 w-4" />
                Limpiar Filtros
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sellers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedSellers.map((seller) => (
          <Card key={seller.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={seller.avatar || "/placeholder.svg"} alt={seller.name} />
                  <AvatarFallback>
                    {seller.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{seller.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-2 h-2 rounded-full ${getEfficiencyColor(seller.efficiency)}`} />
                    <span className="text-sm text-muted-foreground">{seller.efficiency}% eficiencia</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Ventas</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">{seller.totalSales}</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <DollarSign className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Monto</span>
                    </div>
                    <div className="text-lg font-bold text-blue-600">{formatCurrency(seller.salesAmount)}</div>
                  </div>
                </div>

                {/* Recent Sales */}
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Ventas Recientes
                  </h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {seller.sales.slice(0, 3).map((sale) => (
                      <div key={sale.id} className="flex justify-between items-center text-sm p-2 bg-muted/50 rounded">
                        <div>
                          <div className="font-medium">{sale.clientName}</div>
                          <div className="text-muted-foreground text-xs">{sale.product}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(sale.amount)}</div>
                          <div className="text-muted-foreground text-xs">{sale.date}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAndSortedSellers.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">No se encontraron vendedores</p>
              <p>Intenta ajustar los filtros de búsqueda</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
