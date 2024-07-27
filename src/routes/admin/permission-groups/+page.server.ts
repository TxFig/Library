import type { PageServerLoad } from "./$types";
import db from "$lib/server/database/";


export const load: PageServerLoad = async () => ({
    allPermissionGroups: await db.auth.permissionGroup.getAllPermissionGroupsWithPermissions(),
    allPermissions: await db.auth.permission.getAllPermissions()
})
