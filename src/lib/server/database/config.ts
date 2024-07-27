import type { AppSettings } from "@prisma/client"
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

export async function getSettings() {
    const settings = await prisma.appSettings.findFirst({
        where: { id: 1 }
    })
    if (!settings) {
        throw new Error("Config not found")
    }
    return settings
}

export async function setSettings(settings: Omit<AppSettings, "id">) {
    await prisma.appSettings.update({
        where: { id: 1 },
        data: settings
    })
}


export default {
    getInitialSetup,
    setInitialSetup,
    getSettings,
    setSettings
}
