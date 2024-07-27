import { z } from "zod";


export const BookCollectionCreateSchema = z.object({
    name: z.string().min(1, "Name Required")
})
export type BookCollectionCreateSchema = typeof BookCollectionCreateSchema
export type BookCollectionCreateData = z.infer<BookCollectionCreateSchema>
