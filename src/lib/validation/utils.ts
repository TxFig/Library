import type { Infer, InferIn, SuperValidated } from "sveltekit-superforms"
import { z } from "zod"

export const MAX_INT32BIT = 2 ** 31 - 1

export const EmailSchema = z // TODO: move to user file
    .string()
    .min(1, "Required")
    .email("Invalid Email")

export type SchemaToSuperValidated<
    Schema extends z.ZodType
> = SuperValidated<Infer<Schema>, App.Superforms.Message, InferIn<Schema>>
