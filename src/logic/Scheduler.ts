import type { Process } from "@models/Process"

// Sortest job first (SJF)
export function SortestJobFirst(processes: Process[]): Process[] {
    // Clear all cache
    processes.forEach((process) => process.clearCache())

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

// First-Come, First-Served
export function FirstComeFirstServed(processes: Process[]): Process[] {return processes}

// Shortest Remaining Time First
export function ShortestRemainingTimeFirst(processes: Process[]): Process[] {return processes}

// Priority Scheduling
export function PriorityScheduling(processes: Process[]): Process[] {return processes}

// Round Robin
export function RoundRobin(processes: Process[], quantumTime: number): Process[] {return processes}

// Highest Response Ratio Next
export function HighestResponseRatioNext(processes: Process[]): Process[] {return processes}

// Multilevel Queue
export function MultilevelQueue(processes: Process[]): Process[] {return processes}

// Multilevel Feedback Queue
export function MultilevelFeedbackQueue(processes: Process[]): Process[] {return processes}