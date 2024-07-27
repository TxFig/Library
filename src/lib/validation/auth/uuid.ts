import { validate } from "uuid";
import { z } from "zod";

export const uuidv4Schema = z
    .string()
    .refine(validate, "Invalid UUIDv4 String")
