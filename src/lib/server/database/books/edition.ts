import { EditionCreate } from "$lib/types"
import generatePublicId from "$lib/server/database/publicId"
import type { BookEditionSchemaOutput } from "$lib/validation/book"
import prisma from "$lib/server/database/prisma"
import type { Prisma } from "@prisma/client"
import type { ImageInput } from "./image"
import { generateResizedImages } from "$lib/utils/images"


export function getUnique<T extends Prisma.BookEditionFindUniqueArgs>(
    args: Parameters<typeof prisma.bookEdition.findUnique<T>>[0]
) {
    return prisma.bookEdition.findUnique<T>(args)
}

export function getAll<T extends Prisma.BookEditionFindManyArgs>(
    args?: Parameters<typeof prisma.bookEdition.findMany<T>>[0]
) {
    return prisma.bookEdition.findMany<T>(args)
}

export function schemaToBookEditionCreateInput(edition: BookEditionSchemaOutput, publicId: string, image: ImageInput[] | undefined): Prisma.BookEditionCreateWithoutBookInput
export function schemaToBookEditionCreateInput(edition: BookEditionSchemaOutput, publicId: string, image: ImageInput[] | undefined, bookPublicId: string): Prisma.BookEditionCreateInput
export function schemaToBookEditionCreateInput(edition: BookEditionSchemaOutput, publicId: string, image: ImageInput[] | undefined, bookPublicId?: string): Prisma.BookEditionCreateInput | Prisma.BookEditionCreateWithoutBookInput {
    return {
        book: bookPublicId ? {
            connect: {
                publicId: bookPublicId
            }
        } : undefined,
        publicId,
        title: edition.title,
        subtitle: edition.subtitle,
        pageCount: edition.pageCount,
        isbn10: edition.isbn10,
        isbn13: edition.isbn13,
        language: edition.language ? {
            connectOrCreate: {
                where: { value: edition.language },
                create: { value: edition.language }
            }
        } : undefined,
        authors: {
            connectOrCreate: edition.authors.map(author => ({
                where: { name: author },
                create: { name: author }
            }))
        },
        publishers: {
            connectOrCreate: edition.publishers.map(publisher => ({
                where: { name: publisher },
                create: { name: publisher }
            }))
        },
        image: image ? {
            create: image
        } : undefined,
        publishDate: edition.publishDate ? {
            create: edition.publishDate
        } : undefined,
        copies: {
            create: edition.copies.map(copy => ({
                publicId: generatePublicId(),
                location: {
                    connectOrCreate: {
                        where: { value: copy.location },
                        create: { value: copy.location }
                    }
                },
                owner: {
                    connect: { publicId: copy.ownerId }
                }
            }))
        }
    }
}

export async function create(bookPublicId: string, edition: BookEditionSchemaOutput) {
    const publicId = generatePublicId()
    let image: ImageInput[] | undefined = undefined
    if (edition.image) {
        image = await generateResizedImages(bookPublicId, publicId, edition.image)
    }

    return prisma.bookEdition.create({
        data: schemaToBookEditionCreateInput(edition, publicId, image, bookPublicId),
        include: EditionCreate.include
    })
}

export async function deleteEditionLessFields() {
    await prisma.author.deleteMany({
        where: {
            AND: [{
                books: { none: {} },
                editions: { none: {} }
            }]
        }
    })

    await prisma.publisher.deleteMany({
        where: {
            editions: { none: {} }
        }
    })

    await prisma.language.deleteMany({
        where: {
            editions: { none: {} }
        }
    })

    await prisma.location.deleteMany({
        where: {
            copies: { none: {} }
        }
    })
}

export default {
    getAll,
    getUnique,
    create
}
