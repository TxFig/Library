<script lang="ts">
    import { enhance } from "$app/forms";
    import SubmitFunctionFactory from "$lib/utils/submit-function-factory";
    import { UserCreateSchema } from "$lib/validation/auth/user";

    export let formData: {
		email: string,
		username: string
	}

    const submitFunction = SubmitFunctionFactory(UserCreateSchema)

</script>

<form
    use:enhance={submitFunction}
    method="post"
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
</form>
