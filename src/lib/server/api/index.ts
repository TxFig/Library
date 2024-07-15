import type { HttpErrorCodesValues } from "$lib/utils/http-codes"
import book from "./book"


export type ApiMethodReturn = {
    success: true,
    message?: string,
    data: any
} | {
    success: false,
    code: HttpErrorCodesValues,
    message: string,
}

export default {
    book
}
