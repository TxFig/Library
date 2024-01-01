import { saveImage, deleteImage, formatImageFilename } from "$lib/utils/images"
import type { Book, Location, Language, Author, Publisher, Subject, PublishDate } from "@prisma/client"
import { prisma } from "."

import type { Prisma } from "@prisma/client"

type A = Prisma.BookCreateInput

type InsertBook = Omit<Book, "publishDateId" | "locationId" | "languageId" | "front_image" | "back_image"> & {
    front_image: File | null
    back_image: File | null
}
export type InsertBookData = {
    book: InsertBook
    publish_date: Omit<PublishDate, "id"> | null
    location: string | null
    language: string | null
    authors: string[]
    publishers: string[]
    subjects: string[]
}

export async function createBook({ book, publish_date, location, language, authors, publishers, subjects }: InsertBookData): Promise<Error | void> {
    console.log("Creating book", book.isbn, book.title)

    let frontImageFilename: string | null = null
    if (book.front_image) {
        frontImageFilename = formatImageFilename(book.isbn, "front", book.front_image.name)
        const error = await saveImage(frontImageFilename, await book.front_image.arrayBuffer())
        if (error) return error
    }

    let backImageFilename: string | null = null
    if (book.back_image) {
        backImageFilename = formatImageFilename(book.isbn, "back", book.back_image.name)
        const error = await saveImage(backImageFilename, await book.back_image.arrayBuffer())
        if (error) return error
    }

    try {
        await prisma.book.create({
            data: {
                ...book,
                front_image: frontImageFilename,
                back_image: backImageFilename,
                location: location ? {
                    connectOrCreate: {
                        where: { value: location },
                        create: { value: location }
                    }
                } : undefined,
                language: language ? {
                    connectOrCreate: {
                        where: { value: language },
                        create: { value: language }
                    }
                } : undefined,
                authors: {
                    connectOrCreate: authors.map(author => ({
                        where: { name: author },
                        create: { name: author }
                    }))
                },
                publishers: {
                    connectOrCreate: publishers.map(publisher => ({
                        where: { name: publisher },
                        create: { name: publisher }
                    }))
                },
                subjects: {
                    connectOrCreate: subjects.map(subject => ({
                        where: { value: subject },
                        create: { value: subject }
                    }))
                }
            },
            include: {
                publish_date: Boolean(publish_date),
                location: Boolean(location),
                language: Boolean(language),
                authors: true,
                publishers: true,
                subjects: true
            }
        })
    } catch (error) {
        console.log("Error creating book")
        console.log(error)
    }
}

export async function updateBook({ book, location, language, authors, publishers, subjects }: InsertBookData): Promise<Error | void> {
    console.log("Updating book", book.isbn, book.title)

    let frontImageFilename: string | null = null
    if (book.front_image) {
        frontImageFilename = formatImageFilename(book.isbn, "front", book.front_image.name)

        const deleteError = await deleteImage(frontImageFilename)
        if (deleteError) return deleteError
        const saveError = await saveImage(frontImageFilename, await book.front_image.arrayBuffer())
        if (saveError) return deleteError
    }

    let backImageFilename: string | null = null
    if (book.back_image) {
        backImageFilename = formatImageFilename(book.isbn, "back", book.back_image.name)

        const deleteError = await deleteImage(backImageFilename)
        if (deleteError) return deleteError
        const saveError = await saveImage(backImageFilename, await book.back_image.arrayBuffer())
        if (saveError) return saveError
    }

    try {
        await prisma.book.update({
            where: { isbn: book.isbn },
            data: {
                ...book,
                front_image: frontImageFilename,
                back_image: backImageFilename,
                location: location ? {
                    connectOrCreate: {
                        where: { value: location },
                        create: { value: location }
                    }
                } : undefined,
                language: language ? {
                    connectOrCreate: {
                        where: { value: language },
                        create: { value: language }
                    }
                } : undefined,
                authors: {
                    connectOrCreate: authors.map(author => ({
                        where: { name: author },
                        create: { name: author }
                    }))
                },
                publishers: {
                    connectOrCreate: publishers.map(publisher => ({
                        where: { name: publisher },
                        create: { name: publisher }
                    }))
                },
                subjects: {
                    connectOrCreate: subjects.map(subject => ({
                        where: { value: subject },
                        create: { value: subject }
                    }))
                }
            },
            include: {
                location: Boolean(location),
                language: Boolean(language),
                authors: true,
                publishers: true,
                subjects: true
            }
        })
    } catch (error) {
        console.log("Error updating book")
        console.log(error)
    }
}

