import { z } from "zod"


const daysInMonth = (month: number, year: number) =>
    new Date(year, month, 0).getDate()

const minYear = 1970

export type DateObject = { year?: number, month?: number, day?: number }
export type DateObjectWithYear = { year: number, month?: number, day?: number }
function isValidDate (date: DateObject | undefined): date is DateObjectWithYear {
    if (!date || (!date.year && !date.month && !date.day)) return true

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
        year: z.number().optional(),
        month: z.number().optional(),
        day: z.number().optional()
    })
    .refine(isValidDate, "Invalid Publish Date")
    .default({})


export default PublishDateSchema
