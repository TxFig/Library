import type { RequestHandler } from "./$types";

import { applyDecorators } from "$lib/decorators";
import AuthDecorator from "$lib/decorators/auth";

import HttpCodes from "$lib/utils/http-codes"
import { json } from "@sveltejs/kit";

import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { BookCreateSchema } from "$lib/validation/book/book";

import api, { ApiMethodResponse } from "$lib/server/api"
import HeadersValidationDecorator from "$lib/decorators/headers";
import { ApiEndpoint } from "$lib/server/api/endpoint";


export const GET: RequestHandler = applyDecorators(
    [AuthDecorator()],
    async () => ApiMethodResponse(
        await api.book.GET()
    )
)

// export const POST: RequestHandler = applyDecorators(
//     [
//         AuthDecorator(["Create Book"]),
//         HeadersValidationDecorator(
//             { "Content-Type": ["application/x-www-form-urlencoded", "multipart/form-data"] },
//             () => json(
//                 { message: "Invalid Content Type" },
//                 { status: HttpCodes.ClientError.BadRequest }
//             )
//         )
//     ],
//     async ({ request, locals }) => {
//         const formData = await request.formData()
//         const userId = locals.user!.id
//         const form = await superValidate(formData, zod(BookCreateSchema))

//         if (!form.valid) {
//             return json({
//                 message: "Invalid Form Data",
//                 errors: form.errors
//             }, {
//                 status: HttpCodes.ClientError.BadRequest
//             })
//         }

//         return ApiMethodResponse(
//             await api.book.POST(form, userId)
//         )
//     }
// )

export const POST = ApiEndpoint(api.book.POST, BookCreateSchema)
