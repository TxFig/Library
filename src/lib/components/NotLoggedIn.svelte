<script lang="ts">
    import Icon from "@iconify/svelte"
    import { page } from "$app/stores"

    const redirectPath = $page.url.pathname
</script>

<div class="h-full flex justify-center items-center">
    <div class="flex flex-col gap-8 w-1/3 justify-center">
        <p>Not Logged In</p>

        <a href={`/auth/login?redirect=${redirectPath}`} class="btn variant-filled">
            <Icon icon="ph:sign-in" width="24" height="24"/>
            <span class="hidden md:block">Log In</span>
        </a>
    </div>
</div>
