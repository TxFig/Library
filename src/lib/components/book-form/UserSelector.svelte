<script lang="ts">
    import { onMount, type ComponentProps } from "svelte"
    import SearchableCombobox from "../form/SearchableCombobox.svelte"
    import type { UserTransformed } from "$lib/server/database/auth/user";


    let {
        value = $bindable(),
        users = [],
        ...rest
    }: {
        value: string,
        users: UserTransformed[]
    } & Omit<ComponentProps<typeof SearchableCombobox>, "options" | "onClick"> = $props()

    let usernames = $derived(users.map(user => user.username))
    let selected = $state("")

    onMount(() => {
        selected = users.find(user => user.id == value)?.username ?? ""
    })

    function onClick(username: string, index: number) {
        value = users[index].id
    }
</script>

<SearchableCombobox
    options={usernames}
    bind:value={selected}
    width="w-full"
    {onClick}
    {...rest}
/>
