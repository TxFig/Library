import { json, error } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"

import { getOpenLibraryBook } from "$lib/utils/open-library"
import db from "$lib/server/database/"
import HttpCodes from "$lib/utils/http-codes"
import { ISBNSchema } from "$lib/validation/book/isbn"
import type { BookCreateData } from "$lib/validation/book/book-form"
import { generateResizedImages } from "$lib/utils/images"


export const POST: RequestHandler = async ({ params, locals }) => {
    if (!locals.user) {
        error(HttpCodes.ClientError.Unauthorized, {
            message: "Need to be logged in"
        })
    }
    const { isbn: rawISBN } = params
    let isbn: string
    try {
        isbn = ISBNSchema.parse(rawISBN)
    } catch {
        error(HttpCodes.ClientError.BadRequest, "Invalid ISBN")
    }

    const bookAlreadyExists = await db.books.book.doesBookExist(isbn)
    if (bookAlreadyExists) {
        error(HttpCodes.ClientError.Conflict, {
            message: "Book already exists in database.",
        })
    }

    const data = await getOpenLibraryBook(isbn)

    if (!data) {
        error(HttpCodes.ClientError.NotFound, {
            message: "Book not available in OpenLibrary.",
        })
    }

    const createBookData: BookCreateData = {
        ...data,
        front_image: false,
        back_image: false
    }

    if (data.front_image) {
        await generateResizedImages(data.isbn, "front", data.front_image)
        createBookData.front_image = true
    }
    if (data.back_image) {
        await generateResizedImages(data.isbn, "back", data.back_image)
        createBookData.back_image = true
    }

    try {
        await db.books.book.createBook(createBookData)
        return json({
            status: 200,
            message: "Successfully added Book"
        })
    } catch (error) {
        return json({
            status: 500,
            message: "Error adding Book"
        })
    }
}
