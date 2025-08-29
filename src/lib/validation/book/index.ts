import * as v from "valibot"
import { NumberSchema, StringSchema } from "../utils"
import PublishDateSchema from "./publish-date"
import { ISBNSchema } from "./isbn"
import { ImageFileSchema } from "./file"
import { PublicIdSchema } from "../publicId"
import { SubjectSchema } from "./subject"


export const BookCopySchema = v.object({
    location: StringSchema,
    ownerId: PublicIdSchema
})
export type BookCopySchema = typeof BookCopySchema
export type BookCopySchemaInput = v.InferInput<BookCopySchema>
export type BookCopySchemaOutput = v.InferOutput<BookCopySchema>

export const BookEditionSchema = v.object({
    title: StringSchema,
    subtitle: v.optional(StringSchema),
    pageCount: v.optional(NumberSchema),
    isbn10: v.optional(ISBNSchema),
    isbn13: v.optional(ISBNSchema),
    language: v.optional(StringSchema),
    authors: v.optional(v.array(StringSchema), []),
    publishers: v.optional(v.array(StringSchema), []),
    publishDate: v.optional(PublishDateSchema),
    image: v.optional(ImageFileSchema),
    copies: v.optional(v.array(BookCopySchema), [])
})
export type BookEditionSchema = typeof BookEditionSchema
export type BookEditionSchemaInput = v.InferInput<BookEditionSchema>
export type BookEditionSchemaOutput = v.InferOutput<BookEditionSchema>

export const BookSchema = v.object({
    authors: v.pipe(
        v.array(StringSchema),
        v.minLength(1, "At least one author is required"),
    ),
    subjects: v.optional(
        v.array(SubjectSchema), []
    ),
    editions: v.array(BookEditionSchema)
})
export type BookSchema = typeof BookSchema
export type BookSchemaInput = v.InferInput<BookSchema>
export type BookSchemaOutput = v.InferOutput<BookSchema>

export const FormBookEditionSchema = v.object({
    ...BookEditionSchema.entries,
    language: StringSchema,
    publishDate: PublishDateSchema,
})
export type FormBookEditionSchema = typeof FormBookEditionSchema
export type FormBookEditionSchemaInput = v.InferInput<FormBookEditionSchema>
export type FormBookEditionSchemaOutput = v.InferOutput<FormBookEditionSchema>

export const FormBookSchema = v.object({
    ...BookSchema.entries,
    editions: v.array(FormBookEditionSchema)
})
export type FormBookSchema = typeof FormBookSchema
export type FormBookSchemaInput = v.InferInput<FormBookSchema>
export type FormBookSchemaOutput = v.InferOutput<FormBookSchema>
