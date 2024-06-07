import type { EntireUser } from "$lib/server/database/auth/user"


export function isUserAdmin(user: EntireUser): boolean {
    return user.permissionGroup.permissions.some(p => p.name == "Admin")
}


export default {
    isUserAdmin
}
