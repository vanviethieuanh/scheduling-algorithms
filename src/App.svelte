<script lang="ts">
    // Components
    import Table from "@components/Table.svelte"
    import Grantt from "@components/Grantt.svelte"
    import Algorithms from "@components/Algorithms.svelte"

    // Logics
    import { Process } from "@models/Process"
    import * as Scheduler from "@logic/Scheduler"
    import Metrics from "@components/Metrics.svelte"
    import Donate from "@components/Donate.svelte"

    let inputProcesses = [
        new Process("P-1", 0, 12, 2),
        new Process("P-2", 2, 7, 1),
        new Process("P-3", 5, 8, 5),
        new Process("P-4", 9, 3, 4),
        new Process("P-5", 12, 6, 3),
    ]

    // define column configs
    const inputColumnsMapper = [
        {
            title: "Name",
            dataType: "text",
            getter: (v) => v.name,
            setter: (process, value) => {
                process.name = value
            },
            editable: true,
        },
        {
            title: "Arrival Time",
            dataType: "number",
            getter: (v) => v.arrivalTime,
            setter: (process, value) => {
                process.arrivalTime = value
            },
            min: 0,
            editable: true,
        },
        {
            title: "Burst Time",
            dataType: "number",
            getter: (v) => v.burstTime,
            setter: (process, value) => {
                process.burstTime = value
            },
            min: 1,
            editable: true,
        },
        {
            title: "Priority",
            dataType: "number",
            getter: (v) => (v.priority ? v.priority : "0"),
            setter: (process, value) => {
                process.priority = value
            },
            editable: true,
        },
        {
            title: "Finish Time",
            dataType: "number",
            getter: (v) => v.finishedTime,
            setter: (obj, value) => {
                throw "Not Implemented"
            },
            copyable: true,
            avg: true,
        },
        {
            title: "Wait Time",
            dataType: "text",
            getter: (v) => v.waitTime,
            setter: (obj, value) => {
                throw "Not Implemented"
            },
            copyable: true,
            avg: true,
        },
        {
            title: "Turnaround Time",
            dataType: "text",
            getter: (v) => v.turnaroundTime,
            setter: (obj, value) => {
                throw "Not Implemented"
            },
            copyable: true,
            avg: true,
        },
        {
            title: "Response Time",
            dataType: "text",
            getter: (v) => v.responseTime,
            setter: (obj, value) => {
                throw "Not Implemented"
            },
            copyable: true,
            avg: true,
        },
    ]

    let scheduler: Function = Scheduler.SortestJobFirst
    let quantumnTime: number = 4

    $: result = scheduler(inputProcesses.slice(), {
        quantumnTime: quantumnTime,
    })

    $: runs = result.map((process) => process.toGranttPeriods()).flat()

    function updateInput(event) {
        inputProcesses = event.detail.data
    }
</script>

<main>
    <div class="container">
        <Grantt {runs} />
        <div class="options">
            <Algorithms
                on:change={({ detail: algo }) => {
                    scheduler = algo
                }}
            />
            <div class="divider" />
            <Metrics bind:quantumnTime />
        </div>
        <div class="table">
            <Table
                calculatedProcesses={result}
                bind:processes={inputProcesses}
                columnsMapper={inputColumnsMapper}
                on:change={updateInput}
            />
        </div>
        <Donate />

        <p class="credit">
            Design and created by Văn Viết Hiếu Anh - All images from
            <a
                href="https://unsplash.com/"
                target="_blank"
            >
                <i class="fa-brands fa-unsplash" /> Unsplash
            </a>
        </p>
    </div>
</main>

<style
    global
    lang="scss"
>
    @import "https://cdn.jsdelivr.net/npm/gridjs/dist/theme/mermaid.min.css";

    main {
        font-family: "Montserrat", sans-serif;

        text-align: center;
        margin: 0;

        backdrop-filter: blur(50px);
        background-color: rgba(0, 0, 50, 0.5);
        min-height: 100%;

        .container {
            padding-bottom: 0;
        }
    }

    .credit {
        color: white;
        font-size: 0.8rem;
        opacity: 0.2;

        user-select: none;

        a {
            color: white;
        }
    }

    .options {
        display: grid;
        grid-template-columns: 1fr auto auto;
        gap: 1rem;
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

    .component {
        background-color: rgba(255, 255, 255, 0.7);
        padding: 1rem;
        padding-bottom: 0;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba($color: #000030, $alpha: 0.1);
        user-select: none;
    }

    .container {
        display: flex;
        flex-direction: column;
        gap: 1rem;

        padding: 3rem 2rem;
        max-width: 1400px;
        margin: 0 auto;
    }

    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }
</style>
