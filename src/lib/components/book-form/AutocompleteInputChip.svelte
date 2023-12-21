<script lang="ts">
    import { Autocomplete, InputChip, type AutocompleteOption } from "@skeletonlabs/skeleton"

    let inputValue = ""
    export let selectedOptions: string[] = []
    export let options: string[]

    const autoCompleteOptions: AutocompleteOption<string>[] = options.map(val => ({
        label: val,
        value: val
    }))

    function onSelect(event: CustomEvent<AutocompleteOption<string>>) {
        const value = event.detail.value
        if (selectedOptions.includes(value) === false) {
            selectedOptions = [...selectedOptions, value]
            inputValue = ""
        }
    }

    export let title: string
    export let name: string
    export let placeholder: string
</script>

<!-- svelte-ignore a11y-label-has-associated-control -->
<label class="label">
    <span>{title}</span>
    <InputChip bind:input={inputValue} bind:value={selectedOptions} name={name} placeholder={placeholder} allowUpperCase />
    <div class="card w-full max-w-sm max-h-48 p-4 overflow-y-auto" tabindex="-1">
        <Autocomplete
            bind:input={inputValue}
            options={autoCompleteOptions}
            denylist={selectedOptions}
            on:selection={onSelect}
        />
    </div>
</label>
