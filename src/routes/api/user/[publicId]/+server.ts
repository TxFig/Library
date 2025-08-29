// import type { RequestHandler } from "./$types"
// import { handleApiErrorWrapper, ApiError } from "$lib/server/api/error"
// import authValidator from "$lib/request-validators/auth"
// import api, { ApiMethodResponse } from "$lib/server/api"
// import paramsValidator from "$lib/request-validators/params"
// import { PublicIdParamSchema } from "$lib/server/api/paramSchemas"


// export const GET: RequestHandler = handleApiErrorWrapper(async (event) => {
//     authValidator(event, (status, message) => {
//         throw new ApiError(status, message)
//     })
//     paramsValidator(event, {
//         publicId: PublicIdParamSchema
//     })
//     const result = await api.user.GET(event.params.publicId)

//     return ApiMethodResponse(result)
// })

