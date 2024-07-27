<script lang="ts">
    import type { PageData } from "./$types";

    export let data: PageData
    const { entireActivityLog } = data
    const sortedActivityLog = entireActivityLog.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
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
        {#each sortedActivityLog as activity}
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
