import { writable } from 'svelte/store'

// Import logics
import { Process } from '@logic/Process'

export const processes = writable([
    new Process('A', 0, 5, 1),
    new Process('B', 1, 4, 2),
    new Process('C', 2, 3, 3),
    new Process('D', 3, 2, 4),
    new Process('E', 4, 1, null),
])
