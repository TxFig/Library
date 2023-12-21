import type { PageServerLoad } from "./$types"
import { error } from "@sveltejs/kit"

import db from "$lib/server/database/book"
import { getBookReadingState } from "$lib/server/database/auth"


export const load: PageServerLoad = async ({ params, locals }) => {
    const { isbn: isbnString } = params
    const isbn = Number(isbnString) // TODO: validate isbn integer / not NaN

    const book = await db.getEntireBookByISBN(isbn)

    if (!book) {
        throw error(404, "Book Not Available")
    }

    const readingState = locals.user ? await getBookReadingState(isbn, locals.user.id) : null

    return { book, readingState }
}
