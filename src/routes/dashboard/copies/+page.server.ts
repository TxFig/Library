import type { PageServerLoad } from "./$types";
import db from "$lib/server/database"
import applyTransformSpec from "$lib/utils/transform-object";
import { DashboardCopiesPage } from "$lib/types";


export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        return {
            copies: [],
            requests: []
        }
    }

    return {
        copies: applyTransformSpec(
            await db.interactions.copy.getAll({
                include: DashboardCopiesPage.Copy.include,
                where: {
                    ownerId: locals.user.id
                }
            }),
            DashboardCopiesPage.Copy.spec
        ),

        requests: applyTransformSpec(
            await db.interactions.copy.request.getAll({
                include: DashboardCopiesPage.Request.include,
                where: {
                    userId: locals.user.id,
                    OR: [
                        { status: "pending" },
                        {
                            status: "accepted",
                            loan: {
                                status: {
                                    in: ["reserved", "active"]
                                }
                            }
                        }
                    ]
                }
            }),
            DashboardCopiesPage.Request.spec
        ).reverse()
    }
}
