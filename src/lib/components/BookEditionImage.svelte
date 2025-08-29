<script lang="ts">
    import PlaceholderImage from "./PlaceholderImage.svelte";
    import type { HTMLImgAttributes } from "svelte/elements"


    let {
        bookId,
        editionId,
        heights,
        quality = "low",
        placeholder = true,
        ...rest
    }: {
        bookId: string,
        editionId: string,
        heights: number[],
        quality?: "high" | "low",
        alt?: string,
        placeholder?: boolean
    } & Omit<HTMLImgAttributes, "placeholder"> = $props()


    let height = $state<number>()
    if (quality === "high") {
        height = Math.max(...heights)
    }
    else {
        height = Math.min(...heights)
    }
</script>

{#if heights.length > 0}
    <img
        src="/images/{bookId}/{editionId}/{height}.webp"
        loading="lazy"
        {...rest}
    />
{:else if placeholder}
    <PlaceholderImage {...rest} />
{/if}
