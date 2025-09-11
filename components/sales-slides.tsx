"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, X, Presentation, Lightbulb, Rocket } from "lucide-react"

const slidesData = [
  {
    problem: "Tiempo invertido en el procesamiento manual de datos",
    solution: "Automatización de la información: datos actualizados en tiempo real",
    icon: <Lightbulb className="h-6 w-6 text-yellow-500" />,
  },
  {
    problem: "Administración y reparto de datos",
    solution: "Centralización de métricas, KPIs y asignacion de contactos en un solo lugar",
    icon: <Rocket className="h-6 w-6 text-blue-500" />,
  },
  {
    problem: "Ampliar la visibilidad sobre el desempeño del equipo",
    solution: "Panel de control con seguimiento claro y transparente",
    icon: <Lightbulb className="h-6 w-6 text-green-500" />,
  },
  {
    problem: "Optimizar la medicion de contactación",
    solution: "Registro histórico y visualizacion de contactos con participacion activa del vendedor",
    icon: <Rocket className="h-6 w-6 text-purple-500" />,
  },
  {
    problem: "Potenciar la comparación de rendimiento entre vendedores",
    solution: "Control de actividad por vendedor e incentivos a la competencia",
    icon: <Lightbulb className="h-6 w-6 text-orange-500" />,
  },
  {
    problem: "Integrar la comunicación con clientes en un solo canal",
    solution: "Administracion de whatsapp para trazabilidad de interacciones",
    icon: <Rocket className="h-6 w-6 text-cyan-500" />,
  },
]

export function SalesSlides() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slidesData.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slidesData.length) % slidesData.length)
  }

  const currentData = slidesData[currentSlide]

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
        size="icon"
      >
        <Presentation className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
      </Button>

      {/* Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl w-full mx-4 p-0 bg-black/95 border-gray-800 backdrop-blur-sm">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <Presentation className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">CRM de Contactación</h2>
                <p className="text-sm text-gray-400">
                  Slide {currentSlide + 1} de {slidesData.length}
                </p>
              </div>
            </div>
          </div>

          {/* Slide Content */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Problem Side */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center">
                    <span className="text-red-400 font-semibold text-sm">!</span>
                  </div>
                  <h3 className="text-lg font-medium text-red-400">Oportunidad de mejora</h3>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed text-left">{currentData.problem}</p>
              </div>

              {/* Solution Side */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  {currentData.icon}
                  <h3 className="text-lg font-medium text-green-400">Solución con la plataforma</h3>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed text-left">{currentData.solution}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between p-6 border-t border-gray-800">
            <Button
              onClick={prevSlide}
              variant="outline"
              className="flex items-center space-x-2 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white bg-transparent"
              disabled={currentSlide === 0}
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Anterior</span>
            </Button>

            {/* Slide Indicators */}
            <div className="flex space-x-2">
              {slidesData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 w-8 rounded-full transition-colors ${
                    index === currentSlide
                      ? "bg-gradient-to-r from-blue-600 to-purple-600"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={nextSlide}
              variant="outline"
              className="flex items-center space-x-2 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white bg-transparent"
              disabled={currentSlide === slidesData.length - 1}
            >
              <span>Siguiente</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
