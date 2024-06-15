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


export default {
    createCollection,
    isNameAvailable
}
