import type { Infer, InferIn, SuperValidated } from "sveltekit-superforms"
import type { BookCreateData, BookCreateDataWithImageFiles, BookCreateSchema } from "$lib/validation/book/book-form"

import db from "$lib/server/database/"
import type { EntireBook } from "$lib/server/database/books/book"

import HttpCodes, { type HttpErrorCodesValues } from "$lib/utils/http-codes"
import { generateResizedImages } from "$lib/utils/images"
import type { Implements } from "$lib/utils/types"

import type { ApiMethodReturn } from ".."


export type SuperFormCreateBook = SuperValidated<
    Infer<BookCreateSchema>,
    App.Superforms.Message,
    InferIn<BookCreateSchema>
>

export type BookPostMethodReturn = Implements<ApiMethodReturn, {
    success: true
    message: string,
    data: EntireBook
} | {
    success: false
    code: HttpErrorCodesValues,
    message: string,
}>

async function handleBookImagesCreation(book: BookCreateDataWithImageFiles): Promise<BookCreateData> {
    const createBookData: BookCreateData = {
        ...book,
        front_image: false,
        back_image: false
    }

    if (book.front_image) {
        await generateResizedImages(book.isbn, "front", book.front_image)
        createBookData.front_image = true
    }
    if (book.back_image) {
        await generateResizedImages(book.isbn, "back", book.back_image)
        createBookData.back_image = true
    }

    return createBookData
}

export async function POST(form: SuperFormCreateBook, userId: number): Promise<BookPostMethodReturn> {
    const { data } = form

    const doesBookExist = await db.books.book.doesBookExist(data.isbn)
    if (doesBookExist) {
        return {
            code: HttpCodes.ClientError.Conflict,
            message: "Book Already Exists",
            success: false
        }
    }

    const bookCreateData = await handleBookImagesCreation(data)

    try {
        const book = await db.books.book.createBook(bookCreateData)
        await db.activityLog.logActivity(userId, "BOOK_ADDED", bookCreateData)

        return {
            message: "Book Created Successfully",
            success: true,
            data: book
        }
    } catch (err) {
        console.log(err) // TODO: fix publish date year missing ?
        return {
            success: false,
            code: HttpCodes.ServerError.InternalServerError,
            message: "Error creating book in database"
        }
    }
}


export default POST
