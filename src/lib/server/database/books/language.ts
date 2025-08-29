import type { Language, Prisma } from "@prisma/client";
import prisma from "$lib/server/database/prisma"
import applyTransformSpec, { type ApplyTransformSpec } from "$lib/utils/transform-object";
import { languageTransform } from "$lib/transforms";


export function getAll<T extends Prisma.LanguageFindManyArgs>(
    ...args: Parameters<typeof prisma.language.findMany<T>>
) {
    return prisma.language.findMany(...args)
}

export function getUnique<T extends Prisma.LanguageFindUniqueArgs>(
    ...args: Parameters<typeof prisma.language.findUnique<T>>
) {
    return prisma.language.findUnique(...args)
}

export async function getAllTransformed() {
    return applyTransformSpec(
        await getAll(),
        { $: languageTransform }
    )
}
export type LanguageTransformed = ApplyTransformSpec<Language, { $: typeof languageTransform }>

export default {
    getAll,
    getAllTransformed,
}
