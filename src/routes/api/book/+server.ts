import { error, json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import db from "$lib/server/database/"
import HttpCodes from "$lib/utils/http-codes"
import { bookFormSchema, getFormattedError } from "$lib/validation/book-form"
import { generateResizedImages } from "$lib/utils/images"
import type { InsertBookData } from "$lib/server/database/book"
import { BadRequestError, InternalServerError } from "$lib/utils/custom-errors"


type FormDataObject = {
    [key: string]: FormDataEntryValue | FormDataEntryValue[]
}

function convertFormDataToObject(formData: FormData): FormDataObject {
    const entries = [...formData.entries()]
    const object: FormDataObject = {}

    for (const [key, value] of entries) {
        if (object[key]) {
            if (Array.isArray(object[key])) {
                (object[key] as FormDataEntryValue[]).push(value)
            } else {
                object[key] = [object[key], value] as FormDataEntryValue[]
            }
        } else {
            object[key] = value
        }
    }

    return object
}

// Create Book
export const POST: RequestHandler = async ({ request }) => {
    let data: unknown

    try {
        const formData = await request.formData()
        data = convertFormDataToObject(formData)
    } catch {
        throw error(HttpCodes.BadRequest, {
            message: "No Data Provided"
        })
    }

    const parsingResult = bookFormSchema.safeParse(data)
    if (!parsingResult.success) {
        throw error(HttpCodes.BadRequest, {
            message: "Invalid Book Data",
            error: getFormattedError(parsingResult.error)
        })
    }

    // TODO: check if book already exists

    const parsedData = parsingResult.data
    const createBookData: InsertBookData = {
        ...parsedData,
        front_image: false,
        back_image: false
    }

    if (parsedData.front_image) {
        try {
            await generateResizedImages(parsedData.isbn, "front", parsedData.front_image)
        } catch (err) {
            if (err instanceof BadRequestError) {
                throw error(HttpCodes.BadRequest, { message: err.message })
            }
            else if (err instanceof InternalServerError) {
                throw error(HttpCodes.InternalServerError, { message: err.message })
            }
        }
        createBookData.front_image = true
    }
    if (parsedData.back_image) {
        try {
            await generateResizedImages(parsedData.isbn, "back", parsedData.back_image)
        } catch (err) {
            if (err instanceof BadRequestError) {
                throw error(HttpCodes.BadRequest, { message: err.message })
            }
            else if (err instanceof InternalServerError) {
                throw error(HttpCodes.InternalServerError, { message: err.message })
            }
        }
        createBookData.back_image = true
    }

    db.book.createBook(createBookData)

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
        throw error(HttpCodes.Unauthorized, {
            message: "Need to be logged in"
        })
    }

    const { isbn: isbnString } = params // TODO: get isbn from request body + fix code that uses this route to delete books to include the isbn in the request

    const isbn = Number(isbnString) // TODO: isbn validation

    await db.book.deleteBook(isbn)

    return json({ message: `Successfully deleted book, isbn ${isbnString}` })
}
