import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] InfoExperto API: Received POST request")

    console.log("[v0] InfoExperto API: All env vars:", Object.keys(process.env))
    console.log("[v0] InfoExperto API: NODE_ENV:", process.env.NODE_ENV)
    console.log("[v0] InfoExperto API: Direct API key check:", process.env.INFO_EXPERTO_API_KEY ? "EXISTS" : "MISSING")

    const { cuit } = await request.json()

    if (!cuit) {
      return NextResponse.json({ error: "CUIT is required" }, { status: 400 })
    }

    const apiKey =
      process.env.INFO_EXPERTO_API_KEY ||
      process.env["INFO_EXPERTO_API_KEY"] ||
      globalThis.process?.env?.INFO_EXPERTO_API_KEY

    console.log("[v0] InfoExperto API: API key exists:", !!apiKey)
    console.log("[v0] InfoExperto API: API key length:", apiKey?.length || 0)

    if (!apiKey) {
      console.error("[v0] InfoExperto API: API key not found. Environment may not be loaded yet.")

      return NextResponse.json(
        {
          error: "API key not accessible. Environment variables may not be loaded in this runtime context.",
          debug: {
            envVarsCount: Object.keys(process.env).length,
            hasNodeEnv: !!process.env.NODE_ENV,
            timestamp: new Date().toISOString(),
          },
        },
        { status: 500 },
      )
    }

    console.log("[v0] InfoExperto API: Making request for CUIT:", cuit)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

    try {
      const formData = new FormData()
      formData.append("apiKey", apiKey)
      formData.append("cuit", cuit)
      formData.append("tipo", "normal")

      const response = await fetch("https://servicio.infoexperto.com.ar/api/informeApi/obtenerInforme", {
        method: "POST",
        body: formData,
        signal: controller.signal,
        headers: {
          "User-Agent": "CSV-Parser-App/1.0",
        },
      })

      clearTimeout(timeoutId)

      console.log("[v0] InfoExperto API: Response status:", response.status)
      console.log("[v0] InfoExperto API: Response headers:", Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] InfoExperto API: External API error:", response.status, errorText)

        return NextResponse.json(
          {
            error: `External API error: ${response.status} ${response.statusText}`,
            details: errorText,
            cuit: cuit,
          },
          { status: response.status },
        )
      }

      const data = await response.json()
      console.log("[v0] InfoExperto API: Response received for CUIT:", cuit)

      let extractedPhones: string[] = []
      try {
        if (data?.data?.informe?.telefonosDeclaradosValidados) {
          extractedPhones = data.data.informe.telefonosDeclaradosValidados
            .map((item: any) => item.telefono)
            .filter((phone: string) => phone && phone.trim())
        }
        console.log("[v0] InfoExperto API: Extracted phones:", extractedPhones)
      } catch (phoneExtractionError) {
        console.error("[v0] InfoExperto API: Error extracting phones:", phoneExtractionError)
      }

      return NextResponse.json({
        success: true,
        data,
        extractedPhones,
      })
    } catch (fetchError) {
      clearTimeout(timeoutId)

      if (fetchError instanceof Error && fetchError.name === "AbortError") {
        console.error("[v0] InfoExperto API: Request timeout")
        return NextResponse.json({ error: "Request timeout - external API took too long to respond" }, { status: 408 })
      }

      throw fetchError // Re-throw to be caught by outer catch
    }
  } catch (error) {
    console.error("[v0] InfoExperto API: Error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        type: error instanceof Error ? error.constructor.name : "UnknownError",
      },
      { status: 500 },
    )
  }
}
