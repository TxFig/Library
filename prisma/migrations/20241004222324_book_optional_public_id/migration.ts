import { PrismaClient } from "@prisma/client";


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

export default async function (prisma: PrismaClient) {
    const books = await prisma.book.findMany({
        where: {
            publicId: "NULL"
        }
    })

    for (const book of books) {
        const newId = generateRandomId()
        await prisma.book.update({
            where: {
                id: book.id
            },
            data: {
                publicId: newId
            }
        })
    }
}
