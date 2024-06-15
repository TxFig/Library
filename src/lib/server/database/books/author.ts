import type { Author, Book } from "@prisma/client"
import { prisma } from ".."


export function getAllAuthors(): Promise<Author[]> {
    return prisma.author.findMany()
}

type AuthorWithBooks = Author & {
    books: Book[]
}
export async function getAuthorWithBooksByName(name: string): Promise<AuthorWithBooks | null> {
    return prisma.author.findUnique({
        where: { name },
        include: {
            books: true
        }
    })
}


export default {
    getAllAuthors,
    getAuthorWithBooksByName
}
