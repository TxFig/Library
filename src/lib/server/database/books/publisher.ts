import type { Prisma, Publisher } from "@prisma/client"
import prisma from "$lib/server/database/prisma"
import applyTransformSpec, { type ApplyTransformSpec } from "$lib/utils/transform-object"
import { publisherTransform } from "$lib/transforms"


export function getAll<T extends Prisma.PublisherFindManyArgs>(
    ...args: Parameters<typeof prisma.publisher.findMany<T>>
) {
    return prisma.publisher.findMany(...args)
}

export function getUnique<T extends Prisma.PublisherFindUniqueArgs>(
    ...args: Parameters<typeof prisma.publisher.findUnique<T>>
) {
    return prisma.publisher.findUnique(...args)
}

export async function getAllTransformed() {
    return applyTransformSpec(
        await getAll(),
        { $: publisherTransform }
    )
}
export type PublisherTransformed = ApplyTransformSpec<Publisher, { $: typeof publisherTransform }>

export default {
    getAll,
    getAllTransformed,
}
