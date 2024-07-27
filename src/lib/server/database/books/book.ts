import type {
    Book, Location, Language, Author, Publisher, Subject, PublishDate,
    User, UserBookReadingState, Image
} from "@prisma/client"
import { prisma } from ".."
import type { BookCreateFormData, BookUpdateFormData } from "$lib/validation/book/book-form"
import { deleteImagesFolder, generateResizedImages } from "$lib/utils/images"
import type { ReplaceFields } from "$lib/utils/types"
import isObjectEmpty, { isObjectNotEmpty } from "$lib/utils/is-object-empty"


export type EntireBook = Book & {
    image: Image[]
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
    image: true,
    publish_date: true,
    authors: true,
    publishers: true,
    subjects: true,
    location: true,
    language: true,
    userBookReadingState: true,
    owner: true
}

type BookCreateDatabaseData = {
    book: Omit<Book, "id" | "ownerId" | "locationId" | "languageId">
    publish_date: Omit<PublishDate, "id" | "bookId"> | null,
    location: Omit<Location, "id"> | null,
    language: Omit<Language, "id"> | null,
    authors: Omit<Author, "id">[],
    publishers: Omit<Publisher, "id">[],
    subjects: Omit<Subject, "id">[],
    image: BookImageInput[],
    // owner: Omit<User, "id"> | null
}
export type BookImageInput = Omit<Image, "id" | "bookId" | "createdAt">

type BookUpdateDatabaseData = ReplaceFields<BookCreateDatabaseData, {
    book: ReplaceFields<BookCreateDatabaseData["book"], {
        title: string | undefined
    }>
}>

async function BookCreateFormDataToDatabaseData(book: BookCreateFormData): Promise<BookCreateDatabaseData> {
    const imageSizes = book.image ?
        await generateResizedImages(book.isbn, book.image)
    : []

    return {
        book: {
            isbn: book.isbn,
            title: book.title,
            subtitle: book.subtitle ?? null,
            number_of_pages: book.number_of_pages ?? null,
            isbn10: book.isbn10 ?? null,
            isbn13: book.isbn13 ?? null,
            public: book.public
        },
        publish_date: book.publish_date ? {
            year: book.publish_date.year,
            month: book.publish_date.month ?? null,
            day: book.publish_date.day ?? null
        } : null,
        location: book.location ? { value: book.location } : null,
        language: book.language ? { value: book.language } : null,
        authors: book.authors.map(author => ({ name: author })),
        publishers: book.publishers.map(publisher => ({ name: publisher })),
        subjects: book.subjects.map(subject => ({ value: subject })),
        image: imageSizes
    }
}


export async function createBook(formData: BookCreateFormData): Promise<EntireBook> {
    const data = await BookCreateFormDataToDatabaseData(formData)
    const { book, publish_date, location, language, authors, publishers, subjects, image } = data


    const returnBook = await prisma.book.create({
        data: {
            ...book,
            publish_date: publish_date ? {
                create: publish_date
            } : undefined,
            location: location ? {
                connectOrCreate: {
                    where: location,
                    create: location
                }
            } : undefined,
            language: language ? {
                connectOrCreate: {
                    where: language,
                    create: language
                }
            } : undefined,
            authors: {
                connectOrCreate: authors.map(author => ({
                    where: author,
                    create: author
                }))
            },
            publishers: {
                connectOrCreate: publishers.map(publisher => ({
                    where: publisher,
                    create: publisher
                }))
            },
            subjects: {
                connectOrCreate: subjects.map(subject => ({
                    where: subject,
                    create: subject
                }))
            }
        },
        include: EntireBookInclude
    })

    if (image.length > 0) {
        await prisma.image.createMany({
            data: image.map(img => ({
                bookId: returnBook.id,
                ...img
            }))
        })
    }

    return returnBook
}

export async function updateBook(formData: BookUpdateFormData): Promise<EntireBook> {
    const data: BookUpdateDatabaseData = await BookCreateFormDataToDatabaseData({
        ...formData,
        title: formData.title ?? ""
    })
    data.book.title ||= undefined

    const { book, publish_date, location, language, authors, publishers, subjects, image } = data

    const returnBook = await prisma.book.update({
        where: { isbn: book.isbn },
        data: {
            ...book,
            publish_date: publish_date ? {
                update: publish_date
            } : undefined,
            location: location ? {
                connectOrCreate: {
                    where: location,
                    create: location
                }
            } : undefined,
            language: language ? {
                connectOrCreate: {
                    where: language,
                    create: language
                }
            } : undefined,
            authors:  {
                connectOrCreate: authors.map(author => ({
                    where: author,
                    create: author
                }))
            },
            publishers: {
                connectOrCreate: publishers.map(publisher => ({
                    where: publisher,
                    create: publisher
                }))
            },
            subjects: {
                connectOrCreate: subjects.map(subject => ({
                    where: subject,
                    create: subject
                }))
            }
        },
        include: EntireBookInclude
    })

    await prisma.image.deleteMany({
        where: {
            bookId: returnBook.id,
        }
    })

    if (image.length > 0) {
        await prisma.image.createMany({
            data: image.map(img => ({
                bookId: returnBook.id,
                ...img
            }))
        })
    }


    return returnBook
}

export async function deleteBook(isbn: string): Promise<void> {
    const book = await prisma.book.findUnique({
        where: { isbn },
        include: {
            authors:    { include: { books: true } },
            publishers: { include: { books: true } },
            subjects:   { include: { books: true } },
            image: true
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

    if (book.image.length > 0) {
        deleteImagesFolder(book.isbn)
    }
}


export async function doesBookExist(isbn: string): Promise<boolean> {
    const count = await prisma.book.count({
        where: { isbn }
    })
    return count !== 0
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
