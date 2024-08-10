<script lang="ts">
    import type { ReadingStateUpdateData } from "$lib/validation/book/reading-state";
    import Icon from "@iconify/svelte";
    import type { ReadingState } from "@prisma/client";
    import { RadioGroup, RadioItem } from "@skeletonlabs/skeleton";


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
</script>

<div>
    <p>Reading State:</p>
    <RadioGroup class="flex flex-col">
        <RadioItem
            bind:group={userBookReadingState}
            name="userBookReadingState"
            value={"NOT_READ"}
            on:click={() => setReadingState("NOT_READ")}
            class="flex items-center gap-2 pr-8"
        >
            <Icon icon="fa6-regular:eye-slash" width="16" height="16"/>
            <span>Not Read</span>
        </RadioItem>
        <RadioItem
            bind:group={userBookReadingState}
            name="userBookReadingState"
            value={"READING"}
            on:click={() => setReadingState("READING")}
            class="flex items-center gap-2 pr-8"
        >
            <Icon icon="fa6-regular:bookmark" width="16" height="16"/>
            <span>Currently Reading</span>
        </RadioItem>
        <RadioItem
            bind:group={userBookReadingState}
            name="userBookReadingState"
            value={"READ"}
            on:click={() => setReadingState("READ")}
            class="flex items-center gap-2 pr-8"
        >
            <Icon icon="fa6-regular:circle-check" width="16" height="16"/>
            <span>Already Read</span>
        </RadioItem>
    </RadioGroup>
</div>
