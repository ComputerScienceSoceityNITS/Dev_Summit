import { useState } from "react";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen.jsx";
import HomePage from "./pages/HomePage.jsx";
import "./styles/global.css";

function App() {
  const [isComplete, setIsComplete] = useState(false);

  return (
    <div className="site-shell">
      {isComplete ? (
        <HomePage />
      ) : (
        <LoadingScreen onComplete={() => setIsComplete(true)} />
      )}
    </div>
  );
}

export default App;
