<script lang="ts">
    import { createEventDispatcher } from "svelte"

    import {
        FirstComeFirstServed,
        HighestResponseRatioNext,
        NonPreemptivePriorityScheduling,
        PreemptivePriorityScheduling,
        RoundRobin,
        ShortestRemainingTimeFirst,
        SortestJobFirst,
    } from "@logic/Scheduler"

    const Algorithms: {
        name: string
        shorthand?: string
        scheduler: Function
        disabled?: boolean
    }[] = [
        {
            name: "Shortest Job First",
            shorthand: "SJF",
            scheduler: SortestJobFirst,
        },
        {
            name: "Shortest Remaining Time First ",
            shorthand: "SRTF",
            scheduler: ShortestRemainingTimeFirst,
        },
        {
            name: "First-Come, First-Served ",
            shorthand: "FCFS",
            scheduler: FirstComeFirstServed,
        },
        {
            name: "Preemptive Priority Scheduling",
            scheduler: PreemptivePriorityScheduling,
        },
        {
            name: "Non-Preemptive Priority Scheduling",
            scheduler: NonPreemptivePriorityScheduling,
        },
        { name: "Round-Robin ", shorthand: "RR", scheduler: RoundRobin },
        {
            name: "Highest Response Ratio Next ",
            shorthand: "HRRN",
            scheduler: HighestResponseRatioNext,
        },
    ]

    let selectedIndex: number = 0

    const dispatch = createEventDispatcher()
</script>

<div class="algo">
    <ul>
        {#each Algorithms as algorithm, index}
            <li>
                <button
                    disabled={algorithm.disabled ?? false}
                    class={selectedIndex === index ? "item selected" : "item"}
                    on:click={(e) => {
                        selectedIndex = index
                        dispatch("change", Algorithms[selectedIndex].scheduler)
                    }}
                >
                    {#if algorithm.shorthand}
                        <b>{algorithm.shorthand}</b> -
                    {/if}
                    {algorithm.name}
                </button>
            </li>
        {/each}
    </ul>
</div>

<style lang="scss">
    ul {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 0.3rem;
    }
    b {
        font-weight: 700;
    }
    .item {
        width: 100%;
        height: 100%;

        padding: 0.5rem 1rem;
        color: white;

        background-color: rgba($color: #fff, $alpha: 0.1);
        border: rgba($color: #fff, $alpha: 0.1) 1px solid;

        &.selected {
            color: #222;

            background-color: rgba($color: #fff, $alpha: 0.8);
            border: rgba($color: #fff, $alpha: 0.5) 1px solid;

            &:hover {
                background-color: rgba($color: #fff, $alpha: 0.8);
                border: rgba($color: #fff, $alpha: 0.5) 1px solid;
            }
        }
        &:hover {
            background-color: rgba($color: #fff, $alpha: 0.2);
            border: rgba($color: #fff, $alpha: 0.5) 1px solid;
        }
    }
</style>
