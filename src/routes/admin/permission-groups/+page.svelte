<script lang="ts">
    import type { PageData } from "./$types";

    export let data: PageData
    const { allPermissionGroups, allPermissions } = data
</script>

<div class="flex flex-col gap-4">
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
            {#each allPermissions as permission}
                <tr>
                    <td>{permission.id}</td>
                    <td>{permission.name}</td>
                    <td>{permission.description}</td>
                </tr>
            {/each}
        </tbody>
    </table>

    <hr class="my-4"/>

    <p class="text-xl">Permission Groups</p>
    <table class="table table-hover">
        <thead>
            <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Description</th>
                <th>Permissions</th>
            </tr>
        </thead>
        <tbody>
            {#each allPermissionGroups as permissionGroup}
                <tr>
                    <td>{permissionGroup.id}</td>
                    <td>{permissionGroup.name}</td>
                    <td>{permissionGroup.description}</td>
                    <td>
                        {#each permissionGroup.permissions as permission}
                            <p>{permission.name}</p>
                        {/each}
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
