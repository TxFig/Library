import type { Author, Prisma } from "@prisma/client"
import prisma from "$lib/server/database/prisma"
import applyTransformSpec, { type ApplyTransformSpec } from "$lib/utils/transform-object"
import { authorTransform } from "$lib/transforms"


export function getAll<T extends Prisma.AuthorFindManyArgs>(
    ...args: Parameters<typeof prisma.author.findMany<T>>
) {
    return prisma.author.findMany(...args)
}

export function getUnique<T extends Prisma.AuthorFindUniqueArgs>(
    ...args: Parameters<typeof prisma.author.findUnique<T>>
) {
    return prisma.author.findUnique(...args)
}

/**
 * @deprecated (use getUnique + transforms)
 */
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

export function createManyInBook(publicId: string, authors: string[]) {
    return prisma.book.update({
        where: { publicId },
        data: {
            authors: {
                connectOrCreate: authors.map(author => ({
                    where: { name: author },
                    create: { name: author }
                }))
            }
        }
    })
}

export function clearBookAuthors(publicId: string) {
    return prisma.book.update({
        where: { publicId },
        data: {
            authors: {
                set: []
            }
        }
    })
}


export async function getAllTransformed() {
    return applyTransformSpec(
        await getAll(),
        { $: authorTransform }
    )
}
export type AuthorTransformed = ApplyTransformSpec<Author, { $: typeof authorTransform }>

export default {
    getAll,
    getAllTransformed,
    getAuthorWithBooksByName,
    createManyInBook,
    clearBookAuthors
}
