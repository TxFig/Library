import { validate } from "uuid";
import type { PageServerLoad } from "./$types";
import db from "$lib/server/database/";


export const load: PageServerLoad = async ({ cookies }) => {
    const sessionToken = cookies.get("sessionToken")
    const loggedIn = Boolean(sessionToken && validate(sessionToken))

    const allPermissionGroups = await db.auth.getAllPermissionGroups()

    return {
        users: loggedIn ? await db.auth.getAllEntireUsers() : [],
        allPermissionGroups
    }
}
