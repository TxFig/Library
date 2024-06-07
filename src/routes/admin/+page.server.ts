import { validate } from "uuid";
import type { PageServerLoad } from "./$types";
import db from "$lib/server/database/";


export const load: PageServerLoad = async ({ cookies }) => {
    const sessionToken = cookies.get("sessionToken")
    const loggedIn = Boolean(sessionToken && validate(sessionToken))

    const allPermissionGroups = await db.auth.permissionGroup.getAllPermissionGroups()
    const allPermissions = await db.auth.permission.getAllPermissions()

    return {
        users: loggedIn ? await db.auth.user.getAllUsers() : [],
        allPermissionGroups,
        allPermissions
    }
}
