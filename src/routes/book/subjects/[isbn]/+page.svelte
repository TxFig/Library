<script lang="ts">
    import Icon from "@iconify/svelte";
    import type { PageData } from "./$types"
    import type { Subject } from "@prisma/client";
    import { scale } from "svelte/transition";
    import { cubicIn } from "svelte/easing";
    import { invalidateAll } from "$app/navigation";
    import { page } from "$app/stores";


    export let data: PageData
    let { subjects, book } = data

    const isbn = $page.params.isbn
    async function removeSubject(subject: Subject) {
        await fetch(`/api/book/subjects/${isbn}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                subjects: [subject.value]
            })
        })
        await invalidateAll()
        subjects = subjects.filter(s => s.value !== subject.value)
    }
</script>

<div class="py-6 px-12 space-y-4">
    <p class="space-x-2">
        <span class="text-base opacity-90">Subjects of </span>
        <a href="/book/{book.isbn}" class="text-xl hover:anchor duration-300">{book.title}</a>
    </p>
    <table class="table table-hover">
        <thead>
            <tr>
                <th>Subject</th>
                <th>Remove</th>
            </tr>
        </thead>
        <tbody>
            {#each subjects as subject (subject.id)}
                <tr out:scale={{ easing: cubicIn }}>
                    <td>
                        <a href="/subject/{subject.value}" class="hover:anchor duration-300">{subject.value}</a>
                    </td>
                    <td class="text-center">
                        <button class="btn-icon btn-icon-sm variant-soft-error" on:click={() => removeSubject(subject)}>
                            <Icon icon="tabler:trash" width="16" height="16" />
                        </button>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
