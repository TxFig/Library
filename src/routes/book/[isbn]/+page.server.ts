import type { PageServerLoad } from "./$types"
import { error } from "@sveltejs/kit"

import db from "$lib/server/database"

export const load: PageServerLoad = async ({ params }) => {
    const { isbn } = params
    const book = await db.getBookByISBN(isbn)

    if (!book) {
        throw error(404, "Book Not Available")
    }

    const authors = await db.getAuthorsByBook(book)
    const publishers = await db.getPublishersByBook(book)
    const subjects = await db.getSubjectsByBook(book)
    const location = await db.getLocationByBook(book)
    const language = await db.getLanguageByBook(book)

    return { isbn, book, authors, publishers, subjects, location, language }
}
