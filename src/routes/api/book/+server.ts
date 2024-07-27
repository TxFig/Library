import type { RequestHandler } from "./$types";

import { applyDecorators } from "$lib/decorators";
import AuthDecorator from "$lib/decorators/auth";

import HttpCodes from "$lib/utils/http-codes"
import { json } from "@sveltejs/kit";

import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { BookCreateSchema } from "$lib/validation/book/book-form";

import api, { defaultApiMethodResponse } from "$lib/server/api"


export const GET: RequestHandler = applyDecorators(
    [AuthDecorator(["View Book"])],
    async () => defaultApiMethodResponse(
        await api.book.GET()
    )
)

export const POST: RequestHandler = applyDecorators(
    [AuthDecorator(["Create Book"])],
    async ({ request, locals }) => {
        const formData = await request.formData()
        const userId = locals.user!.id
        const form = await superValidate(formData, zod(BookCreateSchema))

        if (!form.valid) {
            return json({
                message: "Invalid Form Data",
                errors: form.errors
            }, {
                status: HttpCodes.ClientError.BadRequest
            })
        }

        return defaultApiMethodResponse(
            await api.book.POST(form, userId)
        )
    }
)
