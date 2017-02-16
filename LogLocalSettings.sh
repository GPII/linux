#!/bin/bash
#
# GPII Linux settings snapshotter
#
# Copyright 2014 Hochschule der Medien (HdM)
#
# Licensed under the Apache License, Version 2.0 (the "License");
#  you may not use this file except in compliance with the License.
#  You may obtain a copy of the License at
#
#       http://www.apache.org/licenses/LICENSE-2.0
#
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an "AS IS" BASIS,
#  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#  See the License for the specific language governing permissions and
#  limitations under the License.

# The research leading to these results has received funding from 
# the European Union's Seventh Framework Programme (FP7/2007-2013) 
# under grant agreement no. 289016.

user="$USER"
logpath="/home/$user/gpiilogs_pilot2"
# echo "Bash: Logpath = $logpath"

# Snapshot settings - except Orca's - to a logfile on the local file system
node ../node_modules/universal/gpii/node_modules/matchMaker/src/LogSettings.js $logpath
if [[ $? = 0 ]]; then
    echo "Bash: Linux/GNOME settings snapshotted to logfile."
else
    echo "Bash: Failed to snapshot Linux/GNOME settings: $?"
fi

# Copy Orca's settings to a "logfile" on the local file system
# http://stackoverflow.com/questions/14447997/running-a-python-script-within-shell-script-check-status
python ./logOrcaSettings.py
if [[ $? = 0 ]]; then
    echo "Bash: Orca settings snapshotted."
else
    echo "Bash: Failed to snapshot the Orca settings: $?"
fi
