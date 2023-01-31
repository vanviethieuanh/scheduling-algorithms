<script lang="ts">
    import type { GranttPeriod } from "@models/GranttPeriod"

    export let runs: GranttPeriod[] = []

    $: cols = Math.max(...runs.map((run) => run.periodEnd))
    $: processesName = [...new Set(runs.map((run) => run.periodName))]
</script>

<div class="table">
    {#each processesName as name}
        <div class="row">
            <div class="title">{name}</div>
            <div
                class="bar"
                style={`--cols: ${cols}`}
            >
                {#each runs as run}
                    {#if run.periodName === name}
                        <div
                            class="grantt"
                            style={`
                                --start: ${run.periodStart + 1};
                                --end: ${run.periodEnd + 1}
                            `}
                        />
                    {/if}
                {/each}
            </div>
        </div>
    {/each}
</div>

<style lang="postcss">
    .row {
        display: grid;
        grid-template-columns: auto 1fr;
    }

    .title {
        padding-right: 1rem;
    }

    .bar {
        display: grid;
        gap: 1px;
        grid-template-columns: repeat(var(--cols), 1fr);
        height: 100%;
    }

    .grantt {
        background-color: #222222;
        height: 20px;
        border-radius: 3px;
        grid-column: var(--start) / var(--end);
    }
</style>
