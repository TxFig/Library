import { z } from "zod";
import { EmailSchema } from "../utils";
import type { Infer, InferIn, SuperValidated } from "sveltekit-superforms";


export const LoginSchema = z.object({
    email: EmailSchema
})
export type LoginSchema = typeof LoginSchema
export type LoginFormData = z.output<typeof LoginSchema>

export type SuperFormLogin = SuperValidated<
    Infer<LoginSchema>,
    App.Superforms.Message,
    InferIn<LoginSchema>
>
