import { z } from "zod"


const daysInMonth = (month: number, year: number) =>
    new Date(year, month, 0).getDate()

const minYear = 1800

export type DateObject = {
    year: number,
    month?: number,
    day?: number
}
function isValidDate(date: DateObject): boolean {
    const { year, month, day } = date
    const maxYear = new Date().getFullYear()

    if (!year || (day && !month)) return false

    if (year < minYear || year > maxYear) return false
    if (month && (month < 1 || month > 12)) return false
    if (day && (day < 1)) return false
    if ((day && month) && day > daysInMonth(month, year)) return false

    return true
}

export const PublishDateSchema = z
    .object({
        year: z.number()
            .or(z.literal("")).default(""),
        month: z.number().optional(),
        day: z.number().optional()
    })
    .refine((val): val is DateObject => val.year !== "", "Year is required")
    .refine(isValidDate, "Invalid Publish Date")

export type PublishDateSchema = typeof PublishDateSchema
export type PublishDateSchemaOutput = z.output<typeof PublishDateSchema>

export default PublishDateSchema
