import type { Prisma } from "@prisma/client"
import type { ApplyTransformSpec } from "./transform-object"
import { permissionGroupTransform, permissionTransform } from "$lib/transforms"


type PermissionGroupRaw = Prisma.PermissionGroupGetPayload<{
    include: {
        permissions: true
    }
}>
type PermissionGroup = ApplyTransformSpec<PermissionGroupRaw, {
    $: typeof permissionGroupTransform,
    permissions: {
        $: typeof permissionTransform
    }
}>

export type PermissionName = "Create Book" | "Edit Book" | "Delete Book" | "Borrow Book" | "View Book" | "Admin"
export function hasPermission(permissionGroup: PermissionGroup, permissionName: PermissionName): boolean {
    return permissionGroup.permissions.some(p => p.name == permissionName)
}

export function hasPermissions(permissionGroup: PermissionGroup, permissionNames: PermissionName[]): boolean {
    return permissionNames.every(permission => hasPermission(permissionGroup, permission))
}

export default {
    hasPermission
}
