<script lang="ts">
    import Icon from "@iconify/svelte"
    import { onMount } from "svelte"

    export let images: string[]
    let elemCarousel: HTMLDivElement
    let multiImages = images.length > 1

    function carouselLeft(): void {
        const x =
            elemCarousel.scrollLeft === 0
                ? elemCarousel.clientWidth * elemCarousel.childElementCount // loop
                : elemCarousel.scrollLeft - elemCarousel.clientWidth // step left
        elemCarousel.scroll(x, 0)
    }

    function carouselRight(): void {
        const x =
            elemCarousel.scrollLeft === elemCarousel.scrollWidth - elemCarousel.clientWidth
                ? 0 // loop
                : elemCarousel.scrollLeft + elemCarousel.clientWidth // step right
        elemCarousel.scroll(x, 0)
    }

    function adjustImageMargin() {
        const width = elemCarousel.clientWidth
        const imagesElements = elemCarousel.children as HTMLCollectionOf<HTMLImageElement>

        for (const image of imagesElements) {
            if (image.clientWidth < width) {
                const xMargin = (width - image.clientWidth) / 2
                image.style.marginLeft = `${xMargin}px`
                image.style.marginRight = `${xMargin}px`
            }
        }
    }

    onMount(() => {
        adjustImageMargin()
        window.addEventListener("resize", adjustImageMargin)
    })

</script>

<div class="flex flex-col sm:w-1/2">
    <div class="card p-4 grid {multiImages ? "grid-cols-[auto_1fr_auto]" : "grid-cols-1"} gap-4 items-center">
        <!-- Button: Left -->
        {#if multiImages}
            <button type="button" class="btn-icon variant-filled" on:click={carouselLeft}>
                <Icon icon="fe:arrow-left"/>
            </button>
        {/if}
        <!-- Full Images -->
        <div bind:this={elemCarousel} class="snap-x snap-mandatory scroll-smooth flex overflow-x-auto">
            {#each images as img}
                <img
                    class="snap-center rounded-container-token object-contain"
                    src={img}
                    alt=""
                />
            {/each}
        </div>
        <!-- Button: Right -->
        {#if multiImages}
            <button type="button" class="btn-icon variant-filled" on:click={carouselRight}>
                <Icon icon="fe:arrow-right"/>
            </button>
        {/if}
    </div>
</div>
