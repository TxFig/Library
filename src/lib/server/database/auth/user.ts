import type { Book, BookCollection, EmailConfirmationRequest, Permission, PermissionGroup, User, UserBookReadingState, UserSettings } from "@prisma/client"
import { prisma } from ".."
import type { UserCreateData, UserUpdateData } from "$lib/validation/auth/user"
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

const UserIncludeBase: Prisma.UserInclude = {}
const UserIncludeAll: Prisma.UserInclude = {
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

export function _getUserById(id: number, include: Prisma.UserInclude = UserIncludeBase) {
    return prisma.user.findUnique({
        where: { id },
        include
    })
}


export async function createUser(data: UserCreateData): Promise<EntireUser> {
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

export async function updateUser(id: number, data: UserUpdateData): Promise<EntireUser> {
    const { permissionGroup, ...user } = data
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

export async function getUserById(id: number): Promise<EntireUser | null> {
    return await prisma.user.findUnique({
        where: { id },
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
    getUserById,

    getUserCount
}
