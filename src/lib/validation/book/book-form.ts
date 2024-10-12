import { z } from "zod"
import { ISBNSchema } from "./isbn"
import { MAX_INT32BIT } from "../utils"
import PublishDateSchema from "./publish-date"
import FileSchema from "./file"



//* Create Schema
export const BookCreateSchema = z.object({
    isbn: ISBNSchema.optional(),
    title: z.string().min(1, "Title Required"),
    subtitle: z.string().nullish(),
    numberOfPages: z
        .number()
        .int()
        .positive()
        .lte(MAX_INT32BIT)
        .nullish(),

    isbn10: ISBNSchema.nullish(),
    isbn13: ISBNSchema.nullish(),

    image: FileSchema.optional(),

    publishDate: PublishDateSchema,
    location: z.string().optional(),
    language: z.string().optional(),
    authors: z.array(z.string()).default([]),
    publishers: z.array(z.string()).default([]),
    subjects: z.array(z.string()).default([]),
}, {
    required_error: "Book Data Required",
}).strict()
export type BookCreateSchema = typeof BookCreateSchema

export type BookCreateFormDataInput = z.input<BookCreateSchema>
export type BookCreateFormData = z.output<BookCreateSchema>


//* Update Schema (only for API)
export const BookUpdateSchema = BookCreateSchema.partial().required({
    isbn: true,

    //* These fields have default values, so they must be marked as required
    //* to ensure their types are correct. They can still be omitted by the user.
    publishDate: true,
    authors: true,
    publishers: true,
    subjects: true,
})
export type BookUpdateSchema = typeof BookUpdateSchema

export type BookUpdateFormData = z.output<BookUpdateSchema>
