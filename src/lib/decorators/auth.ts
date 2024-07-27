import { error, type RequestEvent } from "@sveltejs/kit"
import type { TargetFunction } from "."
import HttpCodes from "$lib/utils/http-codes"
import { hasPermissions, type PermissionName } from "$lib/utils/permissions"


export function AuthDecorator(permissions?: PermissionName[]) {
    return function<Event extends RequestEvent, Return>(
        target: TargetFunction<Event, Return>
    ): TargetFunction<Event, Return> {
        return function(event) {
            if (!(event.locals.user && event.locals.session)) {
                error(HttpCodes.ClientError.Unauthorized, {
                    message: "Need to be logged in"
                })
            }
            if (permissions && !hasPermissions(event.locals.user, permissions)) {
                const permissionsString = permissions.map(p => `'${p}'`).join(", ")
                error(HttpCodes.ClientError.Forbidden, {
                    message: `Need to have these permissions: ${permissionsString}`
                })
            }

            return target(event)
        }
    }
}

export default AuthDecorator
