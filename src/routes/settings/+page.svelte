<script lang="ts">
    import { SlideToggle, getToastStore } from "@skeletonlabs/skeleton";
    import type { PageData } from "./$types";
    import HttpCodes from "$lib/utils/http-codes"
    import type { SettingsUpdateData } from "$lib/validation/auth/settings";


    export let data: PageData
    const { user } = data

    const toastStore = getToastStore()


    let readingStateVisibility: boolean = user?.userSettings?.visibleReadingState ?? true

    async function updateUserSettings(settings: SettingsUpdateData) {
        const response = await fetch("/api/settings/", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(settings)
        })

        if (response.status === HttpCodes.ServerError.InternalServerError) {
            toastStore.trigger({
                message: "Error Updating Settings",
                background: "variant-filled-error"
            })
        }
    }

    $: settings = {
        visibleReadingState: readingStateVisibility
    }
</script>

<div class="w-full h-full flex flex-col items-center justify-start p-10">
    <div class="flex flex-col gap-4">
        <p class="text-2xl">Your Settings</p>
        <div class="flex gap-4">
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label class="flex items-center gap-2">
                <p>Visible Reading State</p>
                <SlideToggle
                    name="reading-state-visibility"
                    bind:checked={readingStateVisibility}
                    size="sm"
                    on:change={() => updateUserSettings(settings)}
                />
            </label>
        </div>
    </div>
</div>
