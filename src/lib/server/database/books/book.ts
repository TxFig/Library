import { deleteImagesFolder, generateResizedImages } from "$lib/utils/images"
// import type { ReplaceFields } from "$lib/utils/types"
import type { BookCreateSchemaOutput } from "$lib/validation/book/book"
import type {
    Author,
    Book,
    Language,
    Location,
    PublishDate,
    Publisher, Subject,
    Prisma
} from "@prisma/client"
import { prisma } from ".."
import { createBookImage, deleteBookImage, updateBookImage, type BookImageInput } from "./image"
import generatePublicId from "$lib/utils/publicId"


// type BookCreateDatabaseData = {
//     book: Omit<Book, "id" | "ownerId" | "locationId" | "languageId" | "publicId">
//     publish_date: Omit<PublishDate, "id" | "bookId"> | null,
//     location: Omit<Location, "id"> | null,
//     language: Omit<Language, "id"> | null,
//     authors: Omit<Author, "id">[],
//     publishers: Omit<Publisher, "id">[],
//     subjects: Omit<Subject, "id">[],
//     image: BookImageInput[],
//     // owner: Omit<User, "id"> | null
// }

// type BookUpdateDatabaseData = ReplaceFields<BookCreateDatabaseData, {
//     book: ReplaceFields<BookCreateDatabaseData["book"], {
//         title: string | undefined
//     }>
// }>

// async function BookCreateFormDataToDatabaseData(book: BookCreateFormData): Promise<BookCreateDatabaseData> {
//     const imageSizes = book.image ?
//         await generateResizedImages(book.isbn!, book.image)
//     : []

//     return {
//         book: {
//             isbn: book.isbn,
//             title: book.title,
//             subtitle: book.subtitle ?? null,
//             number_of_pages: book.number_of_pages ?? null,
//             isbn10: book.isbn10 ?? null,
//             isbn13: book.isbn13 ?? null,
//         },
//         publish_date: book.publish_date ? {
//             year: book.publish_date.year,
//             month: book.publish_date.month ?? null,
//             day: book.publish_date.day ?? null
//         } : null,
//         location: book.location ? { value: book.location } : null,
//         language: book.language ? { value: book.language } : null,
//         authors: book.authors.map(author => ({ name: author })),
//         publishers: book.publishers.map(publisher => ({ name: publisher })),
//         subjects: book.subjects.map(subject => ({ value: subject })),
//         image: imageSizes
//     }
// }

// export async function createBook(data: BookCreateFormData): Promise<Book> {
//     // const data = await BookCreateFormDataToDatabaseData(formData)
//     // const { book, publish_date, location, language, authors, publishers, subjects, image } = data
//     const publicId = generatePublicId()

//     const returnBook = await prisma.book.create({
//         data: {
//             ...book,
//             publicId,
//             publish_date: publish_date ? {
//                 create: publish_date
//             } : undefined,
//             location: location ? {
//                 connectOrCreate: {
//                     where: location,
//                     create: location
//                 }
//             } : undefined,
//             language: language ? {
//                 connectOrCreate: {
//                     where: language,
//                     create: language
//                 }
//             } : undefined,
//             authors: {
//                 connectOrCreate: authors.map(author => ({
//                     where: author,
//                     create: author
//                 }))
//             },
//             publishers: {
//                 connectOrCreate: publishers.map(publisher => ({
//                     where: publisher,
//                     create: publisher
//                 }))
//             },
//             subjects: {
//                 connectOrCreate: subjects.map(subject => ({
//                     where: subject,
//                     create: subject
//                 }))
//             }
//         }
//     })

//     if (image.length > 0) {
//         await createBookImage(returnBook.id, image)
//     }

//     return returnBook
// }
async function BookCreateSchemaToDatabaseData(data: BookCreateSchemaOutput): Promise<Prisma.BookCreateInput> {
    const bookPublicId = generatePublicId()
    const editionPublicId = generatePublicId()
    const images = data.edition.image ?
        await generateResizedImages(bookPublicId, editionPublicId, data.edition.image)
    : undefined
    return {
        publicId: bookPublicId,

        authors: {
            connectOrCreate: data.book.authors.map(author => ({
                where: {
                    name: author
                },
                create: {
                    name: author
                }
            }))
        },
        subjects: {
            connectOrCreate: data.book.subjects.map(subject => ({
                where: {
                    value: subject
                },
                create: {
                    value: subject
                }
            }))
        },
        editions: {
            create: {
                publicId: editionPublicId,
                title: data.edition.title,
                publishDate: {
                    create: data.edition.publishDate
                },
                language: {
                    connectOrCreate: {
                        where: {
                            value: data.edition.language
                        },
                        create: {
                            value: data.edition.language
                        }
                    }
                },
                isbn10: data.edition.isbn && data.edition.isbn.length === 10 ? data.edition.isbn : undefined,
                isbn13: data.edition.isbn && data.edition.isbn.length === 13 ? data.edition.isbn : undefined,
                subtitle: data.edition.subtitle,
                numberOfPages: data.edition.numberOfPages,
                image: {
                    create: images
                },
                authors: {
                    connectOrCreate: data.edition.authors.map(author => ({
                        where: {
                            name: author
                        },
                        create: {
                            name: author
                        }
                    }))
                },
                publishers: {
                    connectOrCreate: data.edition.publishers.map(publisher => ({
                        where: {
                            name: publisher
                        },
                        create: {
                            name: publisher
                        }
                    }))
                },
                copies: data.copy ? {
                    create: {
                        location: {
                            connectOrCreate: {
                                where: {
                                    value: data.copy.location
                                },
                                create: {
                                    value: data.copy.location
                                }
                            }
                        }
                    }
                } : undefined
            }
        }
    }
}

export async function create(data: BookCreateSchemaOutput): Promise<Book> {
    return await prisma.book.create({
        data: await BookCreateSchemaToDatabaseData(data)
    })
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


export async function updateBook(data: BookUpdateFormData): Promise<Book> {
    // const data: BookUpdateDatabaseData = await BookCreateFormDataToDatabaseData({
    //     ...formData,
    //     title: formData.title ?? ""
    // })
    // data.book.title ||= undefined

    // const { book, publish_date, location, language, authors, publishers, subjects, image } = data

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
        }
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

    await prisma.book.delete({ where: { isbn } })

    deleteBooklessFields()

    if (book.image.length > 0) {
        deleteImagesFolder(book.isbn)
        await deleteBookImage(book.id)
    }
}

export function getUniqueBook<T extends Prisma.BookFindUniqueArgs>(
    args: Parameters<typeof prisma.book.findUnique<T>>[0]
) {
    return prisma.book.findUnique<T>(args)
}

export function getBooks<T extends Prisma.BookFindManyArgs>(
    args?: Parameters<typeof prisma.book.findMany<T>>[0]
) {
    return prisma.book.findMany<T>(args)
}

export async function doesBookExist(where: Prisma.BookWhereUniqueInput): Promise<boolean> {
    const count = await prisma.book.count({
        where
    })
    return count !== 0
}

export default {
    create,
    updateBook,
    deleteBook,

    doesBookExist,
    getUniqueBook,
    getBooks
}
