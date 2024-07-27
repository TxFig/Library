import type { PageServerLoad } from "./$types"
import db from "$lib/server/database/"


export const load: PageServerLoad = async () => {
    const settings = await db.config.getSettings()

    return {
        settings
    }
}