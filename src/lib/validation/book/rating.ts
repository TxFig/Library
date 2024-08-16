import { z } from "zod";


export const RatingUpdateSchema = z.object({
    rating: z.number().min(0).max(10),
    bookId: z.number()
})

export type RatingUpdateSchema = typeof RatingUpdateSchema
export type RatingUpdateData = z.infer<RatingUpdateSchema>
