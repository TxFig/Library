<script lang="ts">
    import { getToastStore, SlideToggle } from "@skeletonlabs/skeleton";
    import type { PageData } from "./$types";
    import type { AppSettings } from "@prisma/client";

    export let data: PageData
    const toastStore = getToastStore()

    let publicAccess: boolean = data.settings.public
    $: settings = {
        public: publicAccess
    }

    async function updateSettings(settings: Omit<AppSettings, "id">) {
        const response = await fetch("/api/app-settings/", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(settings)
        })

        if (!response.status) {
            toastStore.trigger({
                message: "Error Updating Settings",
                background: "variant-filled-error"
            })
        }
    }
</script>

<div class="flex flex-col gap-4">
    <p class="text-xl">App Settings</p>
    <div class="flex gap-4">
        <p>Public Access</p>
        <SlideToggle
            bind:checked={settings.public}
            name=""
            size="sm"
            on:change={() => updateSettings(settings)}
        />
    </div>
</div>
