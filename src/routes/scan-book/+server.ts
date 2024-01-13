import { json, error } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"

import { getOpenLibraryBook } from "$lib/utils/open-library"
import db from "$lib/server/database/"
import HttpCodes from "$lib/utils/http-codes"


export const POST: RequestHandler = async ({ request, locals }) => {
    if (!locals.user) {
        error(HttpCodes.Unauthorized, {
            message: "Need to be logged in"
        })
    }

    const { isbn: isbnString }: { isbn: string } = await request.json()

    const isbn = Number(isbnString)

    const bookAlreadyExists = await db.book.doesBookExist(isbn)
    if (bookAlreadyExists) {
        error(HttpCodes.Conflict, {
            message: "Book already exists in database.",
        })
    }

    const insertData = await getOpenLibraryBook(isbnString)
    if (!insertData) {
        error(HttpCodes.NotFound, {
            message: "Book not available in OpenLibrary.",
        })
    }

    db.book.createBook(insertData)
    return json({ message: "Successfully added Book" })
}
