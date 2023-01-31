<script lang="ts">
    import type { GranttPeriod } from "@models/GranttPeriod"

    const Colors: string[] = ["#5800FF"]

    export let runs: GranttPeriod[] = []

    $: cols = Math.max(...runs.map((run) => run.periodEnd))
    $: processesName = [...new Set(runs.map((run) => run.periodName))]
    $: rows = processesName.length

    function getColor(index) {
        return Colors[index % Colors.length]
    }
</script>

<div class="component">
    <div
        class="table"
        style={`
            --cols: ${cols + 1}
            --rows: ${rows}
        `}
    >
        {#each processesName as name, index}
            <div
                class="title"
                style={`
                --rows: ${index + 1}
            `}
            >
                {name}
            </div>
            {#each runs as run}
                {#if run.periodName === name}
                    <div
                        class="grantt"
                        style={`
                                --start: ${run.periodStart + 2};
                                --end: ${run.periodEnd + 2};
                                --rows: ${index + 1};

                                --color: ${getColor(index)};
                                --shadow-color: ${`${getColor(index)}4f`};
                            `}
                    >
                        {`${run.periodStart} - ${run.periodEnd}`}
                    </div>
                {/if}
            {/each}
        {/each}
    </div>
</div>

<style lang="scss">
    * {
        user-select: none;
    }

    .table {
        margin: 0;
        display: grid;
        grid-template-columns: auto repeat(var(--cols), 1fr);
        grid-template-rows: repeat(var(--rows), 1fr);
    }

    .title {
        padding-right: 1rem;
        display: grid;
        place-content: center;

        grid-column: 1;
        grid-row: var(--rows);
    }

    .bar {
        display: grid;
        gap: 1px;
        grid-template-columns: repeat(var(--cols), 1fr);
        height: 100%;
    }

    .grantt {
        background-color: var(--color);
        box-shadow: 0 0 20px var(--shadow-color);

        color: white;

        height: 100%;
        border-radius: 3px;
        grid-column: var(--start) / var(--end);
        grid-row: var(--rows);

        min-height: 30px;
        display: grid;
        place-content: center;
    }
</style>
