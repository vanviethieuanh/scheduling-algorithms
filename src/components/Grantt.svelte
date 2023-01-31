<script lang="ts">
    import type { GranttPeriod } from "@models/GranttPeriod"

    export let runs: GranttPeriod[] = []

    $: cols = Math.max(...runs.map((run) => run.periodEnd))
    $: processesName = [...new Set(runs.map((run) => run.periodName))]
</script>

<table>
    {#each processesName as name}
        <tr>
            <td>{name}</td>
            <td>
                <div
                    class="bar"
                    style={`--cols: ${cols}`}
                >
                    {#each runs as run}
                        {#if run.periodName === name}
                            <div
                                class="grantt"
                                style={`--start: ${
                                    run.periodStart + 1
                                };--end: ${run.periodEnd + 1}`}
                            />
                        {/if}
                    {/each}
                </div>
            </td>
        </tr>
    {/each}
</table>

<style>
    td:first-child {
        padding-right: min(1rem, 20px);
    }

    td:last-child {
        background-color: #efefef;
    }

    .bar {
        display: grid;
        gap: 1px;
        grid-template-columns: repeat(var(--cols), 20px);
        height: 100%;
    }

    .grantt {
        background-color: #222222;
        height: 20px;
        grid-column: var(--start) / var(--end);
    }
</style>
