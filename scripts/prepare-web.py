"""Prepare the static game and its single-source car catalog."""
import json
import shutil
from pathlib import Path

root = Path(__file__).resolve().parent.parent
output = root / "web" / "build"
catalog = json.loads((root / "models" / "garage" / "cars.json").read_text())
for key, entry in catalog.items():
    source = entry["scene"]
    if not source.startswith("res://") or not (root / source[6:]).is_file():
        raise ValueError(f"Missing scene for {key}: {source}")
    if entry.get("photo"):
        shutil.copy2(root / "web" / entry["photo"], output / entry["photo"])
(output / "cars.js").write_text("window.toyCarCatalog=" + json.dumps(catalog, ensure_ascii=False) + ";\n")
shutil.copy2(root / "web" / "garage.js", output / "garage.js")
shutil.copy2(root / "LICENSE", output / "LICENSE.txt")
shutil.copy2(root / "models" / "garage" / "LICENSE.txt", output / "CAR-ASSETS-LICENSE.txt")
shutil.copy2(root / "models" / "city" / "LICENSE.txt", output / "CITY-ASSETS-LICENSE.txt")
(output / ".nojekyll").touch()
