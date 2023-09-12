/*Main Manager Script (managerScript.js):
FUNCTION initializeManager():
    - Initialize all required libraries.
    - Set up the initial state and configurations.

FUNCTION start():
    - Begin the main loop:
        - Perform reconnaissance to discover servers.
        - Select the prime target for hacking.
        - Start the HWGW batching process for the prime target.
        - Monitor the logs for any issues or alerts.
        - Make dynamic adjustments based on game metrics and logs.
        - Repeat.

FUNCTION stop():
    - Stop all ongoing processes and clean up.
*/

//BEGIN bbManage.js

// Import necessary libraries
import scheduler from 'schLib.js';
import logLib from 'logLib.js';
import hwgwLib from 'hwgwLib.js';

// Configuration
CONFIG = {
    LOOP_INTERVAL: 1000, // Time interval for the main loop
    ERROR_PORT: 8080,    // Port to listen for errors
    // ... other parameters
}

// Initialization
function init() {
    logLib.init();
    logLib.log("Initializing bbManage...");
    // ... other initialization tasks
}

// Stop function
function stop() {
    logLib.log("Stopping bbManage...");
    // ... other stopping tasks
}

// Get available actions
function getAvailableActions() {
    actions = [];
    try {
        if (hwgwLib.isHWGWAvailable()) {
            actions.push("hwgw");
        }
        // Future: if (anotherModule.isAvailable()) { actions.push("anotherModule"); }
    } catch (error) {
        logLib.log("Error in getAvailableActions: " + error.message);
    }
    return actions;
}

// Handle errors from child processes
function handleError(error) {
    logLib.log("Received error from child process: " + error.message);
    // Handle the error: Close the scheduler, log the error, and retry once
    scheduler.stop();
    logLib.log("Stopping scheduler due to error...");
    
    try {
        logLib.log("Retrying scheduler...");
        scheduler.start();
    } catch (retryError) {
        logLib.log("Critical error on scheduler retry: " + retryError.message);
        stop();  // Stop the manager completely
        exit();  // Exit the script
    }
}

// Main loop
function mainLoop() {
    logLib.log("Starting main loop...");
    while (true) {
        try {
            availableActions = getAvailableActions();
            logLib.log("Available actions: " + availableActions);
            
            if (availableActions.length > 0) {
                action = getAvailableActions()[0];  // For now, just taking the first available action
                logLib.log("Calling scheduler for action: " + action);
                scheduler.schedule(action);
            }
            
            // Listen for errors from child processes
            error = logLib.listenOnPort(CONFIG.ERROR_PORT);
            if (error) {
                handleError(error);
            }
        } catch (error) {
            logLib.log("Error in main loop: " + error.message);
        }
        sleep(CONFIG.LOOP_INTERVAL);
    }
}

// Entry point
init();
mainLoop();

