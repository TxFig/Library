import type { Author, Prisma } from "@prisma/client"
import { prisma } from ".."


export function getAllAuthors(): Promise<Author[]> {
    return prisma.author.findMany()
}

export async function getAuthorWithBooksByName(name: string, bookInclude: Prisma.BookInclude = {}) {
    return prisma.author.findUnique({
        where: { name },
        include: {
            books: {
                include: bookInclude
            }
        }
    })
}


export default {
    getAllAuthors,
    getAuthorWithBooksByName
}
