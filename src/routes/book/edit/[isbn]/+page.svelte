<script lang="ts">
    import BookForm from "$lib/components/book-form/BookForm.svelte";
    import NotLoggedIn from "$lib/components/NotLoggedIn.svelte";
    import type { PageData } from "./$types";


    export let data: PageData
</script>

{#if data.user}
    <div class="space-y-4">
        <h2 class="h2">Book Editing</h2>
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
