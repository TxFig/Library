<script lang="ts">
    import { goto } from "$app/navigation";
    import type { Subject } from "@prisma/client";


    export let isbn: string
    export let subjects: Subject[]

    let limit = 12
</script>

<div>
    <p class="opacity-95">Genres</p>
    <div class="flex flex-wrap gap-2">
        {#each subjects.slice(0, limit) as subject}
            <a href="/subject/{subject.value}" class="hover:anchor duration-300 border-b border-b-cyan-600 !no-underline">{subject.value}</a>
        {/each}
        {#if subjects.length > limit}
            {#if limit === 12}
                <button class="border-b border-b-cyan-600" on:click={() => limit = 18}>
                    ...more
                </button>
            {:else if limit === 24}
                <button class="border-b border-b-cyan-600" on:click={() => goto(`/book/subjects/${isbn}`)}>
                    ...show all
                </button>
            {/if}
        {/if}
    </div>
</div>
