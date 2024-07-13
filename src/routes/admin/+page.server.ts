import { validate } from "uuid";
import type { PageServerLoad } from "./$types";
import db from "$lib/server/database/";
import { env } from "$env/dynamic/private";


export const load: PageServerLoad = async ({ cookies }) => {
    const sessionToken = cookies.get(env.SESSION_COOKIE_NAME)
    const loggedIn = Boolean(sessionToken && validate(sessionToken))

    const allPermissionGroups = await db.auth.permissionGroup.getAllPermissionGroupsAndAssociatedPermissions()
    const allPermissions = await db.auth.permission.getAllPermissions()
    const entireActivityLog = await db.activityLog.getEntireActivityLog()

    return {
        users: loggedIn ? await db.auth.user.getAllUsers() : [],
        allPermissionGroups,
        allPermissions,
        entireActivityLog
    }
}
