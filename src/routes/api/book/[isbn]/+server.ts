import { json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import db from "$lib/server/database/book"


export const DELETE: RequestHandler = async ({ params }) => {
    const { isbn: isbnString } = params

    const isbn = Number(isbnString) // TODO: isbn validation

    await db.deleteBook(isbn)

    return json({ message: `Successfully deleted book, isbn ${isbnString}` })
}
