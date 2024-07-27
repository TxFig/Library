import { z } from "zod"

export const MAX_INT32BIT = 2 ** 31 - 1

export const EmailSchema = z
    .string()
    .min(1, "Required")
    .email("Invalid Email")
