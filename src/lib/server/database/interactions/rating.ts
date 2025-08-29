import prisma from "$lib/server/database/prisma"


export async function update(editionPublicId: string, userId: number, rating: number) {
    const edition = await prisma.bookEdition.findUniqueOrThrow({
        where: { publicId: editionPublicId },
        select: { id: true }
    })

    await prisma.userBookRating.upsert({
        where: {
            userId_editionId: {
                userId,
                editionId: edition.id
            }
        },
        create: {
            rating,
            userId,
            editionId: edition.id
        },
        update: {
            rating
        }
    })
}


export default {
    update
}
