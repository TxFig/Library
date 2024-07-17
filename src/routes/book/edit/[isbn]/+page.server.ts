import type { Actions, PageServerLoad } from "./$types"
import { error, fail } from "@sveltejs/kit"
import db from "$lib/server/database/"
import HttpCodes from "$lib/utils/http-codes"
import { ISBNSchema } from "$lib/validation/book/isbn"
import { HttpError } from "$lib/utils/custom-errors"
import API from "$lib/server/api"
import { applyDecorators } from "$lib/decorators"
import AuthDecorator from "$lib/decorators/auth"
import { message, superValidate } from "sveltekit-superforms"
import { zod } from "sveltekit-superforms/adapters"
import { BookUpdateSchema } from "$lib/validation/book/book-form"
import type { BookPatchMethodReturn } from "$lib/server/api/book/PATCH"
import { ParseParamsDecorator } from "$lib/decorators/parse-params"


export const load: PageServerLoad = applyDecorators(
    [ParseParamsDecorator({
        isbn: {
            schema: ISBNSchema,
            onError: () => error(HttpCodes.ClientError.BadRequest, "Invalid ISBN")
        }
    })],
    async ({ params }) => {
        const { isbn } = params

        const book = await db.books.book.getEntireBookByISBN(isbn)
        if (!book) {
            error(HttpCodes.ClientError.NotFound, "Book Not Available")
        }

        const form = await superValidate(book, zod(BookUpdateSchema), { errors:false })

        return {
            form,
            allAuthors: await db.books.author.getAllAuthors(),
            allPublishers: await db.books.publisher.getAllPublishers(),
            allSubjects: await db.books.subject.getAllSubjects(),
            allLocations: await db.books.location.getAllLocations(),
            allLanguages: await db.books.language.getAllLanguages()
        }
    }
)

export const actions: Actions = {
    default: applyDecorators(
        [AuthDecorator(["Edit Book"])],
        async ({ request, locals }) => {
            const formData = await request.formData()
            const form = await superValidate(formData, zod(BookUpdateSchema))

            if (!form.valid) {
                return fail(400, { form })
            }

            let info: BookPatchMethodReturn
            try {
                info = await API.book.PATCH(form, locals.user!.id)

                if (!info.success)
                    return fail(info.code, info)

                return message(form, {
                    type: info.success ? "success" : "error",
                    text: info.message
                })
            }
            catch (err) {
                if (err instanceof HttpError) error(err.httpCode, err.message)
                else error(HttpCodes.ServerError.InternalServerError, "Internal Server Error")
            }
        }
    )
}
