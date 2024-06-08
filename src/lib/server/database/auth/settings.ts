import type { SettingsUpdateData } from "$lib/validation/auth/settings";
import type { UserSettings } from "@prisma/client";
import { prisma } from "..";


export async function updateUserSettings(userId: number, data: SettingsUpdateData): Promise<UserSettings> {
    return await prisma.userSettings.upsert({
        where: { userId },
        update: {
            visibleReadingState: data.visibleReadingState
        },
        create: {
            userId,
            visibleReadingState: data.visibleReadingState
        }
    })
}


export default {
    updateUserSettings
}
