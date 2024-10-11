import type { PrismaClient } from "@prisma/client";


const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
const idLength = 8
function generateRandomId() {
    let id = ""

    for (let i = 0; i < idLength; i++) {
        const index = Math.floor(Math.random() * characters.length)
        id += characters.charAt(index)
    }

    return id
}

export default async function a(prisma: PrismaClient) {
    const editions = await prisma.bookEdition.findMany({
        where: {
            publicId: "NULL"
        }
    })

    for (const edition of editions) {
        const newId = generateRandomId()
        await prisma.bookEdition.update({
            where: {
                id: edition.id
            },
            data: {
                publicId: newId
            }
        })
    }
}
