<script lang="ts">
    import { readingStates, type ReadingState, type ReadingStateUpdateSchemaInput } from "$lib/validation/book/reading-state";
    import Icon from "@iconify/svelte";
    import Combobox from "../form/Combobox.svelte";
    import { type ComponentProps } from "svelte";

    let {
        state: rState = $bindable(),
        editionId,
        ...rest
    }: {
        state?: ReadingState,
        editionId: string
    } & Partial<ComponentProps<typeof Combobox>> = $props()

    function updateUserReadingState() {
        if (rState === undefined || rState === "NOT_READ") return
        fetch(`/api/editions/${editionId}/reading-state/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                state: rState
            } satisfies ReadingStateUpdateSchemaInput),
        })
    }

    const labels = ["Not Read", "Currently Reading", "Read", "Want to Read"] as const
    const icons = ["fa6-regular:eye-slash", "fa6-regular:bookmark", "fa6-regular:circle-check", "material-symbols:star-outline"]

    function onClick(value: string, index: number) {
        rState = readingStates[index]
        updateUserReadingState()
    }
</script>

<Combobox
    {...rest}
    name="readingStateCombobox"
    value={labels[readingStates.indexOf(rState ?? "NOT_READ")]}
    options={labels}
    {onClick}
>
    {#snippet display(value, index)}
        <div class="flex items-center gap-2">
            <Icon
                icon={icons[index ?? labels.indexOf(value)]}
                height="16"
            />
            <span>{value}</span>
        </div>
    {/snippet}
</Combobox>
