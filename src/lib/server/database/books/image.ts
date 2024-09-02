import type { Image } from "@prisma/client";
import { prisma } from "..";

export type BookImageInput = Omit<Image, "id" | "bookId" | "createdAt">


export async function createBookImage(bookId: number, image: BookImageInput[]): Promise<void> {
    await prisma.image.createMany({
        data: image.map(img => ({
            bookId,
            ...img
        }))
    })
}

export async function updateBookImage(bookId: number, image: BookImageInput[]): Promise<void> {
    await prisma.image.deleteMany({
        where: {
            bookId
        }
    })
    if (image.length > 0) {
        await createBookImage(bookId, image)
    }
}

export async function deleteBookImage(bookId: number): Promise<void> {
    await prisma.image.deleteMany({
        where: {
            bookId
        }
    })
}

export default {
    createBookImage,
    updateBookImage,
    deleteBookImage
}
