<script lang="ts">
    import { ListBox, ListBoxItem } from "@skeletonlabs/skeleton"


    function addOption() {
        if (!inputValue || options.includes(inputValue))
            return

        options = [...options, inputValue]
        selected = inputValue
        inputValue = ""
    }

    function inputKeyDown(event: KeyboardEvent) {
        if (event.key == "Enter") {
            event.preventDefault()
            addOption()
        }
    }

    export let title: string
    export let name: string
    export let options: string[]
    export let selected: string | undefined = undefined
    export let placeholder: string
    let inputValue: string

</script>

<!-- svelte-ignore a11y-label-has-associated-control -->
<label class="label flex flex-col gap-2">
    <span>{title}</span>
    <ListBox class="border border-dashed border-surface-600-300-token">
        {#each options as opt}
            <ListBoxItem bind:group={selected} name={name} value={opt}>{opt}</ListBoxItem>
        {/each}
    </ListBox>
    <div class="input-group input-group-divider grid-cols-[1fr_auto]">
        <input placeholder={placeholder} bind:value={inputValue} on:keydown={inputKeyDown}/>
        <button type="button" class="variant-filled-secondary !px-10" on:click={addOption}>Add</button>
    </div>
</label>
