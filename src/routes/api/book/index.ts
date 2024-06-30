import db from "$lib/server/database/"

import { BookCreateSchema, BookUpdateSchema, BookCreateSchemaDecodeInfo, BookUpdateSchemaDecodeInfo } from "$lib/validation/book/book-form"
import type {
    BookCreateData,
    BookCreateDataWithImageFiles,
    BookUpdateData,
    BookUpdateDataWithImageFiles
} from "$lib/validation/book/book-form"
import { generateResizedImages } from "$lib/utils/images"
import HttpCodes, { type HttpErrorCodesValues } from "$lib/utils/http-codes"
import { HttpError } from "$lib/utils/custom-errors"
import { decode as decodeFormData } from "decode-formdata"
import clearEmptyFields from "$lib/utils/clear-empty-fields"
import type { z } from "zod"
import type { Book } from "@prisma/client"
import type { EntireUser } from "$lib/server/database/auth/user"


export type PostMethodReturn = {
    data: Partial<BookCreateDataWithImageFiles>,
    book: BookCreateData,
    success: true
} | {
    data: Partial<BookCreateDataWithImageFiles>,
    code: HttpErrorCodesValues
    errors?: z.inferFormattedError<typeof BookCreateSchema>,
    message?: string
    success: false
}
export async function POST(user: EntireUser, formData: FormData): Promise<PostMethodReturn> {
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

    const bookAlreadyExists = await db.books.book.doesBookExist(parsedData.isbn)
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
        await db.books.book.createBook(createBookData)
        await db.activityLog.logActivity(user.id, "BOOK_ADDED", createBookData)
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
    book: BookUpdateData,
    success: true
} | {
    data: Partial<BookUpdateDataWithImageFiles>,
    code: HttpErrorCodesValues
    errors?: z.inferFormattedError<typeof BookUpdateSchema>,
    message?: string
    success: false
}
export async function PATCH(user: EntireUser, formData: FormData): Promise<PatchMethodReturn> {
    const decodedFormData = decodeFormData<BookCreateDataWithImageFiles>(formData, BookUpdateSchemaDecodeInfo)
    const data = clearEmptyFields(decodedFormData)

    const parsingResult = BookUpdateSchema.safeParse(data)
    if (!parsingResult.success) {
        return {
            data,
            code: HttpCodes.ClientError.BadRequest,
            errors: parsingResult.error.format(),
            success: false
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
        book = await db.books.book.updateBook(updateBookData)
        await db.activityLog.logActivity(user.id, "BOOK_UPDATED", updateBookData)
    } catch {
        throw new HttpError(HttpCodes.ServerError.InternalServerError, "Error updating book in database")
    }

    return { data, book, success: true }
}


export default {
    POST,
    PATCH
}
