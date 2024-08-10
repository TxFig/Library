<script lang="ts">
    import { getModalStore, type ModalSettings } from "@skeletonlabs/skeleton";
    import type { PageData } from "./$types"
    import DataModal from "./DataModal.svelte";

    export let data: PageData
    const { logs } = data

    const modalStore = getModalStore()
    const dataModal: (data: unknown) => ModalSettings = (data) => ({
        type: "component",
        component: {
            ref: DataModal,
            props: {
                data: JSON.stringify(
                    JSON.parse(data as string), null, 4
                )
            }
        },
        title: "Data",
        buttonTextCancel: "Close",
    })
</script>

<table class="table table-hover">
    <thead>
        <tr>
            <th>Time</th>
            <th>Level</th>
            <th>Message</th>
            <th>User Id</th>
            <th>Metadata</th>
        </tr>
    </thead>
    <tbody>
        {#each logs as log}
            <tr>
                <td class="text-surface-200">{log.createdAt.toLocaleString()}</td>
                <td class={
                      log.level === "error" ? "text-red-600"
                    : log.level === "fatal" ? "text-red-600"
                    : log.level === "warn" ? "text-yellow-600"
                    : log.level === "info" ? "text-blue-600"
                    : log.level === "http" ? "text-orange-600"
                    : log.level === "debug" ? "text-green-600"
                    : "text-gray-600"
                }>{log.level}</td>
                <td>{log.message}</td>
                <td>{log.userId ?? ""}</td>
                {#if log.metadata}
                    <button
                        class="btn variant-outline rounded"
                        on:click={() =>
                            modalStore.trigger(dataModal(log.metadata))
                        }
                    >Show</button>
                {:else}
                    <td></td>
                {/if}
            </tr>
        {/each}
    </tbody>
</table>
