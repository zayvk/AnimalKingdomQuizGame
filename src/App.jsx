import { useState } from "react";
import Dashboard from "./Dashboard";
import HigherLower from "./HigherLower";

export default function App() {
  const [screen, setScreen] = useState("dashboard");

  if (screen === "higher-lower") {
    return <HigherLower onExit={() => setScreen("dashboard")} />;
  }

  return (
    <Dashboard onStartGame={(mode) => {
      if (mode === "higher-lower") setScreen("higher-lower");
    }} />
  );
}
