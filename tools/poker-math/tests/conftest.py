"""Macht `src/` importierbar, ohne ein Paket installieren zu müssen."""
import sys
from pathlib import Path

WURZEL = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(WURZEL / "src"))
