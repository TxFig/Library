import type { EntireUser } from "$lib/server/database/auth/user"


export type PermissionName = "Create Book" | "Edit Book" | "Delete Book" | "Borrow Book" | "View Book" | "Admin"
export function hasPermission(user: EntireUser, permissionName: PermissionName): boolean {
    return user.permissionGroup.permissions.some(p => p.name == permissionName)
}

export default {
    hasPermission
}
