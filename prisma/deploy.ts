import { PrismaClient } from "@prisma/client";
import path from "path"
import fs from "fs"
import { exec, execSync } from "child_process";
import chalk from "chalk"


const prisma = new PrismaClient()

function doesFileExist(path: string): boolean {
    try {
        return fs.statSync(path).isFile()
    } catch (e) {
        return false
    }
}

type MigrationInfo = {
    folderName: string
    name: string
    hasDataMigration: boolean
}
const migrationsFolder = path.join(process.cwd(), "prisma/migrations")
const pendingMigrationsFolder = path.join(process.cwd(), "prisma/pending-migrations")
const migrationScriptFileName = "migration.ts"

function getAllMigrationsFromFileSystem(): MigrationInfo[] {
    const folders = fs.readdirSync(migrationsFolder, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dir => dir.name)

    return folders.map(folder => {
        const dataMigrationScriptPath = path.join(migrationsFolder, folder, migrationScriptFileName)
        const hasDataMigration = doesFileExist(dataMigrationScriptPath)

        return {
            folderName: folder,
            name: folder.split("_").slice(1).join("_"),
            hasDataMigration
        }
    })
}

function runPrismaMigrate() {
    try {
        execSync("prisma migrate deploy")
        console.log(chalk.greenBright("Prisma migrate deploy finished"))
        console.log()
    } catch (err) {
        console.error(err)
    }
}

function moveFolder(oldPath: string, newPath: string) {
    try {
        fs.cpSync(oldPath, newPath, { recursive: true })
        fs.rmSync(oldPath, { recursive: true, force: true })
    } catch (e) {
        console.error(e)
        return
    }
}

function moveMigrationFromMigrationsToPending(migration: MigrationInfo) {
    const oldPath = path.join(migrationsFolder, migration.folderName)
    const newPath = path.join(pendingMigrationsFolder, migration.folderName)
    moveFolder(oldPath, newPath)
}

function moveMigrationFromPendingToMigrations(migration: MigrationInfo) {
    const oldPath = path.join(pendingMigrationsFolder, migration.folderName)
    const newPath = path.join(migrationsFolder, migration.folderName)
    moveFolder(oldPath, newPath)
}

async function runDataMigrationScript(migration: MigrationInfo) {
    const scriptPath = path.join(migrationsFolder, migration.folderName, migrationScriptFileName)
    try {
        console.log(chalk.greenBright(`Running data migration script for ${migration.name}`))
        execSync(`tsx ${scriptPath}`)
        console.log(chalk.greenBright("Data migration script finished"))
        console.log()
    } catch (e) {
        console.error(e)
    }
}

function logMigrations(migrations: MigrationInfo[]) {
    console.log(chalk.bold("Applying the following migrations:"))
    console.log(
        migrations.map(migration =>
            `    - ${chalk.blueBright(migration.name)}`
        ).join("\n"),
    )
    console.log()
}

async function addMigrationsToDatabase(migrations: MigrationInfo[]) {
    for (const migration of migrations) {
        await prisma.migration.create({
            data: {
                name: migration.name,
                hasDataMigration: migration.hasDataMigration
            }
        })
    }
}

async function migrate(migrations: MigrationInfo[]) {
    const indexOfFirstDataMigration = migrations.findIndex(migration => migration.hasDataMigration)
    const migrationsBeforeDataMigration = migrations.slice(0, indexOfFirstDataMigration + 1)
    const migrationsAfterDataMigration = migrations.slice(indexOfFirstDataMigration + 1)

    if (indexOfFirstDataMigration === -1) {
        logMigrations(migrations)
        runPrismaMigrate()
        await addMigrationsToDatabase(migrations)
        return
    }

    for (const migration of migrationsAfterDataMigration) {
        moveMigrationFromMigrationsToPending(migration)
    }

    logMigrations(migrationsBeforeDataMigration)
    runPrismaMigrate()
    await addMigrationsToDatabase(migrationsBeforeDataMigration)

    await runDataMigrationScript(migrations[indexOfFirstDataMigration])

    for (const migration of migrationsAfterDataMigration) {
        moveMigrationFromPendingToMigrations(migration)
    }

    if (migrationsAfterDataMigration.length > 0) {
        await migrate(migrationsAfterDataMigration)
    }
}

async function makeSureMigrationsTableExists(allMigrations: MigrationInfo[]) {
    //* Certifies that the "migrations" migration has been applied
    //* so that the migration table in the database also exists

    const migrationMigrationIndex = allMigrations.findIndex(migration => migration.name === "migrations")

    if (migrationMigrationIndex === -1) {
        console.log(chalk.yellowBright("\"migrations\" migration not found"))
        process.exit(1)
    }

    const migrationsBeforeMigration = allMigrations.slice(0, migrationMigrationIndex + 1)
    const migrationsAfterMigration = allMigrations.slice(migrationMigrationIndex + 1)

    for (const migration of migrationsAfterMigration) {
        moveMigrationFromMigrationsToPending(migration)
    }

    logMigrations(migrationsBeforeMigration)
    runPrismaMigrate()
    await addMigrationsToDatabase(migrationsBeforeMigration)

    for (const migration of migrationsAfterMigration) {
        moveMigrationFromPendingToMigrations(migration)
    }
}

async function main() {
    const allMigrations = getAllMigrationsFromFileSystem()
    try {
        await prisma.migration.findMany()
    } catch {
        console.log(chalk.yellowBright("Migrations table not found"))
        await makeSureMigrationsTableExists(allMigrations)
    }

    const appliedMigrations = await prisma.migration.findMany()
    const pendingMigrations = allMigrations.filter(
        migration => !appliedMigrations.some(
            appliedMigration => appliedMigration.name === migration.name
        )
    )

    if (!fs.existsSync(pendingMigrationsFolder)) {
        fs.mkdirSync(pendingMigrationsFolder)
    }

    if (pendingMigrations.length > 0) {
        await migrate(pendingMigrations)
        console.log(chalk.cyanBright("Migrations finished"))
    } else {
        console.log(chalk.cyanBright("No migrations to apply"))
    }
}

main()
    .catch(async (err) => {
        console.error(err)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
