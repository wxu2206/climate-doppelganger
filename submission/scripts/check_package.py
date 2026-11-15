"""Read-only checks for the selected seven-slide submission demo and provenance.

Uses the optional artifact-generation environment (python-pptx, PyMuPDF, Pillow)
and ffprobe. This is not an application/runtime dependency or portal validator.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import subprocess
from datetime import datetime, timedelta, timezone
from pathlib import Path

import fitz
from PIL import Image
from pptx import Presentation

ROOT = Path(__file__).resolve().parents[1]
DATA_SHA256 = "bc79b9e103e350c035a9716ecd8baf6343bc18ee49acddd87cd3e12ae0a44254"


def require(condition: bool, message: str) -> None:
    if not condition:
        raise ValueError(message)


def read_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def within_root(relative: str) -> Path:
    path = (ROOT / relative).resolve()
    require(path.is_relative_to(ROOT), f"Path escapes submission package: {relative}")
    return path


def check_manifest() -> None:
    manifest = read_json(ROOT / "manifest.json")
    require(manifest["dataset_sha256"] == DATA_SHA256, "Manifest dataset hash differs")
    paths: set[Path] = set()
    for entry in manifest["files"]:
        path = within_root(entry["path"])
        require(path not in paths, f"Duplicate manifest entry: {path.name}")
        paths.add(path)
        require(path.is_file(), f"Missing manifest file: {entry['path']}")
        require(path.stat().st_size == entry["bytes"], f"Size mismatch: {entry['path']}")
        require(digest(path) == entry["sha256"], f"Hash mismatch: {entry['path']}")
    inventory = {
        path.resolve()
        for path in ROOT.rglob("*")
        if path.is_file()
        and "__pycache__" not in path.parts
        and path != ROOT / "manifest.json"
        and path != ROOT / "video/recording.webm"
    }
    require(paths == inventory, "Manifest does not match complete submission-file inventory")
    print(f"PASS: {len(paths)} manifest entries match recorded sizes and SHA-256")


def check_deadline(team: dict) -> None:
    require(team["event"] == "Universal Event", "Deadline assumption requires Universal Event")
    require(team["residence_timezone"] == "America/Vancouver", "Deadline assumes Vancouver residence")
    # IANA tzdata 2026b: Vancouver remains UTC-07 after March 2026. Avoid using
    # an older host ZoneInfo database that still predicts a November fallback.
    for key, expected in (
        ("opens", datetime(2026, 11, 14, 16, 0, tzinfo=timezone.utc)),
        ("closes", datetime(2026, 11, 16, 6, 59, tzinfo=timezone.utc)),
    ):
        local = datetime.fromisoformat(team[f"submission_{key}_local"])
        utc = datetime.fromisoformat(team[f"submission_{key}_utc"])
        require(local.utcoffset() is not None, f"Submission {key} local time lacks UTC offset")
        require(local.utcoffset() == timedelta(hours=-7), f"Submission {key} Vancouver offset must be UTC-07")
        require(utc.utcoffset() == timedelta(0), f"Submission {key} UTC field must use UTC")
        require(local == utc == expected, f"Submission {key} local/UTC conversion differs from IANA 2026b")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--manifest", action="store_true", help="Also verify final manifest")
    args = parser.parse_args()

    require(digest(ROOT.parent / "public/data/climate.json") == DATA_SHA256, "NASA snapshot changed")
    team = read_json(ROOT / "team.json")
    check_deadline(team)
    print("PASS: Universal/Vancouver deadline is 2026-11-15 23:59 UTC-07 = 2026-11-16 06:59 UTC")
    required_text = [team["team_name"], team["challenge"]]
    required_text.extend(member["name"] for member in team["members"])
    require(all(isinstance(value, str) and value.strip() for value in required_text), "Missing team identity")
    require(team["members"], "Participant roster is empty")

    presentation = Presentation(ROOT / "presentation/climate-doppelganger.pptx")
    require(len(presentation.slides) == 7, "Selected Project Demo must contain seven slides")
    slide_text = "\n".join(
        shape.text for slide in presentation.slides for shape in slide.shapes if shape.has_text_frame
    )
    # Text wraps differ between PDF and PPTX; whitespace is immaterial to identity.
    normalized_slide_text = " ".join(slide_text.split())
    for value in required_text:
        require(" ".join(value.split()) in normalized_slide_text, f"PPTX missing: {value}")
    core = presentation.core_properties
    require("SI" in (core.subject + core.keywords + core.comments), "PPTX lacks SI-assistance metadata")
    with fitz.open(ROOT / "presentation/climate-doppelganger.pdf") as document:
        require(len(document) == 7, "Selected Project Demo PDF must contain seven pages")
        pdf_text = " ".join(" ".join(page.get_text() for page in document).split())
        for value in required_text:
            require(" ".join(value.split()) in pdf_text, f"PDF missing: {value}")
        require("SI" in str(document.metadata), "PDF lacks SI-assistance metadata")
    print("PASS: seven-slide PPTX/PDF contain team, participant and challenge identification")

    disclosure = read_json(ROOT / "si-disclosure.json")
    authenticity = disclosure.get("media_authenticity", disclosure)
    for key in ("generated_nasa_observations", "generated_screenshots", "generated_video_footage"):
        require(authenticity.get(key) is False, f"Missing authentic-source assertion: {key}")
    print("PASS: structured SI disclosure distinguishes assistance from authentic observations/media")

    provenance = read_json(ROOT / "screenshots/provenance.json")
    require(provenance["dataset_sha256"] == DATA_SHA256, "Screenshot provenance dataset differs")
    screenshot_paths: set[Path] = set()
    require(len(provenance["images"]) == 12, "Expected twelve verified screenshots")
    for entry in provenance["images"]:
        path = within_root(entry["file"])
        require(path not in screenshot_paths, f"Duplicate screenshot: {entry['file']}")
        screenshot_paths.add(path)
        require(digest(path) == entry["sha256"], f"Screenshot changed: {entry['file']}")
        # Conservative decimal MB, below either interpretation of the guide's 10 MB.
        require(path.stat().st_size <= 10_000_000, f"Screenshot exceeds 10 MB: {entry['file']}")
        with Image.open(path) as image:
            require(image.format == "PNG", f"Screenshot is not PNG: {entry['file']}")
            image.verify()
    require(screenshot_paths == set((ROOT / "screenshots").glob("*.png")), "Untracked screenshot inventory")
    print("PASS: all twelve PNGs match source hashes and are below 10 MB")

    metadata = read_json(ROOT / "video/metadata.json")
    require(metadata.get("role") == "supporting_walkthrough", "Long video must be labelled supporting_walkthrough")
    video_path = ROOT / "video/climate-doppelganger.mp4"
    probe = subprocess.run(
        ["ffprobe", "-v", "error", "-show_format", "-show_streams", "-of", "json", str(video_path)],
        check=True, capture_output=True, text=True,
    )
    actual = json.loads(probe.stdout)
    duration = float(actual["format"]["duration"])
    require(abs(duration - float(metadata["format"]["duration"])) < 0.01, "Video duration metadata differs")
    require(int(actual["format"]["size"]) == video_path.stat().st_size, "Video size differs")
    require(any(stream["codec_type"] == "video" for stream in actual["streams"]), "No video stream")
    require(not any(stream["codec_type"] == "audio" for stream in actual["streams"]), "Unexpected audio stream")
    print(f"PASS: {duration:.2f}s silent recording is supporting walkthrough; NOT required Project Demo")
    print("Selected required Project Demo: seven-slide deck (not the >30-second recording)")
    if args.manifest:
        check_manifest()
    print("Technical artifact checks PASS. Portal acceptance, accepted registration, personal declarations")
    print("and Submit for Judging with its success banner still require the participant; these are not verified here.")


if __name__ == "__main__":
    try:
        main()
    except (ValueError, KeyError, OSError, subprocess.CalledProcessError) as error:
        raise SystemExit(f"FAIL: {error}") from error
