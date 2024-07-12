import { applyDecorators } from "$lib/decorators"
import AuthDecorator from "$lib/decorators/auth"
import type { RequestHandler } from "./$types"


export const POST: RequestHandler = applyDecorators(
    [AuthDecorator()],
    async ({ params, request: { formData } }) => {
        console.log(await formData())

        return new Response("Hello world!")
    }
)
