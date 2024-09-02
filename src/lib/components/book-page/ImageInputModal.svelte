<script lang="ts">
    import ImageInput from "$lib/components/book-form/ImageInput.svelte";
    import { getModalStore } from "@skeletonlabs/skeleton";
    import type { SvelteComponent } from "svelte";


    export let parent: SvelteComponent

    const modalStore = getModalStore()
    let file: File | undefined = undefined

    function onSubmit() {
        $modalStore[0]?.response?.(file)
        modalStore.close()
    }
</script>


{#if $modalStore[0]}
    <div class="card p-4 w-modal shadow-xl space-y-4">
        <header>
            <h2 class="text-xl">Add Book Cover</h2>
        </header>
        <ImageInput name="image" bind:file={file} />

        <footer class="modal-footer {parent.regionFooter}">
            <button
                class="btn {parent.buttonNeutral}"
                on:click={parent.onClose}
            >{parent.buttonTextCancel}</button>
            <button
                class="btn {parent.buttonPositive}"
                on:click={onSubmit}
            >Add Book Cover</button>
        </footer>
    </div>
{/if}
