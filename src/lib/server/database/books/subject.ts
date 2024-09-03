import type { Prisma, Subject } from "@prisma/client";
import { prisma } from "..";


export function getAllSubjects(): Promise<Subject[]> {
    return prisma.subject.findMany()
}

export async function getSubjectWithBooksByName(value: string, bookInclude: Prisma.BookInclude = {}) {
    return prisma.subject.findUnique({
        where: { value },
        include: {
            books: {
                include: bookInclude
            }
        }
    })
}

export async function getSubjectsByISBN(isbn: string): Promise<Subject[]> {
    return prisma.subject.findMany({
        where: {
            books: {
                some: {
                    isbn
                }
            }
        }
    })
}

export async function deleteBookSubjects(bookId: number, subjects: string[]): Promise<void> {
    if (subjects.length === 0) return
    await prisma.subject.deleteMany({
        where: {
            books: {
                some: {
                    id: bookId
                }
            },
            value: {
                in: subjects
            }
        }
    })
}


export default {
    getAllSubjects,
    getSubjectWithBooksByName,
    getSubjectsByISBN,
    deleteBookSubjects
}
