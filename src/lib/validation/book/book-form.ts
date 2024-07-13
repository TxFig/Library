import { z } from "zod"
import { ISBNOptionalSchema, ISBNSchema } from "./isbn"
import { MAX_INT32BIT } from "../utils"
import PublishDateSchema from "./publish-date"
import FileOptionalSchema from "./file"
import type { ReplaceFields } from "$lib/utils/types"
import type { FormDataInfo } from "decode-formdata"



//* Create Schema
export const BookCreateSchema = z.object({
    isbn: ISBNSchema,

    title: z.string(),

    subtitle: z.string().optional(),
    number_of_pages: z
        .number()
        .int()
        .positive()
        .lte(MAX_INT32BIT)
        .optional(),

    isbn10: ISBNOptionalSchema,
    isbn13: ISBNOptionalSchema,

    front_image: FileOptionalSchema,
    back_image: FileOptionalSchema,

    publish_date: PublishDateSchema,
    location: z.string().optional(),
    language: z.string().optional(),
    authors: z.array(z.string()).default([]),
    publishers: z.array(z.string()).default([]),
    subjects: z.array(z.string()).default([])
}, {
    required_error: "Book Data Required",
}).strict()
export type BookCreateSchema = typeof BookCreateSchema

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
export type BookUpdateSchema = typeof BookUpdateSchema

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
