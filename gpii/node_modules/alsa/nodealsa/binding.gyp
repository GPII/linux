{
  "targets": [
    {
      "target_name": "nodealsa",
      "sources": ["nodealsa.cc"],
      "libraries": ["<!@(pkg-config --libs alsa)"],
      "cflags": ["<!@(pkg-config --cflags alsa)"],
      "ldflags": ["<!@(pkg-config --libs alsa)"]
    }
  ]
}
