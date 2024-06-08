import type { Activity, ActivityType, ReadingState } from "@prisma/client"
import { prisma } from "."
import { type BookCreateData, type BookUpdateData } from "$lib/validation/book-form"
import { type UserCreateData, type UserUpdateData } from "$lib/validation/auth/user"


export function getEntireActivityLog(): Promise<Activity[]> {
    return prisma.activity.findMany()
}

type MetadataSchemas = {
    BOOK_ADDED: BookCreateData,
    BOOK_UPDATED: BookUpdateData,
    BOOK_DELETED: { isbn: string },
    BOOK_BORROWED: never, // TODO
    USER_CREATED: UserCreateData,
    USER_UPDATED: UserUpdateData,
    USER_DELETED: { userId: number },
    READING_STATE_UPDATED: { bookId: number, userId: number, state: ReadingState }
}

export async function logActivity<Type extends ActivityType>(
    userId: number,
    type: Type,
    metadata: MetadataSchemas[Type]
): Promise<Activity> {
    return await prisma.activity.create({
        data: {
            type,
            metadata: JSON.stringify(metadata),
            user: {
                connect: {
                    id: userId
                }
            }
        }
    })
}


export default {
    logActivity,
    getEntireActivityLog
}
