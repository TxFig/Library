import HttpCodes from "$lib/utils/http-codes"
import { error, json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import { applyDecorators } from "$lib/decorators"
import AuthDecorator from "$lib/decorators/auth"
import { z } from "zod"
import ParseParamsDecorator from "$lib/decorators/parse-params"
import api, { defaultApiMethodResponse } from "$lib/server/api"
import { BookCollectionCreateSchema } from "$lib/validation/book-collection/collection"


const CollectionIdParamSchema = {
    schema: z.coerce.number().int().positive().finite().safe(),
    onError: () => error(HttpCodes.ClientError.BadRequest, {
        message: "Invalid collection id"
    })
}

export const PATCH: RequestHandler = applyDecorators(
    [
        AuthDecorator(["View Book"]),
        ParseParamsDecorator({ id: CollectionIdParamSchema })
    ],
    async ({ locals, params, request }) => {
        const userId = locals.user!.id
        const collectionId = Number(params.id)
        const body = await request.json()
        const { name } = body

        const parsingResult = BookCollectionCreateSchema.safeParse(body)
        if (!parsingResult.success) {
            return json({
                message: "Invalid Form Data",
                errors: parsingResult.error.flatten()
            }, {
                status: HttpCodes.ClientError.BadRequest
            })
        }

        return defaultApiMethodResponse(
            await api.bookCollection.PATCH(collectionId, userId, name)
        )
    }
)


export const DELETE: RequestHandler = applyDecorators(
    [
        AuthDecorator(["View Book"]),
        ParseParamsDecorator({ id: CollectionIdParamSchema })
    ],
    async ({ locals, params }) => {
        const userId = locals.user!.id
        const collectionId = Number(params.id)

        return defaultApiMethodResponse(
            await api.bookCollection.DELETE(collectionId, userId)
        )
    }
)
