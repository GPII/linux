#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# GPII Linux Orca settings snapshotter
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

from __future__ import print_function
from datetime import date
import time
import getpass
import json
import os
import os.path
import shutil
import urllib
import urllib2

DEBUG = True # Set this to False to disable the debug messages
tokenRequestUrl = "http://localhost:8081/token"

def ensureDirectory(f):
    """Check whether the directory 'f' exists in the file system.
    If not, create the directory."""
    dir = os.path.dirname(f)
    if not os.path.exists(dir):
        os.makedirs(dir)


def getCurrentTokens():
    """Get the list of currently logged in GPII tokens"""
    response = urllib.urlopen(tokenRequestUrl)
    content = response.read()
    data = json.loads(content)
    tokeninfo = ""
    if DEBUG:
        print('tokenRequest response = ' + json.dumps(data))

    # First check whether the JSON response contains an error code,
    # else return the last logged in token.
    # WARNING: If more than one token is logged inm only the last one counts!
    if "isError" in data:
        print('No tokens logged in.')
        tokendata = "isError"
    else:
        print('Last item from token request = ' + data[len(data) - 1])
        tokendata = data[len(data) - 1]
    return tokendata


tokens = getCurrentTokens()

currentUser = getpass.getuser()
if DEBUG:
    print('Logged in Linux user: ' + currentUser)
currentOrcaSettings = '/home/' + currentUser + '/.local/share/orca/user-settings.conf'

settingsPathValid = os.path.isfile(os.path.abspath(currentOrcaSettings))
logDir = os.path.abspath('/home/' + currentUser + '/gpiilogs_pilot2') 
logDirTmpFile = os.path.abspath(logDir + '/tmp.txt')
ensureDirectory(logDirTmpFile)
#@TODO get logDir from a settings file that is also read by other logging scripts?
logDirValid = os.path.isdir(logDir)

# now = time formatted for the current timezone: http://docs.python.org/2/library/time.html#time.strftime
now = time.strftime("%Y-%m-%d_%H-%M-%S")

logPath = os.path.abspath(logDir + '/' + now + '_linux__' + tokens + '_orcaSettings.conf')

if DEBUG:
    if logDirValid:
        print('logDir is valid: ' + logDir)
    else:
        print('logDir is NOT valid: ' + logDir)
    if settingsPathValid:
        print('currentOrcaSettings is valid: ' + currentOrcaSettings)
    else:
        print('currentOrcaSettings is NOT valid: ' + currentOrcaSettings)

if settingsPathValid and logDirValid:
    # copy the raw settings file
    shutil.copy2(currentOrcaSettings, logPath)
    print('Finished copying Orca settings to ' + logPath)
else:
    # write error message to file
    errFileName = os.path.abspath(logDir + '/' + 'error_' + now + '.txt')
    ensureDirectory(errFileName)
    with open(errFileName,  'w') as errFile:
        errFile.write('Orca settings for token ' + tokens + ' could not be copied.')
        errFile.write('Orca settings were supposed to be at ' +  currentOrcaSettings)
    errFile.closed
    print('Could not copy Orca settings for token ' + tokens + '. Error written to ' +  errFileName)
    print('Orca settings were supposed to be at ' +  currentOrcaSettings)