export async function deleteBook(isbn: bigint): Promise<Error | void> {
    console.log("Deleting book", isbn)

    const book = await prisma.book.findUnique({
        where: { isbn },
        include: {
            authors:    { include: { books: true } },
            publishers: { include: { books: true } },
            subjects:   { include: { books: true } },
        }
    })

    if (!book) {
        return
        // TODO: throw error
    }

    // Delete book row
    await prisma.book.delete({ where: { isbn } })

    //* --- Delete authors from this book who don't have any other books
    // Filter authors who don't have any other book besides the one being removed
    const booklessAuthors = book.authors.filter(
        author => author.books.filter(
            authorBook => authorBook.isbn != isbn
        ).length == 0
    )
    const booklessAuthorsIDs = booklessAuthors.map(author => author.id)

    // Delete all bookless authors
    await prisma.author.deleteMany({
        where: {
            id: { in: booklessAuthorsIDs }
        }
    })

    //* --- Delete publishers from this book who don't have any other books
    // Filter publishers who don't have any other book besides the one being removed
    const booklessPublishers = book.publishers.filter(
        publisher => publisher.books.filter(
            publisherBook => publisherBook.isbn != isbn
        ).length == 0
    )
    const booklessPublishersIDs = booklessPublishers.map(publisher => publisher.id)

    // Delete all bookless publishers
    await prisma.publisher.deleteMany({
        where: {
            id: { in: booklessPublishersIDs }
        }
    })

    //* --- Delete subjects from this book who don't have any other books
    // Filter subjects who don't have any other book besides the one being removed
    const booklessSubjects = book.subjects.filter(
        subject => subject.books.filter(
            subjectBook => subjectBook.isbn != isbn
        ).length == 0
    )
    const booklessSubjectsIDs = booklessSubjects.map(subject => subject.id)

    // Delete all bookless subjects
    await prisma.subject.deleteMany({
        where: {
            id: { in: booklessSubjectsIDs }
        }
    })


    if (book.front_image) {
        const error = await deleteImage(book.front_image)
        if (error) return error
    }
    if (book.back_image) {
        const error = await deleteImage(book.back_image)
        if (error) return error
    }
}


export async function doesBookExist(isbn: bigint): Promise<boolean> {
    const book = await prisma.book.findUnique({
        where: { isbn }
    })
    return Boolean(book)
}


type EntireBook = Book & {
    authors: Author[]
    publishers: Publisher[]
    subjects: Subject[]
    location: Location | null
    language: Language | null
}

export function getEntireBookByISBN(isbn: bigint): Promise<EntireBook | null> {
    return prisma.book.findUnique({
        where: { isbn },
        include: {
            authors: true,
            publishers: true,
            subjects: true,
            location: true,
            language: true
        }
    })
}

export function getAllBooks(): Promise<Book[]> {
    return prisma.book.findMany()
}

export function getAllAuthors(): Promise<Author[]> {
    return prisma.author.findMany()
}
export function getAllPublishers(): Promise<Publisher[]> {
    return prisma.publisher.findMany()
}
export function getAllSubjects(): Promise<Subject[]> {
    return prisma.subject.findMany()
}
export function getAllLocations(): Promise<Location[]> {
    return prisma.location.findMany()
}
export function getAllLanguages(): Promise<Language[]> {
    return prisma.language.findMany()
}

type AuthorWithBooks = Author & {
    books: Book[]
}
export async function getAuthorWithBooksByName(name: string): Promise<AuthorWithBooks | null> {
    return prisma.author.findUnique({
        where: { name },
        include: {
            books: true
        }
    })
}


type PublisherWithBooks = Publisher & {
    books: Book[]
}
export async function getPublisherWithBooksByName(name: string): Promise<PublisherWithBooks | null> {
    return prisma.publisher.findUnique({
        where: { name },
        include: {
            books: true
        }
    })
}

export default {
    createBook,
    updateBook,
    deleteBook,

    doesBookExist,
    getEntireBookByISBN,

    getAllBooks,
    getAllAuthors,
    getAllPublishers,
    getAllSubjects,
    getAllLocations,
    getAllLanguages,

    getAuthorWithBooksByName,
    getPublisherWithBooksByName
}
