import type { Infer, InferIn, SuperValidated } from "sveltekit-superforms"
import * as v from "valibot"


export const MAX_INT32BIT = 2 ** 31 - 1

export const StringSchema = v.pipe(
    v.string(),
    v.minLength(1, "Required"),
    v.maxLength(500, "Max 500 characters")
)

export const NumberSchema = v.pipe(
    v.number(),
    v.integer(),
    v.minValue(1, "Required"),
    v.maxValue(MAX_INT32BIT, `Max value: ${MAX_INT32BIT}`)
)

export type SchemaToSuperValidated<
    Schema extends v.GenericSchema
> = SuperValidated<Infer<Schema>, App.Superforms.Message, InferIn<Schema>>
