import { z } from "zod";
import { ISBNSchema } from "./isbn";
import { MAX_INT32BIT } from "../utils";
import { ImageFileSchema } from "./file";
import PublishDateSchema from "./publish-date";


const StringSchema = z.string().min(1, "Required").max(500, "Must be less than 500 characters")
const StringArraySchema = z.array(StringSchema)
const NumberSchema = z.number().int().positive().lte(MAX_INT32BIT)

export const BookSchema = z.object({
    authors: StringArraySchema.min(1, "At least one author is required").default([]),
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
    additionalAuthors: StringArraySchema.default([]),
    publishers: StringArraySchema.default([]),
})
export type BookEditionSchema = typeof BookEditionSchema

export const BookCopySchema = z.object({
    location: StringSchema
})
export type BookCopySchema = typeof BookCopySchema

export const BookCreateSchema = z.object({
    book: BookSchema,
    edition: BookEditionSchema,
    copy: BookCopySchema.partial(),
})
export type BookCreateSchema = typeof BookCreateSchema
export type BookCreateSchemaOutput = z.output<typeof BookCreateSchema>


function prefixKeys<Shape extends z.ZodRawShape, ObjectSchema extends z.ZodObject<Shape>>(prefix: string, schema: ObjectSchema): ObjectSchema {
    const newSchema = z.object({})

    for (const [key, value] of Object.entries(schema)) {
        newSchema.merge(z.object({ [prefix + key]: value }))
    }

    return newSchema
}

const prefixBook = prefixKeys("book.", BookSchema)

export const _BookCreateSchema = BookSchema.merge(BookEditionSchema).merge(BookCopySchema)
