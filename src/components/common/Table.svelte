<script lang="ts">
    // Import components
    import { Process } from 'src/dist/Process'

    // Export parameters
    export let entityName: string = 'Row'
    export let editable: boolean = false
    export let copyable: boolean = false

    export let columnsMapper: { title: string; value: Function }[] = []
    export let data: Object[] = []
    export let columnInputTypes: string[] = []

    export let copyMapper: Function = (values) => {
        // Concat all values into a single string separated by commas
        return values.join(',')
    }

    function copy(event: Event, value: Function) {
        const values = data.map((p) => value(p))
        const clipboard = copyMapper(values)

        navigator.clipboard.writeText(clipboard)
    }

    function numberInputFilter(event: Event) {
        const input = event.target as HTMLInputElement
        const value = input.value

        // if input is not numeric, clear it
        if (!/^\d+$/.test(value)) {
            input.value = ''
        }
    }

    function numberPostHandler(event: Event) {
        const input = event.target as HTMLInputElement
        const value = Number(input.value)

        input.value = value.toString()
    }

    function deleteRow(event: Event, index: number) {
        data = data.filter((_, i) => i !== index)
    }

    function addRow(event: Event) {
        data = [...data, new Process('New Process', 0, 0, 0)]
    }
</script>

<table>
    <thead>
        <tr>
            {#each columnsMapper as column}
                {#if copyable}
                    <th>
                        <button on:click={(e) => copy(e, column.value)}>
                            {column.title}
                            <i class="fa-regular fa-clone" />
                        </button>
                    </th>
                {:else}
                    <th>
                        {column.title}
                    </th>
                {/if}
            {/each}
        </tr>
    </thead>
    <tbody>
        {#each data as item, rowIndex}
            <tr>
                {#each columnsMapper as column, columnIndex}
                    <td>
                        {#if editable}
                            {#if columnInputTypes[columnIndex] === 'number'}
                                <input
                                    type={columnInputTypes[columnIndex]}
                                    disabled={!editable}
                                    value={column.value(item)}
                                    on:input={numberInputFilter}
                                    on:blur={numberPostHandler}
                                />
                            {:else}
                                <input type="text" value={column.value(item)} />
                            {/if}
                        {:else}
                            {column.value(item)}
                        {/if}
                    </td>
                {/each}

                <!-- Delete button in the end of each line if Editable -->
                {#if editable}
                    <td>
                        <button
                            name="delete"
                            on:click={(e) => deleteRow(e, rowIndex)}
                        >
                            <i class="fa-solid fa-minus" />
                        </button>
                    </td>
                {/if}
            </tr>
        {/each}
    </tbody>
</table>

{#if editable}
    <button id="add-row" on:click={(e) => addRow(e)}>
        <i class="fa-solid fa-plus" /> Add {entityName}</button
    >
{/if}

<style>
    #add-row {
        width: 100%;
    }

    table {
        width: 100%;
        table-layout: auto;
    }
    th {
        font-weight: 600;
    }
    td {
        width: fit-content;
    }
    input {
        width: 100%;
    }
</style>
