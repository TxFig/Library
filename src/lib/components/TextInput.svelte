<script lang="ts">
    import filterRegex from "$lib/utils/filter-regex";

    export let text: string
    export let name: string | undefined = undefined
    export let value: string | undefined | null = undefined
    export let required: boolean = false
    export let placeholder: string | undefined = undefined


    export let allowedRegex: RegExp | undefined = undefined
    function handleInput() {
        if (!allowedRegex || !value) return

        value = filterRegex(allowedRegex, value)
    }

    let externalClasses: string = ""
    export { externalClasses as class }

    export let errors: string[] | undefined = undefined
    $: hasErrors = errors && errors.length > 0
</script>

<label class="label {externalClasses}">
    <span>
        {text}
        {#if required}
            <sup class="text-red-500">*</sup>
        {/if}
    </span>
    <input
        class="input {hasErrors ? "input-error !bg-error-900" : ""}"
        type="text"
        name={name}
        bind:value={value}
        autocomplete="off"
        placeholder={placeholder}
        on:input={handleInput}

        on:change
        on:input

        aria-invalid={hasErrors ? "true" : undefined}
    />
</label>
