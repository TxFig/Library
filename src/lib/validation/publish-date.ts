import { z } from "zod"
import { isNullish } from "./utils"


const daysInMonth = (month: number, year: number) =>
    new Date(year, month, 0).getDate()

const currentYear = new Date().getFullYear()
export const publishDateSchema = z
    .object({
        year: z
            .string()
            .transform(year => Number(year))
            .refine(year => !Number.isNaN(year) && year >= 1970 && year <= currentYear),
        month: z
            .string()
            .nullish()
            .transform(month => isNullish(month) ? month : Number(month))
            .refine(month => isNullish(month) || (!Number.isNaN(month) && month >= 1 && month <= 12)),
        day: z
            .string()
            .nullish()
            .transform(day => isNullish(day) ? day : Number(day))
            .refine(day => isNullish(day) || (!Number.isNaN(day) && day >= 1)),
    })
    .nullish()
    .refine(date =>
        isNullish(date) ||

        // Only allow to exist day if there's a month
        (date.month || !date.day) &&

        // Determine max day (28/29/30/31) based on month and year
        ((date.month && date.day) ? date.day <= daysInMonth(date.month, date.year) : true)
    )

export default publishDateSchema
