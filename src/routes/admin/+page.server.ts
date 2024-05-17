import { validate } from "uuid";
import type { PageServerLoad } from "./$types";
import db from "$lib/server/database/";


export const load: PageServerLoad = async ({ cookies }) => {
    const sessionToken = cookies.get("sessionToken")
    const loggedIn = Boolean(sessionToken && validate(sessionToken))

    return {
        users: loggedIn ? await db.auth.getAllUsersWithPermissionGroup() : []
    }
}
