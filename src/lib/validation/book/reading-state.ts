import { z } from "zod"
import { ReadingState } from "@prisma/client"


const StateSchema = z.union([
    z.literal(ReadingState.NOT_READ),
    z.literal(ReadingState.READING),
    z.literal(ReadingState.READ),
    z.literal(ReadingState.WANT_TO_READ)
])

export const ReadingStateUpdateSchema = z.object({
    state: StateSchema,
    bookId: z.number()
})
export type ReadingStateUpdateSchema = typeof ReadingStateUpdateSchema
export type ReadingStateUpdateData = z.infer<ReadingStateUpdateSchema>
