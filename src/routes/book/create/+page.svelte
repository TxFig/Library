<script lang="ts">
    import type { PageData } from "./$types"

    import NotLoggedIn from "$lib/components/NotLoggedIn.svelte"
    import BookForm from "$lib/components/book-form/BookForm.svelte";


    export let data: PageData
</script>

{#if data.user}
    <div class="space-y-4">
        <h2 class="h2">Book Creation</h2>
        <BookForm
            data={data.form}
            allAuthors={data.allAuthors}
            allPublishers={data.allPublishers}
            allSubjects={data.allSubjects}
            allLocations={data.allLocations}
            allLanguages={data.allLanguages}
        />
    </div>
{:else}
    <NotLoggedIn />
{/if}
