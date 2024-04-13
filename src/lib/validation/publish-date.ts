import { z } from "zod"


const daysInMonth = (month: number, year: number) =>
    new Date(year, month, 0).getDate()

const minYear = 1970
const maxYear = new Date().getFullYear()

export type DateObject = { year?: number | null, month?: number | null, day?: number | null }
export type DateObjectWithYear = { year: number, month?: number | null, day?: number | null }
function isValidDate (date: DateObject): date is DateObjectWithYear {
    const {year, month, day} = date

    if (!year || (day && !month)) return false

    if (year < minYear || year > maxYear) return false
    if (month && (month < 1 || month > 12)) return false
    if (day && (day < 1)) return false
    if ((day && month) && day > daysInMonth(month, year)) return false

    return true
}

export const PublishDateSchema = z
    .object({
        year: z.number().nullish(),
        month: z.number().nullish(),
        day: z.number().nullish()
    })
    .refine(isValidDate, "Invalid Publish Date")
    .nullish()


export default PublishDateSchema
