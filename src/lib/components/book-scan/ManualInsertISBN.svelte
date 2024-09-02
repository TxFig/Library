<script lang="ts">
    import TextInput from "$lib/components/form/TextInput.svelte";
    import { formISBNRegex } from "$lib/validation/book/isbn";
    import Icon from "@iconify/svelte";
    import { popup, type PopupSettings } from "@skeletonlabs/skeleton";

    const manualInsertISBNPopup: PopupSettings = {
        event: "click",
        target: "ManualInsertISBNPopup",
        placement: "top"
    }
    let manualInsertISBN = ""

    export let onSubmit: (isbn: string) => void | Promise<void>
</script>

<button class="btn variant-filled-secondary" use:popup={manualInsertISBNPopup}>
    Manually Insert ISBN
</button>
<div class="card p-4 variant-filled-surface z-10" data-popup="ManualInsertISBNPopup">
    <div class="arrow variant-filled-surface" />
    <div class="flex flex-col gap-2">
        <TextInput
            text="ISBN"
            name="isbn"
            bind:value={manualInsertISBN}
            allowedRegex={formISBNRegex}
            required
        />
        <button
            class="btn variant-ghost-secondary"
            on:click={() => {
                onSubmit(manualInsertISBN)
                manualInsertISBN = ""
            }}
        >
            <Icon icon="material-symbols:add" width="24" height="24" />
            <span>Submit</span>
        </button>
    </div>
</div>
