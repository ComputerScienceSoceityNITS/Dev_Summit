import { useEffect, useRef, useState } from "react";

const steps = [
  [0, "Booting Dev Summit core protocols..."],
  [24, "Loading CSS × IEEE modules..."],
  [48, "Compiling workshop modules..."],
  [72, "Syncing Phase 01 timeline..."],
  [93, "Finalising interface..."],
  [100, "System Ready. Access Granted."],
];

export default function bvv_Loader({ onDone }) {
  const [p, setP] = useState(0);
  const [out, setOut] = useState(false);
  const finished = useRef(false);
  const raf = useRef(0);
  const timers = useRef([]);

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    cancelAnimationFrame(raf.current);
    setP(100);
    timers.current.push(setTimeout(() => setOut(true), 450));
    timers.current.push(setTimeout(onDone, 1150));
  };

  useEffect(() => {
    document.documentElement.classList.add("is-loading");
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const total = reduce ? 500 : 4200;
    const t0 = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / total);
      const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      setP(Math.round(e * 100));
      if (t < 1) raf.current = requestAnimationFrame(tick);
      else finish();
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf.current);
      timers.current.forEach(clearTimeout);
      document.documentElement.classList.remove("is-loading");
    };
  }, []);

  const msg = [...steps].reverse().find(([at]) => p >= at)[1];
  const ready = p >= 100;

  return (
    <div
      className={`loader ${out ? "out" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Loading Dev Summit 2026"
    >
      <img
        className="ld-char ld-left"
        src="/assets/loader/optimus.png"
        alt=""
        decoding="async"
      />
      <img
        className="ld-char ld-right"
        src="/assets/loader/bumblebee.png"
        alt=""
        decoding="async"
      />
      <div className="ld-tl">
        DEV SUMMIT / <b>2026</b>
      </div>
      <button className="ld-skip" type="button" onClick={finish}>
        Skip
      </button>

      <div className={`ld-logo ${p >= 30 ? "show" : ""}`} aria-hidden="true">
        <span>DEV</span>
        <span className="o">SUMMIT</span>
        <em>2026</em>
      </div>

      <div className="ld-term">
        <div className="ld-row">
          <span>&gt;_ DEV_SUMMIT_V1.0</span>
          <strong>{p}%</strong>
        </div>
        <div className="ld-bar">
          <i style={{ width: `${p}%` }} />
        </div>
        <div className="ld-row ld-msg">
          <span>
            &gt; {msg}
            {!ready && <u />}
          </span>
          <span className={ready ? "ok" : ""}>
            {ready ? "[ OK ]" : "[ PROCESSING ]"}
          </span>
        </div>
        <p className="ld-tag">Ideas collide. The future takes shape.</p>
      </div>

      <div className="ld-bl">
        <i /> SOMETHING BIG IS ON THE HORIZON
      </div>
      <div className="ld-br">BUILD / CONNECT / INSPIRE</div>
    </div>
  );
}
