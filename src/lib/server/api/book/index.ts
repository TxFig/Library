import GET from "./GET"
import POST from "./POST"
import image from "./image"
import subjects from "./subjects"
import bookPublicId from "./[bookPublicId]"

export type { RequestEvent } from "$types/api/book/$types"

export default {
    GET,
    POST,
    image,
    subjects,
    bookPublicId
}
