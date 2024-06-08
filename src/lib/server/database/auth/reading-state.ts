import { ReadingState } from "@prisma/client"
import { prisma } from ".."


export async function updateUserReadingState(bookId: number, userId: number, state: ReadingState): Promise<void> {
    if (state === ReadingState.READ) {
        await prisma.userBookReadingState.delete({
            where: {
                userId_bookId: { bookId, userId }
            }
        })
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
