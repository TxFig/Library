import { prisma } from ".."


export async function updateUserRating(bookId: number, userId: number, rating: number): Promise<void> {
    if (rating === 0) {
        await prisma.userBookRating.delete({
            where: {
                userId_bookId: { bookId, userId }
            }
        })
    } else {
        await prisma.userBookRating.upsert({
            where: {
                userId_bookId: { bookId, userId }
            },
            create: {
                rating,
                bookId,
                userId
            },
            update: {
                rating
            }
        })
    }
}

export async function getUserRating(bookId: number, userId: number): Promise<number | null> {
    const userBookRating = await prisma.userBookRating.findUnique({
        where: {
            userId_bookId: {
                bookId,
                userId
            }
        }
    })
    return userBookRating?.rating ?? null
}


export default {
    updateUserRating,
    getUserRating
}
