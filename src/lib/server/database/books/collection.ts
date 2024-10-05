import type { Book, BookCollection } from "@prisma/client";
import { prisma } from "..";
import { BookCollectionWithBooksInclude, type BookCollectionWithBooks } from "./types";



export async function isNameAvailable(name: string, ownerId: number): Promise<boolean> {
    const count = await prisma.bookCollection.count({
        where: {
            name,
            ownerId
        }
    })
    return count === 0
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
        include: BookCollectionWithBooksInclude
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
            },
            updatedAt: new Date()
        }
    })
}

export async function removeBookFromCollection(id: number, isbn: string): Promise<void> {
    await prisma.bookCollection.update({
        where: {
            id
        },
        data: {
            books: {
                disconnect: {
                    isbn
                }
            },
            updatedAt: new Date()
        }
    })
}

export async function getCollectionByName(name: string, ownerId: number): Promise<BookCollectionWithBooks | null> {
    return await prisma.bookCollection.findFirst({
        where: {
            name,
            ownerId
        },
        include: BookCollectionWithBooksInclude
    })
}

export async function getCollectionById(id: number): Promise<BookCollectionWithBooks | null> {
    return await prisma.bookCollection.findFirst({
        where: {
            id
        },
        include: BookCollectionWithBooksInclude
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
    createCollection,
    deleteCollection,
    updateCollection,
    addBookToCollection,
    removeBookFromCollection,
    getCollectionByName,
    getCollectionById,
    doesCollectionHaveBook
}
