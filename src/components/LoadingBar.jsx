import { useState, useEffect } from "react";
import { Terminal, Cpu, Zap, CheckCircle2, RefreshCw } from "lucide-react";
import "./LoadingBar.css";

// The core Loader Component
const LoadingBar = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("Initializing system...");

  useEffect(() => {
    let currentProgress = 0;

    const messages = [
      {
        threshold: 0,
        text: "Booting Dev Fest core protocols...",
        icon: <Terminal size={14} />,
      },
      {
        threshold: 25,
        text: "Establishing secure network node...",
        icon: <Cpu size={14} />,
      },
      {
        threshold: 50,
        text: "Compiling workshop modules...",
        icon: <Zap size={14} />,
      },
      {
        threshold: 80,
        text: "Finalizing hackathon variables...",
        icon: <Terminal size={14} />,
      },
      {
        threshold: 100,
        text: "System Ready. Access Granted.",
        icon: <CheckCircle2 size={14} color="#111" fill="#d6ff5f" />,
      },
    ];

    const interval = setInterval(() => {
      // Simulate erratic, realistic loading progress
      const increment =
        Math.random() > 0.3 ? Math.floor(Math.random() * 8) + 1 : 0;
      currentProgress += increment;

      if (currentProgress > 100) {
        currentProgress = 100;
      }

      setProgress(currentProgress);

      // Update message based on thresholds
      const currentMsg = messages
        .slice()
        .reverse()
        .find((m) => currentProgress >= m.threshold);
      if (currentMsg) {
        setMessage(
          <span className="flex items-center gap-2">
            {currentMsg.icon}
            {currentMsg.text}
          </span>,
        );
      }

      if (currentProgress === 100) {
        clearInterval(interval);
        if (onComplete) {
          setTimeout(onComplete, 800); // Give user time to see 100%
        }
      }
    }, 150);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="devfest-loader-container">
      {/* Injecting CSS safely to meet single-file requirements */}

      <div className="terminal-header">
        <div className="terminal-title">
          <Terminal size={18} />
          Dev_Fest_v2.0
        </div>
        <div className="terminal-percentage">{progress}%</div>
      </div>

      <div className="loader-track">
        <div
          className={`loader-fill ${progress === 100 ? "complete" : ""}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="terminal-footer">
        <div className="status-message">
          <span style={{ color: "#d6ff5f" }}>&gt;</span>
          {message}
          {progress < 100 && <span className="blink-cursor"></span>}
        </div>
        <div className="text-xs opacity-50">
          [ {progress < 100 ? "PROCESSING" : "OK"} ]
        </div>
      </div>
    </div>
  );
};

export default LoadingBar;
