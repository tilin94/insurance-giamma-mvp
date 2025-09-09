"use client"
import type { Client } from "@/data/clients-mock"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Phone, User, Calendar, MessageSquare, CheckCircle, XCircle, Star } from "lucide-react"

interface ClientDetailsModalProps {
  client: Client | null
  isOpen: boolean
  onClose: () => void
}

export function ClientDetailsModal({ client, isOpen, onClose }: ClientDetailsModalProps) {
  if (!client) return null

  const renderStars = (scoring: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < scoring ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <DialogContent className="fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <User className="h-5 w-5" />
            <span>Detalles de {client.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Section */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground">Estado de Venta</h3>
              <Badge variant={client.sellout ? "default" : "secondary"} className="w-fit">
                {client.sellout ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                {client.sellout ? "Vendido" : "Disponible"}
              </Badge>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground">Estado de Contacto</h3>
              <Badge variant={client.contacted ? "default" : "outline"} className="w-fit">
                {client.contacted ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                {client.contacted ? "Contactado" : "Sin Contactar"}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Scoring Section */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">Probabilidad de Contacto</h3>
            <div className="flex items-center space-x-2">
              <div className="flex">{renderStars(client.scoring)}</div>
              <span className="text-sm text-muted-foreground">({client.scoring}/5)</span>
            </div>
          </div>

          <Separator />

          {/* Phone Numbers */}
          {client.phone.length > 0 && (
            <>
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  Teléfonos ({client.phone.length})
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {client.phone.map((phone, index) => (
                    <Badge key={index} variant="outline" className="justify-center py-2">
                      {phone}
                    </Badge>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Sales Information */}
          {client.sellout && (
            <>
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground">Información de Venta</h3>
                <div className="grid grid-cols-1 gap-3">
                  {client.soldBy && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Vendido por:</span>
                      <Badge variant="default">{client.soldBy}</Badge>
                    </div>
                  )}
                  {client.saleDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Fecha de venta:</span>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span className="text-sm">{new Date(client.saleDate).toLocaleDateString("es-AR")}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Contact Information */}
          {client.contacted && (
            <>
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground">Información de Contacto</h3>
                <div className="grid grid-cols-1 gap-3">
                  {client.contactedBy && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Contactado por:</span>
                      <Badge variant="outline">{client.contactedBy}</Badge>
                    </div>
                  )}
                  {client.lastContactDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Último contacto:</span>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span className="text-sm">{new Date(client.lastContactDate).toLocaleDateString("es-AR")}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Comments Section */}
          {client.comments.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                Comentarios y Observaciones
              </h3>
              <div className="space-y-2">
                {client.comments.map((comment, index) => (
                  <div key={index} className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm">{comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No information available */}
          {!client.contacted && client.comments.length === 0 && client.phone.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No hay información adicional disponible para este contacto.</p>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose} variant="outline">
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
