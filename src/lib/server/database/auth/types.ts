import type { Prisma } from "@prisma/client"
import { BookCollectionBooksInclude } from "../books/types"


export const PageDataUserInclude = {
    bookCollections: {
        include: {
            books: {
                include: {
                    image: true
                }
            }
        }
    },
    permissionGroup: {
        include: {
            permissions: true
        }
    },
    userSettings: true
} as const
export type PageDataUser = Prisma.UserGetPayload<{
    include: typeof PageDataUserInclude
}>

export const DisplayUserInclude = {
    userBookReadingState: {
        include: {
            book: {
                include: BookCollectionBooksInclude
            }
        }
    },
    bookCollections: {
        include: {
            books: {
                include: BookCollectionBooksInclude
            },
        }
    },
    permissionGroup: true,
    userSettings: true
} as const
export type DisplayUser = Prisma.UserGetPayload<{
    include: typeof DisplayUserInclude
}>

export type UserWithPermissionGroup = Prisma.UserGetPayload<{
    include: {
        permissionGroup: true
    }
}>

export type UserWithPermissionGroupAndPermissions = Prisma.UserGetPayload<{
    include: {
        permissionGroup: {
            include: {
                permissions: true
            }
        }
    }
}>
