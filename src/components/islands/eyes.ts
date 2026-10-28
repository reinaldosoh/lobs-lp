import { useEffect, useRef } from "preact/hooks";

const pointer = { x: 0, y: 0, lastMove: 0, active: false };
let listening = false;

function listenPointer() {
  if (listening) return;
  listening = true;
  const onMove = (e: PointerEvent) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.lastMove = performance.now();
    pointer.active = true;
  };
  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerdown", onMove, { passive: true });
}

/**
 * Gaze + blink for a character SVG. Calls `onLook(x, y)` every frame with a
 * smoothed direction in [-1, 1] (towards the pointer, or wandering when idle),
 * and periodically restarts the `.is-blinking` CSS animation on the blink refs.
 */
export function useLivelyEyes(
  svgRef: { current: SVGSVGElement | null },
  onLook: (x: number, y: number) => void,
  { reach = 320, still = false } = {},
) {
  const blinkRefs = useRef<(SVGGElement | null)[]>([]);
  const look = useRef(onLook);
  look.current = onLook;

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || still || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    listenPointer();

    let raf = 0;
    let visible = false;
    let lx = 0;
    let ly = 0;
    const frame = (now: number) => {
      const r = svg.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height * 0.5;
      let tx = 0;
      let ty = 0;
      if (!pointer.active || now - pointer.lastMove > 5000) {
        // Idle: slow wandering gaze
        tx = 0.55 * Math.sin(now / 1700);
        ty = 0.25 * Math.cos(now / 2300);
      } else {
        const dx = pointer.x - cx;
        const dy = pointer.y - cy;
        const dist = Math.hypot(dx, dy) || 1;
        const k = Math.min(1, dist / reach);
        tx = (dx / dist) * k;
        ty = (dy / dist) * k;
      }
      lx += (tx - lx) * 0.15;
      ly += (ty - ly) * 0.15;
      look.current(lx, ly);
      if (visible) raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([entry]) => {
      const was = visible;
      visible = entry.isIntersecting;
      if (visible && !was) raf = requestAnimationFrame(frame);
      if (!visible) cancelAnimationFrame(raf);
    });
    io.observe(svg);

    let blinkTimer: ReturnType<typeof setTimeout>;
    const scheduleBlink = () => {
      blinkTimer = setTimeout(() => {
        blinkRefs.current.forEach((el) => {
          if (!el) return;
          el.classList.remove("is-blinking");
          el.getBoundingClientRect(); // restart the CSS animation
          el.classList.add("is-blinking");
        });
        scheduleBlink();
      }, 2500 + 3500 * Math.random());
    };
    scheduleBlink();

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(blinkTimer);
    };
  }, [reach, still]);

  return blinkRefs;
}
