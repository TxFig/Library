import { prisma } from "."


export async function getInitialSetup() {
    const config = await prisma.appConfig.findFirst({
        where: { id: 1 }
    })

    if (!config) {
        throw new Error("Config not found")
    }

    return config.initialSetup
}

export async function setInitialSetup(initialSetup: boolean) {
    await prisma.appConfig.update({
        where: { id: 1 },
        data: { initialSetup }
    })
}


export default {
    getInitialSetup,
    setInitialSetup
}
