import { PrismaClient } from "@prisma/client";


export default async function(prisma: PrismaClient) {
    const books = await prisma.book.findMany({
        include: {
            publish_date: true,
            image: true,
            publishers: true,
            userBookReadingState: true,
            bookCollections: true,
            userBookRating: true
        }
    })

    for (const book of books) {
        await prisma.bookEdition.create({
            data: {
                book: {
                    connect: {
                        id: book.id
                    }
                },
                title: book.title,
                subtitle: book.subtitle,
                numberOfPages: book.number_of_pages,
                publishDate: book.publish_date ? {
                    connect: {
                        id: book.publish_date.id
                    }
                } : undefined,
                isbn10: book.isbn.length === 10 ? book.isbn : book.isbn10,
                isbn13: book.isbn.length === 13 ? book.isbn : book.isbn13,
                image: {
                    connect: book.image.map(image => ({
                        id: image.id
                    }))
                },
                language: book.languageId ? {
                    connect: {
                        id: book.languageId
                    }
                } : undefined,
                publishers: {
                    connect: book.publishers.map(publisher => ({
                        id: publisher.id
                    }))
                },
                readingState: {
                    connect: book.userBookReadingState.map(readingState => ({
                        userId_bookId: {
                            bookId: readingState.bookId,
                            userId: readingState.userId
                        }
                    }))
                },
                collections: {
                    connect: book.bookCollections.map(collection => ({
                        id: collection.id
                    }))
                },
                ratings: {
                    connect: book.userBookRating.map(rating => ({
                        userId_bookId: {
                            bookId: rating.bookId,
                            userId: rating.userId
                        }
                    }))
                },
                copies: book.locationId ? {
                    create: {
                        location: {
                            connect: {
                                id: book.locationId
                            }
                        }
                    }
                }: undefined
            }
        })
    }
}
