import type { Prisma, Subject } from "@prisma/client";
import prisma from "$lib/server/database/prisma"
import applyTransformSpec, { type ApplyTransformSpec } from "$lib/utils/transform-object";
import { subjectTransform } from "$lib/transforms";


export function getAll<T extends Prisma.SubjectFindManyArgs>(
    ...args: Parameters<typeof prisma.subject.findMany<T>>
) {
    return prisma.subject.findMany(...args)
}

export function getUnique<T extends Prisma.SubjectFindUniqueArgs>(
    ...args: Parameters<typeof prisma.subject.findUnique<T>>
) {
    return prisma.subject.findUnique(...args)
}

export async function deleteFn(bookPublicId: string, subject: string) {
    await prisma.subject.delete({
        where: {
            books: {
                some: {
                    publicId: bookPublicId
                }
            },
            value: subject
        }
    })
}

export async function getAllTransformed() {
    return applyTransformSpec(
        await getAll(),
        { $: subjectTransform }
    )
}
export type SubjectTransformed = ApplyTransformSpec<Subject, { $: typeof subjectTransform }>

export default {
    getAll,
    getAllTransformed,
    delete: deleteFn,
}
