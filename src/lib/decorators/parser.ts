import { type RequestEvent } from "@sveltejs/kit"
import type { z } from "zod"
import HttpCodes from "$lib/utils/http-codes"
import { HttpError } from "$lib/utils/custom-errors"
import { decode as decodeFormData, type FormDataInfo } from "decode-formdata"
import clearEmptyFields from "../utils/clear-empty-fields"
import type { MaybePromise } from "."


type ReplaceValues<Object, NewValue> = { [Key in keyof Object]: NewValue } //! Not Recursive
export function ParserDecorator<
    RouteParams extends Partial<Record<string, string>>
>(
    config: {
        params?: ReplaceValues<RouteParams, z.ZodType>,
        formData?: {
            schema: z.ZodType,
            decodeInfo: FormDataInfo
        }
    }
) {
    return function<
        Event extends RequestEvent,
        Return
    >(
        target: (event: Event) => MaybePromise<Return>
    ): (event: Event) => MaybePromise<Return> {
        function parseParams(params: Partial<Record<string, string>>): void {
            for (const paramsKey in config.params) {
                if (!Object.hasOwn(params, paramsKey)) continue

                const schema = config.params[paramsKey]
                const data = params[paramsKey]
                const result = schema.safeParse(data)

                if (!result.success) {
                    throw new HttpError(
                        HttpCodes.ClientError.BadRequest,
                        result.error.message
                    )
                }
            }
        }

        function parseFormData(formData: FormData): void {
            const schema = config.formData!.schema
            const decodedFormData = decodeFormData(
                formData,
                config.formData!.decodeInfo
            )
            const data = clearEmptyFields(decodedFormData)

            const result = schema.safeParse(data)

            if (!result.success) {
                throw new HttpError(
                    HttpCodes.ClientError.BadRequest,
                    result.error.message
                )
            }
        }

        return async function(event) {
            if (config.params) parseParams(event.params)

            if (config.formData) {
                try {
                    const formData = await event.request.formData()
                    parseFormData(formData)
                } catch {}
            }

            return target(event)
        }
    }
}

export default ParserDecorator
