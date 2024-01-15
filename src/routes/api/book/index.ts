import { error } from "@sveltejs/kit"

import db from "$lib/server/database/"
import type { InsertBookData } from "$lib/server/database/book"

import { bookFormSchema, getFormattedError } from "$lib/validation/book-form"
import { generateResizedImages } from "$lib/utils/images"
import HttpCodes from "$lib/utils/http-codes"
import { HttpError } from "$lib/utils/custom-errors"
import { convertFormDataToObject } from "$lib/utils/formdata-to-object"


export async function POST(formData: FormData): Promise<InsertBookData> {
    const data = convertFormDataToObject(formData)
    const parsingResult = bookFormSchema.safeParse(data)
    if (!parsingResult.success) {
        throw new HttpError(HttpCodes.ClientError.BadRequest, getFormattedError(parsingResult.error))
    }

    const parsedData = parsingResult.data

    const bookAlreadyExists = await db.book.doesBookExist(parsedData.isbn)
    if (bookAlreadyExists) {
        throw new HttpError(HttpCodes.ClientError.Conflict, "Book Already Exists")
    }

    const createBookData: InsertBookData = {
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
        error(HttpCodes.ServerError.InternalServerError, {
            message: "Error creating book in database"
        })
    }

    return createBookData
}


export default {
    POST
}
