// components/Game.js
import { useEffect, useState } from "react";

export default function Game() {
  const [gameState, setGameState] = useState(null);
  const [playerId, setPlayerId] = useState(
    `player-${Math.random().toString(36).substr(2, 5)}`
  );

  useEffect(() => {
    // Spieler registrieren
    fetch("/api/game", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId }),
    })
      .then((response) => response.json())
      .then((data) => setGameState(data.gameState));
  }, [playerId]);

  const rollDice = () => {
    fetch("/api/game", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId }),
    })
      .then((response) => response.json())
      .then((data) => setGameState(data.gameState));
  };

  if (!gameState) return <p>Lädt...</p>;

  return (
    <div>
      <h1>Würfelspiel</h1>
      <p>Du bist: {playerId}</p>
      <p>Aktueller Spieler: {gameState.currentPlayer}</p>
      <p>Letzter Wurf: {gameState.lastRoll}</p>
      <button
        onClick={rollDice}
        disabled={gameState.currentPlayer !== playerId}
      >
        Würfeln
      </button>
      <h2>Punktestand:</h2>
      <ul>
        {Object.entries(gameState.players).map(([id, score]) => (
          <li key={id}>
            {id}: {score} Punkte
          </li>
        ))}
      </ul>
    </div>
  );
}
