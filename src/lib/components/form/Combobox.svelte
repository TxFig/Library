<script lang="ts" generics="T extends string | number">
    import type { Placement } from "@floating-ui/dom";
    import Icon from "@iconify/svelte";
    import { ListBox, ListBoxItem, popup, type PopupSettings } from "@skeletonlabs/skeleton";
    import type { Snippet } from "svelte";


    let {
        name, options,
        value = $bindable(),
        placeholder = "Select",
        event = "click",
        placement = "bottom",
        width = "w-48",
        height = "max-h-52",
        onClick = () => {},
        required = false,
        display = undefined,
        disabled = Array.from({ length: options.length }).map(() => false)
    }: {
        name: string,
        options: readonly T[],
        value?: T,
        placeholder?: string,
        event?: "click" | "hover",
        placement?: Placement,
        width?: string,
        height?: string,
        required?: boolean
        onClick?: (value: T, index: number) => void,
        display?: Snippet<[T, number | undefined]>,
        disabled?: boolean[]
    } = $props()

    const popupSettings: PopupSettings = {
        event: event,
        target: name,
        placement: placement,
        closeQuery: ".listbox-item:not(:has(input:disabled))",
    }

    let clientWidth = $state(0)
</script>

<div class={width}> <!-- prevent external css properties from separating the button from the popup -->
    <button
        class="btn variant-ghost-surface w-full justify-between"
        use:popup={popupSettings}
        type="button"
        bind:clientWidth
    >
        {#snippet displayValue()}
            {#if value && display}
                {@render display(value, undefined)}
            {:else}
                <span>{value || placeholder}</span>
            {/if}
        {/snippet}

        {#if required}
            <div>
                {@render displayValue()}
                <sup class="text-red-500">*</sup>
            </div>
        {:else}
            {@render displayValue()}
        {/if}

        <Icon icon="tabler:caret-down-filled" width="24" height="24" class="shrink-0" />
    </button>
    <div
        class="card shadow-xl py-2 z-10"
        data-popup={name}
        style:width="{clientWidth}px"
    >
        <ListBox rounded="rounded-container-token" class="{height} overflow-y-auto">
            {#each options as option, index}
                <ListBoxItem
                    bind:group={value}
                    name={name}
                    value={option}
                    on:click={() => onClick(option, index)}
                    disabled={disabled[index]}
                >
                    {#if display}
                        {@render display(option, index)}
                    {:else}
                        {option}
                    {/if}
                </ListBoxItem>
            {/each}
        </ListBox>
        <div class="arrow variant-filled-surface"></div>
    </div>
</div>
