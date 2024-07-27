<script lang="ts">
    import type { PageData } from "./$types";

    export let data: PageData
    const { username } = data

</script>

<div class="flex flex-col gap-8 p-6">
    <p class="text-2xl">Successfully logged in</p>
    <div class="flex gap-4">
        <a href="/" class="btn variant-ghost-primary">Home</a>
        <a href={`/user/${username}`} class="btn variant-ghost-primary">Profile</a>
    </div>
</div>
