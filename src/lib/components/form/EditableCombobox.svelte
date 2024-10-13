<script lang="ts">
    import type { Placement } from "@floating-ui/dom";
    import Icon from "@iconify/svelte";
    import { ListBox, ListBoxItem, popup, type PopupSettings } from "@skeletonlabs/skeleton";


    export let name: string
    export let options: string[]
    export let value: string | undefined = undefined
    export let event: "click" | "hover" = "click"
    export let placement: Placement = "bottom"
    export let width: string = "w-48"
    export let onClick: (value: string, index: number) => void = () => {}

    const popupSettings: PopupSettings = {
        event: event,
        target: name,
        placement: placement,
        closeQuery: ".listbox-item",
    }
</script>

<div> <!-- prevent external css properties from separating the button from the popup -->
    <button
        class="flex items-center variant-filled w-full justify-between p-0 pr-2"
        use:popup={popupSettings}
        type="button"
    >
        <input
            type="text"
            class="w-full variant-filled focus:ring-transparent border-0 input"
            bind:value={value}
        />
        <Icon icon="tabler:caret-down-filled" width="24" height="24" />
    </button>
    <div
        class="card {width} shadow-xl py-2 z-10"
        class:!opacity-0={options.length === 0}
        data-popup={name}
    >
        <ListBox rounded="rounded-container-token">
            {#each options as option}
                {@const optionIndex = options.indexOf(option)}
                <ListBoxItem
                    bind:group={value}
                    name={name}
                    value={option}

                    on:click={() => onClick(option, optionIndex)}
                >
                    {option}
                </ListBoxItem>
            {/each}
        </ListBox>
        <div class="arrow variant-filled-surface" />
    </div>
</div>
