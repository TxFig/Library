import type { RequestHandler } from "./$types";

import { applyDecorators } from "$lib/decorators";
import AuthDecorator from "$lib/decorators/auth";

import HttpCodes from "$lib/utils/http-codes"
import { json } from "@sveltejs/kit";

import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { BookCreateSchema } from "$lib/validation/book/book-form";

import API from "$lib/server/api"


export const GET: RequestHandler = applyDecorators(
    [AuthDecorator(["View Book"])],
    async () => {
        const methodReturn = await API.book.GET()
        if (methodReturn.success) {
            return json(methodReturn.data, {
                status: HttpCodes.Success
            })
        } else {
            return json({
                message: methodReturn.message
            }, {
                status: methodReturn.code
            })
        }
    }
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

        const methodReturn = await API.book.POST(form, userId)
        if (methodReturn.success) {
            return json({
                message: methodReturn.message,
                data: methodReturn.data
            }, {
                status: HttpCodes.Success
            })
        } else {
            return json({
                message: methodReturn.message
            }, {
                status: methodReturn.code
            })
        }
    }
)
