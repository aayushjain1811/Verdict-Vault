# Performance

This build was profiled and tuned for smooth scrolling on mid- and low-end
devices. Here's what was causing lag and exactly what changed.

## The root causes (and fixes)

### 1. Background repainting on every scroll frame
`body` used `background-attachment: fixed`. That forces the browser to repaint
the entire background image on **every scroll tick** — one of the most common
causes of mobile scroll jank.
**Fix:** removed `background-attachment: fixed`. The gradient still covers the
viewport; it just scrolls normally and paints once.

### 2. Animated blurred elements (the big one)
`AmbientGlow` animated the *position* of three `blur(110px)` orbs on infinite
loops. Moving a blurred element forces the GPU to **re-render the entire blur
region every frame** — three times over, forever.
**Fix:** `AmbientGlow` is now a static layer of CSS radial gradients. Identical
atmosphere, zero per-frame cost. (Radial gradients don't need a blur filter.)

### 3. A never-ending cursor-glow loop
`MouseSpotlight` ran a `requestAnimationFrame` loop non-stop, dragging a 600px
blurred div.
**Fix:** it's now smaller (420px) and lighter (60px blur), **idles** the loop
once the glow catches up to the cursor, **pauses** when the tab is hidden, and
is **disabled entirely on touch devices and under reduced-motion**.

### 4. Blur on every scroll-reveal
The `Reveal` animation faded elements in *and* animated `blur(6px) → blur(0)`.
Animated filters are expensive, and this ran on dozens of elements.
**Fix:** reveals now use opacity + a small vertical slide only. Same feel,
no filter cost.

### 5. JS smooth-scroll on phones
Lenis smooth-scroll hijacks scrolling, which competes with the phone's optimised
native scroll.
**Fix:** Lenis now runs on **desktop only**. Touch devices get fast, native,
GPU-accelerated scrolling. Desktop keeps the premium smooth feel.

## Also respected

Everything honours `prefers-reduced-motion` — users who ask for less motion get
a near-static, maximally smooth experience automatically.

## The rule to remember

If you add effects later: **never animate the transform/position of a blurred
element.** Animate opacity instead, or move a sharp element and blur its
container statically. That single rule prevents most "why is it laggy" problems.

## Already in place

- All content pages are **statically generated** (SSG) — instant first paint.
- Images use `next/image` (lazy, responsive, modern formats).
- `optimizePackageImports` trims `lucide-react` and `framer-motion` bundles.
- Fonts load via `next/font` with `display: swap` (no invisible-text flash).
