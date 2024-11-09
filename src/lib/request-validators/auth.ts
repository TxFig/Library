import { ApiError, ApiMethodResponse } from "$lib/server/api"
import HttpCodes from "$lib/utils/http-codes"
import { hasPermissions, type PermissionName } from "$lib/utils/permissions"
import { error, type RequestEvent } from "@sveltejs/kit"


type AuthEvent<Event extends RequestEvent> = Event & {
    locals: {
        user: NonNullable<App.Locals["user"]>
        session: NonNullable<App.Locals["session"]>
    }
}
export function authValidator<Event extends RequestEvent>(event: Event, permissions?: PermissionName[]): asserts event is AuthEvent<Event> {
    if (!(event.locals.user && event.locals.session)) {
        // error(HttpCodes.ClientError.Unauthorized, {
        //     message: "Need to be logged in"
        // })
        // return ApiMethodResponse({
        //     success: false,
        //     message: "Need to be logged in",
        //     code: HttpCodes.ClientError.Unauthorized,
        // })
        throw new ApiError(
            HttpCodes.ClientError.Unauthorized,
            "Need to be logged in"
        )
    }

    if (permissions && !hasPermissions(event.locals.user, permissions)) {
        const permissionsString = permissions.map(p => `'${p}'`).join(", ")
        // error(HttpCodes.ClientError.Forbidden, {
        //     message: `Need to have these permissions: ${permissionsString}`
        // })
        throw new ApiError(
            HttpCodes.ClientError.Forbidden,
            `Need to have these permissions: ${permissionsString}`
        )
    }
}


export default authValidator
