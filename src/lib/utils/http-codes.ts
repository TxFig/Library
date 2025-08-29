import type { Values } from "./types"


export const HttpCodes = {
    Success: {
        OK: 200,
        Created: 201,
        NoContent: 204,
    },

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

export type HttpSuccess = HttpCodes["Success"]
export type HttpSuccessValues = Values<HttpSuccess>

export type HttpClientError = HttpCodes["ClientError"]
export type HttpClientErrorValues = Values<HttpClientError>
export type HttpServerError = HttpCodes["ServerError"]
export type HttpServerErrorValues = Values<HttpServerError>

export type HttpErrorCodesValues = HttpClientErrorValues | HttpServerErrorValues

export default HttpCodes
