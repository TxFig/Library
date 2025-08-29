<script lang="ts">
    import type { PageData } from "./$types"
    import NotLoggedIn from "$lib/components/NotLoggedIn.svelte"
    import BookForm from "$lib/components/book-form/BookForm.svelte"
    import { page } from "$app/state";
    import { hasPermissions } from "$lib/utils/permissions";

    let { data }: { data: PageData } = $props()
</script>

{#if page.data.user && hasPermissions(page.data.user.permissionGroup, ["Create Book"])}
    <div class="space-y-8 px-4 py-6 sm:px-8 sm:py-10 max-w-7xl mx-auto">
        <h1 class="h1">Book Creation</h1>
        <BookForm {...data} />
    </div>
{:else}
    <NotLoggedIn />
{/if}
