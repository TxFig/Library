<script lang="ts">
    import { enhance } from "$app/forms";
    import type { SubmitFunction } from "@sveltejs/kit";
    import type { ActionData, PageData } from "./$types"
    import { getToastStore } from "@skeletonlabs/skeleton";

    export let data: PageData
    const { providedAdminEmail } = data

    export let form: ActionData
    $: error = form?.error
    $: formData = form?.data

    const toastStore = getToastStore()

    const submitFunction: SubmitFunction = () => ({ result }) => {
        if (result.type == "success") {
            toastStore.trigger({
                message: "Confirmation email sent",
                background: "variant-filled-success"
            })
        }
    }

</script>

<div class="flex flex-col gap-4 p-6">
    <p class="text-2xl mb-4">Admin Account Setup</p>
    {#if providedAdminEmail}
        <p>Confirmation email sent</p>
    {:else}
        <p class="text-xl">Create Admin User Form:</p>
        <form class="flex flex-col gap-4" method="post" use:enhance={submitFunction}>
            <label class="label">
                <span>Email</span>
                <input class="input" type="text" name="email" placeholder="Enter email..." value={formData?.email ?? ""} />
            </label>
            <label class="label">
                <span>Username</span>
                <input class="input" type="text" name="username" placeholder="Enter username..." value={formData?.username ?? ""} />
            </label>
            {#if error}
                <p class="text-red-500">{error}</p>
            {/if}
            <button class="btn variant-ghost-primary w-fit">Create Admin User</button>
        </form>
    {/if}
</div>
