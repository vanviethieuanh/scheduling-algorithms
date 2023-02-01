<script lang="ts">
    import {
        SortestJobFirst,
        FirstComeFirstServed,
        ShortestRemainingTimeFirst,
        PriorityScheduling,
        RoundRobin,
        HighestResponseRatioNext,
        MultilevelQueue,
        MultilevelFeedbackQueue,
    } from "@logic/Scheduler"

    const Algorithms: {
        name: string
        shorthand?: string
        scheduler: Function
    }[] = [
        {
            name: "Shortest Job First ",
            shorthand: "SJF",
            scheduler: SortestJobFirst,
        },
        {
            name: "First-Come, First-Served ",
            shorthand: "FCFS",
            scheduler: FirstComeFirstServed,
        },
        {
            name: "Shortest Remaining Time First ",
            shorthand: "SRTF",
            scheduler: ShortestRemainingTimeFirst,
        },
        { name: "Priority Scheduling", scheduler: PriorityScheduling },
        { name: "Round-Robin ", shorthand: "RR", scheduler: RoundRobin },
        {
            name: "Highest Response Ratio Next ",
            shorthand: "HRRN",
            scheduler: HighestResponseRatioNext,
        },
        { name: "Multilevel Queue", scheduler: MultilevelQueue },
        {
            name: "Multilevel Feedback Queue",
            scheduler: MultilevelFeedbackQueue,
        },
    ]

    export let selectedIndex: number = 0
    export const selectedScheduler: Function =
        Algorithms[selectedIndex].scheduler
</script>

<div class="algo">
    <ul>
        {#each Algorithms as algorithm, index}
            <li>
                <button
                    class={selectedIndex === index ? "item selected" : "item"}
                    on:click={(e) => (selectedIndex = index)}
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
