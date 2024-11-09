import type { RequestEvent } from "./$types";

import authValidator from "$lib/request-validators/auth";
import api, { handleApiError } from "$lib/server/api";
import { BaseEndpoint } from "$lib/server/api/endpoint";


export const GET = BaseEndpoint<RequestEvent>(api.book.GET, {
    auth: ["View Book"]
})

// export const POST = FormEndpoint<RequestEvent, BookCreateSchema>(api.book.POST, BookCreateSchema, {
//     auth: ["Create Book"]
// })

export const POST = function(event: RequestEvent) {
    try {
        authValidator(event, ["Create Book"])
    }
    catch (err) {
        return handleApiError(err)
    }
}
