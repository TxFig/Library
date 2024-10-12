import type { Prisma } from "@prisma/client"


export const BookCollectionEditionsInclude = {
    image: true
} as const
export const BookCollectionWithBooksInclude = {
    editions: {
        include: BookCollectionEditionsInclude
    }
} as const
export type BookCollectionWithBooks = Prisma.BookCollectionGetPayload<{
    include: typeof BookCollectionWithBooksInclude
}>
export type BuiltInBookCollectionWithBooks = Omit<BookCollectionWithBooks, "id" | "createdAt" | "updatedAt">

export const BookEditionWithSearchPropertiesInclude = {
    language: true,
    image: true,
    publishers: true,
    book: {
        include: {
            authors: true,
            subjects: true
        }
    },
    copies: {
        include: {
            location: true
        }
    }
} as const
export type BookEditionWithSearchProperties = Prisma.BookEditionGetPayload<{
    include: typeof BookEditionWithSearchPropertiesInclude
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

export const DisplayBookEditionInclude = {
    authors: true,
    publishers: true,
    subjects: true,
    publish_date: true,
    location: true,
    language: true,
    image: true
} as const
export type DisplayBookEdition = Prisma.BookGetPayload<{
    include: typeof DisplayBookEditionInclude
}>
