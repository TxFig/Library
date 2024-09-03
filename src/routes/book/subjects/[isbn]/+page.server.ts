import type { PageServerLoad } from "./$types"
import { error } from "@sveltejs/kit"

import db from "$lib/server/database/"
import HttpCodes from "$lib/utils/http-codes"
import { ISBNSchema } from "$lib/validation/book/isbn"
import { applyDecorators } from "$lib/decorators"
import { ParseParamsDecorator } from "$lib/decorators/parse-params"


const load: PageServerLoad = async ({ params }) => {
    const { isbn } = params

    const book = await db.books.book.getBookByISBN(isbn)
    if (!book) {
        error(HttpCodes.ClientError.NotFound, "Book Not Found")
    }

    const subjects = await db.books.subject.getSubjectsByISBN(isbn)
    return { subjects, book }
}

const decoratedLoad = applyDecorators([
    ParseParamsDecorator({
        isbn: {
            schema: ISBNSchema,
            onError: () => error(HttpCodes.ClientError.BadRequest, "Invalid ISBN")
        }
    })
], load)

export { decoratedLoad as load }
