import { z } from "zod"
import { ISBNOptionalSchema, ISBNSchema,  } from "./isbn"
import type { Entries } from "../utils/types"
import { convertToNullIfUndefined, isNullish } from "./utils"


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
            .optional().transform(convertToNullIfUndefined)
            .transform(month => isNullish(month) ? month : Number(month))
            .refine(month => isNullish(month) || (!Number.isNaN(month) && month >= 1 && month <= 12)),
        day: z
            .string()
            .optional().transform(convertToNullIfUndefined)
            .transform(day => isNullish(day) ? day : Number(day))
            .refine(day => isNullish(day) || (!Number.isNaN(day) && day >= 1)),
    })
    .optional().transform(convertToNullIfUndefined)
    .refine(date =>
        isNullish(date) ||

        // Only allow to exist day if there's a month
        (date.month || !date.day) &&

        // Determine max day (28/29/30/31) based on month and year
        ((date.month && date.day) ? date.day <= daysInMonth(date.month, date.year) : true)
    )

const MBToBytes = (mb: number) => mb * 1000000
export const MAX_IMAGE_SIZE_MB = 16
export const MAX_IMAGE_SIZE_BYTES = MBToBytes(MAX_IMAGE_SIZE_MB)

const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
]

const fileOptionalSchema = z.instanceof(File)
    .refine(
        (file) => file.size <= MAX_IMAGE_SIZE_BYTES,
        `Image size can not exceeded ${MAX_IMAGE_SIZE_MB} MB`
    )
    .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
        "Only .jpg, .jpeg, .png and .webp formats are supported."
    )
    .optional().transform(convertToNullIfUndefined)



const MAX_INT32BIT = 2 ** 31 - 1

const OptionalStringSchema = z.string().optional().transform(convertToNullIfUndefined)
const OptionalStringArraySchema = z.array(z.string()).optional().transform(convertToNullIfUndefined)



export const bookFormSchema = z.object({
    isbn: ISBNSchema,

    title: z.string(),

    subtitle: OptionalStringSchema,
    number_of_pages: z
        .number()
        .int()
        .positive()
        .lte(MAX_INT32BIT)
        .optional().transform(convertToNullIfUndefined),

    isbn10: ISBNOptionalSchema,
    isbn13: ISBNOptionalSchema,

    front_image: fileOptionalSchema,
    back_image: fileOptionalSchema,

    publish_date: publishDateSchema,
    location: OptionalStringSchema,
    language: OptionalStringSchema,
    authors: OptionalStringArraySchema,
    publishers: OptionalStringArraySchema,
    subjects: OptionalStringArraySchema
}, {
    required_error: "Book Data Required",
})


type ZodFormattedError = {
    _errors: string[]
} & {
    [key: string]: ZodFormattedError
}

type FormattedError = {
    [key: string]: string | FormattedError
}

export function getFormattedError<T>(error: z.ZodError<T>): string | FormattedError {
    const errorFormatted = error.format()

    const formatFormattedError = (errorFormatted: ZodFormattedError): string | FormattedError => {
        const obj: FormattedError = {}
        for (const [key, value] of Object.entries(errorFormatted) as Entries<ZodFormattedError>) {
            if (key == "_errors" && Array.isArray(value)) {
                if (value.length != 0) {
                    return (value as string[])[0]
                }
                else continue
            } else {
                obj[key] = formatFormattedError(value)
            }
        }
        return obj
    }

    return formatFormattedError(errorFormatted)
}
