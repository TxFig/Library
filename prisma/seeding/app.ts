import type { PrismaClient } from "@prisma/client"


async function seedAppConfig(prisma: PrismaClient) {
    const appConfigCount = await prisma.appConfig.count()
    if (appConfigCount > 0)
        return

    await prisma.appConfig.create({
        data: {
            initialSetup: false
        }
    })

    await prisma.appSettings.create({
        data: {
            public: true
        }
    })
}

export default seedAppConfig
