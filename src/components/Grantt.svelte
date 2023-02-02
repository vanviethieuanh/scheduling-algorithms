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
            --cols: ${cols};
            --rows: ${rows}
        `}
    >
        {#each processesName as name, index}
            <div
                class="title"
                style={`
                --rows: ${index + 2}
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
                                --rows: ${index + 2};

                                --color: ${getColor(index)};
                                --shadow-color: ${`${getColor(index)}4f`};
                            `}
                    >
                        {run.periodName}
                    </div>
                {/if}
            {/each}
        {/each}
        {#each Array(cols) as _, index}
            <div
                class="time"
                style={`
                --cols: ${index + 2};
            `}
            >
                {index}
            </div>
        {/each}
        <div
            class="time last"
            style={`
                --cols: ${cols + 1};
            `}
        >
            {cols}
        </div>
    </div>
</div>

<style lang="scss">
    * {
        user-select: none;
    }

    .table {
        height: 300px;
        margin: 2rem 1rem;
        display: grid;
        grid-template-columns: auto repeat(var(--cols), 1fr);
        grid-template-rows: auto repeat(var(--rows), 1fr);
    }

    .title {
        width: fit-content;
        padding-right: 3rem;

        display: grid;
        place-content: center;

        grid-column: 1;
        grid-row: var(--rows);
    }

    .grantt {
        background-color: var(--color);
        box-shadow: 0 0 20px var(--shadow-color);

        color: white;

        border-radius: 3px;
        grid-column: var(--start) / var(--end);
        grid-row: var(--rows);

        display: grid;
        place-content: center;

        animation-duration: 1s;
        animation-name: expand;
        animation-iteration-count: 1;
        animation-direction: normal;
        animation-timing-function: ease-out;
        animation-fill-mode: forwards;
    }
    .time {
        height: fit-content;

        grid-row: 1;
        grid-column: var(--cols);

        width: fit-content;
        transform: translateX(-50%);

        padding: 1rem 0;

        &.last {
            margin-left: auto;
            transform: translateX(50%);
        }

        &::after {
            content: "";
            position: absolute;
            top: 38px;
            left: 50%;
            width: 1px;
            height: 280px;
            background: linear-gradient(
                rgba(0, 0, 0, 0) 0%,
                rgba(0, 0, 0, 0.1) 8%,
                rgba(0, 0, 0, 0.1) 50%,
                rgba(0, 0, 0, 0.1) 92%,
                rgba(0, 0, 0, 0.1) 92%,
                rgba(0, 0, 0, 0) 100%
            );
        }
    }
    @keyframes expand {
        0% {
            width: 0;
        }
        100% {
            width: 100%;
        }
    }
</style>
