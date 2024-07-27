import type { RequestHandler } from "./$types";
import { json } from "@sveltejs/kit";
import { HttpCodes } from "$lib/utils/http-codes"
import { applyDecorators } from "$lib/decorators";
import AuthDecorator from "$lib/decorators/auth";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { BookCollectionCreateSchema } from "$lib/validation/book-collection/collection";
import api, { defaultApiMethodResponse } from "$lib/server/api";


export const POST: RequestHandler = applyDecorators(
    [AuthDecorator(["View Book"])],

    async ({ locals, request }) => {
        const userId = locals.user!.id
        // const formData = await request.formData()
        const json = await request.json()

        const form = await superValidate(json, zod(BookCollectionCreateSchema))

        if (!form.valid) {
            return json({
                message: "Invalid Form Data",
                errors: form.errors
            }, {
                status: HttpCodes.ClientError.BadRequest
            })
        }

        return defaultApiMethodResponse(
            await api.bookCollection.POST(form, userId)
        )
    }
)
