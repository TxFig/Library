import { ReadingState } from "@prisma/client"
import prisma from "$lib/server/database/prisma"


async function update(editionPublicId: string, userId: number, state: ReadingState) {
    const edition = await prisma.bookEdition.findUniqueOrThrow({
        where: { publicId: editionPublicId },
        select: { id: true }
    })

    await prisma.userBookReadingState.upsert({
        where: {
            userId_editionId: {
                userId,
                editionId: edition.id
            }
        },
        create: {
            state,
            userId,
            editionId: edition.id
        },
        update: {
            state
        }
    })
}


export default {
    update
}
