import { HttpCodes, type HttpErrorCodesValues } from "$lib/utils/http-codes"
import { error, type RequestHandler } from "@sveltejs/kit"
import { ApiMethodResponse } from "."


export class ApiError extends Error {
    code: HttpErrorCodesValues
    errors?: any

    constructor(code: HttpErrorCodesValues, message: string, errors?: any) {
        super(message)
        this.code = code
        this.errors = errors
    }
}

export function handleApiError(err: unknown): Response {
    if (!(err instanceof ApiError)) {
        console.error(err)
        error(HttpCodes.ServerError.InternalServerError, {
            message: "Something went wrong",
            error: err
        })
    }

    return ApiMethodResponse({
        success: false,
        message: err.message,
        code: err.code,
        errors: err.errors
    })
}

export function handleApiErrorWrapper<
    Params extends Partial<Record<string, string>>,
    RouteId extends string | null
>(func: RequestHandler<Params, RouteId>): RequestHandler<Params, RouteId> {
    return async (event) => {
        try {
            return await func(event)
        } catch (err) {
            return handleApiError(err)
        }
    }
}
