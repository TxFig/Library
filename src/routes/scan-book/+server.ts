import { json, error } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"

import { getOpenLibraryBook } from "$lib/utils/open-library"
import db from "$lib/server/database/book"


export const POST: RequestHandler = async ({ request, locals }) => {
    if (!locals.user) {
        throw error(401, {
            message: "Need to be logged in"
        })
    }

    const { isbn: isbnString }: { isbn: string } = await request.json()

    const isbn = Number(isbnString)

    const bookAlreadyExists = await db.doesBookExist(isbn)
    if (bookAlreadyExists) {
        throw error(409, {
            message: "Book already exists in database.",
        })
    }

    const insertData = await getOpenLibraryBook(isbnString)
    if (!insertData) {
        throw error(404, {
            message: "Book not available in OpenLibrary.",
        })
    }

    db.createBook(insertData)
    return json({ message: "Successfully added Book" })
}
