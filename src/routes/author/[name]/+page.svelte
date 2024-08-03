<script lang="ts">
    import Icon from "@iconify/svelte"
    import type { PageData } from "./$types"
    export let data: PageData
    const { author } = data

</script>

<div class="flex flex-col space-y-2 p-6">
    <h1 class="font-bold mb-5 text-2xl">{author.name}</h1>
    <h2>Books:</h2>
    <div
        class="
            grid
            grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10
            gap-5 px-5 justify-items-center"
    >
        {#each author.books as book}
        {@const smallestImage = book.image.sort((a, b) => a.width - b.width)[0]}

        <a href={"/book/" + book.isbn} class="flex flex-col items-center justify-center">
            {#if book.image.length > 0}
                <img
                    src={`/images/${book.isbn}/${smallestImage.height}.webp`}
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
