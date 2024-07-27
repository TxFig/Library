import type { Book, BookCollection, EmailConfirmationRequest, Permission, PermissionGroup, User, UserBookReadingState, UserSettings } from "@prisma/client"
import { prisma } from ".."
import type { UserCreateFormData, UserUpdateFormData } from "$lib/validation/auth/user"
import { v4 as uuidv4 } from "uuid"
import type { Prisma } from "@prisma/client"


export type EntireUser = User & {
    permissionGroup: PermissionGroup & {
        permissions: Permission[]
    }
    userBookReadingState: (UserBookReadingState & {
        book: Book
    })[]
    emailConfirmationRequest: EmailConfirmationRequest | null
    userSettings: UserSettings | null
    books: Book[]
    bookCollections: (BookCollection & {
        books: Book[]
    })[]
}

export const EntireUserInclude = {
    permissionGroup: {
        include: {
            permissions: true
        }
    },
    userBookReadingState: {
        include: {
            book: true
        }
    },
    emailConfirmationRequest: true,
    userSettings: true,
    books: true,
    bookCollections: {
        include: {
            books: true
        }
    }
}

export async function createUser(data: UserCreateFormData): Promise<EntireUser> {
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
        },
        include: EntireUserInclude
    })
}

export async function updateUser(opaqueId: string, data: UserUpdateFormData): Promise<EntireUser> {
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
        },
        include: EntireUserInclude
    })
}

export async function deleteUser(opaqueId: string): Promise<EntireUser> {
    return await prisma.user.delete({
        where: { opaqueId },
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

export async function getUserById(id: number): Promise<EntireUser | null> {
    return await prisma.user.findUnique({
        where: { id },
        include: EntireUserInclude
    })
}

export async function getEntireUserByOpaqueId(opaqueId: string): Promise<EntireUser | null> {
    return await prisma.user.findUnique({
        where: { opaqueId },
        include: EntireUserInclude
    })
}

export async function getUserCount(): Promise<number> {
    return await prisma.user.count()
}

export async function doesUserExist(where: Prisma.UserWhereUniqueInput): Promise<boolean> {
    return await prisma.user.findFirst({
        where,
        select: { id: true }
    }) !== null
}


export default {
    createUser,
    updateUser,
    deleteUser,

    getAllUsers,
    getUserByEmail,
    getUserByUsername,
    getUserBySessionToken,
    getUserById,
    getEntireUserByOpaqueId,

    getUserCount,
    doesUserExist
}
