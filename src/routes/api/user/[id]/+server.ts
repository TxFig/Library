import type { RequestHandler } from "./$types"
import { error } from "@sveltejs/kit"
import HttpCodes from "$lib/utils/http-codes"
import methods from "../index"


export const DELETE: RequestHandler = async ({ params, locals }) => {
    if (!locals.user || locals.user.permissionGroup.name != "Admin") {
        error(HttpCodes.ClientError.Unauthorized, {
            message: "Need to be logged in to delete users"
        })
    }
    return methods.DELETE(params.id)
}

// export const DELETE: RequestHandler = applyDecorators(decorators.ensureAdmin(), methods.DELETE)
