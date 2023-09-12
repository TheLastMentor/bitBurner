/*schedulerLib.js (Task Scheduler Library):
FUNCTION initializeScheduler():
    - Set up necessary data structures for task management.

FUNCTION scheduleTask(task, time):
    - Add the task to the scheduler to be executed at the specified time.

FUNCTION runScheduledTasks():
    - Continuously check for tasks that are due to be run.
    - Execute tasks when their scheduled time arrives.

FUNCTION cancelTask(taskID):
    - Remove a task from the scheduler using its ID.

FUNCTION adjustTaskTiming(taskID, newTime):
    - Adjust the scheduled time for a specific task.
*/

import { scanAndHack } from "scanhack.js";
import { log } from "logLib.js";

let scheduledTasks = [];

export function scheduleTask(ns, taskName, execFunction, ...args) {
    try {
        const pid = ns.exec(execFunction, "home", 1, ...args);
        if (pid === 0) {
            log(`Failed to schedule task: ${taskName}`);
            return false;
        }
        const uid = generateUID();
        scheduledTasks.push({ taskName, pid, uid });
        log(`Scheduled task: ${taskName} with PID: ${pid} and UID: ${uid}`);
        return true;
    } catch (error) {
        log(`Error scheduling task: ${taskName}. Error: ${error.message}`);
        return false;
    }
}

export function killTask(ns, uid) {
    const task = scheduledTasks.find(t => t.uid === uid);
    if (!task) {
        log(`Task with UID: ${uid} not found.`);
        return false;
    }
    if (ns.kill(task.pid)) {
        scheduledTasks = scheduledTasks.filter(t => t.uid !== uid);
        log(`Killed task: ${task.taskName} with PID: ${task.pid} and UID: ${uid}`);
        return true;
    } else {
        log(`Failed to kill task: ${task.taskName} with PID: ${task.pid} and UID: ${uid}`);
        return false;
    }
}

function generateUID() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function checkAvailableResources(ns) {
    try {
        let totalAvailableRam = 0;

        // Get list of servers from scanhack.js
        const knownServers = scanAndHack(ns);

        // Add purchased servers to the list
        const purchasedServers = ns.getPurchasedServers();
        for (const server of purchasedServers) {
            if (!knownServers.includes(server)) {
                knownServers.push(server);
            }
        }

        // Calculate total available RAM
        for (const server of knownServers) {
            const [totalRam, usedRam] = ns.getServerRam(server);
            totalAvailableRam += (totalRam - usedRam);
        }

        log(`Total available RAM across all known servers: ${totalAvailableRam} GB.`);
        return totalAvailableRam;
    } catch (error) {
        log(`Error checking available resources: ${error.message}`);
        return 0;
    }
}

export function main(ns) {
    while (true) {
        const availableRam = checkAvailableResources(ns);
        if (availableRam <= 0) {
            log("Insufficient RAM available. Waiting...");
            ns.sleep(60000); // Sleep for 1 minute before checking again
            continue;
        }

        // Here, you can add logic to decide which tasks to schedule based on available RAM and other conditions.
        // For example:
        // if (someCondition) {
        //     scheduleTask(ns, "SomeTaskName", "someScript.js", arg1, arg2);
        // }

        ns.sleep(10000); // Sleep for 10 seconds before checking again
    }
}
