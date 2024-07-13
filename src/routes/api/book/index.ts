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
import type { Infer, InferIn, SuperValidated } from "sveltekit-superforms"


export type PostMethodReturn = {
    book: BookCreateData,
    message?: string
    success: true
} | {
    code: HttpErrorCodesValues
    message?: string
    success: false
}

type SuperFormCreateBook = SuperValidated<
    Infer<BookCreateSchema>,
    App.Superforms.Message,
    InferIn<BookCreateSchema>
>
export async function POST(user: EntireUser, form: SuperFormCreateBook): Promise<PostMethodReturn> {
    const { data } = form

    const bookAlreadyExists = await db.books.book.doesBookExist(data.isbn)
    if (bookAlreadyExists) {
        return {
            code: HttpCodes.ClientError.Conflict,
            message: "Book Already Exists",
            success: false
        }
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
        await db.activityLog.logActivity(user.id, "BOOK_ADDED", createBookData)
    } catch (err) {
        console.log(err) // TODO: fix
        throw new HttpError(HttpCodes.ServerError.InternalServerError, "Error creating book in database")
    }

    return {
        book: createBookData,
        success: true,
        message: "Book Created Successfully"
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
