import { AllReadingStates } from "$lib/server/database/auth/reading-state"
import { z } from "zod"
import { ISBNSchema } from "./isbn"


export const ReadingStateUpdateSchema = z.object({
    state: z.enum(AllReadingStates),
    isbn: ISBNSchema
})

export type ReadingStateUpdateSchema = z.infer<typeof ReadingStateUpdateSchema>
