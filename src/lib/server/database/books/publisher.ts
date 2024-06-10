import type { Book, Publisher } from "@prisma/client"
import { prisma } from ".."


export function getAllPublishers(): Promise<Publisher[]> {
    return prisma.publisher.findMany()
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
    getAllPublishers,
    getPublisherWithBooksByName
}
