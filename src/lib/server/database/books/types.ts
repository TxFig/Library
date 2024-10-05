import type { Prisma } from "@prisma/client"


export const BookCollectionBooksInclude = {
    image: true
} as const
export const BookCollectionWithBooksInclude = {
    books: {
        include: BookCollectionBooksInclude
    }
} as const
export type BookCollectionWithBooks = Prisma.BookCollectionGetPayload<{
    include: typeof BookCollectionWithBooksInclude
}>
export type BuiltInBookCollectionWithBooks = Omit<BookCollectionWithBooks, "id" | "createdAt" | "updatedAt">

export const BookWithSearchPropertiesInclude = {
    subjects: true,
    location: true,
    language: true,
    image: true
} as const
export type BookWithSearchProperties = Prisma.BookGetPayload<{
    include: typeof BookWithSearchPropertiesInclude
}>

export const DisplayBookInclude = {
    authors: true,
    publishers: true,
    subjects: true,
    publish_date: true,
    location: true,
    language: true,
    image: true
} as const
export type DisplayBook = Prisma.BookGetPayload<{
    include: typeof DisplayBookInclude
}>

