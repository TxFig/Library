import db from "$lib/server/database/"

import { BookCreateSchema, BookUpdateSchema, BookCreateSchemaDecodeInfo, BookUpdateSchemaDecodeInfo } from "$lib/validation/book-form"
import type {
    BookCreateData,
    BookCreateDataWithImageFiles,
    BookUpdateData,
    BookUpdateDataWithImageFiles
} from "$lib/validation/book-form"
import { generateResizedImages } from "$lib/utils/images"
import HttpCodes, { type HttpErrorCodes } from "$lib/utils/http-codes"
import { HttpError } from "$lib/utils/custom-errors"
import { decode as decodeFormData } from "decode-formdata"
import clearEmptyFields from "$lib/utils/clear-empty-fields"
import type { z } from "zod"
import type { Book } from "@prisma/client"

// import convertFormDataToObject from "$lib/utils/formData-to-object"
// import { getFormattedError } from "$lib/validation/format-errors"


export type PostMethodReturn = {
    data: Partial<BookCreateDataWithImageFiles>,
    book: BookCreateData,
    success: true
} | {
    data: Partial<BookCreateDataWithImageFiles>,
    code: HttpErrorCodes
    errors?: z.inferFormattedError<typeof BookCreateSchema>,
    message?: string
    success: false
}
export async function POST(formData: FormData): Promise<PostMethodReturn> {
    const decodedFormData = decodeFormData<BookCreateDataWithImageFiles>(formData, BookCreateSchemaDecodeInfo)
    const data = clearEmptyFields(decodedFormData)

    const parsingResult = BookCreateSchema.safeParse(data)
    if (!parsingResult.success) {
        return {
            data,
            code: HttpCodes.ClientError.BadRequest,
            errors: parsingResult.error.format(),
            success: false
        }
    }

    const parsedData: BookCreateDataWithImageFiles = parsingResult.data

    const bookAlreadyExists = await db.book.doesBookExist(parsedData.isbn)
    if (bookAlreadyExists) {
        return {
            data,
            code: HttpCodes.ClientError.Conflict,
            message: "Book Already Exists",
            success: false
        }
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

    return {
        data,
        book: createBookData,
        success: true
    }
}

export type PatchMethodReturn = {
    data: Partial<BookUpdateDataWithImageFiles>,
    errors?: z.inferFormattedError<typeof BookUpdateSchema>,
    book?: BookUpdateData,
    message?: string
}
export async function PATCH(formData: FormData): Promise<PatchMethodReturn> {
    const decodedFormData = decodeFormData<BookCreateDataWithImageFiles>(formData, BookUpdateSchemaDecodeInfo)
    const data = clearEmptyFields(decodedFormData)

    const parsingResult = BookUpdateSchema.safeParse(data)
    if (!parsingResult.success) {
        return {
            data,
            errors: parsingResult.error.format()
        }
    }

    const parsedData: BookUpdateDataWithImageFiles = parsingResult.data
    const updateBookData: BookUpdateData = {
        ...parsedData,
        front_image: undefined,
        back_image: undefined
    }

    if (parsedData.front_image) {
        await generateResizedImages(parsedData.isbn, "front", parsedData.front_image)
        updateBookData.front_image = true
    }
    if (parsedData.back_image) {
        await generateResizedImages(parsedData.isbn, "back", parsedData.back_image)
        updateBookData.back_image = true
    }

    let book: Book
    try {
        book = await db.book.updateBook(updateBookData)
    } catch {
        throw new HttpError(HttpCodes.ServerError.InternalServerError, "Error updating book in database")
    }

    return { data, book }
}


export default {
    POST,
    PATCH
}
