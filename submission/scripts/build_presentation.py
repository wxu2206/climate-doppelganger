"""Generate editable slides and a matching PDF from the same layout primitives.
No generated imagery: browser screenshots plus editable text/shapes only.
Requires python-pptx, reportlab and Pillow in an existing user-space environment.
"""

import hashlib
from pathlib import Path
import json
from PIL import Image
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from reportlab.pdfgen import canvas
from reportlab.pdfbase.pdfmetrics import stringWidth, registerFont
from reportlab.pdfbase.ttfonts import TTFont

registerFont(TTFont("Deck", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"))
registerFont(TTFont("Deck-Bold", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"))
from reportlab.lib.utils import ImageReader

ROOT = Path(__file__).resolve().parents[1]
assert (
    hashlib.sha256((ROOT.parent / "public/data/climate.json").read_bytes()).hexdigest()
    == "bc79b9e103e350c035a9716ecd8baf6343bc18ee49acddd87cd3e12ae0a44254"
), "Review scientific annotations before using a different dataset"
OUT = ROOT / "presentation"
OUT.mkdir(exist_ok=True)
W, H = 960, 540
BG = "#080F19"
PANEL = "#142431"
WHITE = "#E1EDF3"
MUTED = "#AFBFCC"
MINT = "#6EE7D5"
BLUE = "#A8BDFF"
prs = Presentation()
prs.slide_width = Inches(W / 72)
prs.slide_height = Inches(H / 72)
pdf = canvas.Canvas(str(OUT / "climate-doppelganger.pdf"), pagesize=(W, H))
pdf.setTitle("Climate Doppelgänger — Different Worlds. The Same Story.")
layout = []


def rgb(color):
    return RGBColor.from_string(color.lstrip("#"))


def rect(x, y, w, h, color=PANEL):
    shape = slide.shapes.add_shape(
        MSO_SHAPE.RECTANGLE, Inches(x / 72), Inches(y / 72), Inches(w / 72), Inches(h / 72)
    )
    shape.fill.solid()
    shape.fill.fore_color.rgb = rgb(color)
    shape.line.fill.background()
    pdf.setFillColor(color)
    pdf.rect(x, H - y - h, w, h, fill=1, stroke=0)


def line(x1, y1, x2, y2, color=MINT, width=2):
    from pptx.enum.shapes import MSO_CONNECTOR

    s = slide.shapes.add_connector(
        MSO_CONNECTOR.STRAIGHT, Inches(x1 / 72), Inches(y1 / 72), Inches(x2 / 72), Inches(y2 / 72)
    )
    s.line.color.rgb = rgb(color)
    s.line.width = Pt(width)
    pdf.setStrokeColor(color)
    pdf.setLineWidth(width)
    pdf.line(x1, H - y1, x2, H - y2)


def text(value, x, y, w, size=20, color=WHITE, bold=False):
    # Deterministic wrapping shared by both formats, native editable text in PPTX.
    lines = []
    for paragraph in value.split("\n"):
        words = paragraph.split()
        current = ""
        for word in words:
            candidate = (current + " " + word).strip()
            if stringWidth(candidate, "Deck-Bold" if bold else "Deck", size) > w and current:
                lines.append(current)
                current = word
            else:
                current = candidate
        lines.append(current)
    height = len(lines) * size * 1.3 + 8
    assert x >= 0 and y >= 0 and x + w <= W and y + height <= H, (value, y, height)
    box = slide.shapes.add_textbox(
        Inches(x / 72), Inches(y / 72), Inches(w / 72), Inches(height / 72)
    )
    tf = box.text_frame
    tf.margin_left = 0
    tf.margin_right = 0
    tf.margin_top = 0
    tf.margin_bottom = 0
    tf.word_wrap = False
    for i, value in enumerate(lines):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.text = value
        p.font.name = "Arial"
        p.font.size = Pt(size)
        p.font.bold = bold
        p.font.color.rgb = rgb(color)
        p.space_after = Pt(0)
        p.line_spacing = 1.3
        pdf.setFillColor(color)
        pdf.setFont("Deck-Bold" if bold else "Deck", size)
        pdf.drawString(x, H - y - size - i * size * 1.3, value)
    layout.append({"slide": len(prs.slides), "text": value, "bounds": [x, y, w, height]})


def image(name, x, y, w, h):
    path = ROOT / "screenshots" / name
    with Image.open(path) as im:
        iw, ih = im.size
        scale = min(w / iw, h / ih)
        dw, dh = iw * scale, ih * scale
        slide.shapes.add_picture(
            str(path),
            Inches((x + (w - dw) / 2) / 72),
            Inches((y + (h - dh) / 2) / 72),
            width=Inches(dw / 72),
            height=Inches(dh / 72),
        )
        pdf.drawImage(ImageReader(im), x + (w - dw) / 2, H - y - (h + dh) / 2, dw, dh)


def start(title, kicker):
    global slide
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    rect(0, 0, W, H, BG)
    text(kicker.upper(), 42, 24, 876, 10, MINT, True)
    text(title, 42, 54, 876, 32, WHITE, True)


def finish():
    text(
        "NASA POWER / MERRA-2 | 10 points | 1991–2024 | Independent project; no NASA endorsement",
        42,
        505,
        820,
        9,
        MUTED,
    )
    text(f"{len(prs.slides):02}", 890, 505, 30, 10, MINT)
    pdf.showPage()


start("Climate Doppelgänger", "NASA Space Apps Challenge 2026 · project presentation")
text("Different Worlds.\nThe Same Story.", 42, 120, 365, 34, MINT, True)
text(
    "Discover distant places with similar climate conditions — or selected patterns of change.",
    42,
    250,
    335,
    21,
)
image("01-desktop.png", 410, 115, 510, 335)
text("Authentic NASA POWER data. Transparent comparisons.", 42, 454, 870, 16, MUTED)
finish()

start("A similar climate is not the same change", "01 / The problem")
text(
    "Average conditions can hide different trajectories.\nDifferent baselines can also hide related change features.",
    42,
    120,
    420,
    23,
)
rect(525, 130, 380, 118)
text("CLIMATE", 548, 146, 330, 12, MINT, True)
text("Mean conditions + seasonality", 548, 180, 330, 22)
rect(525, 300, 380, 118)
text("CHANGE", 548, 316, 330, 12, BLUE, True)
text("Trend estimates + variability", 548, 350, 330, 22)
line(710, 252, 710, 292, WHITE)
text("Ask both questions before drawing conclusions.", 42, 365, 420, 23, MINT)
finish()

start("Two views of the same planet", "02 / Our solution")
text("Climate Twins", 42, 116, 420, 24, MINT, True)
text("Similar selected average conditions", 42, 151, 420, 16, MUTED)
image("11-climate-detail.png", 42, 184, 420, 220)
text("Change Twins", 500, 116, 420, 24, BLUE, True)
text("Similar trends and detrended variability", 500, 151, 420, 16, MUTED)
image("12-change-detail.png", 500, 184, 420, 220)
text("User-adjustable weights and periods. Explanations behind every ranking.", 42, 442, 876, 18)
finish()

start("From NASA data to an explainable match", "03 / Scientific workflow")
steps = [
    "NASA POWER\nmonthly data",
    "Validate units,\ndates and values",
    "Aggregate; fit\nOLS trends",
    "Build climate /\nchange features",
    "Standardize;\nweight; rank",
    "Explore histories,\nCIs and maps",
]
for i, label in enumerate(steps):
    label = f"{i + 1}. " + label
    x = 42 + (i % 3) * 300
    y = 135 + (i // 3) * 125
    rect(x, y, 276, 90)
    text(label, x + 16, y + 18, 244, 19, WHITE, True)
    if i % 3 < 2:
        line(x + 280, y + 45, x + 296, y + 45)
text("Distance = √Σ(weight × standardized feature difference²)", 42, 405, 876, 22, MINT)
text(
    "Day-weighted temperature · rainfall rate × calendar days · nominal Student-t slope intervals",
    42,
    455,
    876,
    14,
    MUTED,
)
finish()

start("Lisbon has two different top matches", "04 / Verified discovery")
rect(42, 128, 420, 134)
text("Climate Twin → Cape Town", 60, 146, 384, 23, MINT, True)
text("Distance 0.188 · 8,562 km away", 60, 187, 384, 19)
rect(500, 128, 420, 134)
text("Change Twin → Reykjavík", 518, 146, 384, 23, BLUE, True)
text("Distance 0.461 · 2,951 km away", 518, 187, 384, 19)
text(
    "Mean temperature differs by 12.2°C\nbetween Lisbon and Reykjavík.",
    42,
    280,
    510,
    22,
    WHITE,
    True,
)
text(
    "1991–2024 · Temperature weight 70 · Precipitation 30\nMinimum separation 1,500 km",
    42,
    355,
    510,
    12,
    MUTED,
)
text(
    "Distances are cohort-dependent feature differences, not probabilities or percentages. Change ranking includes variability, not just slopes.",
    42,
    410,
    510,
    15,
    MINT,
)
text("Actual temperature histories", 590, 280, 330, 12, MUTED)
image("05-temperature.png", 590, 305, 330, 160)
finish()

start("Similar estimates. Honest uncertainty.", "05 / Scientific evidence")
text("Temperature change (°C / decade)", 42, 116, 530, 17, MUTED)
# Native editable confidence-interval plot, computed from the verified independent result.
values = [
    ("Lisbon", 0.098093, -0.032894, 0.229080, 0.136979, MINT),
    ("Reykjavík", 0.076879, -0.079381, 0.233139, 0.323787, BLUE),
]


def px(v):
    return 200 + (v + 0.10) / 0.35 * 310


line(px(0), 156, px(0), 302, MUTED, 1)
for i, (name, estimate, lo, hi, p, c) in enumerate(values):
    y = 184 + i * 82
    text(name, 42, y - 11, 150, 20, c, True)
    line(px(lo), y, px(hi), y, c, 4)
    rect(px(estimate) - 4, y - 4, 8, 8, c)
    text(f"p = {p:.3f}", 540, y - 10, 130, 18, c)
text(
    "95% intervals include zero. Neither trend is nominally significant at p < 0.05.",
    42,
    335,
    876,
    22,
    WHITE,
    True,
)
text(
    "No test of equal slopes. No common-cause or predictive claim. Ten-point sampling; uncorrected autocorrelation and multiple testing.",
    42,
    409,
    876,
    17,
    MUTED,
)
text("+0.098°C/decade\n95% CI [−0.033, +0.229]", 685, 160, 232, 16, MINT)
text("+0.077°C/decade\n95% CI [−0.079, +0.233]", 685, 242, 232, 16, BLUE)
for tick in [-0.1, 0, 0.1, 0.2]:
    text(f"{tick:+.1f}", px(tick) - 10, 296, 55, 10, MUTED)
finish()

start("Make environmental comparisons reproducible", "06 / Impact and next steps")
text("For students and educators", 42, 125, 420, 23, MINT, True)
text(
    "Explore unexpected connections while learning to distinguish similarity, significance and causation.",
    42,
    170,
    420,
    21,
)
text("Future work", 505, 125, 410, 23, BLUE, True)
text(
    "More validated points and variables; autocorrelation-aware inference; richer seasonal comparisons.",
    505,
    170,
    410,
    21,
)
text("github.com/wxu2206/climate-doppelganger", 42, 315, 876, 24, WHITE, True)
text(
    "Source code: MIT, © 2026 Will Xu. NASA POWER / MERRA-2 data credit retained.\nNo live site is claimed. Official 2026 submission rules still require confirmation.",
    42,
    382,
    876,
    16,
    MUTED,
)
text("Transparent methods. Authentic data. Explicit limitations.", 42, 455, 876, 21, MINT, True)
finish()
prs.save(OUT / "climate-doppelganger.pptx")
pdf.save()
(ROOT / "scripts/layout-check.json").write_text(
    json.dumps(
        {"slides": len(prs.slides), "all_text_within_canvas": True, "objects": layout}, indent=2
    )
    + "\n"
)
print("Generated seven editable slides and matching PDF")
