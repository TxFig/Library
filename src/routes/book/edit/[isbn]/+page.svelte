<script lang="ts">
    import type { PageData } from "./$types"
    import { page } from "$app/stores"
    import { enhance } from "$app/forms"

    import { Autocomplete, InputChip, FileDropzone, getToastStore, ListBox, ListBoxItem } from '@skeletonlabs/skeleton'
    import type { AutocompleteOption, ToastSettings } from '@skeletonlabs/skeleton'
    import Icon from "@iconify/svelte"


    export let data: PageData
    const {
        isbn, book, bookAuthors, bookPublishers, bookSubjects, bookLocation, bookLanguage,
        allAuthors, allPublishers, allSubjects, allLocations, allLanguages
    } = data

    const toastStore = getToastStore()

    //#region --------------------------------------------------- Authors Input
    let authorInputValue = ""
    let authorsList: string[] = [...bookAuthors.map(author => author.name)]
    const authors: AutocompleteOption[] = [
        ...allAuthors.map(author => ({
            label: author.name,
            value: author.name
        }))
    ]

    function onAuthorSelect(event: CustomEvent<AutocompleteOption>) {
        if (authorsList.includes(event.detail.value as string) === false) {
            authorsList = [...authorsList, event.detail.value as string]
			authorInputValue = ""
		}
    }

    //#endregion
    //#region ------------------------------------------------ Publishers Input
    let publisherInputValue = ""
    let publisherList: string[] = [...bookPublishers.map(publisher => publisher.name)]
    const publishers: AutocompleteOption[] = [
        ...allPublishers.map(publisher => ({
            label: publisher.name,
            value: publisher.name
        }))
    ]

    function onPublisherSelect(event: CustomEvent<AutocompleteOption>) {
        if (publisherList.includes(event.detail.value as string) === false) {
            publisherList = [...publisherList, event.detail.value as string]
			publisherInputValue = ""
		}
    }

    //#endregion
    //#region -------------------------------------------------- Subjects Input
    let subjectInputValue = ""
    let subjectsList: string[] = [...bookSubjects.map(subject => subject.value)]
    const subjects: AutocompleteOption[] = [
        ...allSubjects.map(subject => ({
            label: subject.value,
            value: subject.value
        }))
    ]

    function onSubjectSelect(event: CustomEvent<AutocompleteOption>): void {
        if (subjectsList.includes(event.detail.value as string) === false) {
            subjectsList = [...subjectsList, event.detail.value as string]
			subjectInputValue = ""
		}
	}

    //#endregion
    //#region ---------------------------------------------------- Images Input
    const fileSizeLimit = 16 // MB
    const fileSizeTooBig: ToastSettings = {
        message: `File size can not exceeded ${fileSizeLimit} MB`
    }

    function MB2Bytes(mb: number): number {
        return mb * 1000000
    }

    let frontImageSrc: string = book.front_image ?? ""
    let backImageSrc: string = book.back_image ?? ""

    async function getDataURLImage(image: File): Promise<string | null> {
        if (!image) return null
        if (image.size > MB2Bytes(fileSizeLimit)) {
            toastStore.trigger(fileSizeTooBig)
            return null
        }

        return new Promise((resolve) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result as string)
            reader.readAsDataURL(image)
        })
    }

    async function onFrontImageChange(ev: any) {
        const image: File = ev.target.files[0]
        const url = await getDataURLImage(image)
        frontImageSrc = url ?? ""
    }

    async function onBackImageChange(ev: any) {
        const image: File = ev.target.files[0]
        const url = await getDataURLImage(image)
        backImageSrc = url ?? ""
    }

    //#endregion
    //#region -------------------------------------------------- Location Input
    let locationSelected: string = bookLocation?.value ?? ""
    let addLocationValue: string
    let locations = allLocations.map(loc => loc.value)

    function addBookLocation() {
        if (!addLocationValue || locations.includes(addLocationValue))
            return
        locations = [...locations, addLocationValue]
        locationSelected = addLocationValue
        addLocationValue = ""
    }

    function addLocationKeyDown(ev: KeyboardEvent) {
        if (ev.key == "Enter") {
            ev.preventDefault()
            addBookLocation()
        }
    }

    //#endregion
    //#region -------------------------------------------------- Language Input
    let languageSelected: string = bookLanguage?.value ?? ""
    let addLanguageValue: string
    let languages = allLanguages.map(lang => lang.value)

    function addBookLanguage() {
        if (!addLanguageValue || languages.includes(addLanguageValue))
            return
        languages = [...languages, addLanguageValue]
        languageSelected = addLanguageValue
        addLanguageValue = ""
    }

    function addLanguageKeyDown(ev: KeyboardEvent) {
        if (ev.key == "Enter") {
            ev.preventDefault()
            addBookLanguage()
        }
    }

    //#endregion

    function onFormData(ev: FormDataEvent) {
        const formData = ev.formData

        for (const [key, value] of [...formData.entries()]) {
            if ((typeof value == "string" && value == "") ||
                (typeof value == "object" && (value as File).name == "")
            ) {
                formData.delete(key)
            }
        }

        formData.set("isbn", isbn)
    }

