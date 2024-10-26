import { type MaybePromise, type RequestHandler } from "@sveltejs/kit";
import { ApiMethodResponse, type ApiMethodReturn } from ".";
import { superValidate } from "sveltekit-superforms";
import type { Infer, InferIn, SuperValidated } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import HttpCodes from "$lib/utils/http-codes";
import type { z } from "zod";
import { applyDecorators } from "$lib/decorators";
import HeadersValidationDecorator from "$lib/decorators/headers";
import AuthDecorator from "$lib/decorators/auth";
import type { PermissionName } from "$lib/utils/permissions";


type FormEndpoint<Schema extends z.ZodType, Data = any> = (
    form: SuperValidated<Infer<Schema>, App.Superforms.Message, InferIn<Schema>>
) => MaybePromise<ApiMethodReturn<Data>>
type FormEndpointOptions = {
    auth?: PermissionName[]
    headers?: {
        contentType?: string[]
    }
}
const FormEndpointDefaultOptions: FormEndpointOptions = {
    auth: [],
    headers: {
        contentType: ["application/x-www-form-urlencoded", "multipart/form-data"]
    }
}

export function FormEndpoint<
    Schema extends z.ZodType,
    Params extends Partial<Record<string, string>> = Partial<Record<string, string>>,
    RouteId extends string | null = string | null
>(
    endpoint: FormEndpoint<Schema>,
    schema: Schema,
    options: FormEndpointOptions = FormEndpointDefaultOptions
): RequestHandler<Params, RouteId> {
    const combinedOptions = {
        ...FormEndpointDefaultOptions,
        ...options
    }

    return applyDecorators(
        [
            AuthDecorator(combinedOptions.auth),
            HeadersValidationDecorator(
                { "Content-Type": combinedOptions.headers?.contentType },
                () => ApiMethodResponse({
                    success: false,
                    message: "Invalid Content Type",
                    code: HttpCodes.ClientError.BadRequest
                })
            )
        ],
        async function({ request }) {
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
                await endpoint(form)
            )
        }
    )
}
