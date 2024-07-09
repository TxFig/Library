import type { Values } from "./types"


export const HttpCodes = {
    // Successful
    Success: 200,

    // Redirection
    SeeOther: 303,

    ClientError: {
        BadRequest: 400,
        Unauthorized: 401,
        Forbidden: 403,
        NotFound: 404,
        Conflict: 409,
    },

    ServerError: {
        InternalServerError: 500
    }
} as const

export type HttpCodes = typeof HttpCodes

type ClientError = HttpCodes["ClientError"]
type ServerError = HttpCodes["ServerError"]
export type HttpCodesValues = Values<ClientError> | Values<ServerError>

export default HttpCodes
