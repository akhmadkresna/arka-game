#!/bin/sh
set -eu
cd "$(dirname "$0")/.."
if [ -n "${GODOT_BIN:-}" ]; then
  engine="$GODOT_BIN"
elif [ -x work/runtime/Godot.app/Contents/MacOS/Godot ]; then
  engine=work/runtime/Godot.app/Contents/MacOS/Godot
else
  engine=godot
fi
mkdir -p web/build work
"$engine" --headless --path . --log-file work/build.log --export-release Web
python3 scripts/prepare-web.py
