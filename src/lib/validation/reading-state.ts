import { AllReadingStates } from "$lib/server/database/auth"
import { z } from "zod"
import { ISBNSchema } from "./isbn"


export const ReadingStateUpdateSchema = z.object({
    state: z.enum(AllReadingStates),
    isbn: ISBNSchema
})

export type ReadingStateUpdateSchema = z.infer<typeof ReadingStateUpdateSchema>
