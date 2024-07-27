import type { Activity, ActivityType, ReadingState } from "@prisma/client"
import { prisma } from "."
import { type UserCreateFormData, type UserUpdateFormData } from "$lib/validation/auth/user"
import type { BookCreateFormData, BookUpdateFormData } from "$lib/validation/book/book-form"


export function getEntireActivityLog(): Promise<Activity[]> {
    return prisma.activity.findMany()
}

type MetadataDataTypes = {
    BOOK_ADDED: BookCreateFormData,
    BOOK_UPDATED: BookUpdateFormData,
    BOOK_DELETED: { isbn: string },
    BOOK_BORROWED: never, // TODO
    USER_CREATED: UserCreateFormData,
    USER_UPDATED: UserUpdateFormData,
    USER_DELETED: { opaqueId: string },
    READING_STATE_UPDATED: { bookId: number, userId: number, state: ReadingState }
}

export async function logActivity<Type extends ActivityType>(
    userId: number,
    type: Type,
    metadata: MetadataDataTypes[Type]
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
