import { z } from "zod";


export const SettingsUpdateSchema = z.object({
    visibleReadingState: z.boolean()
})
export type SettingsUpdateSchema = typeof SettingsUpdateSchema

export type SettingsUpdateData = z.infer<SettingsUpdateSchema>
