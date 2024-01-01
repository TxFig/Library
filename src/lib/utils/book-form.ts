import { z } from "zod"
import { ISBNOptionalSchema, ISBNSchema } from "./isbn"


export function isNullish<T>(value: T | null | undefined): value is null | undefined {
    return value == null || value == undefined
}

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
            .optional()
            .transform(month => isNullish(month) ? month : Number(month))
            .refine(month => isNullish(month) || (!Number.isNaN(month) && month >= 1 && month <= 12)),
        day: z
            .string()
            .optional()
            .transform(day => isNullish(day) ? day : Number(day))
            .refine(day => isNullish(day) || (!Number.isNaN(day) && day >= 1)),
    })
    .optional()
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
    .optional()


const MAX_INT32BIT = 2 ** 31 - 1

export const bookFormSchema = z.object({
    isbn: ISBNSchema,

    title: z.string(),

    subtitle: z.string().optional(),
    number_of_pages: z.number().int().positive().lte(MAX_INT32BIT).optional(),

    isbn10: ISBNOptionalSchema,
    isbn13: ISBNOptionalSchema,

    front_image: fileOptionalSchema,
    back_image: fileOptionalSchema,

    publish_date: publishDateSchema,
    location: z.string().optional(),
    language: z.string().optional(),
    authors: z.array(z.string()).optional(),
    publishers: z.array(z.string()).optional(),
    subjects: z.array(z.string()).optional()
}, {
    required_error: "Book Data Required",
})


type Entries<T> = {
    [K in keyof T]: [K, T[K]];
}[keyof T][];

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
