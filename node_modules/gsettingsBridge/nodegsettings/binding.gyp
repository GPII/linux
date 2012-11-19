{
  "targets": [
    {
      "target_name": "nodegsettings",
      "sources": ["nodegsettings.cc"],
      "libraries": ["<!@(pkg-config --libs gio-2.0)"],
      "cflags": ["<!@(pkg-config --cflags gio-2.0)"],
      "ldflags": ["<!@(pkg-config --libs gio-2.0)"]
    }
  ]
}
