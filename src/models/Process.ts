import { GranttPeriod } from "./GranttPeriod"

export class Process {
    readonly name: string
    readonly arrivalTime: number
    readonly burstTime: number
    readonly priority?: number

    private _finishedTime: number = null
    public get finishedTime() {
        return this._finishedTime
    }

    private _waitTime: number
    public get waitTime() {
        return this._waitTime
    }

    private _turnaroundTime: number
    public get turnaroundTime() {
        return this._turnaroundTime
    }

    private _responseTime: number = null
    public get responseTime() {
        return this._responseTime
    }

    public get endTime(): number {
        return Math.max(...this._executionPeriods.map((period) => period[1]))
    }

    private _remainingTime: number
    public get remainingTime() {
        return this._remainingTime
    }
    public get isDone() {
        return this._remainingTime <= 0
    }

    private _executionPeriods: [number, number][] = []

    constructor(name, arrivalTime, burstTime, priority) {
        this.name = name
        this.arrivalTime = arrivalTime
        this.burstTime = burstTime
        this.priority = priority
        this._remainingTime = burstTime
        this._waitTime = 0
        this._turnaroundTime = 0
    }

    execute(time, currentTime) {
        let lastExecutionPeriod =
            this._executionPeriods[this._executionPeriods.length - 1]

        this._remainingTime -= time
        if (!!lastExecutionPeriod && lastExecutionPeriod[1] === currentTime) {
            lastExecutionPeriod[1] += time
        } else this._executionPeriods.push([currentTime, currentTime + time])

        if (this._responseTime === null)
            this._responseTime = currentTime - this.arrivalTime

        if (this._remainingTime <= 0) {
            this._finishedTime = currentTime + time
            this._waitTime =
                this._finishedTime - this.arrivalTime - this.burstTime
            this._turnaroundTime = this._finishedTime - this.arrivalTime
        }
    }

    toGranttPeriods(): GranttPeriod[] {
        return this._executionPeriods.map(
            ([start, end]) => new GranttPeriod(this.name, start, end)
        )
    }

    clearCache(): void {
        console.log(this._responseTime)
        this._executionPeriods = []
    }

    reset(): void {
        this._remainingTime = this.burstTime
        this._waitTime = 0
        this._turnaroundTime = 0
        this._finishedTime = null
        this._responseTime = null
    }
}
