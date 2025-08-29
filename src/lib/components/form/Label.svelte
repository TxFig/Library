<script lang="ts">
    import Icon from "@iconify/svelte";
    import type { Snippet } from "svelte";
    import type { HTMLLabelAttributes } from "svelte/elements"


    let {
        text,
        children = undefined,
        required = false,
        icon = undefined,
        iconSize = 16,
        ...rest
    }: {
        text: string,
        children?: Snippet
        required?: boolean,
        icon?: string,
        iconSize?: number
    } & HTMLLabelAttributes = $props()
</script>

<!-- svelte-ignore a11y_label_has_associated_control -->
<label class="label" {...rest}>
    <p class="flex items-center">
        <span>{text}</span>
        {#if icon}
            <Icon {icon} height={iconSize} />
        {/if}
        {#if required}
            <sup class="text-red-500">*</sup>
        {/if}
    </p>

    {@render children?.()}
</label>
