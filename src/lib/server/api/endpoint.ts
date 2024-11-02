import { applyDecorators } from "$lib/decorators";
import AuthDecorator from "$lib/decorators/auth";
import HeadersValidationDecorator from "$lib/decorators/headers";
import HttpCodes from "$lib/utils/http-codes";
import type { PermissionName } from "$lib/utils/permissions";
import type { SchemaToSuperValidated } from "$lib/validation/utils";
import { type MaybePromise, type RequestEvent } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { z } from "zod";
import { ApiMethodResponse, type ApiMethodReturn } from ".";


type EndpointOptions = {
    auth?: PermissionName[]
    headers?: {
        contentType?: string[]
    }
}

export type BaseEndpointFunction<Event extends RequestEvent> = (
    event: Event
) => MaybePromise<ApiMethodReturn>

type RequestHandlerFromRequestEvent<
    Event extends RequestEvent
> = (event: Event) => MaybePromise<Response>

export function BaseEndpoint<
    ReqEvent extends RequestEvent,
>(
    endpoint: BaseEndpointFunction<ReqEvent>,
    options: EndpointOptions = {}
): RequestHandlerFromRequestEvent<ReqEvent> {
    return applyDecorators(
        [
            AuthDecorator(options.auth ?? []),
            HeadersValidationDecorator(
                { "Content-Type": options.headers?.contentType },
                () => ApiMethodResponse({
                    success: false,
                    message: "Invalid Content Type",
                    code: HttpCodes.ClientError.BadRequest
                })
            )
        ],
        async function(event) {
            return ApiMethodResponse(
                await endpoint(event)
            )
        }
    )
}

export type FormEndpointFunction<
    Event extends RequestEvent,
    Schema extends z.ZodType,
    Data = any
> = (
    event: Event,
    form: SchemaToSuperValidated<Schema>
) => MaybePromise<ApiMethodReturn<Data>>

const FormEndpointDefaultOptions: EndpointOptions = {
    auth: [],
    headers: {
        contentType: ["application/x-www-form-urlencoded", "multipart/form-data"]
    }
}
export function FormEndpoint<
    ReqEvent extends RequestEvent,
    Schema extends z.ZodType,
    Data = any
>(
    endpoint: FormEndpointFunction<ReqEvent, Schema, Data>,
    schema: Schema,
    options: EndpointOptions = {}
): RequestHandlerFromRequestEvent<ReqEvent> {
    const mergedOptions = {
        ...FormEndpointDefaultOptions,
        ...options
    }
    return applyDecorators(
        [
            AuthDecorator(mergedOptions.auth ?? []),
            HeadersValidationDecorator(
                { "Content-Type": mergedOptions.headers?.contentType },
                () => ApiMethodResponse({
                    success: false,
                    message: "Invalid Content Type",
                    code: HttpCodes.ClientError.BadRequest
                })
            )
        ],
        async function(event) {
            const { request } = event
            const formData = await request.formData()
            const form = await superValidate(formData, zod(schema))

            if (!form.valid) {
                return ApiMethodResponse({
                    success: false,
                    message: "Invalid Form Data",
                    code: HttpCodes.ClientError.BadRequest,
                    errors: form.errors
                })
            }

            return ApiMethodResponse(
                await endpoint(event, form)
            )
        }
    )
}

export default {
    BaseEndpoint,
    FormEndpoint
}
