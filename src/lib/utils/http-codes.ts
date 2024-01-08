export default {
    // Successful
    Success: 200,

    // Redirection
    SeeOther: 303,

    // Client Error
    BadRequest: 400,
    Unauthorized: 401,
    NotFound: 404,
    Conflict: 409,

    // Server Error
    InternalServerError: 500,
} as const
