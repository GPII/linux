# GNU/Linux

This repository contains all of the platform-specific code required to run the GPII Personalization Framework on GNU/Linux with GNOME.

The following components can be found in the repository:

* usbDriveListener: a UserListener implementation that will detect a USB drive 
  with an anonymous GPII user token installed on it
* gSettingsBridge: a Node.js module for accessing the gSettings API via 
  JavaScript within a Node application
* orca: a Node.js module for dealing with GNOME Orca's settings
* alsa: a Node.js module for accessing the ALSA API via JavaScript within a 
  Node application to interact with system's volume
* xrandr: a Node.js module for accessing the XRandr API via JavaScript within 
  a Node application. This module is used for setting the resolution and the 
  screen brightness.

# Building, Installing, and Running

We use the grunt task system to perform our build operations.  If you don't 
have grunt installed yet you can do so with:

    npm install -g grunt-cli

To fetch our core universal dependencies and build the linux specific plugins
run

    npm install
    grunt build
    
Because the history of the universal repository is quite large, it can take a
long time to clone (and sometimes will fail depending on the network). To 
check it out faster for testing use the fastClone option. Note however, you 
will need the regular build in order to commit code and push on universal.

    grunt build --fastClone    

To clean the plugin binaries use

    grunt clean

You can start the GPII local server on port 8080 using:

    node gpii.js

To install and uninstall the listener components use the following. Note that
this may prompt you for sudo access.

    grunt install
    grunt uninstall

# Setting Up a Physical or Virtual Machine Without Using Vagrant

The next section describes an automated deployment approach that involves using Vagrant. If the GPII Linux Framework needs to be set up on a physical or virtual machine without using Vagrant then the ``install.sh`` script in the ``provisioning`` directory can be used. The script will bootstrap the environment to the point where Ansible roles can be used to set up the Framework. You will need administrative privileges (via sudo) and GNOME 3 set up on Fedora 23 or 24 before using the script:
```
cd provisioning
sudo GPII_FRAMEWORK_DIR=/opt/gpii-linux-framework ./install.sh
```
The ``GPII_FRAMEWORK_DIR`` environment variable should be used to point to the file system location where this Git working directory exists.

# Setting Up a Virtual Machine Using Vagrant

This repository contains content that will allow you to automatically provision a development VM. A [Vagrantfile](http://docs.vagrantup.com/v2/vagrantfile/) is provided that downloads a [Fedora Vagrant box](https://github.com/idi-ops/packer-fedora), starts a VM, and deploys the GPII Framework on it.

The ``provisioning`` directory contains these files:

* ``playbook.yml`` - an [Ansible playbook](http://docs.ansible.com/ansible/playbooks.html) that orchestrates the provisioning process
* ``requirements.yml`` - specifies the [Ansible roles](http://docs.ansible.com/ansible/playbooks_roles.html) that the playbook requires
* ``vars.yml`` - a list of variables used by the playbook

## Requirements

Please ensure that the [QI Development Environments software requirements](https://github.com/GPII/qi-development-environments/blob/master/README.md#requirements) have been met. You will additionally need the following on your host operating system:

* [grunt-cli](https://github.com/gruntjs/grunt-cli)
* At least 2 GB of available storage space

## Getting Started

In order to create a new VM you will need to issue the following command:

    vagrant up

By default the VM will use two processor cores and 2GB of RAM. Two environment variables can be passed to the ``vagrant up`` command to allocate more cores (``VM_CPUS=2``) and RAM (``VM_RAM=2048``). If this is your first time setting up this VM then the 2 GB Fedora Vagrant box will be downloaded.

Once the box has been downloaded the provisioning process will ensure that project dependencies have been met and then the ``npm install`` and ``grunt --force build`` commands will be executed. If you reboot the VM the provisioner will not run again. However, you can use ``vagrant provision`` to trigger that process at any time.

To run tests you can use the ``grunt tests`` command on your host which will run unit and acceptance tests in the VM. Or you could use ``grunt unit-tests`` and/or ``grunt acceptance-tests`` separately.

You can stop the VM using ``vagrant halt`` or delete it altogether using ``vagrant destroy``.

## Notes

The entire Git working directory will be mounted at the ``/home/vagrant/sync`` path in the VM and bidirectionally synced with the host operating system. This means build artifacts created by processes in the VM will be exposed to the host. It will be safer if you commit to running build tasks such as ``npm install`` or ``grunt build`` in the VM and not attempt that on the host. 
