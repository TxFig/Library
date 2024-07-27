import type { Book, BookCollection } from "@prisma/client";
import { prisma } from "..";


export async function isNameAvailable(name: string, ownerId: number): Promise<boolean> {
    const count = await prisma.bookCollection.count({
        where: {
            name,
            ownerId
        }
    })
    return count === 0
}

export async function doesUserOwnCollection(id: number, ownerId: number): Promise<boolean> {
    return await prisma.bookCollection.findUnique({
        where: {
            id,
            ownerId
        }
    }) !== null
}

export type BookCollectionWithBooks = BookCollection & {
    books: Book[]
}
export async function createCollection(name: string, ownerId: number): Promise<BookCollectionWithBooks> {
    const collection = await prisma.bookCollection.create({
        data: {
            name, ownerId
        }
    })

    return {
        ...collection,
        books: []
    }
}

export async function deleteCollection(id: number, ownerId: number): Promise<void> {
    await prisma.bookCollection.delete({
        where: {
            id,
            ownerId
        }
    })
}

export async function updateCollection(id: number, ownerId: number, name: string): Promise<BookCollectionWithBooks> {
    return await prisma.bookCollection.update({
        where: {
            id,
            ownerId
        },
        data: {
            name
        },
        include: {
            books: true
        }
    })
}

export async function addBookToCollection(id: number, isbn: string): Promise<void> {
    await prisma.bookCollection.update({
        where: {
            id
        },
        data: {
            books: {
                connect: {
                    isbn
                }
            }
        }
    })
}

export async function getCollectionByName(name: string): Promise<BookCollectionWithBooks | null> {
    return await prisma.bookCollection.findFirst({
        where: {
            name
        },
        include: {
            books: true
        }
    })
}

export async function doesCollectionHaveBook(id: number, isbn: string): Promise<boolean> {
    return await prisma.bookCollection.findFirst({
        where: {
            id,
            books: {
                some: {
                    isbn
                }
            }
        }
    }) !== null
}

export default {
    isNameAvailable,
    doesUserOwnCollection,
    createCollection,
    deleteCollection,
    updateCollection,
    addBookToCollection,
    getCollectionByName,
    doesCollectionHaveBook
}
