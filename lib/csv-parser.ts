export interface ParsedRow {
  id: string
  phoneNumbers: string[]
}

export interface PhoneNumberExtractor {
  extract(data: string): string[]
}

/**
 * Extracts phone numbers from structured data format
 * Handles formats like: "PAR: 02291 460318;LAB: ;CEL: ;CEL 2:27310002653"
 * Also handles formats like: "(11)5178-7965 (C) - ()5178-7965 (C)"
 */
export class StructuredPhoneExtractor implements PhoneNumberExtractor {
  private readonly phonePatterns = [
    { name: "parentheses_dash", regex: /\(?(\d{2,5})\)?(\d{2,4})-(\d{4})\s*\(?[CP]?\)?/g },
    { name: "area_code_separate", regex: /(\d{2,5})\s*(\d{2,4})-(\d{4})\s*\(?[CP]?\)?/g },
    { name: "dash_format", regex: /\b(\d{2,4})-(\d{4})\b/g },
    { name: "spaced_format", regex: /\b(\d{2,5})\s+(\d{6,8})\b/g },
    { name: "consecutive", regex: /\b(\d{10,11})\b/g },
  ]

  extract(data: string): string[] {
    if (!data || typeof data !== "string") return []

    console.log("[v0] Extracting from data:", data)
    const phoneNumbers: string[] = []
    const segments = data.split(" - ") // Split by dash to handle both forms ( - )
    console.log("[v0] Split into segments:", segments)

    // Process each segment
    for (const segment of segments) {
      const trimmed = segment.trim()
      if (!trimmed) continue

      console.log("[v0] Processing segment:", trimmed)

      // Try matching each pattern to the segment
      for (const pattern of this.phonePatterns) {
        const matches = [...trimmed.matchAll(pattern.regex)]
        console.log(`[v0] Pattern ${pattern.name} matches:`, matches)

        if (matches.length > 0) {
          // If matches found, process them
          for (const match of matches) {
            if (match) {
              const fullNumber = this.extractPhoneNumberFromMatch(pattern, match)
              if (fullNumber) {
                phoneNumbers.push(fullNumber)
                console.log("[v0] Extracted phone:", fullNumber)
              }
            }
          }
          break // Stop after first successful pattern match
        }
      }
    }

    // Remove duplicates and return valid phone numbers
    const uniqueNumbers = [...new Set(phoneNumbers)].filter((phone) => this.isValidPhoneNumber(phone))
    console.log("[v0] Final phone numbers:", uniqueNumbers)
    return uniqueNumbers
  }

  private extractPhoneNumberFromMatch(pattern: { name: string }, match: RegExpMatchArray): string | null {
    switch (pattern.name) {
      case "parentheses_dash":
      case "area_code_separate":
        const areaCode = match[1]
        const firstPart = match[2]
        const secondPart = match[3]
        return areaCode ? `${areaCode} ${firstPart}-${secondPart}` : `${firstPart}-${secondPart}`
      case "dash_format":
        return `${match[1]}-${match[2]}`
      case "spaced_format":
        return `${match[1]} ${match[2]}`
      case "consecutive":
        return match[0]
      default:
        return null
    }
  }

  private isValidPhoneNumber(phone: string): boolean {
    const digitsOnly = phone.replace(/\D/g, "") // Remove non-digit characters
    return digitsOnly.length >= 8 && digitsOnly.length <= 15
  }
}

/**
 * Parses CSV content and extracts phone numbers from each row
 */
export function parseCSVPhoneNumbers(csvContent: string): ParsedRow[] {
  const extractor = new StructuredPhoneExtractor()
  const lines = csvContent.split("\n").filter((line) => line.trim())

  const results: ParsedRow[] = lines
    .map((line) => {
      const columns = line.split(/[,\t]/).map((col) => col.trim().replace(/^["']|["']$/g, ""))

      if (columns.length >= 2) {
        const id = columns[0]
        const phoneData = columns[1] // assuming phone data is in the second column
        const phoneNumbers = extractor.extract(phoneData)
        return { id, phoneNumbers }
      }
      return null
    })
    .filter(Boolean) as ParsedRow[]

  return results
}

/**
 * Factory function to create different types of phone extractors
 */
export function createPhoneExtractor(type: "structured" | "simple" = "structured"): PhoneNumberExtractor {
  switch (type) {
    case "structured":
      return new StructuredPhoneExtractor()
    default:
      return new StructuredPhoneExtractor() // Can be extended with SimplePhoneExtractor later
  }
}

/**
 * Utility function to validate phone numbers
 */
export function validatePhoneNumber(phone: string): boolean {
  const digitsOnly = phone.replace(/\s/g, "")
  return digitsOnly.length >= 8 && digitsOnly.length <= 15 && /^\d+$/.test(digitsOnly)
}

/**
 * Utility function to format phone numbers consistently
 */
export function formatPhoneNumber(phone: string, format: "spaces" | "dashes" | "none" = "spaces"): string {
  const digitsOnly = phone.replace(/\D/g, "")

  switch (format) {
    case "spaces":
      return digitsOnly.replace(/(\d{2,4})(\d{6,8})/, "$1 $2")
    case "dashes":
      return digitsOnly.replace(/(\d{2,4})(\d{6,8})/, "$1-$2")
    case "none":
    default:
      return digitsOnly
  }
}
