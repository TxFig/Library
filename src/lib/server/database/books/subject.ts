import type { Prisma, Subject } from "@prisma/client";
import { prisma } from "..";


export function getAllSubjects(): Promise<Subject[]> {
    return prisma.subject.findMany()
}

export async function getPublisherWithBooksByName(value: string, bookInclude: Prisma.BookInclude = {}) {
    return prisma.subject.findUnique({
        where: { value },
        include: {
            books: {
                include: bookInclude
            }
        }
    })
}


export default {
    getAllSubjects,
    getPublisherWithBooksByName
}
