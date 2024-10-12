import { z } from "zod";
import { ISBNSchema } from "./isbn";
import { MAX_INT32BIT } from "../utils";
import { ImageFileSchema } from "./file";
import PublishDateSchema from "./publish-date";
import { isObjectNotEmpty } from "$lib/utils/is-object-empty";


const StringSchema = z.string().min(1).max(500)
const StringArraySchema = z.array(StringSchema)
const NumberSchema = z.number().int().positive().lte(MAX_INT32BIT)

export const BookSchema = z.object({
    authors: StringArraySchema.min(1).default([]),
    subjects: StringArraySchema.default([]),
})
export type BookSchema = typeof BookSchema

export const BookEditionSchema = z.object({
    title: StringSchema,
    publishDate: PublishDateSchema,
    language: StringSchema,
    isbn: ISBNSchema.optional(),
    subtitle: StringSchema.optional(),
    numberOfPages: NumberSchema.optional(),
    image: ImageFileSchema.optional(),
    authors: StringArraySchema.default([]),
    publishers: StringArraySchema.default([]),
})
export type BookEditionSchema = typeof BookEditionSchema

export const BookCopySchema = z.object({
    location: StringSchema
})
export type BookCopySchema = typeof BookCopySchema
export type BookCopySchemaInput = z.input<typeof BookCopySchema>

export const BookCreateSchema = z.object({
    book: BookSchema,
    edition: BookEditionSchema,
    copy: BookCopySchema.optional(),
})
export type BookCreateSchema = typeof BookCreateSchema
export type BookCreateSchemaOutput = z.output<typeof BookCreateSchema>
