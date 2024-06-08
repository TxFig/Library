import { z } from "zod";


export const SettingsUpdateSchema = z.object({
    visibleReadingState: z.boolean()
})

export type SettingsUpdateInput = z.input<typeof SettingsUpdateSchema>
export type SettingsUpdateData = z.infer<typeof SettingsUpdateSchema>
