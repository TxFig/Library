import { error, type RequestEvent } from "@sveltejs/kit"
import HttpCodes from "$lib/utils/http-codes"
import type { TargetFunction } from "."
import { hasPermissions, type PermissionName } from "$lib/utils/permissions"


export function AuthDecorator(permissions: PermissionName[]) {
    return function<Event extends RequestEvent, Return>(
        target: TargetFunction<Event, Return>
    ): TargetFunction<Event, Return> {
        return function(event) {
            if (!event.locals.user) {
                error(HttpCodes.ClientError.Unauthorized, {
                    message: "Need to be logged in"
                })
            }
            if (!hasPermissions(event.locals.user, permissions)) {
                error(HttpCodes.ClientError.Forbidden, {
                    message: "Need to have permissions" // TODO: Add permissions to error
                })
            }

            return target(event)
        }
    }
}

export default AuthDecorator
