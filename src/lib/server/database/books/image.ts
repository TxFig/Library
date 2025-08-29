import type { Prisma } from "@prisma/client";
import prisma from "$lib/server/database/prisma"


export type ImageInput = Prisma.ImageCreateWithoutEditionInput
export async function createBookImage(editionId: number, image: ImageInput[]): Promise<void> {
    await prisma.image.createMany({
        data: image.map(img => ({
            editionId,
            ...img
        }))
    })
}

export async function updateBookImage(editionId: number, image: ImageInput[]): Promise<void> {
    await prisma.image.deleteMany({
        where: {
            editionId
        }
    })
    if (image.length > 0) {
        await createBookImage(editionId, image)
    }
}

export default {
    createBookImage,
    updateBookImage,
}
