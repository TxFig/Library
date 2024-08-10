import { PrismaClient } from "@prisma/client"
import seedPermissionsAndPermissionGroups from "./permissions"
import seedSubjects from "./subjects"
import seedAppConfig from "./app"
import seedDatabase from "./database"


const prisma = new PrismaClient()

async function main() {
    await seedDatabase(prisma)
    await seedAppConfig(prisma)
    await seedPermissionsAndPermissionGroups(prisma)
    await seedSubjects(prisma)
}

main()
    .catch(async (err) => {
        console.error(err)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
