import { type NextRequest, NextResponse } from "next/server"
import { parseCSVPhoneNumbers } from "@/lib/csv-parser"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] API: Received POST request")

    const formData = await request.formData()
    console.log("[v0] API: FormData parsed")

    const file = formData.get("file") as File

    if (!file) {
      console.log("[v0] API: No file provided")
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    console.log("[v0] API: File received:", file.name, "type:", file.type, "size:", file.size)

    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      console.log("[v0] API: Invalid file type")
      return NextResponse.json({ error: "Invalid file type. Please upload a CSV file." }, { status: 400 })
    }

    const text = await file.text()
    console.log("[v0] API: File text length:", text.length)
    console.log("[v0] API: First 200 chars:", text.substring(0, 200))

    const results = parseCSVPhoneNumbers(text)
    console.log("[v0] API: Parsing complete, results count:", results.length)

    return NextResponse.json({
      success: true,
      results,
      totalRows: results.length,
    })
  } catch (error) {
    console.error("[v0] API: CSV parsing error:", error)
    console.error("[v0] API: Error stack:", error instanceof Error ? error.stack : "No stack trace")

    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    return NextResponse.json(
      {
        error: `Failed to parse CSV file: ${errorMessage}`,
      },
      { status: 500 },
    )
  }
}
