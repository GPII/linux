GPII Node.jS GSettings Bridge
-----------------------------

The GPII gsettingsBridge is a Node.js bridge to GNOME's native GSettings API, written in C++.

To compile the module:

* Run build.sh at the top of this repository

Or, by hand:

* cd nodegsettings
* node-waf configure build
* node nodegsettings_tests.js # Run the tests


Notes
-----

gsettings_bridge for Fluid 

cross-hairs-clip
cross-hairs-color
cross-hairs-length
cross-hairs-opacity
cross-hairs-thickness
lens-mode
mag-factor
mouse-tracking
screen-position
scroll-at-edges
show-cross-hairs

gsettings range org.gnome.desktop.a11y.magnifier cross-hairs-clip
gsettings range org.gnome.desktop.a11y.magnifier cross-hairs-color
gsettings range org.gnome.desktop.a11y.magnifier cross-hairs-length
gsettings range org.gnome.desktop.a11y.magnifier cross-hairs-opacity
gsettings range org.gnome.desktop.a11y.magnifier cross-hairs-thickness
gsettings range org.gnome.desktop.a11y.magnifier lens-mode
gsettings range org.gnome.desktop.a11y.magnifier mag-factor
gsettings range org.gnome.desktop.a11y.magnifier mouse-tracking
gsettings range org.gnome.desktop.a11y.magnifier screen-position
gsettings range org.gnome.desktop.a11y.magnifier scroll-at-edges
gsettings range org.gnome.desktop.a11y.magnifier show-cross-hairs

type b
type s
range i 20 4096
range d 0.0 1.0
type i
type b
range d 0.10000000000000001 32.0

enum
'none'
'centered'
'proportional'
'push'

enum
'none'
'full-screen'
'top-half'
'bottom-half'
'left-half'
'right-half'

type b
type b