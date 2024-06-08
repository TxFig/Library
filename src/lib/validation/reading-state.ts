import { z } from "zod"
import { ISBNSchema } from "./isbn"
import { ReadingState } from "@prisma/client"


const StateSchema = z.union([
    z.literal(ReadingState.NOT_READ),
    z.literal(ReadingState.READING),
    z.literal(ReadingState.READ),
])

export const ReadingStateUpdateSchema = z.object({
    state: StateSchema,
    bookId: z.number()
})


export type ReadingStateUpdateSchema = z.infer<typeof ReadingStateUpdateSchema>
