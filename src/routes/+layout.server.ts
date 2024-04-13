import db from "$lib/server/database/";
import { validate } from "uuid";
import type { LayoutServerLoad } from "./$types";


export const load: LayoutServerLoad = async ({ cookies }) => {
    const sessionToken = cookies.get("sessionToken")

    if (sessionToken && validate(sessionToken)) {
        const user = await db.auth.getUserBySessionToken(sessionToken)
        return { user }
    }

    return { user: null }
}