</script>

<form class="space-y-6" method="post" use:enhance enctype="multipart/form-data" on:formdata={onFormData}>
    <h2 class="h2">Book Editing</h2>

    <label class="label">
        <span>ISBN</span>
        <input class="input" type="number" name="isbn" value={isbn} required disabled/>
    </label>

    <label class="label">
        <span>Title<sup class="text-red-500">*</sup></span>
        <input class="input" type="text" name="title" required value={book.title} />
    </label>

    <label class="label">
        <span>Subtitle</span>
        <input class="input" type="text" name="subtitle" value={book.subtitle} />
    </label>

    <label class="label">
        <span>Number of pages</span>
        <input class="input" type="number" name="number_of_pages" value={book.number_of_pages}/>
    </label>

    <label class="label">
        <span>Publish Date</span>
        <input class="input" type="date" name="publish_date" value={book.publish_date}/>
    </label>

    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label class="label">
        <span>Authors</span>
        <InputChip bind:input={authorInputValue} bind:value={authorsList} name="author" placeholder="Enter Author..." allowUpperCase />
        <div class="card w-full max-w-sm max-h-48 p-4 overflow-y-auto" tabindex="-1">
            <Autocomplete
                bind:input={authorInputValue}
                options={authors}
                denylist={authorsList}
                on:selection={onAuthorSelect}
            />
        </div>
    </label>

    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label class="label">
        <span>Publishers</span>
        <InputChip bind:input={publisherInputValue} bind:value={publisherList} name="publisher" placeholder="Enter Publisher..." allowUpperCase />
        <div class="card w-full max-w-sm max-h-48 p-4 overflow-y-auto" tabindex="-1">
            <Autocomplete
                bind:input={publisherInputValue}
                options={publishers}
                denylist={publisherList}
                on:selection={onPublisherSelect}
            />
        </div>
    </label>

    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label class="label">
        <span>Subjects</span>
        <InputChip bind:input={subjectInputValue} bind:value={subjectsList} name="subject" allowUpperCase />
        <div class="card w-full max-w-sm max-h-48 p-4 overflow-y-auto" tabindex="-1">
            <Autocomplete
                bind:input={subjectInputValue}
                options={subjects}
                denylist={subjectsList}
                on:selection={onSubjectSelect}
            />
        </div>
    </label>

    <!-- svelte-ignore a11y-label-has-associated-control -->
    <div class="grid grid-cols-2 grid-rows-[.5fr,3fr,10fr] gap-x-6 gap-y-2">
        <label class="label">Front Image</label>
        <label class="label">Back Image</label>
        <FileDropzone name="front_image" accept="image/*" on:change={onFrontImageChange}>
            <svelte:fragment slot="lead">
                <div class="flex justify-center">
                    <Icon icon="uil:image-upload" color="white" width="32" height="32" />
                </div>
            </svelte:fragment>
        </FileDropzone>
        <FileDropzone name="back_image" accept="image/*" on:change={onBackImageChange}>
            <svelte:fragment slot="lead">
                <div class="flex justify-center">
                    <Icon icon="uil:image-upload" color="white" width="32" height="32" />
                </div>
            </svelte:fragment>
        </FileDropzone>
        <div class="flex justify-center">
            {#if frontImageSrc}
                <img src={frontImageSrc} alt="Book Front" class="object-contain">
            {/if}
        </div>
        <div class="flex justify-center">
            {#if backImageSrc}
                <img src={backImageSrc} alt="Book Back" class="object-contain">
            {/if}
        </div>
    </div>

    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label class="label flex flex-col gap-2">
        <span>Book Location</span>
        <ListBox class="border border-dashed border-surface-600-300-token">
            {#each locations as loc}
                <ListBoxItem bind:group={locationSelected} name="location" value={loc}>{loc}</ListBoxItem>
            {/each}
        </ListBox>
        <div class="input-group input-group-divider grid-cols-[1fr_auto]">
            <input placeholder="Add Location..." bind:value={addLocationValue} on:keydown={addLocationKeyDown}/>
            <button type="button" class="variant-filled-secondary !px-10" on:click={addBookLocation}>Add</button>
        </div>
    </label>

    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label class="label flex flex-col gap-2">
        <span>Book Language</span>
        <ListBox class="border border-dashed border-surface-600-300-token">
            {#each languages as lang}
                <ListBoxItem bind:group={languageSelected} name="language" value={lang}>{lang}</ListBoxItem>
            {/each}
        </ListBox>
        <div class="input-group input-group-divider grid-cols-[1fr_auto]">
            <input placeholder="Add Language..." bind:value={addLanguageValue} on:keydown={addLanguageKeyDown}/>
            <button type="button" class="variant-filled-secondary !px-10" on:click={addBookLanguage}>Add</button>
        </div>
    </label>

    <div class="flex justify-center gap-4 !mt-16">
        <a href={`/book/${isbn}`} class="btn variant-ghost-error px-10 py-3">Cancel</a>
        <button type="submit" class="btn variant-filled-primary px-10 py-3">Submit</button>
    </div>
</form>
