import type { ApiJsonResponse, ApiMethodReturn } from "$lib/server/api"


export type FetchApiOptions = {
    method?: "POST" | "PATCH" | "PUT" | "DELETE",
    body?: Record<PropertyKey, any>
}

export async function fetchAPI<MethodReturn extends ApiMethodReturn>(
    path: string, options?: FetchApiOptions
): Promise<ApiJsonResponse<MethodReturn> | null> {
    let response: Response
    try {
        if (!path.startsWith("/"))
            path = `/${path}`

        response = await fetch(`/api${path}`, options?.method && {
            method: options.method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(options.body)
        })
    } catch (err) {
        console.error("Error fetching api endpoint", path, err)
        return null
    }

    let json: ApiJsonResponse<MethodReturn>
    try {
        json = await response.json()
    } catch (err) {
        console.error("Error getting json from response", path, err)
        return null
    }

    return json
}
