import type { ActionFailure, ActionResult, SubmitFunction } from "@sveltejs/kit"
import { decode as decodeFormData, type FormDataInfo } from "decode-formdata"
import type { z } from "zod"
import clearEmptyFields from "./clear-empty-fields"
import { applyAction } from "$app/forms"


// Copied from ./$types to extract ActionResultSuccess and ActionResultFailure from actions object
type ExcludeActionFailure<T> =
    T extends ActionFailure<any> ? never : T extends void ? never : T
type ActionsSuccess<T extends Record<string, (...args: any) => any>> = {
    [Key in keyof T]: ExcludeActionFailure<Awaited<ReturnType<T[Key]>>>
}[keyof T]
type ExtractActionFailure<T> =
    T extends ActionFailure<infer X>	? X extends void ? never : X : never;
type ActionsFailure<T extends Record<string, (...args: any) => any>> = {
    [Key in keyof T]: Exclude<ExtractActionFailure<Awaited<ReturnType<T[Key]>>>, void>
}[keyof T]
// ------------------------------

export function SubmitFunctionFactory<
    ActionsExport extends Record<string, (...args: any) => any>,
    ActionResultSuccess extends Record<string, unknown> | undefined = ActionsSuccess<ActionsExport>,
    ActionResultFailure extends Record<string, unknown> | undefined = ActionsFailure<ActionsExport>,
    Schema extends z.ZodTypeAny = z.ZodTypeAny,
>(
    schema: Schema,
    formDataDecodeInfo: FormDataInfo,
    onClientSideParsingError?: (error: z.ZodError<z.infer<Schema>>) => void,
    onServerSideResponse?: (actionResult: ActionResult<ActionResultSuccess, ActionResultFailure>) => void
): SubmitFunction<ActionResultSuccess, ActionResultFailure> {
    return function(input) {
        const { formData, cancel } = input

        const decodedFormData = decodeFormData(formData, formDataDecodeInfo)
        const data = clearEmptyFields(decodedFormData)

        const parsingResult = schema.safeParse(data)
        if (!parsingResult.success) {
            onClientSideParsingError?.(parsingResult.error)
            cancel()
        }

        return async function({ result }) {
            (onServerSideResponse ?? applyAction)(result)
        }
    }
}

export default SubmitFunctionFactory
