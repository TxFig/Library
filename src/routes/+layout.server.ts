import db from "$lib/server/database/";
import type { LayoutServerLoad } from "./$types";


export const load: LayoutServerLoad = async ({ cookies }) => {
    const sessionToken = cookies.get("sessionToken")
    const user = sessionToken ? await db.auth.getUserBySessionToken(sessionToken) : null

    return { user }
}
