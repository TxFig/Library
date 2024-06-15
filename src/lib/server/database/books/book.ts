import type { Book, Location, Language, Author, Publisher, Subject, PublishDate, User, UserBookReadingState } from "@prisma/client"
import { prisma } from ".."
import type { BookCreateData, BookUpdateData } from "$lib/validation/book-form"
import { deleteImagesFolder } from "$lib/utils/images"


export type EntireBook = Book & {
    publish_date: PublishDate | null
    authors: Author[]
    publishers: Publisher[]
    subjects: Subject[]
    location: Location | null
    language: Language | null
    userBookReadingState: UserBookReadingState[]
    owner: User | null
}

export const EntireBookInclude = {
    publish_date: true,
    authors: true,
    publishers: true,
    subjects: true,
    location: true,
    language: true,
    userBookReadingState: true,
    owner: true
}


export async function createBook({ publish_date, location, language, authors, publishers, subjects, ...book }: BookCreateData): Promise<EntireBook> {
    return await prisma.book.create({
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
        include: EntireBookInclude
    })
}

export async function updateBook({ publish_date, location, language, authors, publishers, subjects, ...book }: BookUpdateData): Promise<EntireBook> {
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
        include: EntireBookInclude
    })
}

export async function deleteBook(isbn: string): Promise<void> {
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


export async function doesBookExist(isbn: string): Promise<boolean> {
    const book = await prisma.book.findUnique({
        where: { isbn }
    })
    return Boolean(book)
}


export async function getEntireBookByISBN(isbn: string): Promise<EntireBook | null> {
    return await prisma.book.findUnique({
        where: { isbn },
        include: EntireBookInclude
    })
}

export async function getAllBooks(): Promise<EntireBook[]> {
    return await prisma.book.findMany({
        include: EntireBookInclude
    })
}


export default {
    createBook,
    updateBook,
    deleteBook,

    doesBookExist,
    getEntireBookByISBN,
    getAllBooks
}
