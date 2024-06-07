import type { Activity, ActivityType } from "@prisma/client"
import { prisma } from "."
import { BookCreateSchema, BookUpdateSchema } from "$lib/validation/book-form"
import { z } from "zod"
import { ISBNSchema } from "$lib/validation/isbn"
import { UserCreateSchema, UserUpdateSchema } from "$lib/validation/auth/user"


export function getEntireActivityLog(): Promise<Activity[]> {
    return prisma.activity.findMany()
}

const MetadataSchemas = {
    BOOK_ADDED: BookCreateSchema,
    BOOK_UPDATED: BookUpdateSchema,
    BOOK_DELETED: z.object({
        isbn: ISBNSchema
    }),
    BOOK_BORROWED: z.object({
        bookId: z.number(),
        userId: z.number()
    }),
    USER_CREATED: UserCreateSchema,
    USER_UPDATED: UserUpdateSchema,
    USER_DELETED: z.object({
        userId: z.number()
    })
} as const

export async function logActivity(
    userId: number,
    type: ActivityType,
    metadata: z.input<typeof MetadataSchemas[typeof type]>
): Promise<Activity> {
    const schema = MetadataSchemas[type]
    const parsedMetadata = schema.parse(metadata)

    return await prisma.activity.create({
        data: {
            type,
            metadata: JSON.stringify(parsedMetadata),
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
