<script lang="ts">
    import type { Permission, PermissionGroup } from "@prisma/client";

    export let permissionGroups: PermissionGroup[]
    export let permissions: Permission[]

</script>

<div class="flex flex-col gap-4">
    <p class="text-xl">Permission Groups</p>
    <table class="table table-hover">
        <thead>
            <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Description</th>
            </tr>
        </thead>
        <tbody>
            {#each permissionGroups as permissionGroup}
                <tr>
                    <td>{permissionGroup.id}</td>
                    <td>{permissionGroup.name}</td>
                    <td>{permissionGroup.description}</td>
                </tr>
            {/each}
        </tbody>
    </table>

    <p class="text-xl">Permissions</p>
    <table class="table table-hover">
        <thead>
            <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Description</th>
            </tr>
        </thead>
        <tbody>
            {#each permissions as permission}
                <tr>
                    <td>{permission.id}</td>
                    <td>{permission.name}</td>
                    <td>{permission.description}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
