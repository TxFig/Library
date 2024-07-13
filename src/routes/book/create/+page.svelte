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
            allAuthors={data.authors}
            allPublishers={data.publishers}
            allSubjects={data.subjects}
            allLocations={data.locations}
            allLanguages={data.languages}
        />
    </div>
{:else}
    <NotLoggedIn />
{/if}
