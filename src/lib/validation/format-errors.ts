import type { z } from "zod"


// TODO: comment everything


type isErrorObject<Type> =
    Type extends (object | null | undefined) ?
        Type extends any[] ?
            false
        : Type extends File ?
            false
        : true
    : false

type FormattedError<Input> = string | (Input extends null ? never : {
    [key in keyof Input]?: isErrorObject<Input[key]> extends true ?
        FormattedError<Input[key]>
    : string
}) & { [key: string]: string | undefined }

/** @deprecated */
function formatZodFormattedError<T>(zodFormattedError: z.ZodFormattedError<T>): FormattedError<T> {
    let formatterError: FormattedError<T> = {} as FormattedError<T>
    for (const key in zodFormattedError) {
        if (key == "_errors") {
            const errorMessages = zodFormattedError[key]

            if (errorMessages.length != 0) {
                return errorMessages[0]
            }
            else continue
        }
        else {
            // @ts-ignore
            formatterError[key] = formatZodFormattedError(zodFormattedError[key])
        }

    }

    return formatterError
}

/** @deprecated */
export function getFormattedError<T>(error: z.ZodError<T>): FormattedError<T> {
    const zodFormattedError = error.format()
    return formatZodFormattedError(zodFormattedError)
}
