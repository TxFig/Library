import { applyDecorators } from "$lib/decorators";
import AuthDecorator from "$lib/decorators/auth";
import ParseParamsDecorator from "$lib/decorators/parse-params";
import { ISBNSchema } from "$lib/validation/book/isbn";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import HttpCodes from "$lib/utils/http-codes";
import api, { defaultApiMethodResponse } from "$lib/server/api";
import { BookCreateSchema } from "$lib/validation/book/book-form";


const ISBNParamSchema = {
    schema: ISBNSchema,
    onError: () => json({
        message: "Invalid ISBN"
    }, {
        status: HttpCodes.ClientError.BadRequest
    })
}


export const DELETE: RequestHandler = applyDecorators(
    [AuthDecorator(["Edit Book"]), ParseParamsDecorator({ isbn: ISBNParamSchema })],
    async ({ request, locals, params }) => {
        const userId = locals.user!.id
        const json = await request.json()
        const parsingResult = BookCreateSchema.shape.subjects.safeParse(json.subjects)

        if (!parsingResult.success) {
            return json({
                message: "Invalid Image File",
                errors: parsingResult.error.message
            }, {
                status: HttpCodes.ClientError.BadRequest
            })
        }

        return defaultApiMethodResponse(
            await api.book.subjects.DELETE(params.isbn, parsingResult.data, userId)
        )
    }
)
