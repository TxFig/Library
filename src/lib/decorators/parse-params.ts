import type { RequestEvent } from "@sveltejs/kit";
import type { z } from "zod";
import type { TargetFunction } from ".";



export function ParseParamsDecorator<Event extends RequestEvent, Return, ErrorReturn>(
    schemas: {
        [key in keyof Event["params"]]: {
            schema: z.ZodTypeAny,
            onError?: () => ErrorReturn;
        }
    }
) {
    return function(
        target: TargetFunction<Event, Return | ErrorReturn>
    ): TargetFunction<Event, Return | ErrorReturn> {
        return function(event) {
            const { params } = event

            for (const [key, schema] of Object.entries(schemas)) {
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
