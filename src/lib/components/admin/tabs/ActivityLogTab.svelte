<script lang="ts">
    import type { Activity } from "@prisma/client"

    export let entireActivityLog: Activity[]
</script>

<table class="table table-hover">
    <thead>
        <tr>
            <th>Id</th>
            <th>Created At</th>
            <th>UserId</th>
            <th>Type</th>
            <th>Metadata</th>
        </tr>
    </thead>
    <tbody>
        {#each entireActivityLog as activity}
            <tr>
                <td>{activity.id}</td>
                <td>{activity.createdAt.toDateString()}</td>
                <td>{activity.userId}</td>
                <td>{activity.type}</td>
                <td>{activity.metadata}</td>
            </tr>
        {/each}
    </tbody>
</table>
