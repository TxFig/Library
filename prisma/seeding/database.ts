import type { PrismaClient } from "@prisma/client"


async function seedDatabase(prisma: PrismaClient) {
    const databaseInfoCount = await prisma.databaseInfo.count()
    if (databaseInfoCount > 0)
        return

    await prisma.databaseInfo.create({
        data: {
            version: "0.0.0"
        }
    })
}

export default seedDatabase
