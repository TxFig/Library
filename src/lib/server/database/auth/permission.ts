import type { Permission } from "@prisma/client"
import { prisma } from ".."


export async function getAllPermissions(): Promise<Permission[]> {
    return await prisma.permission.findMany()
}


export default {
    getAllPermissions
}
