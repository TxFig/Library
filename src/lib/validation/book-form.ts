import { z } from "zod"
import { ISBNOptionalSchema, ISBNSchema } from "./isbn"
import { MAX_INT32BIT } from "./utils"
import PublishDateSchema from "./publish-date"
import FileOptionalSchema from "./file"
import type { ReplaceFields } from "$lib/utils/types"
import type { FormDataInfo } from "decode-formdata"


//* Create Schema
export const BookCreateSchema = z.object({
    isbn: ISBNSchema,

    title: z.string(),

    subtitle: z.string().nullish(),
    number_of_pages: z
        .number()
        .int()
        .positive()
        .lte(MAX_INT32BIT)
        .nullish(),

    isbn10: ISBNOptionalSchema,
    isbn13: ISBNOptionalSchema,

    front_image: FileOptionalSchema,
    back_image: FileOptionalSchema,

    publish_date: PublishDateSchema,
    location: z.string().nullish(),
    language: z.string().nullish(),
    authors: z.array(z.string()).nullish(),
    publishers: z.array(z.string()).nullish(),
    subjects: z.array(z.string()).nullish()
}, {
    required_error: "Book Data Required",
}).strict()

export const BookCreateSchemaDecodeInfo: FormDataInfo = {
    arrays: ["authors", "publishers", "subjects"],
    files: ["front_image", "back_image"],
    numbers: [
        "number_of_pages", "publish_date.day",
        "publish_date.month", "publish_date.year"
    ]
}

export type BookCreateDataWithImageFiles = z.output<typeof BookCreateSchema>
export type BookCreateData = ReplaceFields<BookCreateDataWithImageFiles, {
    front_image: boolean,
    back_image: boolean
}>

//* Update Schema
export const BookUpdateSchema = BookCreateSchema.partial().required({
    isbn: true
})

export const BookUpdateSchemaDecodeInfo: FormDataInfo = {
    arrays: ["authors", "publishers", "subjects"],
    files: ["front_image", "back_image"],
    numbers: [
        "number_of_pages", "publish_date.day",
        "publish_date.month", "publish_date.year"
    ]
}

export type BookUpdateDataWithImageFiles = z.output<typeof BookUpdateSchema>
export type BookUpdateData = ReplaceFields<BookUpdateDataWithImageFiles, {
    front_image: boolean | undefined,
    back_image: boolean | undefined
}>
