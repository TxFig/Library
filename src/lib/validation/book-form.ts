import { z } from "zod"
import { ISBNOptionalSchema, ISBNSchema,  } from "./isbn"
import { MAX_INT32BIT } from "./utils"
import publishDateSchema from "./publish-date"
import fileOptionalSchema from "./file"
import type { ReplaceFields } from "$lib/utils/types"


const OptionalStringSchema = z.string().min(1).nullish()
const OptionalStringArraySchema = z.array(z.string().min(1)).nullish()

export const bookCreateSchema = z.object({
    isbn: ISBNSchema,

    title: z.string().min(1),

    subtitle: OptionalStringSchema,
    number_of_pages: z
        .number()
        .int()
        .positive()
        .lte(MAX_INT32BIT)
        .nullable(),

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
}).strict()

export type BookCreateDataWithImageFiles = z.output<typeof bookCreateSchema>
export type BookCreateData = ReplaceFields<BookCreateDataWithImageFiles, {
    front_image: boolean,
    back_image: boolean
}>


export const bookUpdateSchema = bookCreateSchema.partial().required({
    isbn: true
})

export type BookUpdateDataWithImageFiles = z.output<typeof bookUpdateSchema>
export type BookUpdateData = ReplaceFields<BookUpdateDataWithImageFiles, {
    front_image: boolean,
    back_image: boolean
}>
