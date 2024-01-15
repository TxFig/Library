import type { Values } from "./types"

const codes = {
    // Successful
    Success: 200,

    // Redirection
    SeeOther: 303,

    ClientError: {
        BadRequest: 400,
        Unauthorized: 401,
        NotFound: 404,
        Conflict: 409,
    },

    ServerError: {
        InternalServerError: 500
    }
} as const

type Codes = typeof codes
type ClientError = Codes["ClientError"]
type ServerError = Codes["ServerError"]

export type HttpErrorCodes = Values<ClientError> | Values<ServerError>

export default codes
