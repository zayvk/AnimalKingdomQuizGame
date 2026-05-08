import { useState, useCallback, useRef, useEffect } from "react";
import { PENIS_ANIMALS, VAGINA_ANIMALS } from "./animalData";
import "./HigherLower.css";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Orb particle ─────────────────────────────────────────────
function OrbParticle({ side, onDone }) {
  const startLeft = side === "left" ? "25vw" : "75vw";
  return (
    <div
      className="orb-particle"
      style={{ "--orb-start-left": startLeft }}
      onAnimationEnd={onDone}
    >
      🐾
    </div>
  );
}

// ── Gender Modal ──────────────────────────────────────────────
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
          <button className="gender-btn gender-btn--male" onClick={() => onSelect("male")}>
            <span className="gender-btn-icon">♂️</span>
            <span className="gender-btn-label">Male</span>
          </button>
          <button className="gender-btn gender-btn--female" onClick={() => onSelect("female")}>
            <span className="gender-btn-icon">♀️</span>
            <span className="gender-btn-label">Female</span>
          </button>
        </div>
        <p className="modal-hint">* Results may permanently alter your view of nature</p>
      </div>
    </div>
  );
}

// ── Game Over Modal ───────────────────────────────────────────
function GameOverModal({ streak, loserAnimal, winnerAnimal, gender, onRetry, onExit }) {
  const organ      = gender === "male" ? "penis"   : "vagina";
  const organPlural = gender === "male" ? "penises" : "vaginas";

  // Witty reason line
  const buildReason = () => {
    if (!loserAnimal || !winnerAnimal) return null;
    const wCount = winnerAnimal.count;
    const lCount = loserAnimal.count;
    const wWord  = wCount === 1 ? organ : organPlural;
    const lWord  = lCount === 1 ? organ : organPlural;

    if (lCount === 0) {
      return (
        <>
          You picked <span className="gameover-reason-name">{loserAnimal.name}</span>
          {" "}— which has{" "}
          <span className="gameover-reason-count--loser">zero</span> {organPlural}.
          {" "}<span className="gameover-reason-name">{winnerAnimal.name}</span>
          {" "}had{" "}
          <span className="gameover-reason-count--winner">{wCount}</span>. Ouch. 😬
        </>
      );
    }
    return (
      <>
        <span className="gameover-reason-name">{winnerAnimal.name}</span>
        {" "}sneaked past with{" "}
        <span className="gameover-reason-count--winner">{wCount}</span> {wWord},
        {" "}beating your{" "}
        <span className="gameover-reason-name">{loserAnimal.name}</span>
        {"'s "}
        <span className="gameover-reason-count--loser">{lCount}</span> {lWord}. 🫣
      </>
    );
  };

  const praiseLines =
    streak === 0 ? "Wow. Zero. The animals are judging you. 🦁" :
    streak < 3   ? "A brave attempt. Emphasis on 'attempt'. 🐢" :
    streak < 6   ? "Not bad… for a human. 🐒" :
    streak < 10  ? "Solid effort! Smarter than a barnacle, at least. 🐚" :
    streak < 15  ? "⭐ Genuinely impressive animal knowledge!" :
    streak < 20  ? "🔥 The animals are scared of you!" :
                   "🏆 Biology legend. You belong in a zoo. (As a scientist.)";

  return (
    <div className="modal-overlay">
      <div className="modal-card gameover-modal">

        {/* Falling animal — no skull */}
        <div className="gameover-dead-animal">
          <span className="gameover-animal-emoji">
            {loserAnimal?.emoji ?? "🐾"}
          </span>
        </div>

        <h2 className="gameover-title">GAME OVER!</h2>

        {loserAnimal && winnerAnimal && (
          <p className="gameover-reason">{buildReason()}</p>
        )}

        <p className="gameover-streak-label">your streak</p>
        <div className="gameover-streak-wrap">
          <span className="gameover-streak-fire">
            {streak >= 15 ? "🔥" : streak >= 5 ? "⭐" : "🐾"}
          </span>
          <span className="gameover-streak-num">{streak}</span>
          <span className="gameover-streak-fire">
            {streak >= 15 ? "🔥" : streak >= 5 ? "⭐" : "🐾"}
          </span>
        </div>

        <p className="gameover-praise">{praiseLines}</p>

        <div className="gameover-actions">
          <button className="gameover-btn gameover-btn--retry" onClick={onRetry}>
            <span className="gameover-btn-icon">🔁</span>
            Retry
          </button>
          <button className="gameover-btn gameover-btn--exit" onClick={onExit}>
            <span className="gameover-btn-icon">🦮</span>
            Exit
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Animal Panel ──────────────────────────────────────────────
function AnimalPanel({ animal, gender, side, onClick, selected, result, disabled, showFact }) {
  const organWord   = gender === "male" ? "penis"   : "vagina";
  const organPlural = gender === "male" ? "penises" : "vaginas";
  const countLabel  =
    animal.count === 0 ? `No ${organPlural}` :
    animal.count === 1 ? `1 ${organWord}`    :
    `${animal.count} ${organPlural}`;

  const panelClass = [
    "animal-panel",
    `animal-panel--${side}`,
    selected && result ? `animal-panel--${result}` : "",
    disabled ? "animal-panel--disabled" : "",
  ].filter(Boolean).join(" ");

  return (
    <button className={panelClass} onClick={onClick} disabled={disabled}>
      <div className="panel-bg-emojis" aria-hidden="true">
        {Array.from({ length: 9 }).map((_, i) => (
          <span key={i} className="panel-bg-emoji">{animal.emoji}</span>
        ))}
      </div>
      <div className="panel-overlay" />
      <div className="panel-hover-glow" />

      <div className="panel-content">
        <div className="panel-main-emoji">{animal.emoji}</div>
        <div className="panel-animal-name">{animal.name}</div>

        {selected ? (
          <div className="panel-count-reveal">
            <span className="panel-count-number">{animal.count}</span>
            <span className="panel-count-label">{countLabel}</span>
          </div>
        ) : (
          <div className="panel-tap-hint">Tap to choose</div>
        )}

        {selected && result === "correct" && (
          <div className="panel-result-badge panel-result-badge--correct">✓ Correct!</div>
        )}
        {selected && result === "wrong" && (
          <div className="panel-result-badge panel-result-badge--wrong">✗ Wrong!</div>
        )}
      </div>

      {showFact && (
        <div className="panel-fact-overlay">
          <span className="panel-fact-icon">💡</span>
          <p className="panel-fact-text">{animal.fact}</p>
        </div>
      )}
    </button>
  );
}

// ── Main Component ────────────────────────────────────────────
export default function HigherLower({ onExit }) {
  const [phase, setPhase]             = useState("gender-select");
  const [gender, setGender]           = useState(null);
  const [pool, setPool]               = useState([]);
  const [poolIndex, setPoolIndex]     = useState(2);
  const [leftAnimal, setLeftAnimal]   = useState(null);
  const [rightAnimal, setRightAnimal] = useState(null);
  const [streak, setStreak]           = useState(0);
  const [selected, setSelected]       = useState(null);
  const [result, setResult]           = useState(null);
  const [showFact, setShowFact]       = useState(false);
  const [factSide, setFactSide]       = useState(null);
  const [orbs, setOrbs]               = useState([]);
  const [tieMessage, setTieMessage]   = useState(false);
  const [streakBump, setStreakBump]   = useState(false);
  const [lostTo, setLostTo]           = useState(null);

  const leftRef  = useRef(null);
  const rightRef = useRef(null);
  const poolRef  = useRef([]);
  const indexRef = useRef(2);

  useEffect(() => { leftRef.current  = leftAnimal;  }, [leftAnimal]);
  useEffect(() => { rightRef.current = rightAnimal; }, [rightAnimal]);
  useEffect(() => { poolRef.current  = pool;        }, [pool]);
  useEffect(() => { indexRef.current = poolIndex;   }, [poolIndex]);

  const initGame = useCallback((g) => {
    const data     = g === "male" ? PENIS_ANIMALS : VAGINA_ANIMALS;
    const shuffled = shuffle(data);
    setPool(shuffled);        poolRef.current  = shuffled;
    setLeftAnimal(shuffled[0]);  leftRef.current  = shuffled[0];
    setRightAnimal(shuffled[1]); rightRef.current = shuffled[1];
    setPoolIndex(2);          indexRef.current = 2;
    setStreak(0);
    setSelected(null); setResult(null);
    setShowFact(false); setOrbs([]);
    setTieMessage(false); setLostTo(null);
    setPhase("playing");
  }, []);

  const handleGenderSelect = (g) => { setGender(g); initGame(g); };

  const spawnOrb = (side) => {
    const id = Date.now() + Math.random();
    setOrbs((prev) => [...prev, { id, side }]);
  };

  const advanceRound = useCallback((winningSide) => {
    const currentLeft  = leftRef.current;
    const currentRight = rightRef.current;
    const currentPool  = poolRef.current;
    const currentIndex = indexRef.current;

    if (currentIndex >= currentPool.length) {
      const remaining = currentPool.filter(
        (a) => a.id !== currentLeft.id && a.id !== currentRight.id
      );
      if (remaining.length === 0) { setPhase("gameover"); return; }
      const reshuffled = shuffle(remaining);
      setPool(reshuffled);       poolRef.current  = reshuffled;
      setPoolIndex(1);           indexRef.current = 1;
      if (winningSide === "left") {
        setRightAnimal(reshuffled[0]); rightRef.current = reshuffled[0];
      } else {
        setLeftAnimal(reshuffled[0]);  leftRef.current  = reshuffled[0];
      }
    } else {
      const next = currentPool[currentIndex];
      setPoolIndex(currentIndex + 1); indexRef.current = currentIndex + 1;
      if (winningSide === "left") {
        setRightAnimal(next); rightRef.current = next;
      } else {
        setLeftAnimal(next);  leftRef.current  = next;
      }
    }

    setSelected(null); setResult(null);
    setShowFact(false); setTieMessage(false);
    setPhase("playing");
  }, []);

  const handlePick = (side) => {
    if (phase !== "playing") return;
    const picked    = side === "left" ? leftAnimal  : rightAnimal;
    const other     = side === "left" ? rightAnimal : leftAnimal;
    const isTie     = picked.count === other.count;
    const isCorrect = isTie || picked.count > other.count;

    setSelected(side);
    setResult(isCorrect ? "correct" : "wrong");
    setPhase("revealing");
    if (isTie) setTieMessage(true);

    if (isCorrect) {
      setFactSide(side);
      setShowFact(true);
      spawnOrb(side);

      // Orb arrives ~900ms → bump streak
      setTimeout(() => {
        setStreak((s) => s + 1);
        setStreakBump(true);
        setTimeout(() => setStreakBump(false), 400);
      }, 900);

      // Fact stays 3.5s then advance
      setTimeout(() => { advanceRound(side); }, 3500);

    } else {
      setLostTo(other);
      setTimeout(() => setPhase("gameover"), 1800);
    }
  };

  const handleRetry = () => { setPhase("gender-select"); setGender(null); };

  const multiplier    = streak >= 15 ? 3 : streak >= 10 ? 2 : streak >= 5 ? 1.5 : 1;
  const displayStreak = Math.floor(streak * multiplier);
  const organPlural   = gender === "male" ? "penises" : "vaginas";

  const loserAnimal  = selected === "left"  ? leftAnimal  : selected === "right" ? rightAnimal : null;
  const winnerAnimal = selected === "left"  ? rightAnimal : selected === "right" ? leftAnimal  : lostTo;

  return (
    <div className="hl-screen">
      {phase === "gender-select" && <GenderModal onSelect={handleGenderSelect} />}

      {phase === "gameover" && (
        <GameOverModal
          streak={displayStreak}
          loserAnimal={loserAnimal}
          winnerAnimal={winnerAnimal}
          gender={gender}
          onRetry={handleRetry}
          onExit={onExit}
        />
      )}

      {orbs.map((orb) => (
        <OrbParticle
          key={orb.id}
          side={orb.side}
          onDone={() => setOrbs((prev) => prev.filter((o) => o.id !== orb.id))}
        />
      ))}

      {(phase === "playing" || phase === "revealing") && leftAnimal && rightAnimal && (
        <div className="hl-arena">
          <AnimalPanel
            animal={leftAnimal} gender={gender} side="left"
            onClick={() => handlePick("left")}
            selected={selected === "left"}
            result={selected === "left" ? result : null}
            disabled={phase === "revealing"}
            showFact={showFact && factSide === "left"}
          />

          <div className="hl-centre-overlay">
            {/* Streak — top */}
            <div className={`centre-streak${streakBump ? " centre-streak--bump" : ""}`}>
              <span className="centre-streak-icon">
                {streak >= 10 ? "🔥" : streak >= 5 ? "⭐" : "🐾"}
              </span>
              <span className="centre-streak-num">{displayStreak}</span>
              {multiplier > 1 && (
                <span className="centre-streak-multiplier">{multiplier}x</span>
              )}
            </div>

            {/* Equal spacer above centre group */}
            <div className="centre-spacer" />

            {/* Centre group: question + VS + optional tie */}
            <div className="centre-mid-group">
              <p className="centre-question-text">
                🤔 Who has more{" "}
                <span className="centre-question-highlight">{organPlural}</span>?!
              </p>
              <div className="centre-vs">VS</div>
              {tieMessage && (
                <div className="centre-tie">🤝 It's a tie! Opponent swaps.</div>
              )}
            </div>

            {/* Equal spacer below centre group */}
            <div className="centre-spacer" />
          </div>

          <AnimalPanel
            animal={rightAnimal} gender={gender} side="right"
            onClick={() => handlePick("right")}
            selected={selected === "right"}
            result={selected === "right" ? result : null}
            disabled={phase === "revealing"}
            showFact={showFact && factSide === "right"}
          />
        </div>
      )}

      <button className="hl-back-btn" onClick={onExit}>← Menu</button>
    </div>
  );
}
