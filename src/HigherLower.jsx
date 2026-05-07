import { useState, useEffect, useCallback } from "react";
import { PENIS_ANIMALS, VAGINA_ANIMALS } from "./animalData";
import "./HigherLower.css";

// ── Helpers ──────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Sub-components ───────────────────────────────────────────

function GenderModal({ onSelect }) {
  return (
    <div className="modal-overlay">
      <div className="modal-card gender-modal">
        <div className="modal-top-emoji">🤔</div>
        <h2 className="modal-title">What are we comparing?</h2>
        <p className="modal-subtitle">
          Choose wisely… the animal kingdom is full of surprises.
        </p>
        <div className="gender-buttons">
          <button
            className="gender-btn gender-btn--male"
            onClick={() => onSelect("male")}
          >
            <span className="gender-btn-icon">♂️</span>
            <span className="gender-btn-label">Male</span>
          </button>
          <button
            className="gender-btn gender-btn--female"
            onClick={() => onSelect("female")}
          >
            <span className="gender-btn-icon">♀️</span>
            <span className="gender-btn-label">Female</span>
          </button>
        </div>
        <p className="modal-hint">* Results may permanently alter your view of nature</p>
      </div>
    </div>
  );
}

function FactFlash({ animal, side }) {
  return (
    <div className={`fact-flash fact-flash--${side}`}>
      <span className="fact-flash-emoji">💡</span>
      <p>{animal.fact}</p>
    </div>
  );
}

function GameOverModal({ streak, onRetry, onExit }) {
  return (
    <div className="modal-overlay">
      <div className="modal-card gameover-modal">
        <div className="gameover-emoji">💀</div>
        <h2 className="gameover-title">Game Over!</h2>
        <p className="gameover-streak-label">Your streak</p>
        <div className="gameover-streak-num">{streak}</div>
        {streak >= 10 && (
          <p className="gameover-praise">
            {streak >= 20 ? "🏆 You're a biology legend!" : streak >= 15 ? "🔥 Absolutely wild knowledge!" : "⭐ Not bad at all!"}
          </p>
        )}
        <div className="gameover-actions">
          <button className="gameover-btn gameover-btn--retry" onClick={onRetry}>
            🔄 Play Again
          </button>
          <button className="gameover-btn gameover-btn--exit" onClick={onExit}>
            🏠 Exit
          </button>
        </div>
      </div>
    </div>
  );
}

function AnimalCard({ animal, gender, onClick, selected, result, disabled }) {
  const organWord = gender === "male" ? "penis" : "vagina";
  const organWordPlural = gender === "male" ? "penises" : "vaginas";
  const countLabel =
    animal.count === 0
      ? `No ${organWordPlural}`
      : animal.count === 1
      ? `1 ${organWord}`
      : `${animal.count} ${organWordPlural}`;

  const cardClass = [
    "animal-card",
    selected ? `animal-card--${result}` : "",
    disabled ? "animal-card--disabled" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={cardClass} onClick={onClick} disabled={disabled}>
      <div className="animal-emoji">{animal.emoji}</div>
      <div className="animal-name">{animal.name}</div>
      {selected && (
        <div className="animal-count-reveal">
          <span className="count-number">{animal.count}</span>
          <span className="count-label">{countLabel}</span>
        </div>
      )}
      {!selected && (
        <div className="animal-tap-hint">Tap to pick</div>
      )}
      {selected && result === "correct" && (
        <div className="result-badge result-badge--correct">✓ Correct!</div>
      )}
      {selected && result === "wrong" && (
        <div className="result-badge result-badge--wrong">✗ Wrong!</div>
      )}
    </button>
  );
}

