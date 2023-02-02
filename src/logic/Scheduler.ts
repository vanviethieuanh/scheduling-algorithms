import type { Process } from "@models/Process"

function ClearProcessesCache(processes: Process[]): void {
    // Clear all cache
    processes.forEach((process) => process.clearCache())
    processes.forEach((process) => process.reset())
}

// Sortest job first (SJF) ** Non-Preemptive
export function NonPreemptive_SortestJobFirst(processes: Process[]): Process[] {
    // Clear all cache
    ClearProcessesCache(processes)

    // Get name order of processes
    const namesOrder = processes.map((p) => p.name)

    // Sort processes by arrival time
    processes.sort((a, b) => {
        return a.arrivalTime - b.arrivalTime
    })

    // Execute processes
    let time = processes[0].arrivalTime
    let finishedProcesses = []
    let arrivedProcessesAtCurrentTime = []

    // Add first process to arrived processes
    arrivedProcessesAtCurrentTime.push(processes.shift())

    while (arrivedProcessesAtCurrentTime.length > 0) {
        // Execute first process in arrived processes list and remove it from list
        let firstProcess = arrivedProcessesAtCurrentTime.shift()
        firstProcess.execute(firstProcess.burstTime, time)
        time += firstProcess.burstTime

        // Add finished process to list
        finishedProcesses.push(firstProcess)

        // Get all processes that arrived at the current time and add them to arrived processes list then remove them from processes list
        if (processes.length > 0) {
            let arrivedProcesses = processes.filter((process) => {
                return process.arrivalTime <= time
            })
            arrivedProcessesAtCurrentTime =
                arrivedProcessesAtCurrentTime.concat(arrivedProcesses)
            processes = processes.filter((process) => {
                return process.arrivalTime > time
            })
        }

        // Sort by burst time
        arrivedProcessesAtCurrentTime.sort((a, b) => {
            return a.burstTime - b.burstTime
        })
    }

    // Order finished processes by nameOrder
    finishedProcesses.sort((a, b) => {
        return namesOrder.indexOf(a.name) - namesOrder.indexOf(b.name)
    })
    return finishedProcesses
}

// Sortest job first (SJF) ** Preemptive
export function Preemptive_SortestJobFirst(processes: Process[]): Process[] {
    // Clear all cache
    ClearProcessesCache(processes)

    // Get name order of processes
    const namesOrder = processes.map((p) => p.name)

    // Sort processes by arrival time
    processes.sort((a, b) => {
        return a.arrivalTime - b.arrivalTime
    })

    // Execute processes
    let time = processes[0].arrivalTime
    let finishedProcesses = []
    let arrivedProcessesAtCurrentTime: Process[] = []

    // Add first process to arrived processes
    arrivedProcessesAtCurrentTime.push(processes.shift())

    while (processes.length > 0 || arrivedProcessesAtCurrentTime.length > 0) {
        // get first process in arrived processes list
        let firstProcess = arrivedProcessesAtCurrentTime[0]

        // get time from now to next process arrival time
        let nextProcessArrivalTime = processes[0]?.arrivalTime ?? Infinity
        let timeToNextProcessArrivalTime = nextProcessArrivalTime - time

        // execute process for the minimum time between burst time and time to next process arrival time
        let timeToExecute = Math.min(
            firstProcess.remainingTime,
            timeToNextProcessArrivalTime
        )

        firstProcess.execute(timeToExecute, time)
        time += timeToExecute

        // add all arrived processes to arrived processes list
        if (processes.length > 0) {
            let arrivedProcesses = processes.filter((process) => {
                return process.arrivalTime <= time
            })
            arrivedProcessesAtCurrentTime =
                arrivedProcessesAtCurrentTime.concat(arrivedProcesses)
            processes = processes.filter((process) => {
                return process.arrivalTime > time
            })
        }

        // move all finished processes from arrived processes list to finished processes list
        arrivedProcessesAtCurrentTime = arrivedProcessesAtCurrentTime.filter(
            (process) => {
                if (process.isDone) {
                    finishedProcesses.push(process)
                    return false
                }
                return true
            }
        )

        // sort arrived processes by remaining time
        arrivedProcessesAtCurrentTime.sort((a, b) => {
            return a.remainingTime - b.remainingTime
        })
    }

    console.log(finishedProcesses)

    // Order finished processes by nameOrder
    finishedProcesses.sort((a, b) => {
        return namesOrder.indexOf(a.name) - namesOrder.indexOf(b.name)
    })
    return finishedProcesses
}

// First-Come, First-Served
export function FirstComeFirstServed(processes: Process[]): Process[] {
    // Clear all cache
    ClearProcessesCache(processes)

    // Sort processes by arrival time
    processes.sort((a, b) => {
        return a.arrivalTime - b.arrivalTime
    })

    let time = 0
    processes.forEach((process) => {
        process.execute(process.burstTime, time)
        time += process.burstTime
    })

    return processes
}

// Shortest Remaining Time First
export function ShortestRemainingTimeFirst(processes: Process[]): Process[] {
    // Clear all cache
    ClearProcessesCache(processes)

    return processes
}

// Priority Scheduling
export function PriorityScheduling(processes: Process[]): Process[] {
    return processes
}

// Round Robin
export function RoundRobin(
    processes: Process[],
    quantumTime: number
): Process[] {
    return processes
}

// Highest Response Ratio Next
export function HighestResponseRatioNext(processes: Process[]): Process[] {
    return processes
}

// Multilevel Queue
export function MultilevelQueue(processes: Process[]): Process[] {
    return processes
}

// Multilevel Feedback Queue
export function MultilevelFeedbackQueue(processes: Process[]): Process[] {
    return processes
}
