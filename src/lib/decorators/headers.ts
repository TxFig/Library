import type { RequestEvent } from "@sveltejs/kit";
import type { TargetFunction } from ".";


const Headers = [
    "Accept",
    "Accept-Language",
    "Content-Language",
    "Content-Type"
] as const
type Headers = typeof Headers[number]

type HeadersInput = Partial<Record<Headers, string | string[]>>
export function HeadersValidationDecorator<Event extends RequestEvent, Return>(
    headers: HeadersInput,
    onInvalid: () => any = () => {}
) {
    return function(target: TargetFunction<Event, Return>): TargetFunction<Event, Return> {
        return function(event) {
            const { request: { headers: requestHeaders } } = event

            for (const [key, expectedValue] of Object.entries(headers)) {
                const value = requestHeaders.get(key)
                if (value === null) return onInvalid()
                const actualValue = value.split(";")[0]

                if (
                    (typeof expectedValue === "string" && expectedValue !== actualValue) ||
                    (Array.isArray(expectedValue) && !expectedValue.includes(actualValue))
                ) return onInvalid()
            }

            return target(event)
        }
    }
}

/*
    Examples:

    HeadersValidationDecorator({ "Content-Type": "application/x-www-form-urlencoded" })
    HeadersValidationDecorator({ "Content-Type": ["application/x-www-form-urlencoded", "multipart/form-data"] })
*/


export default HeadersValidationDecorator
