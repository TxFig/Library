import { z } from "zod"
import path from "path"
import chalk from "chalk";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";


export const envVariablesSchema = z.object({
    STATIC: z.string().min(1, "STATIC required").refine(path.isAbsolute, "STATIC must be an absolute path"),
    PORT: z.coerce.number().min(1).max(65535).default(3000),
    RESTART: z.string().optional().default("always"),
    ORIGIN: z.string().url().min(1, "Required"),

    DATABASE_URL: z.string().min(1, "Required").url(),

    EMAIL_HOST: z.string().min(1, "Required").url(),
    EMAIL_PORT: z.coerce.number().min(1, "Required").default(25),
    EMAIL_USER: z.string().email().min(1, "Required"),
    EMAIL_PASSWORD: z.string().min(1, "Required"),
    EMAIL_FROM: z.string().email().min(1, "Required"),

    EMAIL_CONFIRMATION_EXPIRATION_TIME: z.coerce.number().max(86400).default(600),
    SESSION_EXPIRATION_TIME: z.coerce.number().max(31536000).default(2592000),

    SESSION_COOKIE_NAME: z.string().default("sessionToken"),

    ADMIN_EMAIL: z.optional(z.string().email()),

    MAX_IMAGE_UPLOAD_SIZE: z.coerce.number().min(1).default(16000000),
    BODY_SIZE_LIMIT: z.coerce.number().min(1).default(64000000),
}).refine(envVariables =>
    envVariables.BODY_SIZE_LIMIT > envVariables.MAX_IMAGE_UPLOAD_SIZE,
    "BODY_SIZE_LIMIT must be greater than MAX_IMAGE_UPLOAD_SIZE"
)

export async function validateEnvVariables(variables: Record<string, unknown>): Promise<void> {
    const result = await superValidate(variables, zod(envVariablesSchema))
    if (!result.valid) {
        const errors = Object.entries(result.errors).map(([key, value]) =>
            `- ${key}: ${value[0]}`
        ).join("\n")
        console.log(chalk.red(
            "Invalid environment variables. Errors:\n",
            errors, "\n"
        ))
        console.log(chalk.blue("See .env.example for an example."))
        process.exit(1)
    }

    console.log(chalk.green("Environment variables are valid."))
}
