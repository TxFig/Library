import type { RequestHandler } from "./$types"
import { apiEndpoints } from "$lib/server/api"



type Shift<Arr extends any[]> = Arr extends [infer Value, ...infer Rest] ? [Value, Rest] : never
type RecursiveObjectGet<Object extends Record<PropertyKey, any>, Keys extends PropertyKey[]> =
    Keys extends [] ? Object : Object[Shift<Keys>[0]] extends never ? undefined : RecursiveObjectGet<Object[Shift<Keys>[0]], Shift<Keys>[1]>

function recursiveObjectGet<
    Object extends Record<PropertyKey, any>,
    Keys extends PropertyKey[]
>(object: Object, keys: Keys): RecursiveObjectGet<Object, Keys> {
    if (keys.length === 0) {
        return object
    }

    const key = keys.shift()!
    if (object.hasOwnProperty(key)) {
        return recursiveObjectGet(object[key], keys)
    }
    return undefined
}

const ApiResponse: RequestHandler = async ({ request, params }) => {
    const routeParts = params.route.split("/")
    const method = request.method
    const methodsObject = recursiveObjectGet(apiEndpoints, routeParts)

    if (!methodsObject || !methodsObject[method]) {
        return new Response("Not Found", {
            status: 404
        })
    }


    methodsObject[method]

    return new Response("Hello World")
}

export const GET: RequestHandler = ApiResponse
export const POST: RequestHandler = ApiResponse
export const PUT: RequestHandler = ApiResponse
export const PATCH: RequestHandler = ApiResponse
export const DELETE: RequestHandler = ApiResponse
export const OPTIONS: RequestHandler = () => new Response(null, {
    status: 204
})
