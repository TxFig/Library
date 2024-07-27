import type { Prisma, Publisher } from "@prisma/client"
import { prisma } from ".."


export function getAllPublishers(): Promise<Publisher[]> {
    return prisma.publisher.findMany()
}

export async function getPublisherWithBooksByName(name: string, bookInclude: Prisma.BookInclude = {}) {
    return prisma.publisher.findUnique({
        where: { name },
        include: {
            books: {
                include: bookInclude
            }
        }
    })
}


export default {
    getAllPublishers,
    getPublisherWithBooksByName
}
