import type { UserWithPermissionGroupAndPermissions } from "$lib/server/database/auth/types"


export type PermissionName = "Create Book" | "Edit Book" | "Delete Book" | "Borrow Book" | "View Book" | "Admin"
export function hasPermission(user: UserWithPermissionGroupAndPermissions, permissionName: PermissionName): boolean {
    return user.permissionGroup.permissions.some(p => p.name == permissionName)
}

export function hasPermissions(user: UserWithPermissionGroupAndPermissions, permissionNames: PermissionName[]): boolean {
    return permissionNames.every(permission => hasPermission(user, permission))
}

export default {
    hasPermission
}
