<script lang="ts">
    import Icon from "@iconify/svelte";
    import type { PageData } from "./$types"
    import { getModalStore, popup, Tab, TabGroup, type ModalSettings, type PopupSettings } from "@skeletonlabs/skeleton";
    import type { DashboardCopiesPage } from "$lib/types";
    import RequestsModal from "$lib/components/dashboard-copies/RequestsModal.svelte";
    import { page } from "$app/state";
    import type { CopyLoanUpdateSchema, CopyRequestUpdateSchema, CopyUpdateSchema, CopyUpdateStatus } from "$lib/validation/interactions/copy";
    import { fetchAPI } from "$lib/utils/api-fetch";
    import type { BookCopyPatchMethodReturn } from "$lib/server/api/copies/PATCH";
    import type * as v from "valibot"
    import HttpCodes from "$lib/utils/http-codes";
    import urls from "$lib/urls";
    import { goto } from "$app/navigation";


    let { data }: {
        data: PageData
    } = $props()

    let copies = $state(data.copies)

    let urlTab = page.url.searchParams.get("tab")
    let tabs = ["copies", "loans", "requests"]
    let tabSet = $state(urlTab && tabs.includes(urlTab) ? tabs.indexOf(urlTab) : 0)
    $effect(() => {
        goto(`?tab=${tabs[tabSet]}`, {
            replaceState: true
        })
    })

    let loansCount = $derived(copies.flatMap(cp => cp.loans.filter(loan =>
        loan.status === "active" || loan.status === "reserved"
    )).length)
    let requests = $state(data.requests)

    const copyActionsPopupSettings: PopupSettings = {
        event: "click",
        target: "copy-actions",
        placement: "bottom-end"
    }
    let popupCopyIndex = $state<number>()

    const modalStore = getModalStore()
    const requestsModal: (index: number) => ModalSettings = (index) => ({
        type: "component",
        component: {
            ref: RequestsModal,
            props: {
                copy: copies[index]
            }
        },
        response(response: DashboardCopiesPage.RequestsModalResponse) {
            if (!response) return
            const reqIndex = copies[index].requests.findIndex(req => req.id === response.id)
            if (reqIndex === undefined) return
            copies[index].requests[reqIndex].status = response.status
            if (response.status === "accepted") {
                copies[index].loans.push(response.loan)
            }
        },
    })

    async function updateStatus(index: number, status: CopyUpdateStatus) {
        const json = await fetchAPI<BookCopyPatchMethodReturn>(`/copies/${copies[index].id}`, {
            method: "PATCH",
            body: {
                status
            } satisfies v.InferInput<CopyUpdateSchema>
        })

        if (json && json.status === HttpCodes.Success.OK) {
            copies[index].status = status

            if (status === "unavailable") {
                copies[index].requests = []
            }
        }
    }

    function calcDueDate(startDate: Date, duration: number): Date {
        const due = new Date(startDate)
        due.setDate(due.getDate() + duration)
        return due
    }

    async function cancelLoan(copyIndex: number, loanIndex: number) {
        const copy = copies[copyIndex]
        const loan = copy.loans[loanIndex]
        const json = await fetchAPI(`/copies/${copy.id}/loan/${loan.id}/`, {
            method: "PATCH",
            body: {
                status: "cancelled"
            } satisfies v.InferInput<CopyLoanUpdateSchema>
        })
        if (json?.status !== HttpCodes.Success.OK) {
            return // Show Error
        }

        copies[copyIndex].loans[loanIndex].status = "cancelled"
    }

    async function cancelRequest(requestId: string) {
        const index = requests.findIndex(req => req.id === requestId)
        if (index === -1) return
        const request = requests[index]
        const copy = requests[index].copy

        if (request.status === "pending") {
            const json = await fetchAPI(`/copies/${copy.id}/request/${request.id}`, {
                method: "PATCH",
                body: {
                    status: "cancelled"
                } satisfies v.InferInput<CopyRequestUpdateSchema>
            })
            if (json?.status !== HttpCodes.Success.OK) {
                return // Show Error
            }

            requests[index].status = "cancelled"
        } else if (request.status === "accepted") {
            const json = await fetchAPI(`/copies/${copy.id}/loan/${request.loan.id}`, {
                method: "PATCH",
                body: {
                    status: "cancelled"
                } satisfies v.InferInput<CopyLoanUpdateSchema>
            })
            if (json?.status !== HttpCodes.Success.OK) {
                return // Show Error
            }

            requests[index].loan.status = "cancelled"
        }
    }
