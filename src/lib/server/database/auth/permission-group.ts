import type { Permission, PermissionGroup } from "@prisma/client";
import { prisma } from "..";


export type PermissionGroupWithAssociatedPermissions = PermissionGroup & {
    permissions: Permission[]
}
export async function getAllPermissionGroupsAndAssociatedPermissions(): Promise<PermissionGroupWithAssociatedPermissions[]> {
    return await prisma.permissionGroup.findMany({
        include: {
            permissions: true
        }
    })
}


export default {
    getAllPermissionGroupsAndAssociatedPermissions
}
