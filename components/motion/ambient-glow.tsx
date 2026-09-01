/**
 * Ambient depth layer.
 *
 * PERFORMANCE: this used to animate the position of three blur(110px) elements
 * on infinite loops. Animating a blurred element's transform forces the GPU to
 * re-render the entire blurred region every frame — the main cause of scroll
 * lag on mid/low-end devices.
 *
 * It's now a STATIC layer: painted once via CSS radial gradients (which are
 * cheap and need no blur filter), costing nothing after first paint. The
 * atmosphere is identical; only the wasteful movement is gone. No JS, no motion.
 */
export function AmbientGlow() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div
        className="absolute rounded-full"
        style={{
          top: "-10%", left: "-8%", width: 620, height: 620,
          background: "radial-gradient(circle, rgba(201,161,90,.09), rgba(201,161,90,0) 70%)",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          top: "26%", right: "-10%", width: 560, height: 560,
          background: "radial-gradient(circle, rgba(74,26,31,.16), rgba(74,26,31,0) 70%)",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          bottom: "-12%", left: "32%", width: 520, height: 520,
          background: "radial-gradient(circle, rgba(201,161,90,.06), rgba(201,161,90,0) 70%)",
        }}
      />
    </div>
  );
}
