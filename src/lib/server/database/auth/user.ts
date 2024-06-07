import type { EmailConfirmationRequest, Permission, PermissionGroup, User, UserBookReadingState } from "@prisma/client"
import { prisma } from ".."


export type EntireUser = User & {
    permissionGroup: PermissionGroup & {
        permissions: Permission[]
    }
    userBookReadingState: UserBookReadingState[],
    emailConfirmationRequest: EmailConfirmationRequest | null
}

export const EntireUserInclude = {
    permissionGroup: {
        include: {
            permissions: true
        }
    },
    userBookReadingState: true,
    emailConfirmationRequest: true
}

export type CreateUserInput = Omit<User, "id" | "permissionGroupId"> & {
    permissionGroup: string
}
export async function createUser(input: CreateUserInput): Promise<EntireUser> {
    const { permissionGroup, ...user } = input
    return await prisma.user.create({
        data: {
            ...user,
            permissionGroup: {
                connect: {
                    name: permissionGroup
                }
            }
        },
        include: EntireUserInclude
    })
}

export type UpdateUserInput = Omit<User, "id" | "permissionGroupId"> & {
    permissionGroup: string
}
export async function updateUser(id: number, input: UpdateUserInput): Promise<EntireUser> {
    const { permissionGroup, ...user } = input
    return await prisma.user.update({
        where: { id },
        data: {
            ...user,
            permissionGroup: {
                connect: {
                    name: permissionGroup
                }
            }
        },
        include: EntireUserInclude
    })
}


export async function deleteUser(id: number): Promise<EntireUser> {
    return await prisma.user.delete({
        where: { id },
        include: EntireUserInclude
    })
}

export async function getAllUsers(): Promise<EntireUser[]> {
    return await prisma.user.findMany({
        include: EntireUserInclude
    })
}

export async function getUserByEmail(email: string): Promise<EntireUser | null> {
    return await prisma.user.findUnique({
        where: { email },
        include: EntireUserInclude
    })
}

export async function getUserByUsername(username: string): Promise<EntireUser | null> {
    return await prisma.user.findUnique({
        where: { username },
        include: EntireUserInclude
    })
}

export async function getUserBySessionToken(sessionToken: string): Promise<EntireUser | null> {
    return await prisma.user.findFirst({
        where: {
            session: {
                some: {
                    token: sessionToken
                }
            }
        },
        include: EntireUserInclude
    })
}

export async function getUserCount(): Promise<number> {
    return await prisma.user.count()
}


export default {
    createUser,
    updateUser,
    deleteUser,

    getAllUsers,
    getUserByEmail,
    getUserByUsername,
    getUserBySessionToken,

    getUserCount
}
