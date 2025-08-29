<script lang="ts">
    import type { Snippet } from "svelte"
    import type { SvelteHTMLElements } from "svelte/elements"


    let {
        errors = undefined,
        children,
        ...rest
    }: {
        errors?:
            { _errors?: string[] } & Record<string | number, string[]> |
            string[] |
            undefined,
        children: Snippet
    } & SvelteHTMLElements["div"] = $props()

    let message = $state<string>()
    $effect(() => {
        if (!errors) {
            message = undefined
            return
        }

        if (Array.isArray(errors)) {
            message = errors[0]
            return
        }

        if (errors._errors) {
            message = errors._errors[0]
            return
        }

        message = Object.values(errors)[0][0]
    })

    let container: HTMLDivElement
    let input: HTMLInputElement | null

    $effect(() => {
        if (!input) return

        if (message) {
            input.setAttribute("data-invalid", "")
        } else {
            input.removeAttribute("data-invalid")
        }
    })

    $effect(() => {
        input = container.querySelector("input")
    })
</script>

<div bind:this={container} {...rest}>
    {@render children?.()}
    {#if message}
        <p class="text-red-600">{message}</p>
    {/if}
</div>
