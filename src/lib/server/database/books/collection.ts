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

export async function updateCollection(id: number, ownerId: number, name: string): Promise<void> {
    await prisma.bookCollection.update({
        where: {
            id,
            ownerId
        },
        data: {
            name
        }
    })
}


export default {
    createCollection,
    isNameAvailable,
    deleteCollection,
    updateCollection
}
