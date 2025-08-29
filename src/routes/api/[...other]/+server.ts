import type { RequestHandler } from "./$types";
import { ApiMethodResponse } from "$lib/server/api";
import HttpCodes from "$lib/utils/http-codes";


export const fallback: RequestHandler = function() {
    return ApiMethodResponse({
        success: false,
        code: HttpCodes.ClientError.NotFound,
        message: "API endpoint not found"
    })
}
