import { useState } from "react";
import LoadingScreen from "./components/LoadingScreen.jsx";
import HomePage from "./pages/HomePage.jsx";
import "./styles/global.css";

function App() {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  function updateProgress(event) {
    const video = event.currentTarget;

    if (Number.isFinite(video.duration) && video.duration > 0) {
      setProgress(Math.min(99, Math.floor((video.currentTime / video.duration) * 100)));
    }
  }

  function finishIntro() {
    setProgress(100);
    setIsComplete(true);
  }

  return (
    <main className="site-shell">
      {isComplete ? (
        <HomePage />
      ) : (
        <LoadingScreen
          progress={progress}
          onProgress={updateProgress}
          onComplete={finishIntro}
        />
      )}
    </main>
  );
}

export default App;
