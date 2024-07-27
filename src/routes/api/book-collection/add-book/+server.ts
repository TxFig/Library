import HttpCodes from "$lib/utils/http-codes"
import { json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import { applyDecorators } from "$lib/decorators"
import AuthDecorator from "$lib/decorators/auth"
import { ISBNSchema } from "$lib/validation/book/isbn"
import api, { defaultApiMethodResponse } from "$lib/server/api"
import { invalidate } from "$app/navigation"


export const POST: RequestHandler = applyDecorators(
    [AuthDecorator(["View Book"])],
    async ({ request, locals }) => {
        const userId = locals.user!.id
        const body = await request.json()
        const { collectionName, isbn } = body

        const parsingResultISBN = ISBNSchema.safeParse(isbn)
        if (!collectionName || typeof collectionName !== "string" || !parsingResultISBN.success) {
            return json({
                message: "Invalid Request"
            }, {
                status: HttpCodes.ClientError.BadRequest
            })
        }

        return defaultApiMethodResponse(
            await api.bookCollection.addBook.POST(userId, collectionName, isbn)
        )
    }
)
