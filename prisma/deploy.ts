import { PrismaClient } from "@prisma/client";
import path from "path"
import fs from "fs"


const prisma = new PrismaClient()
async function main() {

    await updateMigrationTable();
}

type MigrationInfo = {
    name: string
    timestamp: string
    hasDataMigration: boolean
}
const migrationsFolder = path.join(process.cwd(), "prisma/migrations")
function getAllMigrationsFromFileSystem(): MigrationInfo[] {
    const folders = fs.readdirSync(migrationsFolder, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dir => dir.name)

    return folders.map(folder => {
        const dataMigrationScriptPath = path.join(migrationsFolder, folder, "migration.ts")
        try {
            const hasDataMigration = fs.statSync(dataMigrationScriptPath)
            console.log(hasDataMigration)
        } catch {}

        return {
            name: folder.split("_").slice(1).join("_"),
            timestamp: folder.split("_")[0],
            hasDataMigration: false
        }
    })
}

async function updateMigrationTable() {
    const migrations = getAllMigrationsFromFileSystem()

    process.exit(0)

    for (const migration of migrations) {
        const migrationRecord = await prisma.migration.findUnique({
            where: {
                name: migration.name
            }
        })

        if (migrationRecord) {
            console.log(`- ${migration.name} already applied`)
            continue
        }

        await prisma.migration.create({
            data: {
                name: migration.name,
                hasDataMigration: migration.hasDataMigration
            }
        })

    }

    //* update migration table with new migrations
    //* move missing migrations to `pending-migrations` folder
    //* and begging applying them based on which ones have data migrations
    //* (series of migration that don't have data migrations can be applied in a single `prisma migrate deploy` call)
}


main()
    .catch(async (err) => {
        console.error(err)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
