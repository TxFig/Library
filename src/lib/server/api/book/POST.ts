import type { Infer, InferIn, SuperValidated } from "sveltekit-superforms"
import type { BookCreateSchema } from "$lib/validation/book/book"
import db from "$lib/server/database/"
import HttpCodes, { type HttpErrorCodesValues } from "$lib/utils/http-codes"
import type { Implements } from "$lib/utils/types"
import type { ApiMethodReturn } from ".."
import log, { logError } from "$lib/logging"
import type { Book } from "@prisma/client"


export type SuperFormCreateBook = SuperValidated<
    Infer<BookCreateSchema>,
    App.Superforms.Message,
    InferIn<BookCreateSchema>
>

export type BookPostMethodReturn = Implements<ApiMethodReturn, {
    success: true
    message: string,
    data: Book
} | {
    success: false
    code: HttpErrorCodesValues,
    message: string,
}>

// export async function POST(form: SuperFormCreateBook, userId: number): Promise<BookPostMethodReturn> {
export async function POST(form: SuperFormCreateBook): Promise<BookPostMethodReturn> {
    const { data } = form

    try {
        const book = await db.books.book.create(data)
        // await log("info", `Book created: ${book.publicId}`, userId, data)
        await log("info", `Book created: ${book.publicId}`, undefined, data)

        return {
            message: "Book Created Successfully",
            success: true,
            data: book
        }
    } catch (err) {
        // await logError(err, `Error creating book: ${data["edition.title"]} in database`, userId)
        await logError(err, `Error creating book: ${data["edition.title"]} in database`)
        return {
            success: false,
            code: HttpCodes.ServerError.InternalServerError,
            message: "Error creating book in database"
        }
    }
}


export default POST
