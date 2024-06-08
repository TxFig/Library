import type { ReadingState } from "@prisma/client"
import { prisma } from ".."


export type AllReadingState = "NOT READ" | ReadingState
export const AllReadingStates = ["NOT READ", "READING", "READ"] as const //! Hardcoded
export async function updateUserReadingState(bookId: number, userId: number, state: AllReadingState): Promise<void> {
    if (state == "NOT READ") {
        try {
            await prisma.userBookReadingState.delete({
                where: {
                    userId_bookId: { bookId, userId }
                }
            })
        } catch {}
    } else {
        await prisma.userBookReadingState.upsert({
            where: {
                userId_bookId: { bookId, userId }
            },
            create: {
                state,
                bookId,
                userId
            },
            update: {
                state
            }
        })
    }
}

export async function getBookReadingState(bookId: number, userId: number): Promise<ReadingState | null> {
    const userBookReadingState = await prisma.userBookReadingState.findUnique({
        where: {
            userId_bookId: {
                bookId,
                userId
            }
        }
    })
    return userBookReadingState?.state ?? null
}


export default {
    updateUserReadingState,
    getBookReadingState
}
