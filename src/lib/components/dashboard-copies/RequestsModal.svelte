<script lang="ts">
    import Icon from "@iconify/svelte";
    import { getModalStore } from "@skeletonlabs/skeleton";
    import { type SvelteComponent } from "svelte";
    import { page } from "$app/state";
    import type { DashboardCopiesPage } from "$lib/types";
    import { fetchAPI } from "$lib/utils/api-fetch";
    import ButtonWithSpinner from "../ButtonWithSpinner.svelte";
    import type { BookCopyRequestAcceptPostMethodReturn } from "$lib/server/api/copies/request/accept/POST";
    import HttpCodes from "$lib/utils/http-codes";


    let { parent, copy }: {
        parent: SvelteComponent,
        copy: DashboardCopiesPage.Copy
    } = $props()

    const modalStore = getModalStore()

    let requests = $state(copy.requests.filter(req => req.status === "pending"))
    let pendingCount = $derived(requests.filter(req => req.status === "pending").length)

    function calcDueDate(startDate: Date, duration: number): Date {
        const due = new Date(startDate)
        due.setDate(due.getDate() + duration)
        return due
    }

    let loadings = $state(Array.from({ length: requests.length }).fill(-1))
    async function accept(index: number) {
        loadings[index] = 0
        const json = await fetchAPI<BookCopyRequestAcceptPostMethodReturn>(`/copies/${copy.id}/request/${requests[index].id}/accept`, {
            method: "POST"
        })
        if (json?.status !== HttpCodes.Success.OK) {
            return // TODO: show error
        }

        requests[index].status = "accepted"
        $modalStore[0].response?.({
            status: "accepted",
            id: requests[index].id,
            loan: {
                ...json.data,
                startDate: new Date(json.data.startDate)
            }
        } satisfies DashboardCopiesPage.RequestsModalResponse)

        if (pendingCount === 0) {
            modalStore.close()
        }
        loadings[index] = -1
    }

    async function reject(index: number) {
        loadings[index] = 1
        const json = await fetchAPI(`/copies/${copy.id}/request/${requests[index].id}/reject`, {
            method: "POST"
        })
        if (json?.status !== HttpCodes.Success.OK) {
            return // TODO: show error
        }

        requests[index].status = "rejected"
            $modalStore[0].response?.({
            status: "rejected",
            id: requests[index].id
        } satisfies DashboardCopiesPage.RequestsModalResponse)
        if (pendingCount === 0) {
            modalStore.close()
        }
        loadings[index] = -1
    }
</script>

{#if $modalStore[0]}
    <div class="card p-6 w-full max-w-2xl shadow-xl flex flex-col justify-between gap-6">
        {#if page.data.user}
            <header class="flex justify-between items-start">
                <div class="space-y-1">
                    <h3 class="h3">Borrowing Requests <span class="opacity-70">({pendingCount})</span></h3>
                    <p class="opacity-70">For: <span class="font-bold">{copy.edition.title}</span></p>
                </div>
                <button type="button" class="btn-icon" onclick={() => parent.onClose()}>
                    <Icon icon="mdi:close" height="16" />
                </button>
            </header>
            <main class="flex flex-col gap-4">
                {#each requests as request, index}
                    {@const dueDate = calcDueDate(request.startDate, request.duration)}
                    <div class={[
                        "flex justify-between card shadow-md p-4",
                        {
                            "variant-outline-success": request.status === "accepted",
                            "variant-outline-error": request.status === "rejected"
                        }
                    ]}>
                        <div class="flex flex-col gap-2 sm:gap-4">
                            <p class="font-bold text-xl">{request.user.username}</p>
                            <div class="flex flex-col sm:flex-row text-sm sm:text-base gap-2 sm:gap-4">
                                <p>
                                    <span class="opacity-70">Start Date:</span><br>
                                    {request.startDate.toDateString()}
                                </p>
                                <p>
                                    <span class="opacity-70">Duration:</span><br>
                                    {request.duration} days
                                </p>
                                <p>
                                    <span class="opacity-70">Due Date:</span><br>
                                    {dueDate.toDateString()}
                                </p>
                            </div>
                            <p class="flex items-center gap-1 text-xs sm:text-sm opacity-70">
                                <Icon icon="mdi:clock-outline" height="16" />
                                <span>Requested on {request.createdAt.toDateString()}</span>
                            </p>
                        </div>
                        <div class="flex flex-col justify-between items-end">
                            <div class="flex flex-col sm:flex-row *:h-fit gap-2">
                                <ButtonWithSpinner
                                    class={[
                                        "btn variant-outline-success text-success-500",
                                        { "variant-filled-success": request.status === "accepted" }
                                    ]}
                                    contentClass="flex items-center gap-2"
                                    onclick={() => accept(index)}
                                    loading={loadings[index] === 0}
                                    disabled={loadings[index] !== -1 || request.status !== "pending"}
                                >
                                    <Icon icon="mdi:check" height="16" />
                                    <span>Accept</span>
                                </ButtonWithSpinner>
                                <ButtonWithSpinner
                                    class={[
                                        "btn variant-outline-error text-error-500",
                                        { "variant-filled-error": request.status === "rejected" }
                                    ]}
                                    contentClass="flex items-center gap-2"
                                    onclick={() => reject(index)}
                                    loading={loadings[index] === 1}
                                    disabled={loadings[index] !== -1 || request.status !== "pending"}
                                >
                                    <Icon icon="mdi:close" height="16" />
                                    <span>Reject</span>
                                </ButtonWithSpinner>
                            </div>
                            {#if request.status === "accepted"}
                                <p class="font-bold opacity-70">See loans tab for details</p>
                            {/if}
                        </div>
                    </div>
                {/each}
            </main>
            <footer class="flex justify-end gap-2">
                <button class="btn variant-outline" onclick={() => parent.onClose()}>Close</button>
            </footer>
        {:else}
            <p class="alert variant-ghost-error">Need to be logged in</p>
        {/if}
    </div>
{/if}
