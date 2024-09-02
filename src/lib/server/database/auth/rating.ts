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

export async function getBookAverageRating(bookId: number): Promise<number | null> {
    const userBookRatings = await prisma.userBookRating.findMany({
        where: {
            bookId
        }
    })
    if (userBookRatings.length === 0) {
        return null
    }
    const ratings = userBookRatings.map(rating => rating.rating)
    return ratings.reduce((a, b) => a + b, 0) / ratings.length
}

export async function getNumberOfRatings(bookId: number): Promise<number> {
    const userBookRatings = await prisma.userBookRating.count({
        where: {
            bookId
        }
    })
    return userBookRatings
}

export default {
    updateUserRating,
    getUserRating,
    getBookAverageRating,
    getNumberOfRatings
}
