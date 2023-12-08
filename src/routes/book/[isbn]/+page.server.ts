import type { PageServerLoad } from "./$types"
import { error } from "@sveltejs/kit"

import db from "$lib/server/database/book"


export const load: PageServerLoad = async ({ params }) => {
    const { isbn: isbnString } = params
    const isbn = Number(isbnString) // TODO: validate isbn integer / not NaN

    const book = await db.getEntireBookByISBN(isbn)

    if (!book) {
        throw error(404, "Book Not Available")
    }

    return { book }
}
