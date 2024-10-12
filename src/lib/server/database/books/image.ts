import type { Image } from "@prisma/client";
import { prisma } from "..";

export type BookImageInput = Omit<Image, "id" | "bookEditionId" | "createdAt">


export async function createBookImage(bookEditionId: number, image: BookImageInput[]): Promise<void> {
    await prisma.image.createMany({
        data: image.map(img => ({
            bookEditionId,
            ...img
        }))
    })
}

export async function updateBookImage(bookEditionId: number, image: BookImageInput[]): Promise<void> {
    await prisma.image.deleteMany({
        where: {
            bookEditionId
        }
    })
    if (image.length > 0) {
        await createBookImage(bookEditionId, image)
    }
}

export async function deleteBookImage(bookEditionId: number): Promise<void> {
    await prisma.image.deleteMany({
        where: {
            bookEditionId
        }
    })
}

export default {
    createBookImage,
    updateBookImage,
    deleteBookImage
}
