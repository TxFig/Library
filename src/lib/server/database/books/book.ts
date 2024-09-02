import {
    type Book, type Location, type Language, type Author, type Publisher, type Subject, type PublishDate,
    type User, type UserBookReadingState, type Image,
    PrismaClient
} from "@prisma/client"
import { prisma } from ".."
import type { BookCreateFormData, BookUpdateFormData } from "$lib/validation/book/book-form"
import { deleteImagesFolder, generateResizedImages } from "$lib/utils/images"
import type { ReplaceFields } from "$lib/utils/types"
import { createBookImage, deleteBookImage, updateBookImage, type BookImageInput } from "./image"


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
        await createBookImage(returnBook.id, image)
    }

    return returnBook
}

async function deleteBooklessFields() {
    await prisma.author.deleteMany({
        where: {
            books: {
                none: {
                    isbn: undefined
                }
            }
        }
    })
    await prisma.publisher.deleteMany({
        where: {
            books: {
                none: {
                    isbn: undefined
                }
            }
        }
    })
    await prisma.subject.deleteMany({
        where: {
            books: {
                none: {
                    isbn: undefined
                }
            }
        }
    })
    await prisma.location.deleteMany({
        where: {
            books: {
                none: {
                    isbn: undefined
                }
            }
        }
    })
    await prisma.language.deleteMany({
        where: {
            books: {
                none: {
                    isbn: undefined
                }
            }
        }
    })
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
                upsert: {
                    create: publish_date,
                    update: publish_date
                }
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
                set: [],
                connectOrCreate: authors.map(author => ({
                    where: author,
                    create: author
                }))
            },
            publishers: {
                set: [],
                connectOrCreate: publishers.map(publisher => ({
                    where: publisher,
                    create: publisher
                }))
            },
            subjects: {
                set: [],
                connectOrCreate: subjects.map(subject => ({
                    where: subject,
                    create: subject
                }))
            }
        },
        include: EntireBookInclude
    })

    deleteBooklessFields()
    updateBookImage(returnBook.id, image)

    return returnBook
}

export async function deleteBook(isbn: string): Promise<void> {
    const book = await prisma.book.findUnique({
        where: { isbn },
        include: {
            image: true
        }
    })
    if (!book) return

    // Delete book row
    await prisma.book.delete({ where: { isbn } })

    deleteBooklessFields()

    if (book.image.length > 0) {
        deleteImagesFolder(book.isbn)
        await deleteBookImage(book.id)
    }
}


export async function doesBookExist(isbn: string): Promise<boolean> {
    const count = await prisma.book.count({
        where: { isbn }
    })
    return count !== 0
}

export async function getBookByISBN(isbn: string): Promise<Book | null> {
    return await prisma.book.findUnique({
        where: { isbn },
    })
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
    getBookByISBN,
    getEntireBookByISBN,
    getAllBooks
}
