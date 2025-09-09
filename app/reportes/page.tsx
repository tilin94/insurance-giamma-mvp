"use client"

import { useState, useMemo } from "react"
import { clientsData } from "@/data/clients-mock"
import { usePack } from "@/contexts/pack-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import {
  TrendingUp,
  Users,
  Phone,
  Star,
  Calendar,
  Download,
  FileSpreadsheet,
  FileText,
  CheckCircle,
  Loader2,
  ChevronDown,
  Lock,
} from "lucide-react"

export default function ReportesPage() {
  const { hasFeature } = usePack()
  const [selectedMonth, setSelectedMonth] = useState("2024-01")
  const [exportLoading, setExportLoading] = useState<string | null>(null)
  const [exportSuccess, setExportSuccess] = useState<string | null>(null)
  const [showExportDropdown, setShowExportDropdown] = useState(false)

  const stats = useMemo(() => {
    const total = clientsData.length
    const contacted = clientsData.filter((c) => c.contacted).length
    const sold = clientsData.filter((c) => c.sellout).length
    const available = total - sold
    const withPhones = clientsData.filter((c) => c.phone.length > 0).length
    const noPhones = total - withPhones
    const avgScoring = clientsData.reduce((sum, c) => sum + c.scoring, 0) / total

    const enCotizacion = clientsData.filter(
      (c) =>
        !c.sellout &&
        c.contacted &&
        c.comments.some(
          (comment) => comment.toLowerCase().includes("cotizacion") || comment.toLowerCase().includes("decidir"),
        ),
    ).length

    const noResponde = clientsData.filter((c) => !c.contacted && c.phone.length > 0).length
    const noTieneWhatsApp = clientsData.filter((c) =>
      c.comments.some((comment) => comment.toLowerCase().includes("whatsapp")),
    ).length
    const sinTrabajar = clientsData.filter((c) => !c.contacted && c.phone.length === 0).length

    return {
      total,
      contacted,
      sold,
      available,
      withPhones,
      noPhones,
      avgScoring,
      enCotizacion,
      noResponde,
      noTieneWhatsApp,
      sinTrabajar,
    }
  }, [])

  const insuranceData = [
    { name: "EN C.", count: 2, fullName: "EN COTIZACION" },
    { name: "NO R.", count: 7, fullName: "NO RESPONDE" },
    { name: "NO TL.", count: 1, fullName: "NO TIENE WHATS APP" },
    { name: "SIN T.", count: 30, fullName: "Sin trabajar" },
  ]

  const pieData = [
    { name: "Meridional Seguros", value: 65, color: "#3b82f6" },
    { name: "La Caja Seguros", value: 20, color: "#10b981" },
    { name: "Sancor Seguros", value: 15, color: "#f59e0b" },
  ]

  const funnelData = [
    { stage: "Base Total", count: stats.total, percentage: 100 },
    { stage: "Contactos", count: stats.contacted, percentage: (stats.contacted / stats.total) * 100 },
    { stage: "En Cotización", count: stats.enCotizacion, percentage: (stats.enCotizacion / stats.total) * 100 },
    { stage: "Venta", count: stats.sold, percentage: (stats.sold / stats.total) * 100 },
  ]

  const detailedBreakdown = [
    { category: "CIERRE - Precio", count: 0, percentage: "0.00%" },
    { category: "CIERRE - Cliente solicita no ser llamado más", count: 0, percentage: "0.00%" },
    { category: "CIERRE - Tiene su propio productor", count: 0, percentage: "0.00%" },
    { category: "CIERRE - Lo hace en su localidad", count: 0, percentage: "0.00%" },
    { category: "CIERRE - Desconfianza", count: 0, percentage: "0.00%" },
    { category: "CIERRE - Compañía No Disponible en panel", count: 0, percentage: "0.00%" },
    { category: "CIERRE - Lo contactó la competencia", count: 0, percentage: "0.00%" },
    { category: "No Contactos", count: 1, percentage: "2.44%" },
    { category: "No Tiene Whats App", count: 1, percentage: "100.00%" },
    { category: "CIERRE - No contesta Teléfono / WhatsApp", count: 0, percentage: "0.00%" },
    { category: "CIERRE - Teléfono equivocado", count: 0, percentage: "0.00%" },
    { category: "CIERRE - Teléfono equivocado", count: 0, percentage: "0.00%" },
    { category: "CIERRE - Teléfono inexistente / fuera de servicio", count: 0, percentage: "0.00%" },
    { category: "No Responde", count: 7, percentage: "17.07%" },
    { category: "Sin Trabajar", count: 30, percentage: "73.17%" },
  ]

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

  const exportToExcel = async () => {
    if (!hasFeature("export")) return
    setShowExportDropdown(false)
    setExportLoading("excel")
    setExportSuccess(null)

    await new Promise((resolve) => setTimeout(resolve, 2000))

    setExportLoading(null)
    setExportSuccess("excel")

    setTimeout(() => setExportSuccess(null), 3000)
  }

  const exportToPDF = async () => {
    if (!hasFeature("export")) return
    setShowExportDropdown(false)
    setExportLoading("pdf")
    setExportSuccess(null)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    setExportLoading(null)
    setExportSuccess("pdf")

    setTimeout(() => setExportSuccess(null), 3000)
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Reportes Administrativos</h1>
        <p className="text-muted-foreground">Análisis detallado del funnel de ventas y métricas de contactación</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Base Seguros Septiembre 2025</span>
            </span>
            <div className="flex items-center space-x-4">
              {exportSuccess && (
                <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-3 py-1 rounded-md">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">
                    {exportSuccess === "excel" ? "Excel exportado exitosamente" : "PDF exportado exitosamente"}
                  </span>
                </div>
              )}

              {hasFeature("export") ? (
                <div className="relative">
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2 bg-transparent"
                    disabled={exportLoading !== null}
                    onClick={() => setShowExportDropdown(!showExportDropdown)}
                  >
                    {exportLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                    <span>
                      {exportLoading === "excel"
                        ? "Exportando Excel..."
                        : exportLoading === "pdf"
                          ? "Exportando PDF..."
                          : "Exportar"}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>

                  {showExportDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
                      <div className="py-1">
                        <button
                          onClick={exportToExcel}
                          disabled={exportLoading !== null}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                        >
                          {exportLoading === "excel" ? (
                            <Loader2 className="h-4 w-4 animate-spin text-green-600" />
                          ) : (
                            <FileSpreadsheet className="h-4 w-4 text-green-600" />
                          )}
                          <span>Exportar a Excel</span>
                        </button>
                        <button
                          onClick={exportToPDF}
                          disabled={exportLoading !== null}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                        >
                          {exportLoading === "pdf" ? (
                            <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                          ) : (
                            <FileText className="h-4 w-4 text-red-600" />
                          )}
                          <span>Exportar a PDF</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative group">
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2 bg-transparent opacity-50 cursor-not-allowed"
                    disabled
                  >
                    <Lock className="h-4 w-4" />
                    <span>Exportar</span>
                  </Button>
                  <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                    Disponible en Pack 3: MVP + Roles + Advanced
                    <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              )}

              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024-01">Enero 2024</SelectItem>
                  <SelectItem value="2024-02">Febrero 2024</SelectItem>
                  <SelectItem value="2024-03">Marzo 2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Estado</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={insuranceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value, name, props) => [value, props.payload.fullName]} />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Aseguradora</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Funnel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {funnelData.map((item, index) => (
              <div
                key={index}
                className={`flex justify-between items-center p-2 rounded ${
                  index === 0
                    ? "bg-blue-100 dark:bg-blue-900"
                    : index === 1
                      ? "bg-gray-100 dark:bg-gray-800"
                      : index === 2
                        ? "bg-gray-100 dark:bg-gray-800"
                        : "bg-gray-100 dark:bg-gray-800"
                }`}
              >
                <span className="font-medium text-sm">{item.stage}</span>
                <div className="text-right">
                  <div className="font-bold">{item.count}</div>
                  <div className="text-xs text-muted-foreground">{item.percentage.toFixed(2)}%</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm bg-blue-500 text-white p-2 rounded">Ultimo estado</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              <div className="flex justify-between p-2 bg-blue-100 dark:bg-blue-900">
                <span className="font-medium">EN COTIZACION</span>
                <span className="font-bold">3</span>
              </div>
              <div className="flex justify-between p-2">
                <span>NO RESPONDE</span>
                <span>7</span>
              </div>
              <div className="flex justify-between p-2">
                <span>NO TIENE WHATS APP</span>
                <span>1</span>
              </div>
              <div className="flex justify-between p-2">
                <span>Sin trabajar</span>
                <span>30</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm bg-blue-500 text-white p-2 rounded">Aseguradora</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              <div className="flex justify-between p-2 bg-blue-100 dark:bg-blue-900">
                <span className="font-medium">Meridional Seguros</span>
                <span className="font-bold">65%</span>
              </div>
              <div className="flex justify-between p-2">
                <span>La Caja Seguros</span>
                <span>20%</span>
              </div>
              <div className="flex justify-between p-2">
                <span>Sancor Seguros</span>
                <span>15%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm bg-gray-600 text-white p-2 rounded">Detalle Completo</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-1">
            {detailedBreakdown.map((item, index) => (
              <div
                key={index}
                className={`flex justify-between items-center p-2 ${
                  index % 2 === 0 ? "bg-gray-50 dark:bg-gray-800" : "bg-white dark:bg-gray-900"
                }`}
              >
                <span className="text-sm">{item.category}</span>
                <div className="flex items-center space-x-4">
                  <span className="font-medium">{item.count}</span>
                  <span className="text-sm text-muted-foreground w-16 text-right">{item.percentage}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Base</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Contactados</p>
                <p className="text-2xl font-bold">{stats.contacted}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Vendidos</p>
                <p className="text-2xl font-bold">{stats.sold}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Scoring Promedio</p>
                <p className="text-2xl font-bold">{stats.avgScoring.toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
