import type { Implements } from "$lib/utils/types";
import type { SettingsUpdateData } from "$lib/validation/auth/settings";
import type { InternalApiMethodReturn } from "..";
import db from "$lib/server/database/"
import HttpCodes, { type HttpErrorCodesValues } from "$lib/utils/http-codes"
import log, { logError } from "$lib/logging";


export type SettingsPatchMethodReturn = Implements<InternalApiMethodReturn, {
    success: true
    message: string,
    data: SettingsUpdateData
} | {
    success: false
    code: HttpErrorCodesValues,
    message: string,
}>

export async function PATCH(data: SettingsUpdateData, userId: number): Promise<SettingsPatchMethodReturn> {
    try {
        await db.auth.settings.updateUserSettings(userId, data)
        await log("info", `Settings updated for user: ${userId}`, userId, data)
        return {
            message: "Successfully Updated Settings",
            success: true,
            data
        }
    } catch (err) {
        await logError(err, `Error updating settings for user: ${userId} in database`, userId)
        return {
            success: false,
            code: HttpCodes.ServerError.InternalServerError,
            message: "Error Updating Settings"
        }
    }
}

export default PATCH
