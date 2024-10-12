import { z } from "zod";


export const PublicIdSchema = z.string().regex(/^[a-zA-Z0-9]{8}$/)
