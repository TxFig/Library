import type { Infer, InferIn, SuperValidated } from "sveltekit-superforms"
import type { BookCreateSchema } from "$lib/validation/book/book-form"
import db from "$lib/server/database/"
import HttpCodes, { type HttpErrorCodesValues } from "$lib/utils/http-codes"
import type { Implements } from "$lib/utils/types"
import type { InternalApiMethodReturn } from ".."
import log, { logError } from "$lib/logging"
import type { Book } from "@prisma/client"


export type SuperFormCreateBook = SuperValidated<
    Infer<BookCreateSchema>,
    App.Superforms.Message,
    InferIn<BookCreateSchema>
>

export type BookPostMethodReturn = Implements<InternalApiMethodReturn, {
    success: true
    message: string,
    data: Book
} | {
    success: false
    code: HttpErrorCodesValues,
    message: string,
}>

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

    try {
        const book = await db.books.book.createBook(data)
        await log("info", `Book created: ${book.isbn}`, userId, data)

        return {
            message: "Book Created Successfully",
            success: true,
            data: book
        }
    } catch (err) {
        await logError(err, `Error creating book: ${data.isbn} in database`, userId)
        return {
            success: false,
            code: HttpCodes.ServerError.InternalServerError,
            message: "Error creating book in database"
        }
    }
}


export default POST
