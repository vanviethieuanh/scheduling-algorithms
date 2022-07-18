<script lang="ts">
    import { Process } from 'src/dist/Process'

    export let editable = false
    export let copyable = false

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

    function inputFilter(event: Event) {
        const input = event.target as HTMLInputElement
        const value = input.value

        // if input is not numeric, clear it
        if (!/^\d+$/.test(value)) {
            input.value = ''
        }
    }

    function postHandler(event: Event) {
        const input = event.target as HTMLInputElement
        const value = input.value

        // if value is not numeric, set it to 0
        if (!/^\d+$/.test(value)) {
            input.value = '0'
        }
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
                            {column.title}</button
                        >
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
                                    on:input={inputFilter}
                                    on:blur={postHandler}
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
                            on:click={(e) => deleteRow(e, rowIndex)}>X</button
                        >
                    </td>
                {/if}
            </tr>
        {/each}
    </tbody>
</table>

{#if editable}
    <button id="add-row" on:click={(e) => addRow(e)}>Add row</button>
{/if}

<style>
    input:disabled {
        background-color: #f0f0f0;
    }

    #add-row {
        width: 100%;
    }
</style>
