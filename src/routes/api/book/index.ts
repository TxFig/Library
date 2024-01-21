import db from "$lib/server/database/"

import { bookCreateSchema, bookUpdateSchema, type BookUpdateDataWithImageFiles, type BookUpdateData, type BookCreateData, type BookCreateDataWithImageFiles } from "$lib/validation/book-form"
import { generateResizedImages } from "$lib/utils/images"
import HttpCodes from "$lib/utils/http-codes"
import { HttpError } from "$lib/utils/custom-errors"
import { convertFormDataToObject } from "$lib/utils/formData-to-object"
import { getFormattedError } from "$lib/validation/format-errors"


export async function POST(formData: FormData): Promise<BookCreateData> {
    const data = convertFormDataToObject(formData)
    const parsingResult = bookCreateSchema.safeParse(data)
    if (!parsingResult.success) {
        throw new HttpError(HttpCodes.ClientError.BadRequest, getFormattedError(parsingResult.error))
    }

    const parsedData: BookCreateDataWithImageFiles = parsingResult.data

    const bookAlreadyExists = await db.book.doesBookExist(parsedData.isbn)
    if (bookAlreadyExists) {
        throw new HttpError(HttpCodes.ClientError.Conflict, "Book Already Exists")
    }

    const createBookData: BookCreateData = {
        ...parsedData,
        front_image: false,
        back_image: false
    }

    if (parsedData.front_image) {
        await generateResizedImages(parsedData.isbn, "front", parsedData.front_image)
        createBookData.front_image = true
    }
    if (parsedData.back_image) {
        await generateResizedImages(parsedData.isbn, "back", parsedData.back_image)
        createBookData.back_image = true
    }

    try {
        await db.book.createBook(createBookData)
    } catch {
        throw new HttpError(HttpCodes.ServerError.InternalServerError, "Error creating book in database")
    }

    return createBookData
}

export async function PATCH(formData: FormData): Promise<void> {
    const data = convertFormDataToObject(formData)
    const parsingResult = bookUpdateSchema.safeParse(data)
    if (!parsingResult.success) {
        throw new HttpError(HttpCodes.ClientError.BadRequest, getFormattedError(parsingResult.error))
    }

    const parsedData: BookUpdateDataWithImageFiles = parsingResult.data

    const bookAlreadyExists = await db.book.doesBookExist(parsedData.isbn)
    if (bookAlreadyExists) {
        throw new HttpError(HttpCodes.ClientError.Conflict, "Book Already Exists")
    }

    const updateBookData: BookUpdateData = {
        ...parsedData,
        front_image: false,
        back_image: false
    }

    try {
        await db.book.updateBook(updateBookData)
    } catch {
        throw new HttpError(HttpCodes.ServerError.InternalServerError, "Error updating book in database")
    }
}


export default {
    POST,
    PATCH
}
