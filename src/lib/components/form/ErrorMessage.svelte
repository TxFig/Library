<script lang="ts">
    import { onMount } from "svelte";

    export let errors:
        { _errors?: string[] } |
        { _errors?: string[] }[] & Record<string | number, string[]> |
        string[] |
        undefined = undefined

    $: message = errors ?
        Array.isArray(errors) ? errors[0] :
        errors._errors ? errors._errors[0] :
        Object.values(errors)[0]
    : undefined

    let container: HTMLDivElement
    let input: HTMLInputElement | null

    $: if (input) message ?
        input.setAttribute("data-invalid", "") :
        input.removeAttribute("data-invalid")

    onMount(() => {
        input = container.querySelector("input")
    })
</script>

<div bind:this={container}>
    <slot />
    {#if message}
        <p class="text-red-600">{message}</p>
    {/if}
</div>
