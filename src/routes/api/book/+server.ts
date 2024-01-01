import { error, json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import db from "$lib/server/database/"
import HttpErrors from "$lib/utils/http-errors"
import { bookFormSchema, getFormattedError } from "$lib/utils/book-form"
import type { Prisma } from "@prisma/client"
import { formatImageFilename, saveImage } from "$lib/utils/images"



// Create Book
export const POST: RequestHandler = async ({ request }) => {
    const data = await request.json()
    const parsingResult = bookFormSchema.safeParse(data)

    if (!parsingResult.success) {
        const error = getFormattedError(parsingResult.error)
        return json(error, {
            status: HttpErrors.BadRequest
        })
    }
    const parsedData = parsingResult.data

    let frontImageFilename: string | null = null
    if (parsedData.front_image) {
        frontImageFilename = formatImageFilename(parsedData.isbn, "front", parsedData.front_image.name)
        const error = await saveImage(frontImageFilename, await parsedData.front_image.arrayBuffer())
        if (error) return json(error, {
            status: HttpErrors.InternalServerError
        })
    }

    let backImageFilename: string | null = null
    if (parsedData.back_image) {
        backImageFilename = formatImageFilename(parsedData.isbn, "back", parsedData.back_image.name)
        const error = await saveImage(backImageFilename, await parsedData.back_image.arrayBuffer())
        if (error) return json(error, {
            status: HttpErrors.InternalServerError
        })
    }

    const insertData = {
        ...parsedData,
        "front_image": frontImageFilename,
        "back_image": backImageFilename,
    }

    try {
        db.book.createBook(insertData)
    }
    catch (error) {

    }

    return new Response()
}


// Retrieve Book
export const GET: RequestHandler = async ({}) => {
    return new Response()
}

// Update Book
export const PATCH: RequestHandler = async ({}) => {
    return new Response()
}

// Delete Book
export const DELETE: RequestHandler = async ({ params, locals }) => {
    if (!locals.user) {
        throw error(HttpErrors.Unauthorized, {
            message: "Need to be logged in"
        })
    }

    const { isbn: isbnString } = params // TODO: get isbn from request body + fix code that uses this route to delete books to include the isbn in the request

    const isbn = Number(isbnString) // TODO: isbn validation

    await db.book.deleteBook(isbn)

    return json({ message: `Successfully deleted book, isbn ${isbnString}` })
}
