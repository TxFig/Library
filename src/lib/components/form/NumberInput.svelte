<script lang="ts">
    import filterRegex from "$lib/utils/filter-regex";

    export let text: string
    export let required: boolean = false
    export let name: string | undefined = undefined
    export let value: number | undefined | null = undefined
    export let placeholder: string | undefined = undefined

    export let min: number | undefined = undefined
    export let max: number | undefined = undefined

    export let allowedRegex: RegExp = /^[0-9]*$/
    function handleInput() {
        if (!value) return

        const validValue = filterRegex(allowedRegex, value.toString())
        value = validValue !== "" ? Number(validValue) : undefined
    }

    let externalClasses: string = ""
    export { externalClasses as class }

    export let errors: { _errors?: string[] } | undefined = undefined
    $: hasErrors = errors?._errors?.length ?? 0 > 0
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
        {name} {min} {max}
        bind:value
        on:input={handleInput}
        placeholder={placeholder}
        autocomplete="off"

        on:change
        on:input

        aria-invalid={hasErrors ? "true" : undefined}
    />
</label>
