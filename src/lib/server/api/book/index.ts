import GET from "./GET"
import POST from "./POST"
import PATCH from "./PATCH"
import DELETE from "./DELETE"
import image from "./image"
import subjects from "./subjects"

export type { RequestEvent } from "$types/api/book/$types"

export default {
    GET,
    POST,
    PATCH,
    DELETE,
    image,
    subjects
}
