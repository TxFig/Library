import HttpCodes, { type HttpClientErrorValues } from "$lib/utils/http-codes"
import { hasPermissions, type PermissionName } from "$lib/utils/permissions"
import { type RequestEvent } from "@sveltejs/kit"


export type AuthEventLocals = App.Locals & {
    user: NonNullable<App.Locals["user"]>
    session: NonNullable<App.Locals["session"]>
}
export type AuthEvent<Event extends RequestEvent> = Event & {
    locals: AuthEventLocals
}
export function authValidator<const Event extends RequestEvent>(
    event: Event,
    onInvalid: (
        status: HttpCodes["ClientError"]["Forbidden"] | HttpCodes["ClientError"]["Unauthorized"],
        message: string
    ) => never,
    permissions?: PermissionName[],
): asserts event is AuthEvent<Event> {
    if (!(event.locals.user && event.locals.session)) {
        onInvalid(
            HttpCodes.ClientError.Unauthorized,
            "Need to be logged in"
        )
    }

    if (permissions && !hasPermissions(event.locals.user.permissionGroup, permissions)) {
        const permissionsString = permissions.map(p => `'${p}'`).join(", ")
        onInvalid(
            HttpCodes.ClientError.Forbidden,
            `Need to have these permissions: ${permissionsString}`
        )
    }
}


export default authValidator
