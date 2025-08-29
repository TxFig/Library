<script lang="ts">
    import { ProgressRadial } from "@skeletonlabs/skeleton"
    import type { HTMLButtonAttributes } from "svelte/elements"


    let {
        loading = false,
        children,
        class: externalClasses,
        contentClass,
        ...rest
    }: { contentClass?: string, loading?: boolean } & HTMLButtonAttributes = $props()
</script>

<button
    class={["btn relative", externalClasses]}
    disabled={loading}
    {...rest}
>
    {#if loading}
        <ProgressRadial width="w-6" class="!absolute" />
    {/if}
    <span class={[contentClass, "!ml-0", { "opacity-0": loading }]}>
        {@render children?.()}
    </span>
</button>
