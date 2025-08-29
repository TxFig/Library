import { fetchBookData } from "$lib/external-book-apis"
import authValidator from "$lib/request-validators/auth"
import paramsValidator from "$lib/request-validators/params"
import db from "$lib/server/database/"
import HttpCodes from "$lib/utils/http-codes"
import { ISBNSchema } from "$lib/validation/book/isbn"
import { error, json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import type { Prisma } from "@prisma/client"
import { ScanPage } from "$lib/types"
import applyTransformSpec from "$lib/utils/transform-object"
import { getFormDataOrJson } from "$lib/request-validators/data-schema"
import api from "$lib/server/api"
import { externalBookEditionToBookEditionSchemaOutput, externalBookToBookSchemaOutput } from "$lib/external-book-apis/utils"


export const POST: RequestHandler = async function(event) {
    authValidator(event,
        (status, message) => error(status, { message }),
        ["Create Book"]
    )
    paramsValidator(event, {
        isbn: {
            schema: ISBNSchema,
            onInvalid() {
                error(HttpCodes.ClientError.BadRequest, {
                    message: "Invalid ISBN Parameter"
                })
            },
        }
    })

    const isbn = event.params.isbn

    let duplicateBook: ScanPage.DuplicateEdition.Raw | null
    try {
        duplicateBook = await db.books.edition.getUnique({
            where: isbn.length === 10 ?
                { isbn10: isbn } : { isbn13: isbn },
            include: ScanPage.DuplicateEdition.include
        })
    } catch (err) {
        error(HttpCodes.ServerError.InternalServerError, {
            message: "Internal Server Error"
        })
    }

    if (duplicateBook !== null) { // Duplicate Edition
        const transformed = applyTransformSpec(duplicateBook, ScanPage.DuplicateEdition.spec)
        return json(transformed, { status: HttpCodes.ClientError.Conflict })
    }

    const data = await fetchBookData(isbn)
    if (!data) { // Not Found
        return error(HttpCodes.ClientError.NotFound, {
            message: "Edition not available in external services"
        })
    }

    const body = await getFormDataOrJson<{ targetBookId: string }>(event)
    let targetBookId: string | undefined = undefined
    if (body instanceof FormData) {
        let value = body.get("targetEdition")
        if (value && typeof value === "string") {
            targetBookId = value
        }
    } else {
        targetBookId = body?.targetBookId
    }

    if (!targetBookId) {
        const input = externalBookToBookSchemaOutput(data)
        const book = await api.books.POST(input, event.locals)
        if (book.success) {
            return json(book.data, { status: HttpCodes.Success.Created })
        } else {
            error(HttpCodes.ServerError.InternalServerError, {
                message: "Internal Server Error"
            })
        }
    }

    const book = db.books.book.getUnique({
        where: { publicId: targetBookId }
    })
    if (!book) {
        error(HttpCodes.ClientError.BadRequest, {
            message: "Target Book Not Found"
        })
    }

    const input = externalBookEditionToBookEditionSchemaOutput(data.edition)
    const edition = await api.books.bookPublicId.editions.POST(targetBookId, input, event.locals)

    if (edition.success) {
        if (data.authors.length > edition.data.book.authors.length) {
            const result = await api.books.bookPublicId.authors.PATCH(targetBookId, data.authors, event.locals)
            if (!result.success) {
                error(HttpCodes.ServerError.InternalServerError, {
                    message: "Internal Server Error"
                })
            }
            edition.data.book.authors = data.authors
        }
        // TODO: update subjects

        return json(edition.data, { status: HttpCodes.Success.Created })
    }
    else {
        error(HttpCodes.ServerError.InternalServerError, {
            message: "Internal Server Error"
        })
    }
}
