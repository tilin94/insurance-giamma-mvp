"use client"

import type React from "react"
import { PhoneNumberComparator } from "@/lib/phone-number-comparator"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { usePack } from "@/contexts/pack-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Upload,
  FileText,
  Phone,
  Loader2,
  ChevronDown,
  ChevronUp,
  Search,
  Shield,
  AlertTriangle,
  Database,
  Zap,
  CheckCircle2,
  BarChart3,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { clientsData } from "@/data/clients-mock"

interface ParsedRow {
  id: string
  phoneNumbers: string[]
  apiResponse?: any
  apiPhones?: string[]
  apiLoading?: boolean
  apiError?: string
  showResponse?: boolean
}

enum LoadingStage {
  IDLE = "idle",
  UPLOADING = "uploading",
  API_PROCESSING = "api_processing",
  SCORING = "scoring",
  COMPLETE = "complete",
}

interface LoadingState {
  stage: LoadingStage
  progress: number
  message: string
  processedRows: number
  totalRows: number
}

export default function CSVParserPage() {
  const { user, isLoading: authLoading } = useAuth()
  const { selectedPack } = usePack()
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingState, setLoadingState] = useState<LoadingState>({
    stage: LoadingStage.IDLE,
    progress: 0,
    message: "",
    processedRows: 0,
    totalRows: 0,
  })
  const [results, setResults] = useState<ParsedRow[]>([])
  const [error, setError] = useState<string>("")
  const [selectedCampaign, setSelectedCampaign] = useState<string>("")
  const [successStats, setSuccessStats] = useState<{
    uploaded: number
    processed: number
    validated: number
  } | null>(null)

  const phoneComparator = new PhoneNumberComparator()

  const isPhoneInCSV = (apiPhone: string, csvPhones: string[]): boolean => {
    return csvPhones.some((csvPhone) => phoneComparator.compare(apiPhone, csvPhone, "AR"))
  }

  const getNewPhones = (apiPhones: string[], csvPhones: string[]): string[] => {
    return apiPhones.filter((apiPhone) => !isPhoneInCSV(apiPhone, csvPhones))
  }

  const hasAPIMatch = (csvPhone: string, apiPhones: string[]): boolean => {
    return apiPhones.some((apiPhone) => phoneComparator.compare(csvPhone, apiPhone, "AR"))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile)
      setError("")
    } else {
      setError("Por favor selecciona un archivo CSV válido")
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError("Por favor selecciona un archivo primero")
      return
    }
    if (!selectedCampaign) {
      setError("Por favor selecciona una campaña")
      return
    }

    setLoading(true)
    setError("")
    setSuccessStats(null)

    // Use a subset of mock data for realistic processing
    const mockDataSubset = clientsData.slice(0, 25) // Use first 25 clients
    const totalRows = mockDataSubset.length

    try {
      // Stage 1: Upload datasource
      setLoadingState({
        stage: LoadingStage.UPLOADING,
        progress: 0,
        message: "Cargando archivo CSV...",
        processedRows: 0,
        totalRows,
      })

      // Simulate upload progress
      for (let i = 0; i <= 100; i += 5) {
        await new Promise((resolve) => setTimeout(resolve, 80))
        setLoadingState((prev) => ({
          ...prev,
          progress: i,
          message:
            i < 50
              ? "Leyendo archivo CSV..."
              : i < 80
                ? "Validando formato de datos..."
                : "Preparando datos para procesamiento...",
        }))
      }

      // Stage 2: API Processing
      setLoadingState({
        stage: LoadingStage.API_PROCESSING,
        progress: 0,
        message: "Consultando API de InfoExperto...",
        processedRows: 0,
        totalRows,
      })

      // Convert mock data to ParsedRow format and simulate API calls
      const processedResults: ParsedRow[] = []

      for (let i = 0; i < mockDataSubset.length; i++) {
        const client = mockDataSubset[i]

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 200))

        // Create mock API response
        const mockApiResponse = {
          cuit: `20${Math.floor(Math.random() * 100000000)}${Math.floor(Math.random() * 10)}`,
          razonSocial: client.name,
          telefono: client.phone.length > 0 ? client.phone[0] : null,
          email: `${client.name.toLowerCase().replace(/\s+/g, ".")}@email.com`,
          direccion: `Calle ${Math.floor(Math.random() * 9999)} ${Math.floor(Math.random() * 999)}`,
          localidad: "Buenos Aires",
          provincia: "Buenos Aires",
        }

        // Generate some additional phone numbers from API
        const additionalPhones =
          Math.random() > 0.6
            ? [`11 ${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`]
            : []

        const parsedRow: ParsedRow = {
          id: mockApiResponse.cuit,
          phoneNumbers: client.phone,
          apiResponse: mockApiResponse,
          apiPhones: [...client.phone, ...additionalPhones],
          apiLoading: false,
          showResponse: false,
        }

        processedResults.push(parsedRow)

        const progress = Math.round(((i + 1) / totalRows) * 100)
        setLoadingState((prev) => ({
          ...prev,
          progress,
          processedRows: i + 1,
          message: `Procesando registro ${i + 1} de ${totalRows} con InfoExperto...`,
        }))
      }

      // Stage 3: Scoring
      setLoadingState({
        stage: LoadingStage.SCORING,
        progress: 0,
        message: "Calculando scoring de clientes...",
        processedRows: 0,
        totalRows,
      })

      // Simulate scoring process
      for (let i = 0; i <= 100; i += 8) {
        await new Promise((resolve) => setTimeout(resolve, 120))
        const processedRows = Math.floor((i / 100) * totalRows)
        setLoadingState((prev) => ({
          ...prev,
          progress: i,
          processedRows,
          message:
            i < 30
              ? "Analizando patrones de contacto..."
              : i < 60
                ? "Evaluando calidad de datos..."
                : i < 90
                  ? "Calculando puntuaciones finales..."
                  : "Finalizando proceso de scoring...",
        }))
      }

      // Complete
      setLoadingState({
        stage: LoadingStage.COMPLETE,
        progress: 100,
        message: "¡Proceso completado exitosamente!",
        processedRows: totalRows,
        totalRows,
      })

      setResults(processedResults)
      setSuccessStats({
        uploaded: totalRows,
        processed: totalRows,
        validated: processedResults.filter((r) => r.apiPhones && r.apiPhones.length > 0).length,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido"
      setError(`Error: ${errorMessage}`)
    } finally {
      setLoading(false)
      setTimeout(() => {
        setLoadingState({
          stage: LoadingStage.IDLE,
          progress: 0,
          message: "",
          processedRows: 0,
          totalRows: 0,
        })
      }, 3000)
    }
  }

  const callInfoExpertoAPI = async (cuit: string, index: number) => {
    setResults((prev) => prev.map((row, i) => (i === index ? { ...row, apiLoading: true, apiError: undefined } : row)))

    try {
      console.log("[v0] Calling InfoExperto API for CUIT:", cuit)

      const response = await fetch("/api/info-experto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cuit }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const data = await response.json()

      setResults((prev) =>
        prev.map((row, i) =>
          i === index
            ? {
                ...row,
                apiResponse: data.data,
                apiPhones: data.extractedPhones || [],
                apiLoading: false,
                showResponse: true,
              }
            : row,
        ),
      )
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      console.error("[v0] InfoExperto API error:", err)

      setResults((prev) =>
        prev.map((row, i) =>
          i === index
            ? {
                ...row,
                apiError: errorMessage,
                apiLoading: false,
              }
            : row,
        ),
      )
    }
  }

  const toggleResponseVisibility = (index: number) => {
    setResults((prev) => prev.map((row, i) => (i === index ? { ...row, showResponse: !row.showResponse } : row)))
  }

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    } else if (!authLoading && user && !user.isAdmin) {
      router.push("/contactacion")
    }
  }, [user, authLoading, router])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (!user.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            <CardTitle>Acceso Denegado</CardTitle>
            <CardDescription>Esta sección solo está disponible para usuarios administradores.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => router.push("/contactacion")} className="w-full">
              Volver al Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="space-y-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="h-6 w-6 text-orange-500" />
              <h1 className="text-3xl font-bold">Cargar datos de contactación</h1>
            </div>
            <p className="text-muted-foreground mt-2">
              Sube un archivo CSV para extraer números telefónicos y obtener reportes de InfoExperto
            </p>
            {selectedPack.id !== "pack1" && (
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-500/20 text-orange-400 border border-orange-500/30 mt-2">
                <Shield className="h-4 w-4 mr-1" />
                Sección de Administrador
              </div>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Subir Archivo CSV
              </CardTitle>
              <CardDescription>
                Selecciona un archivo CSV con datos de ID y números telefónicos para analizar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="campaign-select">Seleccionar Campaña</Label>
                <select
                  id="campaign-select"
                  value={selectedCampaign}
                  onChange={(e) => setSelectedCampaign(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                >
                  <option value="">Selecciona una campaña...</option>
                  <option value="seguros">Seguros</option>
                  <option value="fiat360">FIAT 360</option>
                  <option value="0km-para-todos">0KM Para Todos</option>
                </select>
              </div>

              <div>
                <Label htmlFor="csv-file">Archivo CSV</Label>
                <Input id="csv-file" type="file" accept=".csv" onChange={handleFileChange} className="mt-1" />
              </div>

              {error && <div className="text-destructive text-sm">{error}</div>}

              {loading && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    {loadingState.stage === LoadingStage.UPLOADING && (
                      <div className="flex items-center gap-2">
                        <Database className="h-5 w-5 text-blue-500 animate-pulse" />
                        <span className="text-sm font-medium text-blue-600">Cargando Datos</span>
                      </div>
                    )}
                    {loadingState.stage === LoadingStage.API_PROCESSING && (
                      <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-yellow-500 animate-bounce" />
                        <span className="text-sm font-medium text-yellow-600">Consultando InfoExperto</span>
                      </div>
                    )}
                    {loadingState.stage === LoadingStage.SCORING && (
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-purple-500 animate-pulse" />
                        <span className="text-sm font-medium text-purple-600">Procesando Scoring</span>
                      </div>
                    )}
                    {loadingState.stage === LoadingStage.COMPLETE && (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <span className="text-sm font-medium text-green-600">Completado</span>
                      </div>
                    )}
                  </div>

                  <Progress value={loadingState.progress} className="w-full" />

                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">{loadingState.message}</div>
                    {loadingState.stage !== LoadingStage.UPLOADING && loadingState.totalRows > 0 && (
                      <div className="text-xs text-muted-foreground">
                        Procesados: {loadingState.processedRows} de {loadingState.totalRows} registros
                      </div>
                    )}
                    <div className="text-xs text-center text-muted-foreground">{loadingState.progress}% completado</div>
                  </div>
                </div>
              )}

              {successStats && !loading && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <h3 className="font-medium text-green-800">¡Proceso Completado Exitosamente!</h3>
                  </div>
                  <div className="text-sm text-green-700 space-y-1">
                    <p>
                      • <strong>{successStats.uploaded}</strong> registros cargados correctamente
                    </p>
                    <p>
                      • <strong>{successStats.processed}</strong> consultas realizadas a InfoExperto
                    </p>
                    <p>
                      • <strong>{successStats.validated}</strong> registros validados con información adicional
                    </p>
                  </div>
                  <p className="text-xs text-green-600 mt-2">
                    Los datos han sido procesados y están listos para su análisis en el sistema.
                  </p>
                </div>
              )}

              <Button onClick={handleUpload} disabled={!file || loading || !selectedCampaign} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  "Analizar CSV"
                )}
              </Button>
            </CardContent>
          </Card>

          {results.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Resultados del Análisis ({results.length} filas)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {results.map((row, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <div className="font-medium">CUIL: {row.id}</div>
                          <div className="flex items-center gap-2 mt-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {row.phoneNumbers.length} número(s) telefónico(s)
                            </span>
                          </div>
                          <div className="mt-2 space-y-1">
                            {row.phoneNumbers.map((phone, phoneIndex) => (
                              <div
                                key={phoneIndex}
                                className="text-sm font-mono bg-muted px-2 py-1 rounded flex items-center gap-2"
                              >
                                <div className="w-2 h-2 rounded-full bg-blue-500" title="Del CSV"></div>
                                {phone}
                                {row.apiPhones && hasAPIMatch(phone, row.apiPhones) && (
                                  <span
                                    className="text-yellow-400 ml-1"
                                    title="También encontrado en la API de InfoExperto"
                                  >
                                    ⭐
                                  </span>
                                )}
                              </div>
                            ))}

                            {row.apiPhones && getNewPhones(row.apiPhones, row.phoneNumbers).length > 0 && (
                              <>
                                <div className="text-xs text-muted-foreground mt-3 mb-1 font-medium">
                                  Números nuevos, de la API de InfoExperto:
                                </div>
                                {getNewPhones(row.apiPhones, row.phoneNumbers).map((phone, phoneIndex) => (
                                  <div
                                    key={`api-${phoneIndex}`}
                                    className="text-sm font-mono bg-green-900/30 border border-green-700 px-2 py-1 rounded flex items-center gap-2"
                                  >
                                    <div className="w-2 h-2 rounded-full bg-green-500" title="De la API"></div>
                                    {phone}
                                  </div>
                                ))}
                              </>
                            )}
                          </div>

                          <div className="mt-4 pt-4 border-t">
                            <div className="flex items-center gap-2 mb-2">
                              <Button
                                size="sm"
                                onClick={() => callInfoExpertoAPI(row.id, index)}
                                disabled={row.apiLoading}
                                className="flex items-center gap-2"
                              >
                                {row.apiLoading ? (
                                  <>
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                    Cargando...
                                  </>
                                ) : (
                                  <>
                                    <Search className="h-3 w-3" />
                                    Obtener Reporte InfoExperto
                                  </>
                                )}
                              </Button>
                            </div>

                            {row.apiError && (
                              <div className="text-destructive text-sm mt-2 p-2 bg-destructive/10 rounded">
                                Error: {row.apiError}
                              </div>
                            )}

                            {row.apiResponse && (
                              <div className="mt-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => toggleResponseVisibility(index)}
                                  className="flex items-center gap-2"
                                >
                                  {row.showResponse ? (
                                    <>
                                      <ChevronUp className="h-3 w-3" />
                                      Ocultar Respuesta
                                    </>
                                  ) : (
                                    <>
                                      <ChevronDown className="h-3 w-3" />
                                      Mostrar Respuesta
                                    </>
                                  )}
                                </Button>

                                {row.showResponse && (
                                  <div className="mt-2 p-3 bg-muted rounded-lg">
                                    <pre className="text-xs overflow-auto max-h-64 whitespace-pre-wrap">
                                      {JSON.stringify(row.apiResponse, null, 2)}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
