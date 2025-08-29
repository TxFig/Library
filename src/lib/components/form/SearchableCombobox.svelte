<script lang="ts" generics="T extends string | number">
    import Icon from "@iconify/svelte";
    import { ListBox, ListBoxItem, popup, type PopupSettings } from "@skeletonlabs/skeleton";
    import Input from "./Input.svelte";
    import { search } from "$lib/utils/search";


    let {
        name, options,
        value = $bindable(),
        event = "click",
        placement = "bottom",
        width = "w-fit",
        height = "max-h-52",
        onClick = () => {}
    }: {
        name: string,
        options: T[],
        value: T
        event?: PopupSettings["event"],
        placement?: PopupSettings["placement"],
        width?: string,
        height?: string,
        onClick?: (option: T, index: number) => void
    } = $props()

    const popupSettings: PopupSettings = {
        event, placement,
        target: name,
        closeQuery: ".listbox-item",
    }

    let clientWidth = $state<number>(0)
    let displayOptions = $derived(search(options, value.toString()))
</script>

<div class={width}> <!-- prevent external css properties from separating the input/button from the popup -->
    <div
        bind:clientWidth
        class="{width} grid-cols-[1fr_auto] input-group"
        use:popup={popupSettings}
    >
        <Input bind:value />

        <button type="button" class="border-l border-surface-500">
            <Icon
                icon="tabler:caret-down-filled"
                width="24"
                height="24"
            />
        </button>
    </div>
    <div
        data-popup={name}
        style:width="{clientWidth}px"
        class={[
            "card shadow-xl py-2 z-10",
            { "!p-4": displayOptions.length === 0 }
        ]}
    >
        <ListBox rounded="rounded-container-token" class="{height} overflow-y-auto">
            {#each displayOptions as option, index}
                <ListBoxItem
                    bind:group={value}
                    name={name}
                    value={option}
                    on:click={() => onClick(option, index)}
                >
                    {option}
                </ListBoxItem>
            {:else}
                <p class="text-center">No options</p>
            {/each}
        </ListBox>
        <div class="arrow variant-filled-surface"></div>
    </div>
</div>
