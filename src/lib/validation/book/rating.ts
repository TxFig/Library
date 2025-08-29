import * as v from "valibot"


export const RatingUpdateSchema = v.object({
    rating: v.pipe(v.number(), v.integer(), v.minValue(0), v.maxValue(5)),
})
export type RatingUpdateSchema = typeof RatingUpdateSchema
export type RatingUpdateSchemaInput = v.InferInput<RatingUpdateSchema>
export type RatingUpdateSchemaOutput = v.InferOutput<RatingUpdateSchema>
