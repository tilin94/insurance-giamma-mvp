"use client"

import { useState } from "react"
import { sellersData } from "@/data/sellers-mock"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Clock,
  ActivityIcon,
  Wifi,
  Search,
  Calendar,
  MessageSquare,
  TrendingUp,
  Phone,
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

interface SellerAudit {
  id: string
  name: string
  avatar: string
  loggedTime: number // minutes today
  lastConnection: string
  status: "online" | "offline" | "away"
  todayActivities: any[]
  weeklyLoggedTime: number // minutes this week
}

const auditData: SellerAudit[] = sellersData.map((seller, index) => ({
  id: seller.id,
  name: seller.name,
  avatar: seller.avatar,
  loggedTime: [480, 420, 360, 510, 390][index], // 8h, 7h, 6h, 8.5h, 6.5h
  lastConnection: ["2024-09-08 14:30", "2024-09-08 13:45", "2024-09-08 12:20", "2024-09-08 15:10", "2024-09-08 11:30"][
    index
  ],
  status: ["online", "online", "away", "online", "offline"][index] as "online" | "offline" | "away",
  weeklyLoggedTime: [2400, 2100, 1800, 2550, 1950][index], // 40h, 35h, 30h, 42.5h, 32.5h
  todayActivities: [
    [
      {
        id: "a1",
        type: "login",
        description: "Inicio de sesión",
        timestamp: "09:00",
        clientName: undefined,
        amount: undefined,
      },
      {
        id: "a2",
        type: "contact",
        description: "Contactó cliente potencial",
        timestamp: "09:30",
        clientName: "María González",
        amount: undefined,
      },
      {
        id: "a3",
        type: "sale",
        description: "Venta realizada",
        timestamp: "11:15",
        clientName: "Carlos Rodríguez",
        amount: 12300,
      },
      {
        id: "a4",
        type: "comment",
        description: "Disponible después de las 18hs",
        timestamp: "13:20",
        clientName: "Ana Martínez",
        amount: undefined,
      },
      {
        id: "a5",
        type: "contact",
        description: "Seguimiento telefónico",
        timestamp: "14:45",
        clientName: "Luis Fernández",
        amount: undefined,
      },
    ],
    [
      {
        id: "a6",
        type: "login",
        description: "Inicio de sesión",
        timestamp: "08:45",
        clientName: undefined,
        amount: undefined,
      },
      {
        id: "a7",
        type: "sale",
        description: "Venta realizada",
        timestamp: "10:30",
        clientName: "Pedro Sánchez",
        amount: 11200,
      },
      {
        id: "a8",
        type: "comment",
        description: "Cliente solicita llamada mañana",
        timestamp: "12:00",
        clientName: "Isabel García",
        amount: undefined,
      },
      {
        id: "a9",
        type: "contact",
        description: "Reunión presencial",
        timestamp: "13:30",
        clientName: "Miguel Torres",
        amount: undefined,
      },
    ],
    [
      {
        id: "a10",
        type: "login",
        description: "Inicio de sesión",
        timestamp: "09:15",
        clientName: undefined,
        amount: undefined,
      },
      {
        id: "a11",
        type: "contact",
        description: "Llamada de seguimiento",
        timestamp: "10:00",
        clientName: "Francisco Morales",
        amount: undefined,
      },
      {
        id: "a12",
        type: "comment",
        description: "No responde teléfono",
        timestamp: "11:30",
        clientName: "Elena Ruiz",
        amount: undefined,
      },
      {
        id: "a13",
        type: "logout",
        description: "Pausa almuerzo",
        timestamp: "12:00",
        clientName: undefined,
        amount: undefined,
      },
    ],
    [
      {
        id: "a14",
        type: "login",
        description: "Inicio de sesión",
        timestamp: "08:30",
        clientName: undefined,
        amount: undefined,
      },
      {
        id: "a15",
        type: "sale",
        description: "Venta realizada",
        timestamp: "09:45",
        clientName: "Manuel Ortega",
        amount: 7600,
      },
      {
        id: "a16",
        type: "contact",
        description: "WhatsApp enviado",
        timestamp: "11:00",
        clientName: "Pilar Romero",
        amount: undefined,
      },
      {
        id: "a17",
        type: "comment",
        description: "Interesado en seguro familiar",
        timestamp: "14:20",
        clientName: "Diego Navarro",
        amount: undefined,
      },
      {
        id: "a18",
        type: "sale",
        description: "Venta realizada",
        timestamp: "15:10",
        clientName: "Mónica Guerrero",
        amount: 6500,
      },
    ],
    [
      {
        id: "a19",
        type: "login",
        description: "Inicio de sesión",
        timestamp: "09:30",
        clientName: undefined,
        amount: undefined,
      },
      {
        id: "a20",
        type: "contact",
        description: "Email enviado",
        timestamp: "10:15",
        clientName: "Alejandro Silva",
        amount: undefined,
      },
      {
        id: "a21",
        type: "comment",
        description: "Prefiere contacto por email",
        timestamp: "11:45",
        clientName: "Beatriz Ramos",
        amount: undefined,
      },
      {
        id: "a22",
        type: "logout",
        description: "Fin de jornada",
        timestamp: "11:30",
        clientName: undefined,
        amount: undefined,
      },
    ],
  ][index],
}))

