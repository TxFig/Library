<script lang="ts">
    import filterRegex from "$lib/utils/filter-regex"
    import type { HTMLInputAttributes } from "svelte/elements"


    let {
        value = $bindable(undefined),
        allowedRegex = undefined,
        handleInput = defaultHandleInput,
        class: externalClasses,
        ...rest
    }: {
        value?: string | number,
        allowedRegex?: RegExp,
        handleInput?: () => void
    } & HTMLInputAttributes = $props()

    function defaultHandleInput() {
        if (!allowedRegex || !value) return

        value = filterRegex(allowedRegex, value)
    }
</script>


<input
    class="input {externalClasses}"
    bind:value
    autocomplete="off"
    oninput={handleInput}
    {...rest}
/>
