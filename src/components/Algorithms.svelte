<script lang="ts">
    import { createEventDispatcher } from "svelte"

    import {
        SortestJobFirst,
        ShortestRemainingTimeFirst,
        FirstComeFirstServed,
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

    let selectedIndex: number = 0
    let quantumnTime: number = 0
    let isPreemptive: boolean = false

    const dispatch = createEventDispatcher()
</script>

<div class="algo">
    <ul>
        {#each Algorithms as algorithm, index}
            <li>
                <button
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
    <div class="divider" />
    <div class="settings">
        <div>Quantum Time</div>
        <input
            id="quantumn-time"
            bind:value={quantumnTime}
        />
        <div>Preemptive</div>

        <label class="switch">
            <input
                type="checkbox"
                bind:checked={isPreemptive}
            />
            <span class="slider round" />
        </label>
    </div>
</div>

<style lang="scss">
    .algo {
        display: grid;
        grid-template-columns: 1fr auto auto;
        gap: 1rem;
    }

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

    .divider {
        width: 1px;
        height: 100%;
        background: linear-gradient(
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.1) 20%,
            rgba(255, 255, 255, 0.15) 50%,
            rgba(255, 255, 255, 0.1) 80%,
            rgba(255, 255, 255, 0) 100%
        );
    }

    .settings {
        height: fit-content;

        display: grid;
        grid-template-columns: 1fr auto;
        grid-template-rows: 1fr 1fr;
        gap: 0.5rem;

        align-items: center;
        justify-content: left;

        color: white;

        * {
            text-align: left;
        }

        #quantumn-time {
            max-width: 50px;

            padding: 0.5rem;
            color: white;

            margin: 0;

            background-color: rgba($color: #fff, $alpha: 0.1);
            border: rgba($color: #fff, $alpha: 0.1) 1px solid;

            &:hover {
                background-color: rgba($color: #fff, $alpha: 0.2);
                border: rgba($color: #fff, $alpha: 0.5) 1px solid;
            }

            &:focus {
                background-color: rgba($color: #fff, $alpha: 0.2);
                border: rgba($color: #fff, $alpha: 0.5) 1px solid;
                outline: none;
            }
        }
    }

    .switch-button {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.7rem;
        color: white;
    }

    .switch {
        $height: 24px;
        $circle-size: 16px;

        $width: $circle-size * 2 + ($height - $circle-size);

        position: relative;
        display: inline-block;
        width: $width;
        height: $height;

        input {
            opacity: 0;
            width: 0;
            height: 0;

            &:checked + .slider {
                background-color: #2195f3b3;
            }

            &:focus + .slider {
                box-shadow: 0 0 1px #2195f3b3;
            }

            &:checked + .slider:before {
                transform: translateX($circle-size - 1px);
            }
        }

        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            -webkit-transition: 0.4s;
            transition: 0.4s;

            background-color: rgba($color: #fff, $alpha: 0.1);
            border: rgba($color: #fff, $alpha: 0.1) 1px solid;

            &.round {
                border-radius: $width;
                &:before {
                    border-radius: 50%;
                }
            }

            &:before {
                position: absolute;
                content: "";
                height: $circle-size;
                width: $circle-size;
                left: ($height - $circle-size) / 2;
                bottom: ($height - $circle-size) / 2 - 1px;
                background-color: white;
                -webkit-transition: 0.4s;
                transition: 0.4s;
            }
        }
    }
</style>
