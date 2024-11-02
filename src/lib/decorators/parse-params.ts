import type { RequestEvent } from "@sveltejs/kit";
import type { z } from "zod";
import type { TargetFunction } from ".";


interface ParamSchema<Return = any> {
    schema: z.ZodTypeAny,
    onError?: () => Return
}

export type ParamsSchemas<Event extends RequestEvent, Return = any> = {
    [key in keyof Event["params"]]?: ParamSchema<Return>
}

export function ParseParamsDecorator<Event extends RequestEvent, Return, ParamErrorReturn = any>(
    schemas: ParamsSchemas<Event, ParamErrorReturn>
) {
    return function(
        target: TargetFunction<Event, Return>
    ): TargetFunction<Event, Return | ParamErrorReturn> {
        return function(event) {
            const { params } = event

            for (const [key, schema] of Object.entries(schemas)) {
                if (!schema) continue

                const value = params[key]
                try {
                    params[key] = schema.schema.parse(value)
                } catch (err) {
                    if (schema.onError)
                        return schema.onError()
                }
            }
            return target(event)
        }
    }
}

export default ParseParamsDecorator
