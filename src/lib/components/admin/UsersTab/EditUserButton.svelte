<script lang="ts">
    import type { EntireUser } from "$lib/server/database/auth/user";
    import Icon from "@iconify/svelte";
    import { getModalStore, type ModalSettings } from "@skeletonlabs/skeleton";
    import UserFormModal from "./UserFormModal.svelte";
    import type { PermissionGroup } from "@prisma/client";
    import type { SuperFormCreateUser } from "$lib/server/api/user/POST";


    export let users: EntireUser[]
    export let allPermissionGroups: PermissionGroup[]
    export let user: EntireUser
    export let updateForm: SuperFormCreateUser

    const modalStore = getModalStore()

    const editUserModal: (user: EntireUser) => ModalSettings = (user) => {
        updateForm.data.email = user.email
        updateForm.data.username = user.username
        updateForm.data.permissionGroup = user.permissionGroup.name

        return {
            type: "component",
            title: "Edit User Form",
            buttonTextConfirm: "Edit User",
            component: {
                ref: UserFormModal,
                props: {
                    allPermissionGroups,
                    form: updateForm,
                    actionName: "update",
                    opaqueId: user.opaqueId
                }
            },
            response(editedUser?: EntireUser) {
                if (editedUser)
                    users = users.map(u => u.id == editedUser.id ? editedUser : u)
            }
        }
    }

    function editUser(user: EntireUser) {
        modalStore.trigger(editUserModal(user))
    }

</script>

<button
    on:click={() => editUser(user)}
    class="btn-icon"
>
    <Icon icon="mdi:pencil" width="24" height="24"/>
</button>
