import { json, error } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"

import { getOpenLibraryBook } from "$lib/utils/books"
import db from "$lib/server/database"


export const POST: RequestHandler = async ({ request }) => {
    const { isbn }: { isbn: string } = await request.json()

    const bookAlreadyExists = await db.getBookByISBN(isbn)
    if (bookAlreadyExists) {
        throw error(409, {
            message: "Book already exists in database.",
        })
    }

    const insertData = await getOpenLibraryBook(isbn)
    if (!insertData) {
        throw error(404, {
            message: "Book not available in OpenLibrary.",
        })
    }

    db.insertBookInfo(insertData)
    return json({ message: "Successfully added Book" })
}
