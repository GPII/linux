{
  "targets": [
    {
      "target_name": "nodexrandr",
      "sources": ["nodexrandr.cc"],
      "libraries": ["<!@(pkg-config --libs xrandr xrender x11 xproto)"],
      "cflags": ["<!@(pkg-config --cflags xrandr xrender x11 xproto)", "-fpermissive"],
      "ldflags": ["<!@(pkg-config --libs xrandr xrender x11 xproto)"]
    }
  ]
}
