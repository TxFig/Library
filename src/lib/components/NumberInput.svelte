<script lang="ts">
    export let name: string
    export let value: string | undefined = undefined
    export let min: number | undefined = undefined
    export let max: number | undefined = undefined
    export let placeholder: string | undefined = undefined

    const onlyDigitsRegex = /^[0-9X]*$/
    const nonDigitsRegex = /[^0-9X]/g
    function handleInput() {
        console.log(onlyDigitsRegex.test(value ?? ""))
        if (!value || onlyDigitsRegex.test(value)) return

        value = value.replace(nonDigitsRegex, "")
    }

    // for external use
    export let inputElement: HTMLInputElement
</script>

<input
    class="input"
    type="text"
    {name} {min} {max}
    bind:value
    on:input={handleInput}
    placeholder={placeholder}

    bind:this={inputElement}
    autocomplete="off"
/>
