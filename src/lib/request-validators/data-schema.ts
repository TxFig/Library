import { ApiError } from "$lib/server/api/error";
import HttpCodes from "$lib/utils/http-codes";
import type { Entries } from "$lib/utils/types";
import type { SchemaToSuperValidated } from "$lib/validation/utils";
import { superValidate, type Infer, type InferIn, type ValidationErrors } from "sveltekit-superforms";
import type * as v from "valibot";
import { valibot } from "sveltekit-superforms/adapters";
import type { RequestEvent } from "@sveltejs/kit";


function isObject(object: unknown): object is Record<PropertyKey, unknown> {
    return typeof object === "object" && !Array.isArray(object) && object !== null
}

type FormattedErrors = Record<PropertyKey, string | Record<PropertyKey, string>>

function formatErrorsArray(value: any[]): string {
    return value[0]
}

function formatErrorsObject(
    object: Record<PropertyKey, string[] | Record<PropertyKey, string[]>>
): string | Record<PropertyKey, string> {
    if (object._errors && Array.isArray(object._errors)) {
        return object._errors[0]
    }

    const errors = {} as Record<string, string>
    for (const [key, value] of Object.entries(object)) {
        if (Array.isArray(value)) {
            errors[key] = formatErrorsArray(value)
        }
    }
    return errors
}

function formatErrors<Schema extends v.GenericSchema>(errors: ValidationErrors<Infer<Schema>>): FormattedErrors {
    const formattedErrors: FormattedErrors = {}

    for (const [key, value] of Object.entries(errors) as Entries<typeof errors>) {
        if (key === "_errors" && Object.keys(errors).length - 1 !== 0) continue

        if (Array.isArray(value)) {
            formattedErrors[key] = formatErrorsArray(value)
        }
        else if (isObject(value)) {
            formattedErrors[key] = formatErrorsObject(value)
        }
    }

    return formattedErrors
}

export async function getFormDataOrJson<Json extends Record<PropertyKey, any>>(
    event: RequestEvent,
): Promise<FormData | Json | undefined> {
    const contentType = event.request.headers.get("Content-Type")
    if (
        contentType === "application/x-www-form-urlencoded" ||
        contentType === "multipart/form-data"
    ) {
        try {
            return await event.request.formData()
        } catch {}
    }
    if (contentType === "application/json") {
        try {
            return await event.request.json()
        } catch {}
    }

    return undefined
}

async function schemaValidator<Schema extends v.GenericSchema>(
    data: InferIn<Schema> | FormData,
    schema: Schema
): Promise<SchemaToSuperValidated<Schema>> {
    let form: SchemaToSuperValidated<Schema>
    try {
        // @ts-ignore: Type instantiation is excessively deep and possibly infinite.
        form = await superValidate(data, valibot(schema))
    } catch (err) {
        throw new ApiError(
            HttpCodes.ClientError.BadRequest,
            "Error parsing Data",
        )
    }

    if (!form.valid) {
        throw new ApiError(
            HttpCodes.ClientError.BadRequest,
            "Invalid Data",
            formatErrors(form.errors)
        )
    }

    return form
}


export default schemaValidator
