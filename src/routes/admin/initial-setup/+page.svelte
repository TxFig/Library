<script lang="ts">
    import type { PageData } from "./$types"

    export let data: PageData
    const { providedAdminEmail } = data

</script>

<div class="flex flex-col gap-4">
    <h2 class="h2">Admin Account Setup</h2>
    {#if providedAdminEmail}
        <p>Confirmation email sent</p>
    {:else}
        Create Admin User Form:
    {/if}
</div>
