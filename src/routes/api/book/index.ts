import { error, type NumericRange } from "@sveltejs/kit"

import db from "$lib/server/database/"
import type { InsertBookData } from "$lib/server/database/book"

import { bookFormSchema, getFormattedError } from "$lib/validation/book-form"
import { generateResizedImages } from "$lib/utils/images"
import HttpCodes from "$lib/utils/http-codes"
import { BadRequestError, InternalServerError } from "$lib/utils/custom-errors"
import { convertFormDataToObject } from "$lib/utils/formdata-to-object"


type ActionFailureOrBookData = {
    formError: {
        status: NumericRange<400, 599>,
        data: App.FormError
    },
    book?: undefined
} | {
    formError?: undefined,
    book: InsertBookData
}
export async function POST(formData: FormData): Promise<ActionFailureOrBookData> {
    const data = convertFormDataToObject(formData)
    const parsingResult = bookFormSchema.safeParse(data)
    if (!parsingResult.success) {
        return {
            formError: {
                status: HttpCodes.BadRequest,
                data: {
                    message: "Invalid Book Data",
                    error: getFormattedError(parsingResult.error)
                }
            }
        }
    }

    const parsedData = parsingResult.data

    const bookAlreadyExists = await db.book.doesBookExist(parsedData.isbn)
    if (bookAlreadyExists) {
        error(HttpCodes.Conflict, {
            message: "Book ALready Exists"
        })
    }

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
                error(HttpCodes.BadRequest, { message: err.message })
            }
            else if (err instanceof InternalServerError) {
                error(HttpCodes.InternalServerError, { message: err.message })
            }
        }
        createBookData.front_image = true
    }
    if (parsedData.back_image) {
        try {
            await generateResizedImages(parsedData.isbn, "back", parsedData.back_image)
        } catch (err) {
            if (err instanceof BadRequestError) {
                error(HttpCodes.BadRequest, { message: err.message })
            }
            else if (err instanceof InternalServerError) {
                error(HttpCodes.InternalServerError, { message: err.message })
            }
        }
        createBookData.back_image = true
    }

    try {
        await db.book.createBook(createBookData)
    } catch {
        error(HttpCodes.InternalServerError, {
            message: "Error creating book in database"
        })
    }

    return {
        book: createBookData
    }
}


export default {
    POST
}
