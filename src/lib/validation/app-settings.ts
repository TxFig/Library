import { z } from "zod";


export const AppSettingsSchema = z.object({
    public: z.boolean()
})
export type AppSettingsSchema = typeof AppSettingsSchema
export type AppSettingsSchemaData = z.output<typeof AppSettingsSchema>
