import { deleteImagesFolder, generateResizedImages } from "$lib/utils/images"
import type { BookSchemaOutput } from "$lib/validation/book"
import type { Prisma } from "@prisma/client"
import prisma from "$lib/server/database/prisma"
import generatePublicId from "$lib/server/database/publicId"
import { BookCreate } from "$lib/types"
import { deleteEditionLessFields, schemaToBookEditionCreateInput } from "./edition"


async function schemaToBookCreateInput(data: BookSchemaOutput): Promise<Prisma.BookCreateInput> {
    const bookPublicId = generatePublicId()
    const editionsPublicIds = data.editions.map(() => generatePublicId())
    const images = data.editions.map(async (edition, index) => {
        if (!edition.image) return

        return await generateResizedImages(bookPublicId, editionsPublicIds[index], edition.image)
    })
    const resolvedImages = (await Promise.allSettled(images)).map(result => {
        if (result.status === "rejected") return
        return result.value
    })

    return {
        publicId: bookPublicId,
        authors: {
            connectOrCreate: data.authors.map(author => ({
                where: { name: author },
                create: { name: author }
            }))
        },
        subjects: {
            connectOrCreate: data.subjects.map(subject => ({
                where: { value: subject },
                create: { value: subject }
            }))
        },
        editions: {
            create: data.editions.map((edition, index) =>
                schemaToBookEditionCreateInput(edition, editionsPublicIds[index], resolvedImages[index])
            )
        }
    }
}

export async function create(data: BookSchemaOutput): Promise<BookCreate.Raw> {
    return await prisma.book.create({
        data: await schemaToBookCreateInput(data),
        include: BookCreate.include
    })
}

// export async function update(data: BookUpdateFormData): Promise<Book> {
    // const data: BookUpdateDatabaseData = await BookCreateFormDataToDatabaseData({
    //     ...formData,
    //     title: formData.title ?? ""
    // })
    // data.book.title ||= undefined

    // const { book, publish_date, location, language, authors, publishers, subjects, image } = data

    // const returnBook = await prisma.book.update({
    //     where: { isbn: book.isbn },
    //     data: {
    //         ...book,
    //         publish_date: publish_date ? {
    //             upsert: {
    //                 create: publish_date,
    //                 update: publish_date
    //             }
    //         } : undefined,
    //         location: location ? {
    //             connectOrCreate: {
    //                 where: location,
    //                 create: location
    //             }
    //         } : undefined,
    //         language: language ? {
    //             connectOrCreate: {
    //                 where: language,
    //                 create: language
    //             }
    //         } : undefined,
    //         authors: {
    //             set: [],
    //             connectOrCreate: authors.map(author => ({
    //                 where: author,
    //                 create: author
    //             }))
    //         },
    //         publishers: {
    //             set: [],
    //             connectOrCreate: publishers.map(publisher => ({
    //                 where: publisher,
    //                 create: publisher
    //             }))
    //         },
    //         subjects: {
    //             set: [],
    //             connectOrCreate: subjects.map(subject => ({
    //                 where: subject,
    //                 create: subject
    //             }))
    //         }
    //     }
    // })

//     deleteBooklessFields()
//     updateBookImage(returnBook.id, image)

//     return returnBook
// }

export async function deleteFn(publicId: string): Promise<void> {
    const book = await prisma.book.findUniqueOrThrow({
        where: { publicId },
        include: {
            editions: {
                include: {
                    image: true
                }
            }
        }
    })

    await prisma.book.delete({
        where: { publicId }
    })

    deleteEditionLessFields()

    for (const edition of book.editions) {
        if (edition.image.length === 0) continue
        deleteImagesFolder(book.publicId, edition.publicId)
    }
}

export function getUnique<T extends Prisma.BookFindUniqueArgs>(
    ...args: Parameters<typeof prisma.book.findUnique<T>>
) {
    return prisma.book.findUnique(...args)
}

export function getAll<T extends Prisma.BookFindManyArgs>(
    ...args: Parameters<typeof prisma.book.findMany<T>>
) {
    return prisma.book.findMany(...args)
}

export async function getCount<T extends Prisma.BookCountArgs>(
    ...args: Parameters<typeof prisma.book.count<T>>
) {
    return prisma.book.count(...args)
}

export default {
    create,
    // update,
    delete: deleteFn,

    getAll,
    getUnique,
    getCount
}
