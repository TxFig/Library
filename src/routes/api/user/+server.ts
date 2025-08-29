// import type { RequestHandler } from "./$types"
// import api, { ApiMethodResponse } from "$lib/server/api"
// import { handleApiErrorWrapper, ApiError } from "$lib/server/api/error"
// import authValidator from "$lib/request-validators/auth"


// export const GET: RequestHandler = handleApiErrorWrapper(async (event) => {
//     authValidator(event, (status, message) => {
//         throw new ApiError(status, message)
//     })
//     const result = await api.user.GET()

//     return ApiMethodResponse(result)
// })

// // import AuthDecorator from "$lib/decorators/auth"
// // import { json } from "@sveltejs/kit"
// // import HttpCodes from "$lib/utils/http-codes"
// // import { applyDecorators } from "$lib/decorators"
// // import { superValidate } from "sveltekit-superforms"
// // import { zod } from "sveltekit-superforms/adapters"
// // import { UserCreateSchema } from "$lib/_validation/auth/user"
// // export const POST: RequestHandler = applyDecorators(
// //     [AuthDecorator(["Admin"])],
// //     async ({ request, locals }) => {
// //         const formData= await request.formData()
// //         const userId = locals.user!.id
// //         const form = await superValidate(formData, zod(UserCreateSchema))

// //         if (!form.valid) {
// //             return json({
// //                 message: "Invalid Form Data",
// //                 errors: form.errors
// //             }, {
// //                 status: HttpCodes.ClientError.BadRequest
// //             })
// //         }

// //         return ApiMethodResponse(
// //             await api.user.POST(form, userId)
// //         )
// //     }
// // )
