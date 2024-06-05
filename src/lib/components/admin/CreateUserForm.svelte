<script lang="ts">
    import Icon from "@iconify/svelte";
    import type { PermissionGroup } from "@prisma/client";
    import { ListBox, ListBoxItem, SlideToggle, popup, type PopupSettings } from "@skeletonlabs/skeleton";

    export let formData: {
		email: string,
		username: string,
        permissionGroup: string,
        admin: boolean
	}

    export let allPermissionGroups: PermissionGroup[]

    let selectedPermissionGroup: string
    $: formData.permissionGroup = selectedPermissionGroup
    const popupCombobox: PopupSettings = {
        event: "click",
        target: "popupCombobox",
        placement: "bottom",
        closeQuery: ".listbox-item",
    }

    let admin: boolean = false;
    $: selectedPermissionGroup = admin ? "Admin" : selectedPermissionGroup
    $: formData.admin = admin

</script>

<form
    class="modal-form border border-surface-500 p-4 space-y-4 rounded-container-token"
>
    <label class="label">
        <span>Email</span>
        <input class="input" type="email" bind:value={formData.email} placeholder="Enter email..." />
    </label>
    <label class="label">
        <span>Username</span>
        <input class="input" type="text" bind:value={formData.username} placeholder="Enter username..." />
    </label>
    <label class="label flex items-center gap-2" for="slide">
        <span>Admin</span>
        <SlideToggle name="slide" bind:checked={admin} size="sm" />
    </label>
    <label class="label flex flex-col">
        <span>Permission Group</span>
        <button class="btn variant-filled w-48 justify-between" use:popup={popupCombobox}>
            <span class="capitalize">{selectedPermissionGroup ?? "Select"}</span>
            <Icon icon="tabler:caret-down-filled" width="24" height="24" />
        </button>
        <div class="card w-48 shadow-xl py-2" data-popup="popupCombobox">
            <ListBox rounded="rounded-container-token">
                {#each allPermissionGroups as permissionGroup}
                    <ListBoxItem bind:group={selectedPermissionGroup} name="permissionGroup" value={permissionGroup.name}>{permissionGroup.name}</ListBoxItem>
                {/each}
            </ListBox>
            <div class="arrow bg-surface-100-800-token" />
        </div>
    </label>
</form>
