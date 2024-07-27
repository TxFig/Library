import type { RequestHandler } from "./$types";
import HttpCodes from "$lib/utils/http-codes";
import { redirect } from "@sveltejs/kit";


export const GET: RequestHandler = async () => redirect(HttpCodes.Found, "/admin/users")
