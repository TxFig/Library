import type { PermissionGroup } from "@prisma/client";
import { prisma } from "..";


export async function getAllPermissionGroups(): Promise<PermissionGroup[]> {
    return await prisma.permissionGroup.findMany()
}


export default {
    getAllPermissionGroups
}
