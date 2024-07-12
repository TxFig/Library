import { applyDecorators } from "$lib/decorators";
import AuthDecorator from "$lib/decorators/auth";
import type { Actions } from "./$types";


export const actions: Actions = {
    default: applyDecorators([AuthDecorator(["Create Book"])], (event) => {
        console.log("POST")
        return
    })
}
