import { applyDecorators } from "$lib/decorators"
import AuthDecorator from "$lib/decorators/auth"
import api, { defaultApiMethodResponse } from "$lib/server/api"
import { json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import HttpCodes from "$lib/utils/http-codes"
import { ISBNSchema } from "$lib/validation/book/isbn"
import { superValidate } from "sveltekit-superforms"
import { zod } from "sveltekit-superforms/adapters"
import { BookUpdateSchema } from "$lib/validation/book/book-form"
import { ParseParamsDecorator } from "$lib/decorators/parse-params"


const ISBNParamSchema = {
    schema: ISBNSchema,
    onError: () => json({
        message: "Invalid ISBN"
    }, {
        status: HttpCodes.ClientError.BadRequest
    })
}

export const GET: RequestHandler = applyDecorators(
    [AuthDecorator(["View Book"]), ParseParamsDecorator({ isbn: ISBNParamSchema })],
    async ({ params }) => defaultApiMethodResponse(
        await api.book.GET(params.isbn)
    )
)

export const PATCH: RequestHandler = applyDecorators(
    [AuthDecorator(["Edit Book"]), ParseParamsDecorator({ isbn: ISBNParamSchema })],
    async ({ request, locals, params }) => {
        const formData = await request.formData()
        const userId = locals.user!.id
        formData.set("isbn", params.isbn)

        const form = await superValidate(formData, zod(BookUpdateSchema))

        if (!form.valid) {
            return json({
                message: "Invalid Form Data",
                errors: form.errors
            }, {
                status: HttpCodes.ClientError.BadRequest
            })
        }

        return defaultApiMethodResponse(
            await api.book.PATCH(form, userId)
        )
    }
)

export const DELETE: RequestHandler = applyDecorators(
    [AuthDecorator(["Delete Book"]), ParseParamsDecorator({ isbn: ISBNParamSchema })],
    async ({ locals, params }) => defaultApiMethodResponse(
        await api.book.DELETE(params.isbn, locals.user!.id)
    )
)
