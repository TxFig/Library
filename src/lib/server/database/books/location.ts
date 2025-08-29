import type { Location } from "@prisma/client"
import prisma from "$lib/server/database/prisma"


export function getAllLocations(): Promise<Location[]> {
    return prisma.location.findMany()
}


export default {
    getAllLocations,
}