export default function AuditoriaPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "online" | "offline" | "away">("all")
  const [expandedSeller, setExpandedSeller] = useState<string | null>(null)

  const filteredSellers = auditData.filter((seller) => {
    const matchesSearch = seller.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || seller.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-yellow-500"
      case "offline":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "online":
        return "En línea"
      case "away":
        return "Ausente"
      case "offline":
        return "Desconectado"
      default:
        return "Desconocido"
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "login":
        return <Wifi className="h-4 w-4 text-green-600" />
      case "logout":
        return <Wifi className="h-4 w-4 text-red-600" />
      case "sale":
        return <TrendingUp className="h-4 w-4 text-blue-600" />
      case "contact":
        return <Phone className="h-4 w-4 text-purple-600" />
      case "comment":
        return <MessageSquare className="h-4 w-4 text-orange-600" />
      default:
        return <ActivityIcon className="h-4 w-4 text-gray-600" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount)
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Auditoría de Actividad</h1>
        <p className="text-muted-foreground">Monitoreo y seguimiento de la actividad de vendedores</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-2 block">Buscar vendedor</label>
              <Input
                placeholder="Nombre del vendedor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="min-w-[150px]">
              <label className="text-sm font-medium mb-2 block">Estado</label>
              <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="online">En línea</SelectItem>
                  <SelectItem value="away">Ausente</SelectItem>
                  <SelectItem value="offline">Desconectado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sellers Audit List */}
      <div className="space-y-4">
        {filteredSellers.map((seller) => (
          <Card key={seller.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={seller.avatar || "/placeholder.svg"} alt={seller.name} />
                      <AvatarFallback>
                        {seller.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(seller.status)}`}
                    />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{seller.name}</CardTitle>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(seller.status)}`} />
                        {getStatusText(seller.status)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Última conexión: {seller.lastConnection}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedSeller(expandedSeller === seller.id ? null : seller.id)}
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Ver Detalles
                  {expandedSeller === seller.id ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Tiempo Hoy</span>
                  </div>
                  <div className="text-xl font-bold text-blue-600">{formatTime(seller.loggedTime)}</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Calendar className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Tiempo Semanal</span>
                  </div>
                  <div className="text-xl font-bold text-green-600">{formatTime(seller.weeklyLoggedTime)}</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <ActivityIcon className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium">Actividades Hoy</span>
                  </div>
                  <div className="text-xl font-bold text-purple-600">{seller.todayActivities.length}</div>
                </div>
              </div>

              {/* Expanded Activity Details */}
              {expandedSeller === seller.id && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <ActivityIcon className="h-4 w-4" />
                    Registro de Actividad de Hoy
                  </h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {seller.todayActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                        <div className="mt-0.5">{getActivityIcon(activity.type)}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{activity.description}</span>
                            <span className="text-sm text-muted-foreground">{activity.timestamp}</span>
                          </div>
                          {activity.clientName && (
                            <div className="text-sm text-muted-foreground mt-1">
                              Cliente: {activity.clientName}
                              {activity.amount && (
                                <span className="ml-2 font-medium text-green-600">
                                  {formatCurrency(activity.amount)}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSellers.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-muted-foreground">
              <ActivityIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">No se encontraron vendedores</p>
              <p>Intenta ajustar los filtros de búsqueda</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
