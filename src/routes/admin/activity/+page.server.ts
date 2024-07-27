import type { PageServerLoad } from "./$types"
import db from "$lib/server/database/";


export const load: PageServerLoad = async () => ({
    entireActivityLog: await db.activityLog.getEntireActivityLog()
})
