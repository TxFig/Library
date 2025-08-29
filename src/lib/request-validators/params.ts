import type { RequestEvent } from "@sveltejs/kit"
import * as v from "valibot"


export type ParamsSchemas<Params extends RequestEvent["params"]> = {
    [key in keyof Params]?: {
        schema: v.GenericSchema<unknown, string>,
        onInvalid: () => never
    }
}

type ParamsEvent<Event extends RequestEvent> = Event & {  }
function paramsValidator<const Event extends RequestEvent>(
    event: Event,
    schemas: ParamsSchemas<Event["params"]>
) {
    const { params } = event

    for (const [key, schema] of Object.entries(schemas)) {
        if (!schema) continue

        const value = params[key]
        try {
            params[key] = v.parse(schema.schema, value)
        } catch (err) {
            schema.onInvalid?.()
        }
    }
}


export default paramsValidator
