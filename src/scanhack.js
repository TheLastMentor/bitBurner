export async function scanAndHack(ns, startingServer = "home") {
    const serversList = [];
    const toScan = [startingServer];

    while (toScan.length > 0) {
        const currentServer = toScan.pop();
        const scannedServers = ns.scan(currentServer);

        for (const server of scannedServers) {
            if (!serversList.includes(server)) {
                // Check if we can root the server
                const requiredHackingLevel = ns.getServerRequiredHackingLevel(server);
                const requiredPorts = ns.getServerNumPortsRequired(server);
                const hasRequiredPorts = ns.fileExists('BruteSSH.exe') + ns.fileExists('FTPCrack.exe') + ns.fileExists('relaySMTP.exe') + ns.fileExists('HTTPWorm.exe') + ns.fileExists('SQLInject.exe');

                if (ns.getHackingLevel() >= requiredHackingLevel && hasRequiredPorts >= requiredPorts) {
                    if (!ns.hasRootAccess(server)) {
                        ns.nuke(server);
                        await ns.sleep(2000); // Sleep for 2 seconds after gaining root access
                    }

                    // Add the server to the list and to the toScan list
                    serversList.push(server);
                    toScan.push(server);
                }
            }
        }
    }

    return serversList; // Return the list of servers to the calling script
}
