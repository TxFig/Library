import GET from "./GET"
import PATCH from "./PATCH"
import DELETE from "./DELETE"


export type { RequestEvent } from "$types/api/book/[bookPublicId]/$types"

export default {
    GET,
    PATCH,
    DELETE
}
