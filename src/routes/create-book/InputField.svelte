<script lang="ts">
    import NumberInput from "$lib/components/NumberInput.svelte"


    export let text: string
    export let name: string
    export let type: "text" | "number" = "text"
    export let value: string | undefined = undefined
    export let required: boolean = false

    let errorMessage: string = ""
    $: hasAnError = errorMessage != ""

    export function setError(message: string): void {
        errorMessage = message
    }

    export function clearError(): void {
        errorMessage = ""
    }


    let inputElement: HTMLInputElement
    export function focus(): void {
        inputElement.focus()
    }

</script>

<label class="label">
    <span>
        {text}
        {#if required}
            <sup class="text-red-500">*</sup>
        {/if}
    </span>
    {#if type == "text"}
        <input class="input" type="text" name={name} bind:value={value} bind:this={inputElement} autocomplete="off" />
    {:else}
        <NumberInput name={name} value={value} bind:inputElement={inputElement} />
    {/if}
    <p class="text-red-500" hidden={!hasAnError}>Error: {errorMessage}</p>
</label>
