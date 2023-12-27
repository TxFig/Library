import { z } from "zod"
import { ISBNOptionalSchema, ISBNSchema } from "./isbn"


export function isNotNullish<T>(value: T | null | undefined): value is T {
    return value !== null && value !== undefined
}

export function isFile(value: unknown): value is File {
    return value instanceof File
}

export const fileOptionalSchema = z
    .custom<File>()
    .nullable()
    .transform((value, ctx) => {
        if (!isNotNullish(value)) {
            return value
        }

        return value
    })

const stringRequiredSchema = (errorMessage: string) => z
    .string()
    .nullable()
    .refine((value): value is string => isNotNullish(value), errorMessage)

export const bookDataSchema = z.object({
    isbn: ISBNSchema,

    title: stringRequiredSchema("Title Require"),
    subtitle: z.string().nullable(),
    number_of_pages: z.number().nullable(),

    isbn10: ISBNOptionalSchema,
    isbn13: ISBNOptionalSchema,

    front_image: fileOptionalSchema,
    back_image: fileOptionalSchema
})


const daysInMonth = (month: number, year: number) =>
    new Date(year, month, 0).getDate()

const currentYear = new Date().getFullYear()
export const publishDateSchema = z.object({
    year: z
        .string()
        .transform(year => Number(year))
        .refine(year => !Number.isNaN(year) && year >= 1970 && year <= currentYear),
    month: z
        .string()
        .nullable()
        .transform(month => month == null ? null : Number(month))
        .refine(month => month == null || (!Number.isNaN(month) && month >= 1 && month <= 12)),
    day: z
        .string()
        .nullable()
        .transform(day => day == null ? null : Number(day))
        .refine(day => day == null || (!Number.isNaN(day) && day >= 1)),
}).refine(date =>
    // Only allow to exist day if there's a month
    (date.month || !date.day) &&

    // Determine max day based on month and year ( 28/29/30/31 )
    ((date.month && date.day) ? date.day <= daysInMonth(date.month, date.year) : true)
)

const stringArraySchema = z.array(
    z.string()
)

type out = z.output<typeof stringArraySchema>


const bookFormSchema = z.object({
    
})
