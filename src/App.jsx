import Dashboard from "./Dashboard";

export default function App() {
  const handleStartGame = (mode) => {
    console.log("Starting mode:", mode);
    // Game screen routing will go here
  };

  return <Dashboard onStartGame={handleStartGame} />;
}
