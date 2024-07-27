import type { Values } from "./types"


export const HttpCodes = {
    // Successful
    Success: 200,

    // Redirection
    Found: 302,
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

export type ClientError = HttpCodes["ClientError"]
export type ClientErrorValues = Values<ClientError>
export type ServerError = HttpCodes["ServerError"]
export type ServerErrorValues = Values<ServerError>

export type HttpErrorCodesValues = ClientErrorValues | ServerErrorValues

export default HttpCodes
