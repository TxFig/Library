import type { EntireBook } from "$lib/server/database/books/book";
import { HttpCodes, type HttpErrorCodesValues } from "$lib/utils/http-codes";
import type { Implements } from "$lib/utils/types";
import type { Infer, InferIn, SuperValidated } from "sveltekit-superforms";
import type { ApiMethodReturn } from "..";
import type { BookUpdateData, BookUpdateDataWithImageFiles, BookUpdateSchema } from "$lib/validation/book/book-form";
import db from "$lib/server/database/"


export type SuperFormUpdateBook = SuperValidated<
    Infer<BookUpdateSchema>,
    App.Superforms.Message,
    InferIn<BookUpdateSchema>
>

export type BookPatchMethodReturn = Implements<ApiMethodReturn, {
    success: true
    message: string,
    data: EntireBook,
} | {
    success: false,
    code: HttpErrorCodesValues,
    message: string
}>

async function handleBookImagesUpdate(book: BookUpdateDataWithImageFiles): Promise<BookUpdateData> {
    const updateBookData: BookUpdateData = {
        ...book,
        front_image: undefined,
        back_image: undefined
    }

    // TODO
    if (book.front_image) {
        // await generateResizedImages(book.isbn, "front", book.front_image)
        updateBookData.front_image = true
    }
    if (book.back_image) {
        // await generateResizedImages(book.isbn, "back", book.back_image)
        updateBookData.back_image = true
    }

    return updateBookData
}

export async function PATCH(form: SuperFormUpdateBook, userId: number): Promise<BookPatchMethodReturn> {
    const { data } = form

    const doesBookExist = await db.books.book.doesBookExist(data.isbn)
    if (!doesBookExist) {
        return {
            success: false,
            code: HttpCodes.ClientError.NotFound,
            message: "Book Not Found"
        }
    }

    const bookUpdateData = await handleBookImagesUpdate(data)

    try {
        const book = await db.books.book.updateBook(bookUpdateData)
        await db.activityLog.logActivity(userId, "BOOK_UPDATED", bookUpdateData)

        return {
            success: true,
            message: "Book Updated Successfully",
            data: book
        }
    } catch {
        return {
            success: false,
            code: HttpCodes.ServerError.InternalServerError,
            message: "Error updating book in database"
        }
    }
}

export default PATCH
