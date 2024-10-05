import type { UserCreateFormData, UserUpdateFormData } from "$lib/validation/auth/user"
import type { Prisma, User } from "@prisma/client"
import { v4 as uuidv4 } from "uuid"
import { prisma } from ".."


export async function createUser(data: UserCreateFormData): Promise<User> {
    const { permissionGroup, ...user } = data
    const opaqueId = uuidv4()

    return await prisma.user.create({
        data: {
            ...user,
            opaqueId,
            permissionGroup: {
                connect: {
                    name: permissionGroup
                }
            },
            userSettings: {
                create: {
                    visibleReadingState: true
                }
            }
        }
    })
}

export async function updateUser(opaqueId: string, data: UserUpdateFormData): Promise<User> {
    const { permissionGroup, ...user } = data

    return await prisma.user.update({
        where: { opaqueId },
        data: {
            ...user,
            permissionGroup: {
                connect: {
                    name: permissionGroup
                }
            }
        }
    })
}

export async function deleteUser(opaqueId: string): Promise<User> {
    return await prisma.user.delete({
        where: { opaqueId }
    })
}

export const getUniqueUser = prisma.user.findUnique
export const getUsers = prisma.user.findMany
export const getUserCount = prisma.user.count
export async function doesUserExist(where: Prisma.UserWhereUniqueInput): Promise<boolean> {
    const count = await prisma.user.count({
        where,
    })
    return count !== 0
}

export default {
    createUser,
    updateUser,
    deleteUser,

    getUniqueUser,
    getUsers,
    getUserCount,
    doesUserExist
}
