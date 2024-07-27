import type { RequestHandler } from "./$types"
import { json } from "@sveltejs/kit"
import HttpCodes from "$lib/utils/http-codes"
import { applyDecorators } from "$lib/decorators"
import AuthDecorator from "$lib/decorators/auth"
import ParseParamsDecorator from "$lib/decorators/parse-params"
import api, { defaultApiMethodResponse } from "$lib/server/api"
import { uuidv4Schema } from "$lib/validation/auth/uuid"
import { zod } from "sveltekit-superforms/adapters"
import { superValidate } from "sveltekit-superforms"
import { UserUpdateSchema } from "$lib/validation/auth/user"


const OpaqueIdParamSchema = {
    schema: uuidv4Schema,
    onError: () => json({
        message: "Invalid Opaque Id"
    }, {
        status: HttpCodes.ClientError.BadRequest
    })
}

export const GET: RequestHandler = applyDecorators(
    [AuthDecorator(["View Book"]), ParseParamsDecorator({ opaqueId: OpaqueIdParamSchema })],
    async ({ params }) => defaultApiMethodResponse(
        await api.user.GET(params.opaqueId)
    )
)

export const PATCH: RequestHandler = applyDecorators(
    [AuthDecorator(["Admin"]), ParseParamsDecorator({ opaqueId: OpaqueIdParamSchema })],
    async ({ request, locals, params }) => {
        const formData = await request.formData()
        const userId = locals.user!.id
        const opaqueId = params.opaqueId

        const form = await superValidate(formData, zod(UserUpdateSchema))

        if (!form.valid) {
            return json({
                message: "Invalid Form Data",
                errors: form.errors
            }, {
                status: HttpCodes.ClientError.BadRequest
            })
        }

        return defaultApiMethodResponse(
            await api.user.PATCH(form, opaqueId, userId)
        )
    }
)

export const DELETE: RequestHandler = applyDecorators(
    [AuthDecorator(["Admin"]), ParseParamsDecorator({ opaqueId: OpaqueIdParamSchema })],
    async ({ locals, params }) => defaultApiMethodResponse(
        await api.user.DELETE(params.opaqueId, locals.user!.id)
    )
)
