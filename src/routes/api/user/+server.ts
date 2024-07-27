import type { RequestHandler } from "./$types"
import { json } from "@sveltejs/kit"
import HttpCodes from "$lib/utils/http-codes"
import { applyDecorators } from "$lib/decorators"
import AuthDecorator from "$lib/decorators/auth"
import api, { defaultApiMethodResponse } from "$lib/server/api"
import { superValidate } from "sveltekit-superforms"
import { zod } from "sveltekit-superforms/adapters"
import { UserCreateSchema } from "$lib/validation/auth/user"


export const GET: RequestHandler = applyDecorators(
    [AuthDecorator(["View Book"])],
    async () => defaultApiMethodResponse(
        await api.user.GET()
    )
)

export const POST: RequestHandler = applyDecorators(
    [AuthDecorator(["Admin"])],
    async ({ request, locals }) => {
        const formData= await request.formData()
        const userId = locals.user!.id
        const form = await superValidate(formData, zod(UserCreateSchema))

        if (!form.valid) {
            return json({
                message: "Invalid Form Data",
                errors: form.errors
            }, {
                status: HttpCodes.ClientError.BadRequest
            })
        }

        return defaultApiMethodResponse(
            await api.user.POST(form, userId)
        )
    }
)
