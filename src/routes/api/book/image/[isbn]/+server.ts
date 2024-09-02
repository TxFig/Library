import { applyDecorators } from "$lib/decorators";
import AuthDecorator from "$lib/decorators/auth";
import ParseParamsDecorator from "$lib/decorators/parse-params";
import { ISBNSchema } from "$lib/validation/book/isbn";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import HttpCodes from "$lib/utils/http-codes";
import FileSchema from "$lib/validation/book/file";
import api, { defaultApiMethodResponse } from "$lib/server/api";


const ISBNParamSchema = {
    schema: ISBNSchema,
    onError: () => json({
        message: "Invalid ISBN"
    }, {
        status: HttpCodes.ClientError.BadRequest
    })
}


export const PATCH: RequestHandler = applyDecorators(
    [AuthDecorator(["Edit Book"]), ParseParamsDecorator({ isbn: ISBNParamSchema })],
    async ({ request, locals, params }) => {
        const userId = locals.user!.id
        const formData = await request.formData()
        const file = formData.get("image")
        const parsingResult = FileSchema.safeParse(file)

        if (!parsingResult.success) {
            return json({
                message: "Invalid Image File",
                errors: parsingResult.error.message
            }, {
                status: HttpCodes.ClientError.BadRequest
            })
        }

        return defaultApiMethodResponse(
            await api.book.image.PATCH(params.isbn, parsingResult.data, userId)
        )
    }
)
