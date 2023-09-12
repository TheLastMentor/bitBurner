# bitBurner Script Repository
This repository contains a collection of scripts designed to automate and optimize various tasks in the game Bitburner.

## Project Overview
hwgwBatchManagerLib: A library dedicated to managing the Hack-Grow-Weaken (HWGW) loop in Bitburner. It ensures that scripts are executed in the most efficient order and at the optimal time.

- schedulerLib: A general-purpose scheduler that determines when and how tasks should be executed based on the current game state and other metrics. It's designed to be reusable for various loops and tasks within the game.

- reconLib: This library handles the reconnaissance tasks in the game, identifying potential targets and gathering information about them.

- loggingLib: A robust logging system that captures events, errors, and other significant occurrences during the execution of scripts. It consolidates logs from various processes into a single log for easy monitoring.

## Current Work
We are currently focused on refining the scheduler and integrating it with the HWGW batch manager. Our goal is to ensure that the HWGW loop runs seamlessly, taking into account the dynamic nature of the game and adjusting strategies on-the-fly.

## Future Plans
- Implement dynamic adjustments based on real-time game metrics.
- Expand the scheduler to handle other loops and tasks in the game.
- Continuously refine and optimize the existing libraries based on feedback and new game updates.

##Contribution
Feel free to fork this repository, raise issues, or submit pull requests. Any contributions to improve the scripts or add new functionalities are welcome!
