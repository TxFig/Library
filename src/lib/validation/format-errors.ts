import type { Entries } from "$lib/utils/types"
import type { z } from "zod"


type ZodFormattedError = {
    _errors: string[]
} & {
    [key: string]: ZodFormattedError
}

type FormattedError = {
    [key: string]: string | FormattedError
}

export function getFormattedError<T>(error: z.ZodError<T>): string | FormattedError {
    const errorFormatted = error.format()

    const formatFormattedError = (errorFormatted: ZodFormattedError): string | FormattedError => {
        const obj: FormattedError = {}
        for (const [key, value] of Object.entries(errorFormatted) as Entries<ZodFormattedError>) {
            if (key == "_errors" && Array.isArray(value)) {
                if (value.length != 0) {
                    return (value as string[])[0]
                }
                else continue
            } else {
                obj[key] = formatFormattedError(value)
            }
        }
        return obj
    }

    return formatFormattedError(errorFormatted)
}
