<script lang="ts">
    export let formData: {
		email: string,
		username: string
	}

</script>

<form
    method="post"
    class="modal-form border border-surface-500 p-4 space-y-4 rounded-container-token"
>
    <label class="label">
        <span>Email</span>
        <input class="input" type="email" value={formData.email} disabled />
    </label>
    <label class="label">
        <span>Username</span>
        <input class="input" type="text" bind:value={formData.username} placeholder="Enter username..." />
    </label>
</form>
