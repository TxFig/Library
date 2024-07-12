import { applyDecorators } from "$lib/decorators"
import AuthDecorator from "$lib/decorators/auth"
import LoggingDecorator from "$lib/decorators/logging"
import type { RequestHandler } from "./$types"


export const POST: RequestHandler = applyDecorators([
    LoggingDecorator(),
    AuthDecorator(["Create Book", "View Book", "Edit Book"]),
], async ({ request }) => {
    console.log(await request.json())

    return new Response("Hello world!")
})
