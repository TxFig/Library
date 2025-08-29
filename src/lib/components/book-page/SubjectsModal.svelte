<script lang="ts">
    import { page } from "$app/state";
    import { hasPermission } from "$lib/utils/permissions";
    import Icon from "@iconify/svelte";
    import { getModalStore } from "@skeletonlabs/skeleton";
    import { type SvelteComponent } from "svelte";


    let { parent, bookId, subjects }: {
        parent: SvelteComponent,
        bookId: string
        subjects: string[]
    } = $props()

    const modalStore = getModalStore()

    async function deleteFn(subject: string) {
        await fetch(`/api/books/${bookId}/subjects/${subject}`, {
            method: "delete"
        })
        subjects = subjects.filter(subj => subj !== subject)
        $modalStore[0].response?.(subject)
    }
</script>

{#if $modalStore[0]}
    {@const authenticated = page.data.user && hasPermission(page.data.user.permissionGroup, "Edit Book")}
    <div class="card p-6 w-modal shadow-xl flex flex-col justify-between gap-6">
        <header class="flex justify-between items-center">
            <h3 class="h3">Subjects</h3>
            <button type="button" class="btn-icon" onclick={() => parent.onClose()}>
                <Icon icon="mdi:close" height="16" />
            </button>
        </header>
        <main class="grid grid-cols-4 gap-2 max-h-[50vh] overflow-auto">
            {#each subjects as subject}
                {#if !authenticated}
                    <p class="chip variant-ghost-secondary text-sm text-wrap cursor-default">{subject}</p>
                {:else}
                    <div class="chip variant-ghost-secondary text-sm text-wrap py-3 relative group cursor-default">
                        <p>{subject}</p>
                        <button
                            class="btn-icon text-red-500 absolute top-0 right-0 invisible duration-0 group-hover:visible bg-black/10"
                            onclick={() => deleteFn(subject)}
                        >
                            <Icon icon="mdi:trash" height="16" />
                        </button>
                    </div>
                {/if}
            {/each}
        </main>
    </div>
{/if}
