import * as v from "valibot"
import { MAX_INT32BIT } from "../utils"


const daysInMonth = (month: number, year: number) =>
    new Date(year, month, 0).getDate()

export const minYear = 1800

export type DateObject = {
    year: number,
    month?: number,
    day?: number
}
export function isValidDate(date: DateObject): boolean {
    const { year, month, day } = date
    const today = new Date()
    const maxYear = today.getFullYear()
    const maxMonth = today.getMonth() + 1
    const maxDay = today.getDate()

    if (!year || (day && !month)) return false

    if (year < minYear || year > maxYear) return false

    if (month && (month < 1 || month > 12)) return false
    if ((year && month) && year === maxYear && month > maxMonth) return false

    if (day && (day < 1)) return false
    if ((day && month) && day > daysInMonth(month, year)) return false
    if ((year && month && day) && year === maxYear && month === maxMonth && day > maxDay) return false

    return true
}

export const PublishDateSchema = v.pipe(
    v.object({
        year: v.pipe(
            v.number(),
            v.integer(),
            v.minValue(minYear, (issue) =>
                issue.input === 0 ? // default value being used for empty dates
                    "Required"
                : `Min year is ${minYear}`
            ),
            v.maxValue(MAX_INT32BIT)
        ),
        month: v.optional(v.pipe(
            v.number(),
            v.integer(),
            v.minValue(1),
            v.maxValue(12)
        )),
        day: v.optional(v.pipe(
            v.number(),
            v.integer(),
            v.minValue(1),
            v.maxValue(31)
        )),
    }),
    v.check(isValidDate, "Invalid Date")
)
export type PublishDateSchema = typeof PublishDateSchema
export type PublishDateSchemaInput = v.InferInput<PublishDateSchema>
export type PublishDateSchemaOutput = v.InferOutput<PublishDateSchema>


export default PublishDateSchema
