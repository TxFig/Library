<script lang="ts">
    import type { ReadingStateUpdateData } from "$lib/validation/book/reading-state";
    import Icon from "@iconify/svelte";
    import { ReadingState } from "@prisma/client";
    import { ListBox, ListBoxItem, popup, RadioGroup, RadioItem, type PopupSettings } from "@skeletonlabs/skeleton";


    export let readingState: ReadingState | null = null
    export let bookId: number
    let userBookReadingState: ReadingState = readingState ?? "NOT_READ"

    async function setReadingState(state: ReadingState) {
        const updateData: ReadingStateUpdateData = {
            state,
            bookId
        }

        await fetch(`/api/reading-state/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updateData),
        })
    }

    const popupCombobox: PopupSettings = {
        event: 'click',
        target: 'popupCombobox',
        placement: 'bottom',
        closeQuery: '.listbox-item'
    }

    const labels = {
        NOT_READ: "Not Read",
        READING: "Currently Reading",
        READ: "Already Read"
    }

    const icons = {
        NOT_READ: "fa6-regular:eye-slash",
        READING: "fa6-regular:bookmark",
        READ: "fa6-regular:circle-check"
    }

    const states = Object.keys(ReadingState) as ReadingState[]
</script>

<div>
    <p>Reading State:</p>

    <button class="btn variant-filled w-52 justify-between" use:popup={popupCombobox}>
        <div class="flex items-center gap-2">
            <Icon icon={icons[userBookReadingState]} width="16" height="16"/>
            <span>{labels[userBookReadingState]}</span>
        </div>
        <span>↓</span>
    </button>

    <div class="card shadow-xl py-2" data-popup="popupCombobox">
        <ListBox rounded="rounded-none">
            {#each states as readingState}
            <ListBoxItem
                bind:group={userBookReadingState}
                on:click={() => setReadingState(readingState)}
                name="userBookReadingState"
                value={readingState}
                regionDefault="flex items-center gap-2 pr-8"
            >
                <Icon icon={icons[readingState]} width="16" height="16"/>
                <span>{labels[readingState]}</span>
            </ListBoxItem>
            {/each}
        </ListBox>
        <div class="arrow bg-surface-100-800-token" />
    </div>
</div>
