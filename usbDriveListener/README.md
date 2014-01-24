GPII Linux USB Drive User Listener
==================================

The **GPII Linux USB Drive User Listener** is a standalone application which
looks for new filesystems on the system such as USB drives, SD cards, etc.
When a new filesystem has been added the application will look for a valid
token on the partition, if the token exists it will trigger the login process
into the GPII.

If you've installed the GPII you can run the user listener in the same way you
launch any other application from the system, but also, you can run the user
listener yourself by typying _gpii-usb-user-listener_.

If you still haven't installed it, you can run it from the source code just by
typing _./gpii-usb-user-listener_ but you should make sure that you have write
access to _/var/lib/gpii/log.txt_

Usage instructions:

1. Prepare a USB stick with a popular readable file system
2. Create a file _.gpii-user-token.txt_ (with a valid token on it) in the top
level of your USB stick
3. Start the **GPII Linux USB Drive User Listener**
4. Start the Flow Manager by running _start.sh_
5. Add/remove the USB stick and watch your settings change!
