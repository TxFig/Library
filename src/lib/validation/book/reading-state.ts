import * as v from "valibot"


export const readingStates = ["NOT_READ", "READING", "READ", "WANT_TO_READ"] as const
export type ReadingState = typeof readingStates[number]

export const ReadingStateUpdateSchema = v.object({
    state: v.picklist(readingStates)
})
export type ReadingStateUpdateSchema = typeof ReadingStateUpdateSchema
export type ReadingStateUpdateSchemaInput = v.InferInput<ReadingStateUpdateSchema>
export type ReadingStateUpdateSchemaOutput = v.InferOutput<ReadingStateUpdateSchema>
