<script lang="ts">
    import Icon from "@iconify/svelte";
    import type { PageData } from "./$types"
    export let data: PageData
    const { author, books } = data

</script>

<div class="flex flex-col space-y-2">
    <h1 class="font-bold mb-5">{author.name}</h1>
    <h2>Books:</h2>
    <div
        class="
            grid
            grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10
            gap-5 px-5 justify-items-center"
    >
        {#each books as book}
        <a href={"/book/" + book.isbn} class="flex flex-col items-center justify-center">
            {#if book.front_image}
                <img
                    src={`/images/${book.front_image}`}
                    alt={book.title}
                    class="mb-1"
                />
            {:else}
                <Icon icon="material-symbols:book-outline" color="#fbe7d1" width="150" class="mb-1"/>
            {/if}
            <span class="!no-underline hover:!underline">{book.title}</span>
        </a>
        {/each}
    </div>
</div>
