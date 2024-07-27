import type { Actions, LayoutServerLoad } from "./$types"
import db from "$lib/server/database/"


export const load: LayoutServerLoad = async ({ locals }) => {
    const appSettings = await db.config.getSettings()
    return {
        ...locals,
        publicAccess: appSettings.public
    }
}