// ── Main Component ───────────────────────────────────────────
export default function HigherLower({ onExit }) {
  const [phase, setPhase] = useState("gender-select"); // gender-select | playing | revealing | gameover
  const [gender, setGender] = useState(null);
  const [pool, setPool] = useState([]);
  const [poolIndex, setPoolIndex] = useState(2);
  const [leftAnimal, setLeftAnimal] = useState(null);
  const [rightAnimal, setRightAnimal] = useState(null);
  const [streak, setStreak] = useState(0);
  const [selected, setSelected] = useState(null); // 'left' | 'right'
  const [result, setResult] = useState(null); // 'correct' | 'wrong'
  const [factSide, setFactSide] = useState(null);
  const [showFact, setShowFact] = useState(false);

  const initGame = useCallback((g) => {
    const data = g === "male" ? PENIS_ANIMALS : VAGINA_ANIMALS;
    const shuffled = shuffle(data);
    setPool(shuffled);
    setLeftAnimal(shuffled[0]);
    setRightAnimal(shuffled[1]);
    setPoolIndex(2);
    setStreak(0);
    setSelected(null);
    setResult(null);
    setShowFact(false);
    setPhase("playing");
  }, []);

  const handleGenderSelect = (g) => {
    setGender(g);
    initGame(g);
  };

  const handlePick = (side) => {
    if (phase !== "playing") return;
    const picked = side === "left" ? leftAnimal : rightAnimal;
    const other = side === "left" ? rightAnimal : leftAnimal;

    let isCorrect;
    if (picked.count === other.count) {
      // Tie — auto-correct, swap out the non-winning side randomly
      isCorrect = true;
    } else {
      isCorrect = picked.count > other.count;
    }

    setSelected(side);
    setResult(isCorrect ? "correct" : "wrong");
    setPhase("revealing");

    if (isCorrect) {
      setFactSide(side);
      setShowFact(true);
      setTimeout(() => {
        setShowFact(false);
        advanceRound(side, picked, isCorrect);
      }, 2000);
    } else {
      setTimeout(() => {
        setPhase("gameover");
      }, 1500);
    }
  };

  const advanceRound = (winningSide, winnerAnimal, isCorrect) => {
    if (!isCorrect) return;
    setStreak((s) => s + 1);

    // Check pool exhaustion
    if (poolIndex >= pool.length) {
      // Reshuffle remaining animals excluding current two
      const remaining = pool.filter(
        (a) => a.id !== leftAnimal.id && a.id !== rightAnimal.id
      );
      if (remaining.length === 0) {
        setPhase("gameover");
        return;
      }
      const reshuffled = shuffle(remaining);
      setPool(reshuffled);
      setPoolIndex(1);
      const newOpponent = reshuffled[0];
      if (winningSide === "left") {
        setRightAnimal(newOpponent);
      } else {
        setLeftAnimal(newOpponent);
      }
    } else {
      const newOpponent = pool[poolIndex];
      setPoolIndex((i) => i + 1);
      if (winningSide === "left") {
        setRightAnimal(newOpponent);
      } else {
        setLeftAnimal(newOpponent);
      }
    }

    setSelected(null);
    setResult(null);
    setPhase("playing");
  };

  const handleRetry = () => {
    setPhase("gender-select");
    setGender(null);
  };

  const organWordPlural = gender === "male" ? "penises" : "vaginas";
  const multiplier =
    streak >= 15 ? 3 : streak >= 10 ? 2 : streak >= 5 ? 1.5 : 1;
  const displayStreak = Math.floor(streak * multiplier);

  return (
    <div className="hl-screen">
      {/* Gender select modal */}
      {phase === "gender-select" && (
        <GenderModal onSelect={handleGenderSelect} />
      )}

      {/* Game over modal */}
      {phase === "gameover" && (
        <GameOverModal
          streak={displayStreak}
          onRetry={handleRetry}
          onExit={onExit}
        />
      )}

      {/* Top bar */}
      <div className="hl-topbar">
        <button className="hl-back-btn" onClick={onExit} title="Back to menu">
          ← Menu
        </button>
        <div className="hl-streak">
          <span className="streak-fire">
            {streak >= 10 ? "🔥" : streak >= 5 ? "⭐" : "🎯"}
          </span>
          <span className="streak-num">{displayStreak}</span>
          {multiplier > 1 && (
            <span className="streak-multiplier">{multiplier}x</span>
          )}
        </div>
      </div>

      {/* Question */}
      {(phase === "playing" || phase === "revealing") && gender && (
        <div className="hl-question">
          <p className="question-text">
            Who has more{" "}
            <span className="question-highlight">{organWordPlural}</span>?
          </p>
          {streak > 0 && (
            <p className="question-sub">
              {streak >= 15
                ? "You're on fire! 🔥"
                : streak >= 10
                ? "Incredible streak!"
                : streak >= 5
                ? "Keep it going!"
                : ""}
            </p>
          )}
        </div>
      )}

      {/* VS Arena */}
      {(phase === "playing" || phase === "revealing") &&
        leftAnimal &&
        rightAnimal && (
          <div className="hl-arena">
            <AnimalCard
              animal={leftAnimal}
              gender={gender}
              onClick={() => handlePick("left")}
              selected={selected === "left"}
              result={selected === "left" ? result : null}
              disabled={phase === "revealing"}
            />

            <div className="vs-divider">
              <span className="vs-text">VS</span>
            </div>

            <AnimalCard
              animal={rightAnimal}
              gender={gender}
              onClick={() => handlePick("right")}
              selected={selected === "right"}
              result={selected === "right" ? result : null}
              disabled={phase === "revealing"}
            />

            {/* Fact flash on correct answer */}
            {showFact && factSide && (
              <FactFlash
                animal={factSide === "left" ? leftAnimal : rightAnimal}
                side={factSide}
              />
            )}
          </div>
        )}

      {/* Tie notice */}
      {phase === "revealing" &&
        leftAnimal &&
        rightAnimal &&
        leftAnimal.count === rightAnimal.count && (
          <p className="tie-notice">🤝 It's a tie! Both survive, opponent swaps.</p>
        )}
    </div>
  );
}
