<script lang="ts">
    import type { EntireUser } from "$lib/server/database/auth/user";
    import HttpCodes from "$lib/utils/http-codes";
    import Icon from "@iconify/svelte";
    import { getModalStore, getToastStore, type ModalSettings } from "@skeletonlabs/skeleton";

    import type { ApiJsonResponse } from "$lib/server/api";
    import type { UserDeleteMethodReturn } from "$lib/server/api/user/DELETE";
    import { page } from "$app/stores";


    export let users: EntireUser[]
    export let user: EntireUser

    const modalStore = getModalStore()
    const toastStore = getToastStore()

    const deleteUserModal: (user: EntireUser) => ModalSettings = (user) => ({
        type: "confirm",
        title: "Delete User Confirmation",
        body: `Are you sure you want to delete the user <b>${user.username}</b>?`,
        async response(confirmed: boolean) {
            if (!confirmed) return
            const response = await fetch(`/api/user/${user.opaqueId}`, {
                method: "DELETE"
            })
            const json: ApiJsonResponse<UserDeleteMethodReturn> = await response.json()
            if (json.status === HttpCodes.Success) {
                users = users.filter(u => u.id != user.id)
            } else {
                toastStore.trigger({
                    message: json.message,
                    background: "variant-filled-error"
                })
            }
        }
    })

    async function deleteUser(user: EntireUser) {
        modalStore.trigger(deleteUserModal(user))
    }

</script>

<button
    on:click={() => deleteUser(user)}
    disabled={user.opaqueId === $page.data.user?.opaqueId}
    class="btn-icon"
>
    <Icon icon="mdi:delete" width="24" height="24"/>
</button>
