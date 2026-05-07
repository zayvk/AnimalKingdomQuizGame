import { useState } from "react";
import "./Dashboard.css";

const ANIMAL_SILHOUETTES = [
  { emoji: "🦁", x: 5, y: 8, size: 3.5, rotate: -12, opacity: 0.13 },
  { emoji: "🐘", x: 88, y: 5, size: 4, rotate: 8, opacity: 0.13 },
  { emoji: "🦒", x: 2, y: 55, size: 3.2, rotate: -5, opacity: 0.11 },
  { emoji: "🦈", x: 80, y: 70, size: 3.8, rotate: 10, opacity: 0.12 },
  { emoji: "🐊", x: 60, y: 88, size: 3, rotate: -8, opacity: 0.1 },
  { emoji: "🦜", x: 92, y: 38, size: 2.8, rotate: 15, opacity: 0.12 },
  { emoji: "🐍", x: 15, y: 82, size: 3.2, rotate: 20, opacity: 0.11 },
  { emoji: "🦩", x: 72, y: 18, size: 2.6, rotate: -6, opacity: 0.1 },
  { emoji: "🐢", x: 42, y: 92, size: 2.4, rotate: 5, opacity: 0.09 },
  { emoji: "🦋", x: 35, y: 5, size: 2.2, rotate: -15, opacity: 0.1 },
];

export default function Dashboard({ onStartGame }) {
  const [muted, setMuted] = useState(false);

  return (
    <div className="dashboard">
      {/* Background animal silhouettes */}
      <div className="silhouette-layer">
        {ANIMAL_SILHOUETTES.map((a, i) => (
          <span
            key={i}
            className="silhouette"
            style={{
              left: `${a.x}%`,
              top: `${a.y}%`,
              fontSize: `${a.size}rem`,
              transform: `rotate(${a.rotate}deg)`,
              opacity: a.opacity,
            }}
          >
            {a.emoji}
          </span>
        ))}
      </div>

      {/* Mute button */}
      <button
        className="mute-btn"
        onClick={() => setMuted(!muted)}
        aria-label={muted ? "Unmute" : "Mute"}
        title={muted ? "Unmute" : "Mute"}
      >
        {muted ? "🔇" : "🔊"}
      </button>

      {/* Main content */}
      <div className="dashboard-content">
        {/* Header */}
        <div className="dashboard-header">
          <div className="paw-accent">🐾</div>
          <h1 className="game-title">
            Animal Kingdom
            <span className="title-highlight"> Quiz</span>
          </h1>
          <p className="game-subtitle">
            How much do you <em>really</em> know about animals?
          </p>
          <p className="game-teaser">
            Warning: what you're about to learn cannot be unlearned. 🫣
          </p>
        </div>

        {/* Mode cards */}
        <div className="modes-section">
          <p className="modes-label">Choose your game mode</p>

          <div className="mode-cards">
            {/* Mode 2 — Higher or Lower (active) */}
            <button
              className="mode-card mode-card--active"
              onClick={() => onStartGame?.("higher-lower")}
            >
              <div className="mode-card-emoji">⚖️</div>
              <div className="mode-card-body">
                <h2 className="mode-card-title">Higher or Lower</h2>
                <p className="mode-card-desc">
                  Two animals face off. Which one has more? Guess right to keep
                  your streak alive!
                </p>
              </div>
              <div className="mode-card-badge mode-card-badge--play">
                Play Now →
              </div>
            </button>

            {/* Mode 1 — Classic Quiz (coming soon) */}
            <button className="mode-card mode-card--disabled" disabled>
              <div className="mode-card-emoji">🧠</div>
              <div className="mode-card-body">
                <h2 className="mode-card-title">Classic Quiz</h2>
                <p className="mode-card-desc">
                  Answer questions as difficulty ramps up. One wrong answer and
                  it's all over.
                </p>
              </div>
              <div className="mode-card-badge mode-card-badge--soon">
                Coming Soon
              </div>
            </button>
          </div>
        </div>

        {/* Fun Facts button */}
        <div className="extras-section">
          <button className="fun-facts-btn" disabled>
            🔬 Fun Facts &nbsp;<span className="soon-tag">Coming Soon</span>
          </button>
        </div>

        {/* Footer flavour */}
        <p className="footer-note">
          🌿 Brought to you by curious minds & weird biology
        </p>
      </div>
    </div>
  );
}
