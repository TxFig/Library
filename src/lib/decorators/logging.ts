import type { RequestEvent } from "@sveltejs/kit"
import type { TargetFunction } from "."


export function LoggingDecorator() {
    return function<Event extends RequestEvent, Return>(
        target: TargetFunction<Event, Return>
    ): TargetFunction<Event, Return> {
        return async function(event) {
            const { request, url } = event

            console.log(`Request: ${request.method} ${url.pathname}`)
            try {
                const response = await target(event)

                if (response instanceof Response) {
                    console.log(`Response: ${response.status} ${response.statusText}`)
                } else {
                    console.log(`Response: ${response}`)
                }

                return response
            } catch (error) {
                console.log(`Error: ${error}`)
                throw error
            }
        }
    }
}

export default LoggingDecorator
