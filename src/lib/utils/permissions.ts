import type { EntireUser } from "$lib/server/database/auth/user"


export type PermissionName = "Create Book" | "Edit Book" | "Delete Book" | "Borrow Book" | "View Book" | "Admin"
export function hasPermission(user: EntireUser, permissionName: PermissionName): boolean {
    return user.permissionGroup.permissions.some(p => p.name == permissionName)
}

export function hasPermissions(user: EntireUser, permissionNames: PermissionName[]): boolean {
    return permissionNames.every(permission => hasPermission(user, permission))
}

export default {
    hasPermission
}
