<script lang="ts">
    import Icon from "@iconify/svelte";
    import { getModalStore, getToastStore, RangeSlider } from "@skeletonlabs/skeleton";
    import { type SvelteComponent } from "svelte";
    import BookEditionImage from "../BookEditionImage.svelte";
    import type { BookPage } from "$lib/types";
    import { type CopyRequestCreateSchema, maxDays, minDays } from "$lib/validation/interactions/copy";
    import { page } from "$app/state";
    import { fetchAPI } from "$lib/utils/api-fetch";
    import HttpCodes from "$lib/utils/http-codes";
    import type { BookCopyRequestPostMethodReturn } from "$lib/server/api/copies/request/POST";
    import ButtonWithSpinner from "../ButtonWithSpinner.svelte";
    import type * as v from "valibot"
    import messages from "$lib/messages";


    let { parent, bookId, edition, copy }: {
        parent: SvelteComponent,
        bookId: string,
        edition: BookPage.DisplayEdition,
        copy: BookPage.DisplayCopy
    } = $props()

    const modalStore = getModalStore()
    const toastStore = getToastStore()

    const today = new Date().toISOString().split('T')[0]
    let startDate = $state<string>(today)
    let duration = $state(minDays)
    let dueDate = $derived.by(() => {
        const due = new Date(startDate ?? Date.now())
        due.setDate(due.getDate() + duration)
        return due
    })

    let submitting = $state(false)
    async function submit() {
        if (!page.data.user) return
        submitting = true
        const json = await fetchAPI<BookCopyRequestPostMethodReturn>(`/copies/${copy.id}/request`, {
            method: "POST",
            body: {
                startDate: new Date(startDate).toISOString(),
                duration,
            } satisfies v.InferInput<CopyRequestCreateSchema>
        })

        submitting = false
        if (json?.status === HttpCodes.Success.OK) {
            $modalStore[0].response?.(json.data)
            modalStore.close();
        } else if (json?.status === HttpCodes.ClientError.Forbidden) {
            if (json.message === messages.copy.unavailable) {
                $modalStore[0].response?.("unavailable")
            }
            toastStore.trigger({
                message: json.message,
                background: "variant-filled-error"
            })
            modalStore.close();
        }
    }
</script>

{#if $modalStore[0]}
    <div class="card p-6 w-modal shadow-xl flex flex-col justify-between gap-6 max-h-[90vh]">
        {#if page.data.user}
            <header class="flex justify-between items-start">
                <div class="space-y-1">
                    <h3 class="h3">Request Book Copy</h3>
                    <p class="opacity-70 text-sm">Select when you plan to return this book.</p>
                </div>
                <button type="button" class="btn-icon" onclick={() => parent.onClose()}>
                    <Icon icon="mdi:close" height="16" />
                </button>
            </header>
            <main class="flex flex-col gap-8 overflow-y-auto">
                <div class="flex gap-4">
                    <BookEditionImage
                        {bookId}
                        editionId={edition.id}
                        heights={edition.image}
                        class="h-40 mx-2 border border-surface-500"
                    />
                    <div class="flex flex-col justify-between">
                        <div class="space-y-1">
                            <p class="text-xl">{edition.title}</p>
                            {#if edition.subtitle}
                                <p class="text-xs sm:text-sm">{edition.subtitle}</p>
                            {:else if edition.publishers.length > 0}
                                <p>{edition.publishers.join(", ")}</p>
                            {/if}
                        </div>
                        <div>
                            <p><b>Location:</b> {copy.location}</p>
                            <p><b>Owner:</b> {copy.owner.username}</p>
                        </div>
                    </div>
                </div>

                <div class="space-y-1">
                    <p class="font-bold flex items-center gap-1">
                        <Icon icon="mdi:calendar-start" height="16" />
                        <span>Start Date</span>
                    </p>
                    <input
                        type="date"
                        class="input [&::-webkit-calendar-picker-indicator]:invert"
                        min={today}
                        bind:value={startDate}
                        placeholder="YYYY-MM-DD"
                    />
                </div>
                <div class="space-y-1">
                    <RangeSlider
                        name="duration-slider"
                        bind:value={duration}
                        min={minDays}
                        max={maxDays}
                        step={1}
                    >
                        <p class="font-bold flex items-center gap-1">
                            <Icon icon="mdi:book-time" height="16" />
                            <span>Duration</span>
                        </p>
                    </RangeSlider>
                    <div class="flex justify-between text-xs">
                        <p>{minDays} days</p>
                        <p>{duration} days</p>
                        <p>{maxDays} days</p>
                    </div>
                    <p class="text-sm opacity-70">
                        Slide to select how many days you need the book.
                    </p>
                </div>
                <div>
                    <p class="flex items-center gap-1">
                        <Icon icon="mdi:calendar" height="16" />
                        <span>Checkout Summary:</span>
                    </p>
                    <div class="px-4 py-2 variant-ghost-surface flex flex-col gap-1 text-sm sm:text-base">
                        <div class="flex justify-between">
                            <p>Start Date:</p>
                            <p>{new Date(startDate).toDateString()}</p>
                        </div>
                        <div class="flex justify-between">
                            <p>Duration:</p>
                            <p>{duration} days</p>
                        </div>
                        <div class="flex justify-between">
                            <p>Due Date:</p>
                            <p>{dueDate.toDateString()}</p>
                        </div>
                    </div>
                </div>
            </main>
            <footer class="flex justify-end gap-2">
                <button class="btn variant-outline" onclick={() => parent.onClose()}>Cancel</button>
                <ButtonWithSpinner
                    class="variant-filled-primary"
                    onclick={() => submit()}
                    loading={submitting}
                >
                    Submit Request
                </ButtonWithSpinner>
            </footer>
        {:else}
            <p class="alert variant-ghost-error">Need to be logged in</p>
        {/if}
    </div>
{/if}
