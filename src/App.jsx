import { useState } from "react";
import LoadingScreen from "./components/LoadingScreen.jsx";
import HomePage from "./pages/HomePage.jsx";
import "./styles/global.css";

function App() {
  const [isComplete, setIsComplete] = useState(false);

  return (
    <main className="site-shell">
      {isComplete ? (
        <HomePage />
      ) : (
        <LoadingScreen onComplete={() => setIsComplete(true)} />
      )}
    </main>
  );
}

export default App;
