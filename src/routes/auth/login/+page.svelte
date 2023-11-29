<script lang="ts">
    import { enhance } from "$app/forms"
    import { page } from "$app/stores"

</script>

<div class="w-full h-full flex justify-center items-center">
    <form method="post" class="flex flex-col gap-8 w-1/3 justify-center" use:enhance>
        <h1 class="text-2xl">Log In</h1>
        <label for="email" class="label">
            <span>Email</span>
            <input
                type="email"
                name="email"
                class="input"
                placeholder="email@example.com"
                value={$page.url.searchParams.get("email")}
            >
        </label>
        <button type="submit" class="btn variant-filled-primary">Send Email</button>
    </form>
</div>
