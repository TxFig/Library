<script lang="ts">
    import Icon from "@iconify/svelte"
</script>

<div class="h-full flex justify-center items-center">
    <div class="flex flex-col gap-8 w-1/3 justify-center">
        <p>Not Logged In</p>

        <a href="/auth/login" class="btn variant-filled">
            <Icon icon="ph:sign-in" width="24" height="24"/>
            <span class="hidden md:block">Log In</span>
        </a>
    </div>
</div>
