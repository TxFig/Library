<script lang="ts">
    import type { ReadingStateUpdateData } from "$lib/validation/book/reading-state";
    import { ReadingState } from "@prisma/client";
    import Combobox from "../form/Combobox.svelte";

    export let readingState: ReadingState | null = null
    export let bookId: number
    let state: ReadingState = readingState ?? "NOT_READ"

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

    const values = ["NOT_READ", "READING", "READ", "WANT_TO_READ"] as const
    const labels = ["Not Read", "Currently Reading", "Read", "Want to Read"]
    const icons = ["fa6-regular:eye-slash", "fa6-regular:bookmark", "fa6-regular:circle-check", "material-symbols:star-outline"]
</script>

<div class="flex flex-col gap-2">
    <Combobox
        name="readingStateCombobox"
        value={labels[values.indexOf(state)]}
        options={labels}
        icons={icons}
        width="w-60"
        onClick={
            (_, index) => setReadingState(values[index])
        }
    />
</div>