</script>

<svelte:head>
    <title>Library - My Copies</title>
</svelte:head>

{#if page.data.user}
    <div class="space-y-4 md:space-y-8 px-4 py-6 sm:px-8 sm:py-10 max-w-7xl mx-auto">
        <div>
            <h1 class="h1 font-bold">My Copies</h1>
            <h2 class="h2">Manage your copies and borrowing requests</h2>
        </div>
        <TabGroup>
            <Tab bind:group={tabSet} name="copies" value={0}>My Copies</Tab>
            <Tab bind:group={tabSet} name="loans" value={1}>Loans & Reservations</Tab>
            <div class="w-px mx-4 my-2 border-l border-l-surface-400"></div>
            <!-- <div class="w-6 h-px my-auto mx-2 border-t border-t-surface-400"></div> -->
            <Tab bind:group={tabSet} name="requests" value={2}>My Requests</Tab>
            <svelte:fragment slot="panel">
                {#if tabSet === 0}
                    {@render allCopiesTab()}
                {:else if tabSet === 1}
                    {@render loansTab()}
                {:else if tabSet === 2}
                    {@render myRequests()}
                {/if}
            </svelte:fragment>
        </TabGroup>
    </div>
{:else}
    <div class="p-6">
        <p class="alert variant-ghost-error">Need to be logged in</p>
    </div>
{/if}

{#snippet allCopiesTab()}
    <div class="space-y-4">
        <h3 class="h3">Copies you own and their borrowing requests</h3>

        <div class="overflow-x-auto">
            <table class="table table-hover">
                <thead>
                    <tr class="*:!px-3">
                        <th>Title</th>
                        <th>Status</th>
                        <th>Location</th>
                        <th>Requests</th>
                        <th class="w-fit">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {#each copies as copy, index}
                        {@const reserved = copy.loans.some(loan => loan.status === "reserved")}
                        {@const pendingCount = copy.requests.filter(req => req.status === "pending").length}
                        <tr class="*:!align-middle">
                            <td>
                                <a
                                    href={urls.bookPage(copy.edition.book.id, copy.edition.id)}
                                    class="!text-wrap font-bold hover:anchor"
                                >{copy.edition.title}</a>
                            </td>
                            <td>
                                {#if copy.status === "unavailable"}
                                    <span class="variant-filled-error px-3 py-1 rounded-full">Unavailable</span>
                                {:else if copy.status === "on_loan"}
                                    <span class="variant-filled-tertiary px-3 py-1 rounded-full">On Loan</span>
                                {:else if copy.status === "available"}
                                    {#if reserved}
                                        <span class="variant-filled-tertiary px-3 py-1 rounded-full">Reserved</span>
                                    {:else if pendingCount > 0}
                                        <span class="variant-filled-warning px-3 py-1 rounded-full">Requested</span>
                                    {:else}
                                        <span class="variant-filled-success px-3 py-1 rounded-full">Available</span>
                                    {/if}
                                {/if}
                            </td>
                            <td>
                                <a
                                    href={urls.homePage({ location: copy.location.value })}
                                    class="flex items-center gap-1 hover:anchor"
                                >
                                    <Icon icon="mdi:location" height="16" />
                                    <span>{copy.location.value}</span>
                                </a>
                            </td>
                            <td>
                                {#if pendingCount === 0}
                                    <span class="opacity-70">No Requests</span>
                                {:else}
                                    <span class="variant-ghost-error px-3 py-2 rounded-full">
                                        {pendingCount} pending
                                    </span>
                                {/if}
                            </td>
                            <td align="center">
                                <button
                                    class="btn-icon hover:variant-soft"
                                    use:popup={copyActionsPopupSettings}
                                    onclick={() => popupCopyIndex = index}
                                >
                                    <Icon icon="tabler:dots" height="16" />
                                </button>
                            </td>
                        </tr>
                    {:else}
                        <tr>
                            <td colspan="5" align="center" class="opacity-70">
                                No Copies Owned
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
        <div
            data-popup="copy-actions"
            class="card shadow-xl max-h-80 overflow-auto !m-0 p-2"
        >
            {#if popupCopyIndex !== undefined}
                {@const pendingRequests = copies[popupCopyIndex].requests.filter(req => req.status === "pending")}
                <div class="flex flex-col gap-2">
                    <p class="px-2 py-1 font-bold">Actions</p>
                    <hr class="-ml-2 w-[calc(100%+1rem)]">
                    <button
                        class="btn hover:variant-soft w-full pl-2 justify-start"
                        onclick={() => modalStore.trigger(requestsModal(popupCopyIndex!))}
                        disabled={pendingRequests.length === 0}
                    >
                        <Icon icon="mdi:eye" height="16" />
                        <span>View Requests</span>
                    </button>
                    {#if copies[popupCopyIndex].status !== "unavailable"}
                        <button
                            class="btn hover:variant-soft w-full pl-2 justify-start"
                            onclick={() => updateStatus(popupCopyIndex!, "unavailable")}
                        >
                            <Icon icon="mdi:block" height="16" />
                            <span>Make Unavailable</span>
                        </button>
                    {:else}
                        <button
                            class="btn hover:variant-soft w-full pl-2 justify-start"
                            onclick={() => updateStatus(popupCopyIndex!, "available")}
                        >
                            <Icon icon="mdi:check-circle" height="16" />
                            <span>Make Available</span>
                        </button>
                    {/if}
                    <button
                        class="btn hover:variant-soft w-full pl-2 justify-start"
                        onclick={() => {}}
                    >
                        <Icon icon="mdi:pencil" height="16" />
                        <span>Change Location</span>
                    </button>
                    <hr class="-ml-2 w-[calc(100%+1rem)]">
                    <button
                        class="btn hover:variant-soft w-full pl-2 justify-start text-error-500"
                        onclick={() => {}}
                        disabled={
                            copies[popupCopyIndex].status === "on_loan" ||
                            pendingRequests.length > 0
                        }
                    >
                        <Icon icon="mdi:trash" height="16" />
                        <span>Delete Copy</span>
                    </button>
                </div>
            {/if}
        </div>
    </div>
{/snippet}

{#snippet loansTab()}
    <div class="space-y-4">
        <h3 class="h3">Active loans and upcoming reservations for your copies</h3>

        {#if loansCount}
            {#each copies as copy, copyIndex}
                {#each copy.loans.filter(loan =>
                    loan.status === "active" || loan.status === "reserved"
                ) as loan, loanIndex}
                    {@const dueDate = calcDueDate(loan.startDate, loan.duration)}
                    <div class={[
                        "card p-4 shadow-sm flex flex-col justify-between",
                        {
                            "border-l-4 border-l-tertiary-500": loan.status === "active",
                            "border-l-4 border-l-warning-500": loan.status === "reserved"
                        }
                    ]}>
                        <div class="flex justify-between gap-4">
                            <div>
                                <p class="font-bold flex gap-2 flex-nowrap">
                                    <a
                                        href={urls.bookPage(copy.edition.book.id, copy.edition.id)}
                                        class="text-wrap hover:anchor"
                                    >{copy.edition.title}</a>
                                    {#if loan.status === "active"}
                                        <span class="text-xs sm:text-sm px-3 py-1 variant-ghost-tertiary rounded-full h-fit">Active</span>
                                    {:else if loan.status === "reserved"}
                                        <span class="text-xs sm:text-sm px-3 py-1 variant-ghost-warning rounded-full h-fit">Reserved</span>
                                    {/if}
                                </p>
                                <p class="text-sm opacity-80">
                                    <span class="font-bold">Borrower:</span>
                                    <a href={urls.userPage(loan.user.username)} class="hover:anchor">{loan.user.username}</a>
                                </p>
                            </div>
                            <button
                                class="btn btn-sm variant-ghost-error h-fit"
                                onclick={() => cancelLoan(copyIndex, loanIndex)}
                            >
                                <Icon icon="mdi:close-circle-outline" height="16" />
                                <span>Cancel</span>
                            </button>
                        </div>
                        <div class="flex justify-between w-full max-w-xl mt-4">
                            <div class="flex flex-col">
                                <p class="text-sm opacity-70">Start Date:</p>
                                <p>{loan.startDate.toLocaleDateString()}</p>
                            </div>
                            <div class="flex flex-col">
                                <p class="text-sm opacity-70">Duration:</p>
                                <p>{loan.duration} days</p>
                            </div>
                            <div class="flex flex-col">
                                <p class="text-sm opacity-70">Due Date:</p>
                                <p>{dueDate.toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                {/each}
            {/each}
        {:else}
            <p class="text-center opacity-70">No Loans</p>
        {/if}
    </div>
{/snippet}

{#snippet myRequests()}
    <div class="space-y-4">
        <h3 class="h3">Books you've requested or are currently borrowing</h3>
        {#each requests.filter(req => !(req.status === "cancelled" || (req.loan && req.loan.status === "cancelled"))) as request}
            <div class={[
                "card p-4 shadow-sm flex flex-col sm:flex-row justify-between gap-4 sm:gap-8",
                {
                    "border-l-4 border-l-tertiary-500": request.status === "accepted" && request.loan.status === "active",
                    "border-l-4 border-l-warning-500": request.status === "pending" || (request.status === "accepted" && request.loan.status !== "active")
                }
            ]}>
                <div>
                    <p class="font-bold flex gap-2 flex-nowrap">
                        <a
                            href={urls.bookPage(request.copy.edition.book.id, request.copy.edition.id)}
                            class="hover:anchor"
                        >{request.copy.edition.title}</a>
                        {#if request.status === "pending"}
                            <span class="text-xs sm:text-sm px-3 py-1 variant-ghost-warning rounded-full h-fit text-nowrap">Pending</span>
                        {:else if request.status === "accepted"}
                            {#if request.loan.status === "active"}
                                <span class="text-xs sm:text-sm px-3 py-1 variant-ghost-tertiary rounded-full h-fit text-nowrap">Active Loan</span>
                            {:else}
                                <span class="text-xs sm:text-sm px-3 py-1 variant-ghost-warning rounded-full h-fit text-nowrap">Reserved</span>
                            {/if}
                        {/if}
                    </p>
                    <p class="text-sm opacity-80">
                        <span class="font-bold">Owner:</span>
                        <a href={urls.userPage(request.copy.owner.username)} class="hover:anchor">{request.copy.owner.username}</a>
                    </p>
                </div>
                <div class="flex gap-8 md:gap-16 my-auto">
                    <div class="flex flex-col">
                        <p class="text-sm opacity-70">Start Date:</p>
                        <p>{request.startDate.toLocaleDateString()}</p>
                    </div>
                    <div class="flex flex-col">
                        <p class="text-sm opacity-70">Duration:</p>
                        <p>{request.duration} days</p>
                    </div>
                </div>
                <button
                    class="btn btn-sm variant-ghost-error h-fit"
                    onclick={() => cancelRequest(request.id)}
                >
                    <Icon icon="mdi:close-circle-outline" height="16" />
                    <span>Cancel</span>
                </button>
            </div>
        {:else}
            <p class="opacity-70 text-center">No Requests</p>
        {/each}
    </div>
{/snippet}
