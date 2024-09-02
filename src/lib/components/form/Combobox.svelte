<script lang="ts">
    import type { Placement } from "@floating-ui/dom";
    import Icon from "@iconify/svelte";
    import { ListBox, ListBoxItem, popup, type PopupSettings } from "@skeletonlabs/skeleton";


    export let popupName: string
    export let options: string[]
    export let value: string | undefined = undefined
    export let placeholder: string = "Select"
    export let icons: string[] | undefined = undefined
    export let event: "click" | "hover" = "click"
    export let placement: Placement = "bottom"
    export let width: string = "w-48"
    export let onClick: (value: string, index: number) => void = () => {}

    $: valueIndex = value ? options.indexOf(value) : -1

    const popupSettings: PopupSettings = {
        event: event,
        target: popupName,
        placement: placement,
        closeQuery: ".listbox-item",
    }
</script>

<div> <!-- prevent external css properties from separating the button from the popup -->
    <button class="btn variant-filled {width} justify-between" use:popup={popupSettings} type="button">
        {#if icons && valueIndex !== -1}
            <div class="flex items-center gap-2">
                <Icon icon={icons[valueIndex]} width="16" height="16"/>
                <span>{value || placeholder}</span>
            </div>
        {:else}
            <span class="capitalize">{value || placeholder}</span>
        {/if}
        <Icon icon="tabler:caret-down-filled" width="24" height="24" />
    </button>
    <div class="card {width} shadow-xl py-2 z-10" data-popup={popupName}>
        <ListBox rounded="rounded-container-token">
            {#each options as option}
                {@const optionIndex = options.indexOf(option)}
                <ListBoxItem
                    bind:group={value}
                    name={popupName}
                    value={option}
                    regionDefault={icons ? "flex items-center gap-2 pr-8" : ""}

                    on:click={() => onClick(option, optionIndex)}
                >
                    {#if icons}
                        <Icon icon={icons[optionIndex]} width="16" height="16"/>
                        <span>{option}</span>
                    {:else}
                        {option}
                    {/if}
                </ListBoxItem>
            {/each}
        </ListBox>
        <div class="arrow variant-filled-surface" />
    </div>
</div>
