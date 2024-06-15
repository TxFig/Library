import type { RequestHandler } from "./$types"
import { error } from "@sveltejs/kit"
import HttpCodes from "$lib/utils/http-codes"
import methods from "../index"
import { hasPermission } from "$lib/utils/permissions"



export const DELETE: RequestHandler = async ({ params, locals }) => {
    if (!locals.user || !hasPermission(locals.user, "Admin")) {
        error(HttpCodes.ClientError.Unauthorized, {
            message: "Need to be logged in to delete users"
        })
    }
    return methods.DELETE(locals.user, params.id)
}

export const PATCH: RequestHandler = async ({ params, locals, request }) => {
    if (!locals.user || !hasPermission(locals.user, "Admin")) {
        error(HttpCodes.ClientError.Unauthorized, {
            message: "Need to be logged in to edit users"
        })
    }

    return methods.PATCH(locals.user, params.id, await request.json())
}

// export const DELETE: RequestHandler = applyDecorators(decorators.ensureAdmin(), methods.DELETE)
