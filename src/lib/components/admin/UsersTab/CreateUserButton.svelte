<script lang="ts">
    import Icon from "@iconify/svelte";
    import { getModalStore, type ModalSettings } from "@skeletonlabs/skeleton";
    import UserFormModal from "./UserFormModal.svelte";
    import type { EntireUser } from "$lib/server/database/auth/user";
    import type { PermissionGroup } from "@prisma/client";
    import type { SuperFormCreateUser } from "$lib/server/api/user/POST";


    export let users: EntireUser[]
    export let allPermissionGroups: PermissionGroup[]
    export let createForm: SuperFormCreateUser

    const modalStore = getModalStore()

    const createUserModal: ModalSettings = {
        type: "component",
        title: "Create User Form",
        buttonTextConfirm: "Create User",
        component: {
            ref: UserFormModal,
            props: {
                allPermissionGroups,
                form: createForm,
                actionName: "create"
            }
        },
        response(user?: EntireUser) {
            if (user)
                users = [...users, user]
        }
    }

    function createUser() {
        modalStore.trigger(createUserModal)
    }
</script>

<button class="btn variant-outline-primary" on:click={createUser}>
    <Icon icon="mdi:user-add" width="24" height="24"/>
    <span>Create User</span>
</button>
