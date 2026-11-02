import { useEffect } from "react";

export default function useTimelineProgress(ref, page) {
  useEffect(() => {
    const list = ref.current;
    if (!list) return;
    const dots = [...list.querySelectorAll(".timeline-marker i")];
    const items = [...list.querySelectorAll(".timeline-item")];
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let raf = 0;
    const update = () => {
      raf = 0;
      const top = list.getBoundingClientRect().top;
      const c = dots.map((d) => {
        const r = d.getBoundingClientRect();
        return r.top - top + r.height / 2;
      });
      const y = reduce ? Infinity : window.innerHeight * 0.6 - top;
      list.style.setProperty("--tl-top", c[0] + "px");
      list.style.setProperty("--tl-len", c[c.length - 1] - c[0] + "px");
      list.style.setProperty(
        "--tl-fill",
        Math.max(0, Math.min(y, c[c.length - 1]) - c[0]) + "px",
      );
      items.forEach((el, i) => el.classList.toggle("on", y >= c[i]));
    };
    const req = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", req, { passive: true });
    window.addEventListener("resize", req);
    return () => {
      window.removeEventListener("scroll", req);
      window.removeEventListener("resize", req);
      cancelAnimationFrame(raf);
    };
  }, [page]);
}

