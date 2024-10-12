import { prisma } from ".."
import type { Prisma } from "@prisma/client"


export function getUniqueEdition<T extends Prisma.BookEditionFindUniqueArgs>(
    args: Parameters<typeof prisma.bookEdition.findUnique<T>>[0]
) {
    return prisma.bookEdition.findUnique<T>(args)
}

export function getEditions<T extends Prisma.BookEditionFindManyArgs>(
    args?: Parameters<typeof prisma.bookEdition.findMany<T>>[0]
) {
    return prisma.bookEdition.findMany<T>(args)
}


export default {
    getUniqueEdition,
    getEditions
}
