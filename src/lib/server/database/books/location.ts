import type { Location } from "@prisma/client"
import { prisma } from ".."


export function getAllLocations(): Promise<Location[]> {
    return prisma.location.findMany()
}


export default {
    getAllLocations
}
