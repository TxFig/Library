import type { RequestEvent } from "@sveltejs/kit";
import type { z } from "zod";
import type { TargetFunction } from ".";

interface ParamSchema {
    schema: z.ZodTypeAny,
    onError?: () => any
}

type ValidateParams<Event extends RequestEvent> = {
    [key in keyof Event["params"]]?: ParamSchema
}

export function ParseParamsDecorator<Event extends RequestEvent, Return>(
    schemas: ValidateParams<Event>
) {
    return function(
        target: TargetFunction<Event, Return>
    ): TargetFunction<Event, Return> {
        return function(event) {
            const { params } = event

            for (const [key, schema] of Object.entries(schemas)) {
                if (!schema) continue

                const value = params[key]
                try {
                    params[key] = schema.schema.parse(value)
                } catch (err) {
                    schema.onError?.()
                }
            }
            return target(event)
        }
    }
}

export default ParseParamsDecorator
