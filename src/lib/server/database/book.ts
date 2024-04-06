import type { Book, Location, Language, Author, Publisher, Subject, PublishDate } from "@prisma/client"
import { prisma } from "."
import type { BookCreateData, BookUpdateData } from "$lib/validation/book-form"
import { deleteImagesFolder } from "$lib/utils/images"


export async function createBook({ publish_date, location, language, authors, publishers, subjects, ...book }: BookCreateData): Promise<void> {
    await prisma.book.create({
        data: {
            ...book,
            publish_date: publish_date ? {
                create: {
                    ...publish_date
                }
            } : undefined,
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
            authors: authors ? {
                connectOrCreate: authors.map(author => ({
                    where: { name: author },
                    create: { name: author }
                }))
            } : undefined,
            publishers: publishers ? {
                connectOrCreate: publishers.map(publisher => ({
                    where: { name: publisher },
                    create: { name: publisher }
                }))
            } : undefined,
            subjects: subjects ? {
                connectOrCreate: subjects.map(subject => ({
                    where: { value: subject },
                    create: { value: subject }
                }))
            } : undefined
        },
        include: {
            publish_date: Boolean(publish_date),
            location: Boolean(location),
            language: Boolean(language),
            authors: Boolean(authors),
            publishers: Boolean(publishers),
            subjects: Boolean(subjects)
        }
    })
}

export async function updateBook({ publish_date, location, language, authors, publishers, subjects, ...book }: BookUpdateData): Promise<Book> {
    return await prisma.book.update({
        where: { isbn: book.isbn },
        data: {
            ...book,
            publish_date: publish_date ? {
                create: {
                    ...publish_date
                }
            } : undefined,
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
            authors: authors ? {
                connectOrCreate: authors.map(author => ({
                    where: { name: author },
                    create: { name: author }
                }))
            } : undefined,
            publishers: publishers ? {
                connectOrCreate: publishers.map(publisher => ({
                    where: { name: publisher },
                    create: { name: publisher }
                }))
            } : undefined,
            subjects: subjects ? {
                connectOrCreate: subjects.map(subject => ({
                    where: { value: subject },
                    create: { value: subject }
                }))
            } : undefined
        },
        include: {
            publish_date: Boolean(publish_date),
            location: Boolean(location),
            language: Boolean(language),
            authors: Boolean(authors),
            publishers: Boolean(publishers),
            subjects: Boolean(subjects)
        }
    })
}

export async function deleteBook(isbn: bigint): Promise<void> {
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

    if (book.front_image || book.back_image) {
        deleteImagesFolder(book.isbn)
    }
}


export async function doesBookExist(isbn: bigint): Promise<boolean> {
    const book = await prisma.book.findUnique({
        where: { isbn }
    })
    return Boolean(book)
}


export type EntireBook = Book & {
    publish_date: PublishDate | null
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
            publish_date: true,
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
