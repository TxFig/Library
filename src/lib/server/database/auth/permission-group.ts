import type { Permission, PermissionGroup } from "@prisma/client";
import prisma from "$lib/server/database/prisma"

/**
 * @deprecated
 */
type PermissionGroupWithAssociatedPermissions = PermissionGroup & {
    permissions: Permission[]
}
/**
 * @deprecated
 */
export async function getAllPermissionGroupsWithPermissions(): Promise<PermissionGroupWithAssociatedPermissions[]> {
    return await prisma.permissionGroup.findMany({
        include: {
            permissions: true
        }
    })
}

export async function getAllPermissions(): Promise<Permission[]> {
    return await prisma.permission.findMany()
}



export default {
    getAllPermissionGroupsWithPermissions,
    getAllPermissions
}
