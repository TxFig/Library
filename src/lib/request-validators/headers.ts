import { ApiError } from "$lib/server/api/error"
import HttpCodes from "$lib/utils/http-codes"
import type { Entries } from "$lib/utils/types"
import type { RequestEvent } from "@sveltejs/kit"


const Headers = [
    "Accept",
    "Accept-Language",
    "Content-Language",
    "Content-Type"
] as const
type Headers = typeof Headers[number]

type HeadersInput = Partial<Record<Headers, string | string[]>>

function invalidHeaders(header: Headers, expected: string | string[], received: string | null): never {
    let expectedString = expected
    if (Array.isArray(expected)) {
        expectedString = expected.map(e => `'${e}'`).join(", ")
    }

    throw new ApiError(
        HttpCodes.ClientError.BadRequest,
        `Invalid ${header} header. Expected ${expectedString}, received ${received}`
    )
}

export function headersValidator(event: RequestEvent, headers: HeadersInput): void {
    const { request: { headers: requestHeaders } } = event

    for (const [key, expectedValue] of Object.entries(headers) as Entries<HeadersInput>) {
        if (expectedValue === undefined || expectedValue === null) continue

        const value = requestHeaders.get(key)
        if (value === null) invalidHeaders(key, expectedValue, null)
        const actualValue = value.split(";")[0]

        if (
            (typeof expectedValue === "string" && expectedValue !== actualValue) ||
            (Array.isArray(expectedValue) && !expectedValue.includes(actualValue))
        ) invalidHeaders(key, expectedValue, actualValue)
    }
}


export default headersValidator
