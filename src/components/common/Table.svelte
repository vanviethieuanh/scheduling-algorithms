<script lang="ts">
    export let editable = false
    export let copyable = false

    export let columnsMapper: { title: string; value: Function }[] = []
    export let data: Object[] = []

    export let copyMapper: Function

    function copy(value: Function) {
        const values = data.map((p) => value(p))
        const clipboard = copyMapper(values)

        navigator.clipboard.writeText(clipboard)
    }
</script>

<table>
    <thead>
        <tr>
            {#each columnsMapper as column}
                {#if copyable}
                    <th>
                        <button on:click={(e) => copy(column.value)}>
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
        {#each data as item}
            <tr>
                {#each columnsMapper as column}
                    <td>
                        <div contenteditable={editable}>
                            {column.value(item)}
                        </div>
                    </td>
                {/each}
            </tr>
        {/each}
    </tbody>
</table>
